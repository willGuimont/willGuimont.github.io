+++
authors = ["William Guimont-Martin"]
title = "Fix Obsidian Broken Graph View"
description = ""
date = 2024-07-14
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

If the Graph View in Obsidian is broken after an update, you can fix it by following these steps:

```shell
# Close Obsidian
cd ~/.config/obsidian
rm -rf Cache Code\ Cache DawnCache GPUCache
# Reopen Obsidian
```