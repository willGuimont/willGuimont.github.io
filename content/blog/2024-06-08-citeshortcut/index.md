+++
authors = ["William Guimont-Martin"]
title = "Cite website Bookmarklet"
description = "Simple bookmarklet to cite a website in bibme.org"
date = 2024-06-08
# updated = ""
# draft = false
[taxonomies]
tags = ["Computer Sciences"]
[extra]
# banner = ""
# toc = true
toc_inline = true
toc_ordered = true
# trigger = ""
# disclaimer = ""
+++

To automatically cite a website in <a class="external" href="https://www.bibme.org" target="_blank">bibme.org</a>, add the following bookmarklet to your bookmarks bar:

```javascript
javascript:void((function(){location.href='https://www.bibme.org/apa/website-citation/search?q='+location.href;})());
```

Clicking the bookmarklet will open the current page in <a class="external" href="https://www.bibme.org" target="_blank">bibme.org</a>'s citation generator.
