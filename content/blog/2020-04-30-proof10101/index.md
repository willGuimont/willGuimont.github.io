+++
authors = ["William Guimont-Martin"]
title = "Proof of sequence A094028"
description = ""
date = 2020-05-03
# updated = ""
# draft = false
[taxonomies]
tags = ["Mathematics"]
[extra]
# banner = ""
# toc = true
toc_inline = true
toc_ordered = true
# trigger = ""
# disclaimer = ""
katex = true
+++

1, 101, 10101, 1010101, 101010101, 10101010101, 1010101010101, 101010101010101, 10101010101010101, 1010101010101010101, 101010101010101010101, 10101010101010101010101, 1010101010101010101010101, 101010101010101010101010101, 10101010101010101010101010101

This is the sequence A094028 of the [On-Line Encyclopedia of Integer Sequences (OEIS)](https://oeis.org/A094028). According to a comment from Felix Fröhlich on the sequence's page:

> 101 is the only term that is prime, since (100^k-1)/99 = (10^k+1)/11 * (10^k-1)/9. When k is odd and not 1, (10^k+1)/11 is an integer > 1 and thus (100^k-1)/99 is nonprime. When k is even and greater than 2, (100^k-1)/99 has the prime factor 101 and is nonprime. 
>
> Felix Fröhlich, Oct 17 2015[^oeis]

It isn't particularly striking that it should be the case. Let's see why 101 is the only prime number of the sequence.

# The sequence

First of all, let's study a bit more the sequence. Say $A(n)$ the $n$th element of the sequence (0-indexed). 

For the first few elements we have:


$$A(0)=1$$

$$A(1)=101$$

$$A(2)=10101$$

$$A(3)=1010101$$


We can see that we can write the sequence as $$A(n)=\sum_{k=0}^n 100^k.$$

For example, for the first element we have $$A(0)=100^0=1.$$

Similarly, for $n=2$, $$A(2)=10000 + 100 + 1 = 10101.$$

# A simpler form

For the $(n - 1)$th element of the sequence, we have:

$$A(n) = 1 + 100 + 10000 + \ldots + 100^{n-1} + 100^n.$$

We would like to remove some of terms, let's consider 

$$100A(n) = 100 + 10000 + 1000000 + \ldots + 100^{n} + 100^{n+1}.$$

This sequence has many similar terms to $A(n)$, let's subtract $100A(n)$ from $A(n)$.

We can cancel the common terms, we end up with: 

$$A(n) - 100A(n) = 1 - 100^{n+1}.$$

To find out what $A(n)$ is, let's isolate it from the equation.

$$-99A(n)=1 - 100^{n+1}$$

$$\implies 99A(n)=100^{n+1} - 1$$

$$\implies A(n) = \frac{100^{n+1} - 1}{99}.$$

So, we have: $A(n) = \frac{100^{n+1} - 1}{99}$, which we can see from the comment in the OEIS's website.

# Cleaning things a bit

We can rewrite $A(n)$ as $A(n) = \frac{(10^{n+1})^2 - 1}{99}$, because $100 = 10^2$.

We now have a difference of squares, we can factorize it further:

$$A(n) = \frac{(10^{n+1} + 1)(10^{n+1}-1)}{99}.$$

To make it a bit simpler to work with, let's do a little variable substitution with $k=n-1$:

$$A(k)=A(n-1)= \frac{(10^{(n-1)+1} + 1)(10^{(n-1)+1}-1)}{99}=\frac{(10^{n} + 1)(10^{n}-1)}{99}.$$

Therefore, 

$$A(k)=\frac{(10^{n} + 1)(10^{n}-1)}{99}.$$

Okay, now we can write the $(k-1)$th element of the sequence a bit more easily, but it isn't clear how we could prove that only 101 is prime. Let's try to simplify this expression a bit more:

$$A(k)=\frac{(10^n + 1)(10^n-1)}{99}.$$

First of all, we can see that $(10^n-1)$ will be of the form $\underbrace{99\ldots99}_{n\text{-times}}$.

We can split the $99$ in the denominator into $9\cdot 11$. We now have

$$A(k)=\frac{(10^n + 1)(\overbrace{99\ldots99}^{n\text{-times}})}{9\cdot 11}.$$

We can do the same for the $\overbrace{99\ldots99}^{n\text{-times}}$ in the numerator, we get:

$$A(k)=\frac{(10^n + 1)(9\cdot\overbrace{11\ldots11}^{n\text{-times}})}{9\cdot 11}.$$

We can cancel out the $9$s:

$$A(k)=\frac{(10^n + 1)(\overbrace{11\ldots11}^{n\text{-times}})}{11}.$$

# Division by 11

Let's take a small break from our sequence to discuss the divisibility by $11$. For a number $n$ to be divisible by $11$, we must have that $n \equiv 0 \pmod {11}$

A number in decimal base can be expressed as $n=a_ka_{k-1}\ldots a_1a_0$, so the value of $n$ is $10^ka_k+10^{k-1}a_{k-1}+\ldots+10a_1+a_0$.

Note that $10 \equiv -1 \pmod {11}$.

So, 

$$10^ka_k+10^{k-1}a_{k-1}+\ldots+10a_1+a_0 \equiv (-1)^ka_k+(-1)^{k-1}a_{k-1}+\ldots+(-a_1)+a_0 \pmod {11}.$$

Since $(-1)^{2n} = 1 \quad \forall n \in \mathbf{N}$, we deduce that every even placed digit are added, whereas odd placed numbers are subtracted ($(-1)^{2n + 1} = -1 \quad \forall n \in \mathbf{N}$).

So, we can rewrite

$$(-1)^ka_k+(-1)^{k-1}a_{k-1}+\ldots+(-a_1)+a_0 \equiv a_0 - a_1 + a_2 - a_3 + a_4 - a_5 \ldots \pmod {11}.$$


Since we want to check if $n$ is divisible by $11$, we must check if

$$a_0 - a_1 + a_2 - a_3 + a_4 - a_5 \ldots \equiv 0 \pmod {11}.$$


So, $n$ is divisible by $11$ if the sum of even placed digit (starting from the rightmost position) minus the sum of the odd placed digit is divisible by $11$.

# The proof

$$A(k)=\frac{(10^n + 1)(\overbrace{11\ldots11}^{n\text{-times}})}{11}.$$

Now that we know that when a number is divisible by $11$, let's analyse $A(k)$.

## $n > 1$ is even

First, let's suppose that $n$ is even. In that case, we get that $\overbrace{11\ldots11}^{n\text{-times}}$ is divisible by $11$, because, since there is as much even placed $1$s as odd placed $1$s, the sum of even placed digit minus the sum of the odd placed digit is 0, which is divisible by $11$.

Now, let's use the variable $k=n-1$ to link the divisibility of $\overbrace{11\ldots11}^{n\text{-times}}$ by $11$ with the sequence. We notice that for $n > 1$ to be even, we must have that $k$ is odd, because $k=n-1$.

For $k\geq3$, we have $n=k+1\geq4$, so that $\overbrace{11\ldots11}^{(n\geq4)\text{-times}} > 11$.

Thus, we can deduce that $\frac{\overbrace{11\ldots11}^{(n\geq4)\text{-times}}}{11} > 1$ and that it is an integer.

Posing $a=\frac{\overbrace{11\ldots11}^{(n\geq4)\text{-times}}}{11}$, we get $A(k) = (10^n + 1)a$. 

Since $A(k)$ is the result of the multiplication between two integers, each not equal to one, $A(k)$ is not prime.

## $n > 1$ is odd

We can use a similar trick for any even $k\geq2$, this time with the other part of $A(k)$. When $k$ is even (so that $n$ is odd) in $(10^n + 1)$, we have that one $1$ is at a even position and the other at an odd position, thus $1 - 1 = 0$ which is divisible by $11$. Similarly, we have that $(10^n + 1)>11$ because $n\geq3$. Thus, $\frac{(10^n + 1)}{11}>1$ and it is an integer. We can then conclude that $A(k)$ is not prime for even $k=n-1\geq2$.

## The remaining cases

This leaves us with two cases, $k=0$ and $k=1$. $A(0) = 1$ is not prime by definition and $A(1)$ is prime. Since for any other $k$, $A(k)$ is not prime, then $A(1)$ is the only prime in the sequence.

<p style="text-align: right; width=100%;">$\blacksquare$</p>

# References

[^oeis]: OEIS. Sequence A094028, https://oeis.org/A094028
