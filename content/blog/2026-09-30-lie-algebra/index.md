+++
authors = ["William Guimont-Martin"]
title = "Lie Theory by Necessity"
description = "An introduction to Lie groups and Lie algebras through the problems they solve in robotics."
date = 2026-09-30
# updated = ""
draft = true
[taxonomies]
tags = ["Mathematics", "Robotics", "Lie Theory"]
[extra]
# banner = ""
toc_inline = true
toc_ordered = true
katex = true
+++

## A rotation from its generator

In two dimensions, a rotation is an element of the Lie group $SO(2)$. Its Lie algebra contains matrices of the form $\omega J$, where

$$
J = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix},
\qquad
R(t) = \exp(t\omega J) = I\cos(\omega t) + J\sin(\omega t).
$$

The scalar $\omega$ is angular velocity in radians per second. The matrix exponential turns that infinitesimal rotation into a finite rotation. For more on Lie theory in robotics, see [Solà et al.][micro-lie-theory] and [Barfoot][state-estimation]. Move the sliders or press **Play** to see what happens to the unit vector $(1, 0)$. The plot below is generated with NumPy and drawsvg by the Python code under **Show Python code**; Pyodide runs that same code in your browser.

{% <pyodide_demo source="/demo/pyodide/rotation.py" script="/demo/pyodide/rotation.js" stylesheet="/demo/pyodide/rotation.css" title="Unit vector rotated from the positive x-axis"> %}
Try a negative angular velocity to reverse the direction of rotation.
{% </pyodide_demo> %}

## References

- Joan Solà, Jérémie Deray, and Dinesh Atchuthan. [*A micro Lie theory for state estimation in robotics*][micro-lie-theory] (2018).
- Timothy D. Barfoot. [*State Estimation for Robotics*][state-estimation] (2017).
- Philippe Nadeau. [*A Standard Rigid Transformation Notation Convention for Robotics Research*][rigid-notation] (2024).

[micro-lie-theory]: https://www.iri.upc.edu/files/scidoc/2089-A-micro-Lie-theory-for-state-estimation-in-robotics.pdf
[state-estimation]: https://asrl.utias.utoronto.ca/~tdb/bib/barfoot_ser17.pdf
[rigid-notation]: https://arxiv.org/pdf/2405.07351
