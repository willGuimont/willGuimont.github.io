---
layout: post
title:  "PROSAC"
date:   2019-10-29 00:00:40 -0500
categories: cs
---

Recently for a graduated mobile robotics class, I had to present a scientific paper.

Being the algorithms lover I am, I decided to read [TITLE OF PAPER].

So this article will be a more detailed version of my presentation, slides are [THERE (french)].

PROSAC: variant of RANSAC

Goal: Estimate models with noised data

# RANSAC

Explain

1. sample m points
2. model
3. inliers
4. si In/N > tau --> end
5. repeat steps 1 to 4, max 1/w^m times, otherwise return best found model

pseudo code

epipolar geometry, m=7, w=9.2% --> 8.43 x 10^7 iterations

# PROSAC

RANSAC but faster

## Pseudo code

## Quality
Quality --> more likely to be correct
want to start sampling with them
progressively (that's where the name comes from) add lower quality points

Metrics

## Fast sampling


## End criterion

# Code
python

# Results


# Conclusion
RANSAC family
