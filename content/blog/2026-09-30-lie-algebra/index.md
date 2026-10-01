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

## Abstract

- Lie theory has muiltiple uses in robotics
  - Search when first used in robotics
  - Useful since robotics always works with: SO(3), SE(3), ICP, SLAM, calculus on rotations, etc.
- There are multiple resources (see sources), but they often throw definitions and abstract ideas without telling you where they come from
  - Most maths books are like that, but roboticists are often not very much definition oriented as intuition oriented. Need to understand the tool and what it represents to use it in the real world
  - Applied maths
  - Barfoot was good, until it introduced Adjoint, at which point it was just definitions and proofs
  - While useful, does not really help develop the intuition required to use it in the field
- Here's the motivation of this blog post, to start from concrete robotics examples, and show how Lie groups and Lie algebra arise naturally
- Hence the name Lie Theory by Necessity

## Prerequisitse

TODO update while writting

- Linear algebra
  - SO(2), SE(2), SO(3), SE(3)
  - Homogeneous coordinates
- Calulus
- Basic set theory
- Basic group theory

## Setup

- Will consider a robot first in 2D, then in 3D
- Allows to explore SO(2), SE(2), and then SO(3), SE(3)
- Example of why rotations are special
  - Let's say you want to optimize a rotation using gradient descent
  - R = R - eta * Grad_R Error
  - R1 - R2 is not a rotation
  - How to do calculus on objects that are not ordinary vectors?

## Flatland

- SO(2) as a matrix
- Operator is mat mul (R(1)R(2) = R(1 + 2))
- Speed -> derivative

## A smooth group

It is a group

- Example with rot by multitples of 90 degrees (n = 4 steps)
- Identity, closed, inverse, assoc
- As n -> infinity, this is a lie group, a continous generalization

It's speed is the lie algebra

- Rotation for 1 second, R(0) = initial, R(1) = final, at speed omega
- Do it in n steps
- derivative, dt = 1 / n
- delta t -> 0 (or n -> infinity)

## Some definitions

From that concrete example

- groups
- manifold
- tangent space
- lie group
- lie algebra

## SO(2)

- p(t) = (r cos (theta(t)), r sin (theta(t)))
- p_dot(t) = theta_dot (-r sin(theta(t)), r cos(theta(t))) = theta_dot (-y, x)
- As a matrix J = [[0, -1], [1, 0]] = p_dot(t) = theta_dot J p(t)
- Despite 2x2 matrix, the possible rotations theta J have 1 DoF

Adding one more dim
- Like in homogenous coords, where adding dim makes it simpler
- p = (x, y, 0\), w = (0, 0, theta_dot) -> w x p = theta_dot (-y, x, 0)

## SO(3)

Same thing works in 3D p = (x, y, z) and w = (wx, wy, wz).
Need a better explanation why cross product here
Can represent cross product as matrix mult -> hat operator
Again, 3x3 matrix, but only 3 DoF w^p

## Exp

How position works in time (e.g., for calculus)
Take again t in [0, 1], dt

Explain what we want to do

p(t + dt) == p(t) * p_dot(t) dt
p(t) + wJp(t)dt
(I + wJdt)p(t)

Do example / fig in 90deg, but what about infinitially?

dt = 1 / n, in n steps (e.g., 90deg)

p1 = (I + wJ/n)p0, ..., pn = (I + wJ/n)^n p(0)

as lim n -> infinity, this is the same as compounding interest, and is exponential, but here it is matrix exponent
digression to scalar exponent

### Scalar exponent

Explain same mechanism but about, x_dot = ax, x(t + dt) = (1 + a dt) x(t)

### Matrix Exponent

So matrix is exp(wJ) = lim n -> infinity (I + wJ/n)^n
but can also write as exp(A) = I + A + A^2/2! + A^3/3! + ...

Explain that lim n is a bit easier to understand here, as we do the rotation in small steps

TODO: find interpretation in rotations for that other exp(A) (perhaps just a rewriting + binomial coeff)



## A rotation from its generator

In two dimensions, a rotation is an element of the Lie group $\SO(2)$. Its Lie algebra $\so(2)$ contains matrices of the form $\omega J$, where

$$
J = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix},
\qquad
R(t) = \exp(t\omega J) = I\cos(\omega t) + J\sin(\omega t).
$$

The scalar $\omega$ is angular velocity in radians per second. The matrix exponential turns that infinitesimal rotation into a finite rotation. For more on Lie theory in robotics, see [Solà et al.][micro-lie-theory] and [Barfoot][state-estimation]. Move the sliders or press **Play** to see what happens to the unit vector $(1, 0)$. The plot below is generated with NumPy and drawsvg by the Python code under **Show Python code**; Pyodide runs that same code in your browser.

{% <pyodide_demo source="/demo/pyodide/rotation.py" script="/demo/pyodide/rotation.js" stylesheet="/demo/pyodide/rotation.css" title="Unit vector rotated from the positive x-axis"> %}
Try a negative angular velocity to reverse the direction of rotation.
{% </pyodide_demo> %}

## Projective Geometric Algebra



## References

- Joan Solà, Jérémie Deray, and Dinesh Atchuthan. [*A micro Lie theory for state estimation in robotics*][micro-lie-theory] (2018).
- Timothy D. Barfoot. [*State Estimation for Robotics*][state-estimation] (2017).
- Philippe Nadeau. [*A Standard Rigid Transformation Notation Convention for Robotics Research*][rigid-notation] (2024).

[micro-lie-theory]: https://www.iri.upc.edu/files/scidoc/2089-A-micro-Lie-theory-for-state-estimation-in-robotics.pdf
[state-estimation]: https://asrl.utias.utoronto.ca/~tdb/bib/barfoot_ser17.pdf
[rigid-notation]: https://arxiv.org/pdf/2405.07351
