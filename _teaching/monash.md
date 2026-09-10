---
title: "Monash University"
collection: teaching
type: "Lecturer"
permalink: /teaching/monash
venue: "Monash University"
date: 2026-01-01
location: "Melbourne, Australia"
years: "2026–present"
current: true
summary: "ECF 3900 Business, Competition, and Regulation at Monash University."
materials:
  - title: "Week 7: Mergers and Competitive Effects — workshop slides"
    url: /teaching/ecf3900/week7-slides/
  - title: "Week 7 In-Class Exercise: hints"
    url: /teaching/ecf3900/week7-hints/
  - title: "Week 8 In-Class Exercise: hints"
    url: /teaching/ecf3900/week8-hints/
  - title: "Week 8: Vertical Relationships — workshop slides (PDF)"
    url: /teaching/ecf3900/week8-slides/
---

I teach ECF 3900 Business, Competition, and Regulation at Monash University.

{% for material in page.materials %}
- [{{ material.title }}]({{ material.url | relative_url }})
{% endfor %}
