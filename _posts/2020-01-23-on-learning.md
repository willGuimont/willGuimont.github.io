---
layout: post
title: "On learning"
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

This is just some rambles on learning...

I'm currently taking a class on deep neural networks. In the first class, we discussed multiple ways to have artificial intelligence systems. 

One way would be to code hand-designed programs to accomplish the task. `If` something happens, `then` the system does that, `else if` this other thing happens, `then` do this, `else if`... We can achieve great things using rule-based programs, but on more complex tasks we would need a lot of cases to handle a lot of different cases.

Another way would be to make the computer learn from the data. So we analyze the data, find features for the system to learn from, then use classical machine learning algorithms such as SVM. Again, for complex tasks, we may miss some useful feature to correctly learn from the data.

The next step is to make the algorithm find features by itself. This is what neural networks do. Each layer of a deep neural network extract features for the higher layers to "reason" about. The classical example is a neural network that detects faces. The first layers might detect very simple patterns like edges. Higher up, a layer might detect corners and contours. Layers at the end of the network might detect complex object parts used by the final layer to classify the object. This is what is called representation learning, the artificial intelligence system finds a way of representing the data so that it is easy to solve the task.[^Goodfellow].

A good way of visualizing the different takes on artificial intelligence is from the book Deep Learning[^Goodfellow].
![Comp](/assets/images/representation/types.png){: .center-image }

## Dreyfus
When I learned about representation learning, it got me thinking about how we learn and the Dreyfus model[^Dreyfus].

I think we can draw links between the Novice stage and rule-based systems. In this first stage of the Dreyfus model, the learner relies on rules to determine the action.

Perhaps, there are other links between machine learning and the Dreyfus model.

## Mental representations
In The Sciences of the artificial[^Simon] from Herbert A. Simon, the author discusses the experience of A. de Groot and al. on chess perception. They showed chessboard with pieces in positions of real games for 5 seconds, then removed the pieces. Then they asked the subjects to put the pieces back in their position.

As you might guess, somebody not accustomed to chess would have a pretty hard time to reconstruct the positions. For grandmasters and masters thought, they were able to reconstruct the positions with almost no error!

They then retried the experiment with *random* piece positions. In that case, even grandmasters could not reconstruct the board.

This shows that a grandmaster or a master built a good mental *representation* of the game. Instead of memorizing all pieces, they memorized relations between pieces, which allow them to memorize them more easily.

So, when I learned about representation learning, this reminded me of that particular example. Under the hood, a neural network *tries* to do exactly what the grandmaster did, build a good representation of the problem to solve. Once the representation is built, a simple linear layer can solve the problem!

I think this is what is really going on when humans learn. All the studying isn't about memorizing facts or formulas, it's about building a good mental representation that can be used to solve many problems. Once you understand basic algebra, you can use that framework to solve many problems you weren't trained on.

In a neural network, we are usually not concerned about memorizing all the input data, instead, we want to generalize to unseen examples.

Perhaps we should tell students that they aren't in school to memorize facts, but instead to build a toolbox of mental representations to help them in life. Our brain is a neural network that needs to be trained with great care!

# Sources
[^Goodfellow]: Goodfellow, Ian & Bengio, Yoshua & Courville, Aaron. Deep Learning. 2016.
[^Simon]: Simon, Herbert A. The Sciences of the Artificial, 1969.
[^Dreyfus]: Dreyfus, Stuart E. The Five-Stage Model of Adult Skill Acquisition. 2004.
