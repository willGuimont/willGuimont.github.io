+++
authors = ["William Guimont-Martin"]
title = "Proprioception Is All You Need: Terrain Classification for Boreal Forests"
description = "Exterioception need-not apply"
date = 2024-09-10
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

Co-authored paper at IROS 2024: <a class="external" href="https://norlab-ulaval.github.io/BorealTC/" target="_blank">Proprioception Is All You Need: Terrain Classification for Boreal Forests</a>

> Recent works in field robotics highlighted the importance of resiliency against different types of terrains. Boreal forests, in particular, are home to many mobility-impeding terrains that should be considered for off-road autonomous navigation. Also, being one of the largest land biomes on Earth, boreal forests are an area where autonomous vehicles are expected to become increasingly common. In this paper, we address the issue of classifying boreal terrains by introducing BorealTC, a publicly available dataset for proprioceptive-based terrain classification (TC). Recorded with a Husky A200, our dataset contains 116 min of Inertial Measurement Unit (IMU), motor current, and wheel odometry data, focusing on typical boreal forest terrains, notably snow, ice, and silty loam. Combining our dataset with another dataset from the literature, we evaluate both a Convolutional Neural Network (CNN) and the novel state space model (SSM)-based Mamba architecture on a TC task. We show that while CNN outperforms Mamba on each separate dataset, Mamba achieves greater accuracy when trained on a combination of both. In addition, we demonstrate that Mamba's learning capacity is greater than a CNN for increasing amounts of data. We show that the combination of two TC datasets yields a latent space that can be interpreted with the properties of the terrains. We also discuss the implications of merging datasets on classification. Our source code and dataset are <a class="external" href="https://github.com/norlab-ulaval/BorealTC" target="_blank">publicly available online</a>.
