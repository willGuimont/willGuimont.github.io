+++
authors = ["William Guimont-Martin"]
title = "Wayback Machine Bookmarklet"
description = ""
date = 2023-12-29
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

To automatically open a website in the Wayback Machine, add the following bookmarklet to your bookmarks bar:

```javascript
javascript:void((function(){location.href='https://web.archive.org/web/*/'+location.href;})());
```

Clicking the bookmarklet will open the current page in the Wayback Machine.