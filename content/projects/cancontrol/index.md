+++
title = "CanControl"
description = "Control FRC-compatible motor controllers from Arduino"
date = 2026-01-16
weight = 210
[extra]
category = "Libraries"
source_url = "https://github.com/willGuimont/CanControl"
blog_post = "blog/2026-01-16-cancontrol/index.md"
screenshot = "project.svg"
screenshot_alt = "Illustration of an Arduino communicating with an FRC motor controller over a CAN bus"
+++

FRC (FIRST Robotics Competition) robots often use motor controllers such as the REV Robotics Spark MAX, CTRE Talon SRX, or CTRE Victor SPX. These controllers are typically designed for specific libraries and hardware, such as the RoboRIO, which makes integrating them with microcontrollers like Arduino challenging.

CanControl is an Arduino library that enables communication with FRC-compatible motor controllers over the CAN bus. It can send commands, read sensor data, and configure settings directly from an Arduino board, opening these controllers to robotics projects outside the FRC ecosystem.
