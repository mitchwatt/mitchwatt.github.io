---
layout: archive
title: "Research"
permalink: /publications/
author_profile: true
---

## Ongoing research projects

* [Optimal In-Kind Redistribution](https://mitchwatt.github.io/files/OIKR.pdf) (with [Zi Yang Kang](https://www.ziyangkang.com))
  *This paper develops a model of in-kind redistribution where consumers participate in either a private market or a government-designed program, but not both. We characterize when a social planner, seeking to maximize weighted total surplus, can strictly improve upon the laissez-faire outcome. We show that the optimal mechanism consists of three components: a public option, nonlinear subsidies, and laissez-faire consumption. We quantify the resulting distortions and relate them to the correlation between consumer demand and welfare weights. Our findings reveal that while private market access constrains the social planner's ability to redistribute, it also strengthens the rationale for non-market allocations.

* [Walrasian Mechanisms for Non-convex Economies and the Bound-Form First Welfare Theorem](https://mitchwatt.github.io/files/PricingMechanismsNonConvex.pdf) (with [Paul Milgrom](https://milgrom.people.stanford.edu/))
  * Revise and Resubmit, *Review of Economic Studies*
  * Previously "Linear Pricing Mechanisms for Market without Convexity"
  * We introduce two extensions of the Walrasian mechanism for quasilinear economies to allow agents to report non-concave values and non-convex costs. The extended mechanisms, which always deliver feasible, near-efficient allocations with no budget deficit, are computationally undemanding and nearly incentive-compatible. We also introduce an extension of the First Welfare Theorem allowing us to upper bound the welfare losses from these mechanisms.
  * Accepted to [EC'22](https://ec22.sigecom.org/)
  * Presented at [32nd Stony Brook International Conference on Game Theory](https://youtu.be/Xn09KsMNLrs?t=1771) by Paul Milgrom as part of *Auction Research Evolving: Theorems and Market Designs*.
  * Presented at the [NBER Market Design Working Group Meeting, Fall 2021](https://www.nber.org/conferences/market-design-working-group-meeting-fall-2021).
  * See a two-minute technical preview of the paper here:
  * <a href="https://www.youtube.com/watch?v=8-jI7cyXUSc"><img src="https://user-images.githubusercontent.com/86020085/176799493-029db73e-278c-4576-8e1c-395009e8efcb.PNG" width="320" height="180" alt="2-minute technical preview"></a>

* [Strong monotonicity and perturbation-proofness of Walrasian equilibrium](https://mitchwatt.github.io/files/perturbations.pdf)
  * We study the price impact of small perturbations to Walrasian equilibrium, as might be caused by changes in the supply vector, changes in the set of participants, or misreports by an agent. A (nested) sequence of markets is *perturbation-proof* if, given any supply vector, the price impact of any bounded perturbation is inversely proportional to the number of agents. Perturbation-proofness implies good incentive properties of Walrasian equilibrium in large markets and robustness of prices to small misspecifications. Replica economies are perturbation-proof if and only if the base economy's demand correspondence is *strongly monotone*. When buyers' preferences are drawn identically and independently from a type distribution with a strongly monotone *expected* demand correspondence, the resulting sequence of economies is perturbation-proof with high probability. We argue that strong monotonicity of the expected demand correspondence is a realistic assumption in economic models with indivisibilities, reflecting variety in the set of possible preferences and uncertainty about reservation prices associated with demand changes.

## Academic Publications

{% if author.googlescholar %}
  You can also find my articles on <u><a href="{{author.googlescholar}}">my Google Scholar profile</a>.</u>
{% endif %}

{% include base_path %}

{% for post in site.publications reversed %}
  {% include archive-single.html %}
{% endfor %}

## Mathematical Notes
* [Concavity and convexity of order statistics in sample size](https://arxiv.org/abs/2111.04702)
  * We show that the expectation of the $k$th-order statistic of an i.i.d. sample of size $n$ from a monotone reverse hazard rate (MRHR) distribution is convex in $n$ and that the expectation of the $(n-k+1)$th-order statistic from a monotone hazard rate (MHR) distribution is concave in $n$ for $n \geq k$. We apply this result to the analysis of independent private value auctions in which the auctioneer faces a convex cost of attracting bidders.

## Other published work

* Paul Milgrom and Mitchell Watt (2020) [Commentary on *Effective Allocation of Affordable Housing* by Nick Arnosti and Peng Shi](https://www.informs.org/Blogs/ManSci-Blogs/Management-Science-Review/Effective-Allocation-of-Affordable-Housing). *Management Science Blog*.

* Mitchell Watt and Hubert Wu (2018) [Trust mechanisms and online platforms: A regulatory response](https://www.hks.harvard.edu/centers/mrcbg/publications/awp/awp97). *Harvard Mossavar-Rahmani Center for Business and Governance Associate Working Paper Series* No. 97.

* Jim Chalmers and Mitchell Watt (2013) [Labor should fight for economic mobility.](https://web.archive.org/web/20200331215925/https://www.chifley.org.au/labor-should-fight-for-economic-mobility/) *Chifley Research Centre Blog*.
