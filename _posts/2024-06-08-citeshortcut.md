---
layout: post
title: "Cite website Bookmarklet"
date: 2024-06-08 8:20:00 -0500
categories: cs
tags: [Computer Sciences]
color: rgb(110, 93, 157)
---

To automatically cite a website in [bibme.org](https://www.bibme.org), add the following bookmarklet to your bookmarks bar:

```javascript
javascript:void((function(){location.href='https://www.bibme.org/apa/website-citation/search?q='+location.href;})());
```

Clicking the bookmarklet will open the current page in [bibme.org](https://www.bibme.org)'s citation generator.
