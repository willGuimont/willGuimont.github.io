+++
title = "torch_waymo"
description = "Load and convert the Waymo Open Dataset for PyTorch"
date = 2023-02-02
weight = 230
[extra]
category = "Libraries"
source_url = "https://github.com/willGuimont/torch_waymo"
blog_post = "blog/2023-02-02-torch_waymo/index.md"
screenshot = "project.svg"
screenshot_alt = "A point-cloud street scene flowing into a PyTorch tensor"
+++

`torch_waymo` is a Python library for loading the Waymo Open Dataset in PyTorch without requiring TensorFlow in the training pipeline. It converts Waymo records into either simplified frames or complete frame data, then exposes the result through a PyTorch-friendly dataset interface.

The package includes a `torch-waymo-convert` command-line tool and can be installed from PyPI. This keeps the one-time dataset conversion separate from model development and makes Waymo data easier to use in a standard PyTorch workflow.
