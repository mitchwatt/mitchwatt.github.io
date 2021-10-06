---
layout: archive
title: "Research"
permalink: /publications/
author_profile: true
---

## Ongoing research projects

* [Linear pricing mechanisms in markets with non-convexities](https://mitchwatt.github.io/files/PricingMechanismsNonConvex.pdf) (with [Paul Milgrom](https://milgrom.people.stanford.edu/))
  * We introduce two new linear pricing mechanisms that lead to feasible, budget-balanced and approximately efficient outcomes even when preferences or production sets are not convex and Walrasian equilibrium does not exist. One mechanism permits different prices for buyers and sellers; the other uses a single price vector but permits some agents to be rationed. In these mechanisms, both the inefficiency-to-value ratio and the maximum benefit any single agent can gain from false reporting tend quickly to zero as the numbers of producers and consumers increase.
  * Presented at 32nd Stony Brook International Conference on Game Theory by Paul Milgrom as part of *Auction Research Evolving: Theorems and Market Designs*.
  * Invited to present at the [NBER Market Design Working Group Meeting, Fall 2021](https://www.nber.org/conferences/market-design-working-group-meeting-fall-2021).

* How much can one agent influence prices? Perturbation analysis of Walrasian equilibrium
  * Draft soon
  * In exchange economies, the misreport of an agent's preferences or small changes in the supply vector are perturbations from equilibrium and may change the set of Walrasian prices. When buyers' preferences are *strongly convex*, the effect of such perturbations on prices in quasilinear economies is inversely proportional to the number of buyers. This implies that the benefits of misreporting in the Walrasian mechanism declines quickly in the number of agents in strongly convex economies. A closely related condition is also, in some sense, necessary for the set of prices attainable via such perturbations to shrink at that rate. Strong convexity also implies that the Walrasian tatonnement procedure converges efficiently to the equilibrium price.

* A bandit model of trade with two-sided learning (with [Yunus Aybas](https://aybas.people.stanford.edu/))
  * Draft soon
  * We study a model of trade with repeated interaction between a single buyer and many sellers. The buyer is initially uninformed about her valuation for the various goods and sellers are uninformed about the buyer's demand. We model this interaction as a multi-armed bandit problem with strategic arms and seek to understand the welfare consequences of various models of buyer behavior. Similarly to Braverman et al. (2019), we show that a buyer using a no-regret (contextual) learning algorithm may be exploited by colluding sellers in an approximate Nash equilibrium for the sellers. We then show that a buyer with commitment power may extract almost all the gains from trade from the sellers in an approximate dominant strategy equilibrium for the sellers.

## Academic Publications

{% if author.googlescholar %}
  You can also find my articles on <u><a href="{{author.googlescholar}}">my Google Scholar profile</a>.</u>
{% endif %}

{% include base_path %}

{% for post in site.publications reversed %}
  {% include archive-single.html %}
{% endfor %}

## Other published work

* Paul Milgrom and Mitchell Watt (2020) [Commentary on *Effective Allocation of Affordable Housing* by Nick Arnosti and Peng Shi](https://www.informs.org/Blogs/ManSci-Blogs/Management-Science-Review/Effective-Allocation-of-Affordable-Housing). *Management Science Blog*.

* Mitchell Watt and Hubert Wu (2018) [Trust mechanisms and online platforms: A regulatory response](https://www.hks.harvard.edu/centers/mrcbg/publications/awp/awp97). *Harvard Mossavar-Rahmani Center for Business and Governance Associate Working Paper Series* No. 97.

* Jim Chalmers and Mitchell Watt (2013) [Labor should fight for economic mobility.](https://web.archive.org/web/20200331215925/https://www.chifley.org.au/labor-should-fight-for-economic-mobility/) *Chifley Research Centre Blog*.
