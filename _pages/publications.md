---
layout: archive
title: "Research"
permalink: /publications/
author_profile: true
---

## Academic Publications

{% if author.googlescholar %}
  You can also find my articles on <u><a href="{{author.googlescholar}}">my Google Scholar profile</a>.</u>
{% endif %}

{% include base_path %}

{% for post in site.publications reversed %}
  {% include archive-single.html %}
{% endfor %}

## Ongoing research projects

* Pricing mechanisms in markets with non-convexities (with Paul Milgrom)
  * Draft soon
  * When preferences and production sets are non-convex, there may be no linear prices that support efficient allocations. Nevertheless, with sufficiently many producers, the Shapley-Folkman theorem implies that prices can support allocations that are nearly efficient and nearly feasible. In this paper, we study linear pricing mechanisms that lead to exactly feasible, budget-balanced and approximately efficient outcomes, showing that they are also nearly truthful, with the maximum gain to misreporting tending quickly to zero as the economy grows in size.
  * Presented at 32nd Stony Brook International Conference on Game Theory by Paul Milgrom as part of *Auction Research Evolving: Theorems and Market Designs*.

* A bandit model of trade with two-sided learning (with Yunus Aybas)
  * Draft soon
  * We study a model of trade with repeated interaction between a single buyer and many sellers. The buyer is initially uninformed about her valuation for the various goods and sellers are uninformed about the buyer's demand. We model this interaction as a multi-armed bandit problem with strategic arms and seek to understand the welfare consequences of various models of buyer behavior. Similarly to Braverman et al. (2019), we show that a buyer using a no-regret (contextual) learning algorithm may be exploited by colluding sellers in an approximate Nash equilibrium for the sellers. We then show that a buyer with commitment power may extract almost all the gains from trade from the sellers in an approximate dominant strategy equilibrium for the sellers.

## Other published work

* Paul Milgrom and Mitchell Watt (2020) [Commentary on *Effective Allocation of Affordable Housing* by Nick Arnosti and Peng Shi](https://www.informs.org/Blogs/ManSci-Blogs/Management-Science-Review/Effective-Allocation-of-Affordable-Housing). *Management Science Blog*.

* Mitchell Watt and Hubert Wu (2018) [Trust mechanisms and online platforms: A regulatory response](https://www.hks.harvard.edu/centers/mrcbg/publications/awp/awp97). *Harvard Mossavar-Rahmani Center for Business and Governance Associate Working Paper Series* No. 97.

* Jim Chalmers and Mitchell Watt (2013) [Labor should fight for economic mobility.](https://web.archive.org/web/20200331215925/https://www.chifley.org.au/labor-should-fight-for-economic-mobility/) *Chifley Research Centre Blog*.
