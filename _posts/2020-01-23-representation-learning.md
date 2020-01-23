---
layout: post
title: "Representation learning"
date: 2020-01-23 07:00:00 -0500
categories: cs
tags: [Computer Sciences, Algorithm, Machine Learning, Learning]
color: rgb(110, 93, 157)
# feature-img: "assets/img/sample.png"
# thumbnail: "assets/img/thumbnail/sample-th.png"
# bootstrap: true
# excerpt_separator: <!--more-->
# author: willGuimontMartin
---

I'm currently taking a class on deep neural networks. In the first class, we discussed multiple ways to have artificial intelligence systems. 

One way would be code hand-designed programs to accomplish the task. `If` something happens, `then` the system does that, `else if` this other thing happens, `then` do this, `else if`... We can achieve great things using rule-based programs, but on more complex tasks we would need a lot of cases to handle a lot of different cases.
<!-- TODO example -->

Another way would be to make the computer learn from the data. So we analyse the data, find features for the system to learn from, then use classical machine learning algorithms such as SVM. Again, for complex tasks, we may miss some useful feature to correctly learn from the data. This is the basic steps of a classical machine learning algorithm.
<!-- TODO example -->

The next step is to make the algorithm find features by itself. This is what neural networks do. Each layer of a deep neural network extract features for the higher layers to "reason" about. The classical example is a neural network that detect faces. The first layers might detect very simple patterns like edges. Higher up, a layer might detect corners and contours. Layers at the end of the network might detect complex object parts used by the final layer to classify the object. This is what is called representation learning, the artificial intelligence system find a way of representing the data so that it is easy to solve the task.[^Goodfellow].

A good way of visualizing the different takes on artificial intelligence is from the book Deep Learning[^Goodfellow].
![Comp](/assets/images/representation/types.png){: .center-image }

Representation learning reminded me of 

# Sources
[^Goodfellow]: Goodfellow, Ian & Bengio, Yoshua & Courville, Aaron. Deep Learning. 2016.
[^Simon]: Simon, Herbert A. The sciences of the Artificial, 1969.
