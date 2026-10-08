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
courses:
  - title: "ECF 3900 (Semester 2, 2026)"
    url: /teaching/ecf3900/2026-s2/
---

I teach ECF 3900 Business, Competition, and Regulation at Monash University.

{% for course in page.courses %}
- [{{ course.title }}]({{ course.url | relative_url }})
{% endfor %}
