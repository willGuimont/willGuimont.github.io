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
  - Invariant Extended Kalman Filtering (InEKF) for attitude and robot state estimation: represent the state on a Lie group and estimation errors in its Lie algebra. See [Potokar et al.'s introduction][inekf-introduction] and [Bonnabel's original paper][inekf-original].
- There are multiple resources (see sources), but they often throw definitions and abstract ideas without telling you where they come from
  - Most maths books are like that, but roboticists are often not very much definition oriented as intuition oriented. Need to understand the tool and what it represents to use it in the real world
  - Applied maths
  - Barfoot was good, until it introduced Adjoint, at which point it was just definitions and proofs
  - [inekf-introduction] too jumps to definitions
  - While useful, does not really help develop the intuition required to use it in the field
  - Perhaps a bit easier to write such material "linearly" from definitions to consequences, but irl the path to discovering these is not linear, you abstract from the concrete
- Here's the motivation of this blog post, to start from concrete robotics examples, and show how Lie groups and Lie algebra arise naturally
- Hence the name Lie Theory by Necessity

## Prerequisitse

TODO update while writting

- Linear algebra
  - SO(2), SE(2), SO(3), SE(3)
    - Add definitions here
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
- [inekf-introduction]
  - A Lie group is a group and a smooth manifold with the property that element inversion and the group operation are differentiable .
  - A matrix Lie group is simply a Lie group whose elements are matrices, and the group opera-
tion is matrix multiplication.

It's speed is the lie algebra

- Rotation for 1 second, R(0) = initial, R(1) = final, at speed omega
- Do it in n steps
- derivative, dt = 1 / n
- delta t -> 0 (or n -> infinity)
- [inekf-introduction]
  - Tangent plane at an telement, Examples include the unit sphere, a torus, or a smooth surface in .R3 Manifolds are often visualized by a curved surface, where each point X M! is equipped with a tangent space denoted ,T MX as shown in Figure 1. Each tangent space is a vector space of dimension n and can be iso- morphically mapped to Rn [30] using the “hat” operator, which is denoted as : .TR Mn X"/ (S1) Each element of the tangent space is called a vector and often denoted by .T MX!p Furthermore, a map exists from T MX to a neighborhood of ,X M! called the exponential map: : .exp T MMX X " (S2) In some cases, exp is the well-known exponential given by the Taylor series !,/e X nX n n 0R= = but generally, it is not 

## Some definitions

From that concrete example

- groups
- manifold
  - A smooth manifold of dimension n is a geometric structure that is locally close to ,Rn enabling the use of calculus on a local map of the manifold
- tangent space
- lie group
- lie algebra

## SO(2)

A robot with only a heading angle $\theta$ operating in the plane.

{% <pyodide_demo source="/blog/lie-algebra/figures/so2/so2.py" script="/blog/lie-algebra/figures/so2/so2.js" stylesheet="/blog/lie-algebra/figures/so2/so2.css" code_path="content/blog/2026-09-30-lie-algebra/figures/so2/so2.py" title="SO(2) Robot Heading and Sensor Point Setup"> %}
A robot with heading orientation $\theta \in \mathrm{SO}(2)$, a local sensor reference frame $(X_s, Y_s)$, and a point $p_s$ expressed in the sensor referential mapped to world point $q = R(\theta)p_s$.
{% </pyodide_demo> %}

- p(t) = (r cos (theta(t)), r sin (theta(t)))
- p_dot(t) = theta_dot (-r sin(theta(t)), r cos(theta(t))) = theta_dot (-y, x)
- As a matrix J = [[0, -1], [1, 0]] = p_dot(t) = theta_dot J p(t)
- Despite 2x2 matrix, the possible rotations theta J have 1 DoF

Adding one more dim
- Like in homogenous coords, where adding dim makes it simpler
- p = (x, y, 0), w = (0, 0, theta_dot) -> w x p = theta_dot (-y, x, 0)

## SE(2)

A robot with 2D translation $(x, y)$ and heading angle $\theta$.

{% <pyodide_demo source="/blog/lie-algebra/figures/se2/se2.py" script="/blog/lie-algebra/figures/se2/se2.js" stylesheet="/blog/lie-algebra/figures/se2/se2.css" code_path="content/blog/2026-09-30-lie-algebra/figures/se2/se2.py" title="SE(2) Robot Pose and Sensor Point Setup"> %}
A robot with 2D position $(x, y)$ and heading $\theta$ represented by $T \in \mathrm{SE}(2)$, transforming sensor point $p_s$ to world point $q = R(\theta)p_s + t$.
{% </pyodide_demo> %}

## SO(3)

