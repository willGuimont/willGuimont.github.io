---
layout: post
title:  "PROSAC"
date:   2019-12-26 12:00:00 -0500
categories: cs
---

Recently, for a graduated mobile robotics class, I had to present a scientific paper. Loving algorithms, I decided to read [Matching with PROSAC - Progressive Sample Concensus](/assets/linked_paper/2005-Matching-with-PROSAC-progressive-sample-consensus.pdf){:target="_blank"}. A variant of the popular RANSAC algorithm.

This article will be a more detailed version of the presentation I gave for that class, the slides are [here](/assets/presentations/PROSAC.pdf){:target="_blank"}. I won't go into much of the mathematics, the details are in the paper. What I really want to do with this article is to give you the intuition behind the algorithm.

To supplement the presentation, I wrote an implementation of PROSAC in Python: [willGuimont/PROSAC](https://github.com/willGuimont/PROSAC){:target="_blank"}

Before jumping in PROSAC, let's just review RANSAC a bit.

# Random sample consensus - RANSAC

The main goal of RANSAC is to estimate a model from noised data with outliers.

## Pseudo code

Let $$m$$ be the minimum required number of points to fit a model. For a linear model in 2D, $$m$$ would be equal to $$2$$.

Let $$M$$ a model to fit on the data.

Let $$\epsilon_{tol}$$ be the maximum error between a point and the model to be considered an inlier.

Let $$\tau$$ the fraction of inlier over the total number of points above which we are satisfied by the model. If we achieve that ratio, we stop early.

Let $$w$$ be the probabillity of a given point to be an inlier. This is used to estimate the number of times we have to run RANSAC before finding a satisfying solution.

Let $$I$$ be the found set of inliers of maximal cardinality.

1. Sample $$m$$ points
2. Estimate a model $$M$$ from the $$m$$ sampled points
3. Find the number of inliers with model $$M$$ with tolerance $$\epsilon_{tol}$$. If the number of inliers is greater than the number of previously inliers, replace $$I$$ with the new set of inliers.
4. If the fraction of inliers over the total number of points is greater than $$\tau$$, estimate the model with all inliers and stop.
5. Repeat steps 1 to 4, a maximum of $$\frac{1}{w^m}$$ times
6. After $$\frac{1}{w^m}$$ iterations, estimate the model with $$I$$.

## In the paper

In the paper, they looked at estimating epipolar geometry from a pair of pictures. The number of iteration of RANSAC is given by $$\frac{1}{w^m}$$.

![Plant 1](/assets/images/PROSAC/plant01.png){: .center-image }

![Plant 2](/assets/images/PROSAC/plant02.png){: .center-image }

With this pair of pictures, there is a lot of repetitive patterns on the floor and leaves, so there will be a lot of false matches. We have $$m=7$$ and $$w=9.2%$$, we have that the estimated number of sample is over $$8.43 \times 10^7$$ !!! RANSAC would take a pretty long time before find a good solution...

Let's see if PROSAC can help.

# Progressive sample consensus - PROSAC

PROSAC adds the notion of point quality with the basic assumption that points of greater quality have more chances to be inliers to the real model.

So, to make the algorithm quicker, the algorithm starts by trying to fit with points of greater quality. Then more points of lower quality are *progressively* added to the considered set.

## Intuition
Let's say that the points in red are outliers. In RANSAC, we would be sampling $$m=2$$ among all points, so we would have a probability of $$\frac{3}{6}\cdot\frac{2}{5}=20\%$$. So, we would need, on average, $$5$$ samples before finding an uncontaminate sample.

Whereas in PROSAC, we sort points by quality. We would start sampling from the top 2 points, so we would sample $$p_2$$ and $$p_4$$, both of which are correct.
![Comp](/assets/images/PROSAC/comp.png){: .center-image }

Even with this simple example, we can see the possible speed up.

## Simplified pseudo code

1. Sort points by quality
2. Sample $$m$$ points from the top $$n$$
3. Fit the model
4. Verify model with all points
5. If the stopping criterion are not met, repeat steps 1 to 4, adding progressively points $$n\leftarrow n + 1$$. Otherwise, fit the model on all inliers.

## Quality
Okay, PROSAC seems to provide a substential speed up, but how do you define the notion of quality?

There is multiple ways of defining quality. For feature matching on images, we could use correlation of intensity around features on each images. 

In the paper, they mention Lowe's distance.

$$s_1$$: distance of the most similar match

$$s_2$$: distance of the second most similar match

$$distance = \frac{s_1}{s_2}$$

This distance allows use to select first points that are significally better than any other. A match with a low Lowe's distance has more chances of being correct.

## Fast sampling
We could simply sample $$m$$ points from the top $$n$$ points, but that would be inefficient. We could sample multiple times the same set of points. So, to better explore the possibles sets, we use the fact that when adding a new point $$p_{n+1}$$. We add a number $$a$$ of new samples, each of them contains the new point $$p_{n+1}$$. So, we can simply sample $$a$$ times picking $$p_{n+1}$$ and $$m-1$$ points in the first $$n$$ points.

That way, we ensure the quickly explore the possibles sets.

## End criterion

The algorithm has two stopping criterion.

## Non-random solution

This criteria states that for a solution to be considered correct, it must have more inliers than what would randomly happen for an incorrect model.

## Maximality

We want to stop sampling when the chance of getting a model that fit more points is lower than a certain threshold.

# Code
[willGuimont/PROSAC](https://github.com/willGuimont/PROSAC){:target="_blank"}

# Sources
[^ChumMatas]: Chum, Ondrej & Matas, Jiri. Matching with PROSAC = Progressive Sample Consensus. 2005.
