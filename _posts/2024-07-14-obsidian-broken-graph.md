---
layout: post
title: "Fix Obsidian Broken Graph View"
date: 2024-07-14 8:20:00 -0500
categories: cs
tags: [Computer Sciences]
color: rgb(110, 93, 157)
---

If the Graph View in Obsidian is broken after an update, you can fix it by following these steps:

```shell
# Close Obsidian
cd ~/.config/obsidian
rm -rf rm -rf Cache Code\ Cache DawnCache GPUCache
# Reopen Obsidian
```
