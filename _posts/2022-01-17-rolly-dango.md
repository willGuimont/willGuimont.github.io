---
layout: post
title: "Rolly Dango"
date: 2022-01-17 01:00:00 -0500
categories: poesy
tags: [Gamedev, Software Engineering, Dango]
color: rgb(200, 130, 200)
# feature-img: "assets/img/sample.png"
# thumbnail: "assets/img/thumbnail/sample-th.png"
# bootstrap: true
# excerpt_separator: <!--more-->
# author: willGuimontMartin
---

Rolly Dango, an isometric rolling puzzle made with [WASM-4](https://wasm4.org/). We made it for the [WASM-4 Game Jam](https://itch.io/jam/wasm4).

[Try the game here](https://willguimont.github.io/rolly-dango/) or on [itch.io](https://willguimont.itch.io/rolly-dango)!

![rolly dango](https://raw.githubusercontent.com/willGuimont/rolly-dango/main/assets/game.png){: .center-image }

Source code is here: [willGuimont/rolly-dango](https://github.com/willGuimont/rolly-dango)

Here's some key points of our project:

- We made our own ECS (entity-component-systems) from scratch
- To save cartridge space, we built our own Huffman coding algorithm
- To help ourselves make levels, we built our own level editor using [p5.js](https://p5js.org/)
- Made all of our sprites using [Aseprite](https://www.aseprite.org/)

Our level editor:
![level editor](https://raw.githubusercontent.com/willGuimont/rolly-dango/main/assets/editor.png){: .center-image }
