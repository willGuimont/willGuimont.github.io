+++
authors = ["William Guimont-Martin"]
title = "Using Citizen Science Data for UAV Image Analysis"
description = "Using citizen science data to improve UAV image analysis"
date = 2025-04-09
# updated = ""
# draft = false
[taxonomies]
tags = ["Computer Sciences", "Deep Learning", "Machine Learning", "Paper"]
[extra]
# banner = ""
# toc = true
toc_inline = true
toc_ordered = true
# trigger = ""
# disclaimer = ""
katex = true
+++

Co-authored paper in MDPI: <a class="external" href="https://www.mdpi.com/1999-4907/16/4/616" target="_blank">Using Citizen Science Data as Pre-Training for Semantic Segmentation of High-Resolution UAV Images for Natural Forests Post-Disturbance Assessment</a>

> The ability to monitor forest areas after disturbances is key to ensure their regrowth. Problematic situations that are detected can then be addressed with targeted regeneration efforts. However, achieving this with automated photo interpretation is problematic, as training such systems requires large amounts of labeled data. To this effect, we leverage citizen science data (iNaturalist) to alleviate this issue. More precisely, we seek to generate pre-training data from a classifier trained on selected exemplars. This is accomplished by using a moving-window approach on carefully gathered low-altitude images with an Unmanned Aerial Vehicle (UAV), WilDReF-Q (Wild Drone Regrowth Forest—Quebec) dataset, to generate high-quality pseudo-labels. To generate accurate pseudo-labels, the predictions of our classifier for each window are integrated using a majority voting approach. Our results indicate that pre-training a semantic segmentation network on over 140,000 auto-labeled images yields an $F1$ score of 43.74% over 24 different classes, on a separate ground truth dataset. In comparison, using only labeled images yields a score of 32.45%, while fine-tuning the pre-trained network only yields marginal improvements (46.76%). Importantly, we demonstrate that our approach is able to benefit from more unlabeled images, opening the door for learning at scale. We also optimized the hyperparameters for pseudo-labeling, including the number of predictions assigned to each pixel in the majority voting process. Overall, this demonstrates that an auto-labeling approach can greatly reduce the development cost of plant identification in regeneration regions, based on UAV imagery.
