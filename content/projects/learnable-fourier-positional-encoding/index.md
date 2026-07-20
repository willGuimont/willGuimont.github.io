+++
title = "Learnable Fourier Positional Encoding"
description = "PyTorch implementation of learnable Fourier features for spatial positions"
date = 2024-01-01
weight = 250
[extra]
category = "Libraries"
year = 2024
source_url = "https://github.com/willGuimont/learnable_fourier_positional_encoding"
screenshot = "project.svg"
screenshot_alt = "Multidimensional coordinates transformed into waves and a learned feature embedding"
+++

This package implements *Learnable Fourier Features for Multi-Dimensional Spatial Positional Encoding* in PyTorch. It transforms multidimensional spatial coordinates into expressive embeddings using Fourier features whose projection is learned with the rest of the model.

The encoding is useful when a neural network needs to reason about positions in more than one dimension while preserving spatial relationships. The library packages the method as a reusable PyTorch module and is available directly from PyPI.
