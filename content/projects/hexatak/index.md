+++
title = "Hexatak"
description = "A hex-grid puzzle about merging and stacking stones to build a road across the board"
date = 2026-07-10
weight = 110
[extra]
category = "Games"
app_url = "https://willguimont.com/cgame/hexatak_classic/"
action_label = "Play the game"
source_url = "https://github.com/willGuimont/cgame"
blog_post = "blog/2026-07-10-hexatak/index.md"
screenshot = "thumbnail.png"
screenshot_alt = "Hexatak puzzle gameplay"
+++

Hexatak is a hex-grid puzzle about merging and stacking stones to build a contiguous road between two board edges. It was made in C for the [raylib 6.x game jam](https://itch.io/jam/raylib-6x-gamejam), built around the themes `hex` and `merge`, and loosely inspired by the stack movement ideas in [Tak](https://en.wikipedia.org/wiki/Tak_(game)).

You move whole stacks one tile at a time, spread towers across multiple cells, merge matching values, and satisfy bridge conditions before running out of moves. Later levels add gates that require specific stone values or exact stack heights, so the puzzle is not just about reaching the other side, but about routing the right road with the right pieces.

The game includes:

- 18 handcrafted puzzle levels with escalating mechanics
- Stack movement, stack spreading, and value merges
- Blocked cells, fixed bridge anchors, value gates, and height gates
- A built-in level editor used to design and test puzzles
- Debug tooling for checking solvability and loading levels quickly
