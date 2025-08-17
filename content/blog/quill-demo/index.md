+++
authors = ["John Draft"]
title = "Drafty Draft"
description = "Drafted post, very drafty."
date = 2024-04-29
draft = true
[taxonomies]
tags = ["Draft"]
+++

### Blog post specific:

- `banner`: Filename of the [colocated](https://www.getzola.org/documentation/content/overview/#asset-colocation) banner image. Recommended dimensions are 2:1 aspect ratio and 1920x960 resolution.
- `banner_pixels` Makes the banner use nearest neighbor algorithm for scaling, useful for keeping pixel-art sharp.
- `archived`: Make the post visually stand out in the post list. Also accepts message as a value.
- `featured`: Ditto but doesn't accept message as a value.
- `hot`: Ditto.
- `poor`: Ditto.

In `[extra.comments]` section:

- `host`: The Mastodon server on which the post was posted.
- `user`: The username of the poster.
- `id`: ID of the post; the one in the URL.

