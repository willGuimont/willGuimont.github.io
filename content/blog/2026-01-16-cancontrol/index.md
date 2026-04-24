+++
authors = ["William Guimont-Martin"]
title = "CanControl"
description = "Control FRC-compatible motor controller from Arduino"
date = 2026-01-16
# updated = ""
# draft = false
[taxonomies]
tags = ["Robotics", "Arduino", "FRC"]
[extra]
# banner = ""
# toc = true
toc_inline = true
toc_ordered = true
# trigger = ""
# disclaimer = ""
+++

FRC (FIRST Robotics Competition) robots often use motor controllers like the [REV Robotics Spark MAX](https://www.revrobotics.com/rev-11-2158/), the [CTRE Talon SRX](https://store.ctr-electronics.com/products/talon-srx), or the [CTRE Victor SPX](https://store.ctr-electronics.com/products/victor-spx).
However, these controllers are typically designed to work with specific libraries and hardware, such as the RoboRIO used in FRC.
This can make it challenging to integrate them with other microcontrollers like Arduino.
`CanControl` is an Arduino library that enables communication with FRC-compatible motor controllers over the CAN bus.
With `CanControl`, you can send commands to motor controllers, read sensor data, and configure settings directly from an Arduino board.
This opens up new possibilities for robotics projects that want to leverage the capabilities of FRC motor controllers without being tied to the FRC ecosystem.

**GitHub:** <a class="external" href="https://github.com/willGuimont/CanControl" target="_blank">willGuimont/CanControl</a>