Same thing works in 3D p = (x, y, z) and w = (wx, wy, wz).
Need a better explanation why cross product here
Can represent cross product as matrix mult -> hat operator
Again, 3x3 matrix, but only 3 DoF w^p

{% <pyodide_demo source="/blog/lie-algebra/figures/so3/so3.py" script="/blog/lie-algebra/figures/so3/so3.js" stylesheet="/blog/lie-algebra/figures/so3/so3.css" code_path="content/blog/2026-09-30-lie-algebra/figures/so3/so3.py" title="SO(3) 3D Robot Rotation and Sensor Point Setup"> %}
A robot rotating in 3D with orientation $R \in \mathrm{SO}(3)$, showing world frame axes, local sensor frame axes, and 3D point transformation $q = R p_s$. Drag the canvas to rotate the 3D camera view.
{% </pyodide_demo> %}

## SE(3)

A robot with 3D translation $(x, y, z)$ and spatial orientation $R \in \mathrm{SO}(3)$.

{% <pyodide_demo source="/blog/lie-algebra/figures/se3/se3.py" script="/blog/lie-algebra/figures/se3/se3.js" stylesheet="/blog/lie-algebra/figures/se3/se3.css" code_path="content/blog/2026-09-30-lie-algebra/figures/se3/se3.py" title="SE(3) 3D Robot Pose and Sensor Point Setup"> %}
A robot with 3D spatial pose $T = (R, t) \in \mathrm{SE}(3)$, showing 3D translation $t = (x, y, z)$, 3D rotation $R$, local sensor frame, and world point $q = R p_s + t$. Drag the canvas to rotate the 3D camera view.
{% </pyodide_demo> %}

## Exp

How position works in time (e.g., for calculus)
Take again t in [0, 1], dt

Explain what we want to do

p(t + dt) == p(t) * p_dot(t) dt
p(t) + wJp(t)dt
(I + wJdt)p(t)

Do example / fig in 90deg, but what about infinitially? -> figure with slider to select number of steps

dt = 1 / n, in n steps (e.g., 90deg)

p1 = (I + wJ/n)p0, ..., pn = (I + wJ/n)^n p(0)

as lim n -> infinity, this is the same as compounding interest, and is exponential, but here it is matrix exponent
digression to scalar exponent

Then move terms to extract cos and sin

### Scalar exponent

Explain same mechanism but about, x_dot = ax, x(t + dt) = (1 + a dt) x(t)

### Matrix Exponent

So matrix is exp(wJ) = lim n -> infinity (I + wJ/n)^n
but can also write as exp(A) = I + A + A^2/2! + A^3/3! + ...

Explain that lim n is a bit easier to understand here, as we do the rotation in small steps

TODO: find interpretation in rotations for that other exp(A) (perhaps just a rewriting + binomial coeff)

## Same thing but in SO(3)

Add figure to show it in 3D

## Known formula

Rodrigues formula from the matrix exponent

## Log matrix

Why it is useful (diff of rotations?)
inverse mapping from exp

## BCH

Find a problem with our setup that requires it, then show why

## Perturbation

e.g., noise local vs global, left vs right perturbation
Figure

## Adjoint

How to change perturbation between frames? 

## A rotation from its generator

placeholder for the figure
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

## Summary

Adapt table S1 from [eade-lie-groups]

## Projective Geometric Algebra

Maybe a next post? Same setup but exploring PGA instead for the same use case

## References

- Ethan Eade. [*Lie Groups for 2D and 3D Transformations*][eade-lie-groups] (2017).
- Joan Solà, Jérémie Deray, and Dinesh Atchuthan. [*A micro Lie theory for state estimation in robotics*][micro-lie-theory] (2018).
- Timothy D. Barfoot. [*State Estimation for Robotics*][state-estimation] (2017).
- Philippe Nadeau. [*A Standard Rigid Transformation Notation Convention for Robotics Research*][rigid-notation] (2024).
- Easton R. Potokar, Randal W. Beard, and Joshua G. Mangelson. [*An Introduction to the Invariant Extended Kalman Filter [Lecture Notes]*][inekf-introduction] (2024).
- Silvère Bonnabel. [*Left-invariant extended Kalman filter and attitude estimation*][inekf-original] (2007). The original InEKF paper.

[eade-lie-groups]: https://www.ethaneade.com/lie.pdf
[micro-lie-theory]: https://www.iri.upc.edu/files/scidoc/2089-A-micro-Lie-theory-for-state-estimation-in-robotics.pdf
[state-estimation]: https://asrl.utias.utoronto.ca/~tdb/bib/barfoot_ser17.pdf
[rigid-notation]: https://arxiv.org/pdf/2405.07351
[inekf-introduction]: https://doi.org/10.1109/MCS.2024.3466488
[inekf-original]: https://doi.org/10.1109/CDC.2007.4434662
