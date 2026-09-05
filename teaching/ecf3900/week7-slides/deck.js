/* Offline presentation behaviour. Content and source notes live in index.html. */
(function () {
  "use strict";

  const WIDTH = 1280;
  const HEIGHT = 720;
  const BODY_SIZE = 30;
  const MIN_BODY_SIZE = 21;
  const EQUATION_BODY_SIZE = 30;
  const TOLERANCE = 2;
  const audit = {
    status: "loading",
    startedAt: new Date().toISOString(),
    logicalSlides: 0,
    fragments: 0,
    mathNodes: 0,
    mathRendered: 0,
    mathErrors: [],
    errors: [],
    fitPasses: [],
    fitResults: [],
    unfitSlides: []
  };

  window.deckAudit = audit;
  window.deckReadyState = "loading";

  function slideDetails(slide, index) {
    const heading = slide.querySelector("h2, h1, .course-title");
    return {
      slide: index + 1,
      id: slide.id || null,
      title: slide.dataset.menuTitle || (heading ? heading.textContent.trim() : "Title slide"),
      section: slide.dataset.section || "",
      frame: slide.dataset.frame || null,
      part: slide.dataset.part || null
    };
  }

  function reportError(stage, error) {
    const entry = {
      stage: stage,
      message: error instanceof Error ? error.message : String(error)
    };
    audit.errors.push(entry);
    console.error("Week 7 presentation: " + stage, error);
    return entry;
  }

  function renderMath(slides) {
    const nodes = Array.from(document.querySelectorAll(".math-inline, .math-display, .derivation-accessible"));
    audit.mathNodes = nodes.length;
    nodes.forEach(function (node, index) {
      const tex = node.textContent.trim();
      const slide = node.closest(".slides > section");
      node.dataset.tex = tex;
      try {
        window.katex.render(tex, node, {
          displayMode: node.classList.contains("math-display") || node.classList.contains("derivation-accessible"),
          throwOnError: true,
          trust: false,
          strict: "warn",
          // Native MathML also displays correctly when speaker notes are copied
          // into the notes window, which has its own independent stylesheet.
          output: node.closest("aside.notes") || node.classList.contains("derivation-accessible") ? "mathml" : "htmlAndMathml",
          macros: { "\\resultarrow": "\\mathrel{\\Longrightarrow}" }
        });
        node.dataset.mathRendered = "true";
        audit.mathRendered += 1;
      } catch (error) {
        const entry = {
          node: index + 1,
          slide: slide ? slides.indexOf(slide) + 1 : null,
          id: slide ? slide.id || null : null,
          tex: tex,
          message: error instanceof Error ? error.message : String(error)
        };
        audit.mathErrors.push(entry);
        node.textContent = tex;
        node.classList.add("math-error");
        node.dataset.mathRendered = "false";
        node.title = "Mathematics could not be rendered: " + entry.message;
        console.error("Week 7 mathematics could not be rendered", entry);
      }
    });
  }

  function numericStyle(style, property) {
    return parseFloat(style[property]) || 0;
  }

  function contentBounds(element) {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return {
      left: rect.left + numericStyle(style, "borderLeftWidth") + numericStyle(style, "paddingLeft"),
      right: rect.right - numericStyle(style, "borderRightWidth") - numericStyle(style, "paddingRight"),
      top: rect.top + numericStyle(style, "borderTopWidth") + numericStyle(style, "paddingTop"),
      bottom: rect.bottom - numericStyle(style, "borderBottomWidth") - numericStyle(style, "paddingBottom")
    };
  }

  function isMeasured(element) {
    return !element.closest("aside.notes, .katex-mathml, .derivation-accessible") && element.getClientRects().length > 0;
  }

  function unionRects(rects) {
    let bounds = null;
    Array.from(rects).forEach(function (rect) {
      if (!(rect.width > 0 && rect.height > 0)) return;
      if (!bounds) {
        bounds = { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
      } else {
        bounds.left = Math.min(bounds.left, rect.left);
        bounds.right = Math.max(bounds.right, rect.right);
        bounds.top = Math.min(bounds.top, rect.top);
        bounds.bottom = Math.max(bounds.bottom, rect.bottom);
      }
    });
    return bounds;
  }

  function mathInkBounds(element) {
    const rects = [];
    element.querySelectorAll(".katex-html").forEach(function (html) {
      // KaTeX's base boxes include its fractions and superscripts. Measure
      // these visible boxes instead of a Range spanning the accessibility
      // MathML sibling or the zero-width struts used for internal positioning.
      const boxes = html.querySelectorAll(".katex-base, .base, .katex-tag, .tag");
      if (boxes.length) {
        boxes.forEach(function (box) { rects.push(box.getBoundingClientRect()); });
      } else {
        // Keep the fallback restricted to the visible HTML layer if a future
        // KaTeX release changes its base-box class names.
        const range = document.createRange();
        try {
          range.selectNodeContents(html);
          rects.push.apply(rects, Array.from(range.getClientRects()));
        } finally {
          range.detach();
        }
      }
    });
    return unionRects(rects);
  }

  function ordinaryTextBounds(element) {
    const rects = [];
    // SHOW_TEXT = 4. Exclude both KaTeX layers: rendered mathematics has its
    // own measurement below, and MathML remains available to screen readers.
    const walker = document.createTreeWalker(element, 4);
    let node;
    while ((node = walker.nextNode())) {
      if (!node.textContent.trim() || !node.parentElement ||
          node.parentElement.closest("aside.notes, .katex-mathml, .katex-html, .derivation-accessible")) continue;
      const range = document.createRange();
      try {
        range.selectNodeContents(node);
        rects.push.apply(rects, Array.from(range.getClientRects()));
      } finally {
        range.detach();
      }
    }
    return unionRects(rects);
  }

  function scrollOverflow(element) {
    // Inline spans may expose clientWidth=0 even when they have visible ink.
    // A KaTeX ancestor's scroll extents can also include its clipped MathML.
    // In those cases use the visible text/math geometry rather than scroll
    // metrics. No accessibility nodes or styles are changed for measurement.
    if (element.matches(".math-inline, .math-display") ||
        element.querySelector(".katex-mathml, .derivation-accessible") ||
        window.getComputedStyle(element).display === "inline") {
      return { x: 0, y: 0 };
    }
    return {
      x: element.clientWidth > 0 ? Math.max(0, element.scrollWidth - element.clientWidth) : 0,
      y: element.clientHeight > 0 ? Math.max(0, element.scrollHeight - element.clientHeight) : 0
    };
  }

  function horizontalContainer(element, slide) {
    let ancestor = element.parentElement;
    while (ancestor && ancestor !== slide) {
      if (ancestor.matches(".column, td, th, .block-body, .block-title, .slide-body, li, p, blockquote")) {
        return ancestor;
      }
      ancestor = ancestor.parentElement;
    }
    return slide;
  }

  function measureSlide(slide) {
    const bounds = contentBounds(slide);
    let bottom = bounds.top;
    let left = bounds.left;
    let right = bounds.right;
    let horizontalOverflow = 0;
    const issues = [];
    const verticalIssues = [];
    const roots = Array.from(slide.children).filter(function (element) {
      return !element.matches("aside.notes") && isMeasured(element);
    });

    roots.forEach(function (element) {
      const rect = element.getBoundingClientRect();
      const scroll = scrollOverflow(element);
      bottom = Math.max(bottom, rect.bottom + scroll.y);
      left = Math.min(left, rect.left);
      right = Math.max(right, rect.right + scroll.x);
    });

    const candidates = slide.querySelectorAll(
      "h1, h2, h3, h4, p, li, table, td, th, blockquote, img, .column, .block-title, .block-body, .math-inline, .math-display, .button"
    );
    candidates.forEach(function (element) {
      if (!isMeasured(element)) return;
      const rect = element.getBoundingClientRect();
      const container = horizontalContainer(element, slide);
      const localBounds = contentBounds(container);
      let inkLeft = rect.left;
      let inkRight = rect.right;
      let inkBottom = rect.bottom;
      const isMath = element.matches(".math-inline, .math-display");
      const hasMathML = Boolean(element.querySelector(".katex-mathml, .derivation-accessible"));
      const ink = isMath ? mathInkBounds(element) :
        hasMathML ? ordinaryTextBounds(element) : null;

      if (ink) {
        inkLeft = Math.min(inkLeft, ink.left);
        inkRight = Math.max(inkRight, ink.right);
        inkBottom = Math.max(inkBottom, ink.bottom);
      }

      const internalOverflow = scrollOverflow(element).x;
      const boundaryOverflow = Math.max(0, localBounds.left - inkLeft, inkRight - localBounds.right);
      const overflow = Math.max(internalOverflow, boundaryOverflow);
      const detail = {
        element: element.tagName.toLowerCase(),
        className: element.getAttribute("class") || "",
        measurement: isMath ? "katex-html" : hasMathML ? "box-and-ordinary-text" : "box-and-scroll",
        text: (element.dataset.tex || element.textContent || "").trim().slice(0, 160)
      };
      if (overflow > TOLERANCE) {
        horizontalOverflow = Math.max(horizontalOverflow, overflow);
        issues.push(Object.assign({}, detail, {
          overflow: Math.round(overflow * 10) / 10,
          scrollOverflow: Math.round(internalOverflow * 10) / 10,
          boundaryOverflow: Math.round(boundaryOverflow * 10) / 10
        }));
      }
      if (inkBottom - bounds.bottom > TOLERANCE) {
        verticalIssues.push(Object.assign({}, detail, {
          overflow: Math.round((inkBottom - bounds.bottom) * 10) / 10
        }));
      }
      left = Math.min(left, inkLeft);
      right = Math.max(right, inkRight);
      bottom = Math.max(bottom, inkBottom);
    });

    const overflowX = Math.max(horizontalOverflow, bounds.left - left, right - bounds.right, 0);
    const overflowY = Math.max(0, bottom - bounds.bottom);
    const body = slide.querySelector(".slide-body");
    const bodyTop = body ? body.getBoundingClientRect().top : bounds.top;
    return {
      fits: overflowX <= TOLERANCE && overflowY <= TOLERANCE,
      overflowX: Math.round(overflowX * 10) / 10,
      overflowY: Math.round(overflowY * 10) / 10,
      availableBodyHeight: Math.round((bounds.bottom - bodyTop) * 10) / 10,
      contentBottom: Math.round((bottom - slide.getBoundingClientRect().top) * 10) / 10,
      horizontalIssues: issues.slice(0, 12),
      verticalIssues: verticalIssues.slice(0, 12)
    };
  }

  function forceStyle(element, properties) {
    Object.keys(properties).forEach(function (property) {
      element.style.setProperty(property, properties[property], "important");
    });
  }

  function bodySizeRange(slide) {
    // Dense calculations use continuation slides rather than tiny type.
    const minimum = slide.classList.contains("equation-slide")
      ? EQUATION_BODY_SIZE : MIN_BODY_SIZE;
    return {
      minimum: minimum,
      preferred: Math.max(minimum, Number(slide.dataset.bodySize) || BODY_SIZE)
    };
  }

  function fitSlides(slides, passName) {
    const reveal = document.querySelector(".reveal");
    const slideContainer = document.querySelector(".reveal > .slides");
    const targets = [reveal, slideContainer].concat(slides);
    const styles = new Map(targets.map(function (element) {
      return [element, element.getAttribute("style")];
    }));
    const originalCompact = new Map(slides.map(function (slide) {
      return [slide, slide.classList.contains("compact")];
    }));
    const results = [];

    try {
      forceStyle(reveal, {
        width: WIDTH + "px", height: HEIGHT + "px", position: "absolute",
        left: "0", top: "0", transform: "none", visibility: "hidden"
      });
      forceStyle(slideContainer, {
        width: WIDTH + "px", height: HEIGHT + "px", position: "absolute",
        left: "0", top: "0", transform: "none", visibility: "hidden"
      });
      slides.forEach(function (slide) {
        forceStyle(slide, {
          display: "block", visibility: "hidden", position: "absolute",
          width: WIDTH + "px", height: HEIGHT + "px", "max-height": "none",
          left: "0", top: "0", transform: "none", overflow: "visible"
        });
      });

      slides.forEach(function (slide, index) {
        const sizeRange = bodySizeRange(slide);
        let bodySize = sizeRange.preferred;
        slide.classList.remove("compact");
        slide.style.setProperty("--body-size", bodySize + "px");
        let measured = measureSlide(slide);
        const initialMeasurement = Object.assign({ bodySize: bodySize, compact: false }, measured);
        let compactMeasurement = null;
        let attempts = 1;

        if (!measured.fits && !slide.classList.contains("title-slide") && !slide.classList.contains("section-divider")) {
          slide.classList.add("compact");
          measured = measureSlide(slide);
          compactMeasurement = Object.assign({ bodySize: bodySize, compact: true }, measured);
          attempts += 1;
          while (!measured.fits && bodySize > sizeRange.minimum) {
            bodySize = Math.max(sizeRange.minimum, bodySize - 0.5);
            slide.style.setProperty("--body-size", bodySize + "px");
            measured = measureSlide(slide);
            attempts += 1;
          }
        }

        results.push(Object.assign(slideDetails(slide, index), measured, {
          bodySize: bodySize,
          minimumBodySize: sizeRange.minimum,
          compact: slide.classList.contains("compact"),
          attempts: attempts,
          initialMeasurement: initialMeasurement,
          compactMeasurement: compactMeasurement
        }));
      });
    } finally {
      targets.forEach(function (element) {
        const original = styles.get(element);
        if (original === null) element.removeAttribute("style");
        else element.setAttribute("style", original);
      });
      slides.forEach(function (slide, index) {
        const result = results[index];
        if (result) {
          slide.style.setProperty("--body-size", result.bodySize + "px");
          slide.classList.toggle("compact", result.compact);
          slide.dataset.fit = result.fits ? "true" : "false";
        } else {
          slide.classList.toggle("compact", originalCompact.get(slide));
        }
      });
    }

    audit.fitPasses.push({ name: passName, results: results });
    audit.fitResults = results;
    audit.unfitSlides = results.filter(function (result) { return !result.fits; });
    return results;
  }

  function updateFooter() {
    const footer = document.querySelector(".deck-footer");
    if (!footer) return;
    const slide = window.Reveal.getCurrentSlide();
    const hidden = !slide || slide.matches(".title-slide, .section-divider, .plain-slide");
    footer.hidden = hidden;
    footer.style.display = hidden ? "none" : "";
    if (hidden) return;

    let section = footer.querySelector(".footer-section");
    let frame = footer.querySelector(".footer-frame");
    if (!section || !frame) {
      footer.replaceChildren();
      section = document.createElement("button");
      section.type = "button";
      section.className = "footer-section";
      section.title = "Jump to a section (M opens the menu)";
      section.setAttribute("aria-label", "Open section navigation");
      section.addEventListener("click", function (event) {
        window.Reveal.getPlugin("menu").openPanel(event, "Custom0");
      });
      frame = document.createElement("span");
      frame.className = "footer-frame";
      footer.append(section, frame);
    }
    section.textContent = "ECF3900 · Week 7 Workshop" + (slide.dataset.section ? " · " + slide.dataset.section : "");
    frame.textContent = slide.dataset.frame
      ? "Slide " + slide.dataset.frame + (slide.dataset.part ? " · continued" : "")
      : "";
  }

  async function start() {
    if (!window.katex || typeof window.katex.render !== "function") {
      throw new Error("The local KaTeX library did not load.");
    }
    if (!window.Reveal || typeof window.Reveal.initialize !== "function") {
      throw new Error("The local Reveal.js library did not load.");
    }
    if (!window.RevealNotes) {
      throw new Error("The local Reveal.js speaker-notes plugin did not load.");
    }
    const slides = Array.from(document.querySelectorAll(".reveal > .slides > section"));
    if (!slides.length) throw new Error("The presentation contains no slide sections.");

    // Use the menu plugin's standard custom-panel support. Building the list
    // from the existing dividers keeps section links aligned with HTML edits.
    const sectionList = document.createElement("ul");
    sectionList.className = "slide-menu-items";
    slides.forEach(function (slide, index) {
      const heading = slide.querySelector("h1, h2");
      if (heading && !slide.dataset.menuTitle) {
        slide.dataset.menuTitle = heading.textContent.trim();
      }
      if (!slide.matches(".section-divider")) return;
      const item = document.createElement("li");
      item.className = "slide-menu-item";
      item.dataset.slideH = index;
      item.dataset.slideV = 0;
      const label = document.createElement("span");
      label.className = "slide-menu-item-title";
      label.textContent = slide.dataset.section === "Appendix"
        ? heading.textContent.trim() : slide.dataset.section;
      item.append(label);
      sectionList.append(item);
    });

    const menuReady = new Promise(function (resolve) {
      window.Reveal.on("menu-ready", function () {
        const menu = window.Reveal.getPlugin("menu");
        // Select Sections as the default panel without leaving the menu open.
        menu.openPanel(null, "Custom0");
        menu.closeMenu(null, true);
        const opener = document.querySelector(".slide-menu-button a");
        if (opener) {
          opener.setAttribute("aria-label", "Open navigation menu");
          opener.title = "Navigation menu (M)";
        }
        resolve();
      });
    });

    document.querySelectorAll('.column[data-tex-width]').forEach(function (column) {
      const ratio = parseFloat(column.dataset.texWidth);
      if (Number.isFinite(ratio)) column.style.flex = ratio + ' 1 0';
    });
    await Promise.all(Array.from(document.images).map(function (img) {
      if (img.complete) return Promise.resolve();
      return new Promise(function (resolve) { img.onload = resolve; img.onerror = resolve; });
    }));

    audit.logicalSlides = slides.length;
    audit.fragments = document.querySelectorAll(".reveal > .slides > section .fragment").length;
    audit.status = window.deckReadyState = "rendering-math";
    renderMath(slides);
    audit.status = window.deckReadyState = "fitting";
    fitSlides(slides, "before-fonts-ready");

    window.Reveal.on("slidechanged", updateFooter);
    await window.Reveal.initialize({
      width: WIDTH,
      height: HEIGHT,
      center: false,
      hash: true,
      transition: "none",
      backgroundTransition: "none",
      controls: true,
      progress: true,
      keyboard: true,
      autoSlide: 0,
      loop: false,
      slideNumber: false,
      pdfSeparateFragments: false,
      menu: {
        path: "vendor/menu/",
        side: "left",
        width: "min(420px, 90vw)",
        markers: false,
        numbers: false,
        themes: false,
        transitions: false,
        loadIcons: false,
        openButton: true,
        keyboard: true,
        custom: [{
          title: "Sections",
          icon: '<i class="fas fa-list" aria-hidden="true"></i>',
          content: sectionList.outerHTML
        }]
      },
      chalkboard: {
        theme: "chalkboard",
        chalkEffect: 0,
        // Keep the seven original colour indices unchanged for saved drawings.
        // The final entry uses the same recording/replay as the ordinary pens.
        boardmarkers: [
          { color: "rgba(100,100,100,1)", cursor: "url(vendor/chalkboard/img/boardmarker-black.png), auto", label: "Black pen" },
          { color: "rgba(30,144,255,1)", cursor: "url(vendor/chalkboard/img/boardmarker-blue.png), auto", label: "Blue pen" },
          { color: "rgba(220,20,60,1)", cursor: "url(vendor/chalkboard/img/boardmarker-red.png), auto", label: "Red pen" },
          { color: "rgba(50,205,50,1)", cursor: "url(vendor/chalkboard/img/boardmarker-green.png), auto", label: "Green pen" },
          { color: "rgba(255,140,0,1)", cursor: "url(vendor/chalkboard/img/boardmarker-orange.png), auto", label: "Orange pen" },
          { color: "rgba(150,0,255,1)", cursor: "url(vendor/chalkboard/img/boardmarker-purple.png), auto", label: "Purple pen" },
          { color: "rgba(255,220,0,1)", cursor: "url(vendor/chalkboard/img/boardmarker-yellow.png), auto", label: "Yellow pen" },
          { color: "rgba(255,220,0,0.28)", paletteColor: "#ffdc00", width: 26, lineCap: "butt", cursor: "crosshair", label: "Yellow highlighter", icon: "fa-highlighter" }
        ],
        grid: false,
        readOnly: false,
        transition: 1,
        storage: "ecf3900-week7-workshop-chalkboard",
        // Delete clears whichever drawing layer is open. Keep the full-deck
        // Backspace reset disabled to protect earlier work.
        keyBindings: { resetAll: null }
      },
      plugins: [window.RevealNotes, window.RevealChalkboard, window.RevealMenu]
    });
    window.Reveal.addKeyBinding({
      keyCode: 82,
      key: "R",
      description: "Clear slide annotations and blackboard"
    }, function () {
      window.RevealChalkboard.reset();
    });
    // The standard plugin deliberately skips the upcoming-slide speaker frame.
    if (!(window.Reveal.isSpeakerNotes() && window.location.search.endsWith("controls=false"))) {
      await menuReady;
    }

    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    fitSlides(slides, "after-fonts-ready");
    window.Reveal.layout();
    updateFooter();

    audit.refit = function () {
      const results = fitSlides(slides, "manual-refit");
      window.Reveal.layout();
      updateFooter();
      return results;
    };

    if (audit.unfitSlides.length) {
      console.warn("Week 7 slides need a layout check", audit.unfitSlides);
    }
    audit.status = window.deckReadyState =
      audit.mathErrors.length || audit.errors.length || audit.unfitSlides.length ? "ready-with-issues" : "ready";
    audit.completedAt = new Date().toISOString();
    document.documentElement.dataset.deckReady = audit.status;
    window.dispatchEvent(new CustomEvent("deckready", { detail: audit }));
    return audit;
  }

  const domReady = document.readyState === "loading"
    ? new Promise(function (resolve) { document.addEventListener("DOMContentLoaded", resolve, { once: true }); })
    : Promise.resolve();

  window.deckReady = domReady.then(start).catch(function (error) {
    reportError("initialization", error);
    audit.status = window.deckReadyState = "failed";
    document.documentElement.dataset.deckReady = "failed";
    throw error;
  });
  // The promise remains rejected for callers awaiting deckReady, while this
  // handler prevents an additional unhandled-rejection warning during startup.
  window.deckReady.catch(function () {});
}());
