+++
authors = ["William Guimont-Martin"]
title = "Free 3D Scanning using iOS devices"
description = ""
date = 2025-03-03
# updated = ""
# draft = false
[taxonomies]
tags = ["Computer Sciences"]
[extra]
# banner = ""
# toc = true
toc_inline = true
toc_ordered = true
# trigger = ""
# disclaimer = ""
+++

The current state of 3D scanning apps on the App Store is a bit disappointing.
Most of them are either paid or have a subscription model.
Not doing enough scanning to justify the cost, I decided to look for a free alternative.

I was pleasantly surprised to find that Apple's own [RealityKit](https://developer.apple.com/documentation/realitykit) framework has a sample app for exactly this purpose.
[Scanning objects using Object Capture](https://developer.apple.com/documentation/realitykit/scanning-objects-using-object-capture) is a free app that lets you scan objects using your iOS device.

To get started, install Xcode and download the sample app from the [Object Capture sample code](https://developer.apple.com/documentation/realitykit/scanning-objects-using-object-capture).
Build and run the app on your iOS device, and follow the instructions to scan an object.

Once done, you can export the scanned object as a USDZ file or save all the images to your device.
The images can then be used with [Building an object reconstruction app](https://developer.apple.com/documentation/realitykit/building-an-object-reconstruction-app) to create a high-quality 3D model.

Since USDZ is not a widely supported format in the 3D printing world or CAD software, you can convert it to other formats using tools like [Blender](https://www.blender.org/).