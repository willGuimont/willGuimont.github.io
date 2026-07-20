+++
title = "PROSAC"
description = "Python implementations of RANSAC and quality-guided PROSAC"
date = 2019-11-29
weight = 240
[extra]
category = "Libraries"
source_url = "https://github.com/willGuimont/prosac"
blog_post = "blog/2019-11-29-prosac-algorithm/index.md"
screenshot = "project.svg"
screenshot_alt = "A robust fitted line through ranked data points with outliers"
+++

PROSAC is a Python implementation of both RANSAC and Progressive Sample Consensus. These algorithms estimate a model from noisy observations while remaining robust to outliers.

Unlike RANSAC's uniform random sampling, PROSAC ranks observations by their known quality and begins with the most promising candidates. It progressively expands the sampling pool, often finding a useful model much sooner when good correspondences can be ranked reliably.
