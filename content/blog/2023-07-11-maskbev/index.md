+++
authors = ["William Guimont-Martin"]
title = "MaskBEV"
description = ""
date = 2023-07-11
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
+++

Accepted paper at IROS 2023: <a class="external" href="https://arxiv.org/abs/2307.01864" target="_blank">MaskBEV: Joint Object Detection and Footprint Completion for Bird's-eye View 3D Point Clouds</a>

> Recent works in object detection in LiDAR point clouds mostly focus on predicting bounding boxes around objects. This prediction is commonly achieved using anchor-based or anchor-free detectors that predict bounding boxes, requiring significant explicit prior knowledge about the objects to work properly. To remedy these limitations, we propose MaskBEV, a bird's-eye view (BEV) mask-based object detector neural architecture. MaskBEV predicts a set of BEV instance masks that represent the footprints of detected objects. Moreover, our approach allows object detection and footprint completion in a single pass. MaskBEV also reformulates the detection problem purely in terms of classification, doing away with regression usually done to predict bounding boxes. We evaluate the performance of MaskBEV on both SemanticKITTI and KITTI datasets while analyzing the architecture advantages and limitations. 
