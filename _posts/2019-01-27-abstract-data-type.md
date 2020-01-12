---
layout: post
title:  "Introduction to Abstract Data Types"
date:   2019-01-27 14:00:00 -0500
categories: cs
tags: [Computer Sciences, Data Structure]
---

The proposition of abstract data types by Liskov and Zilles is an important step in the way we build computer software. Abstract data types allow programmers to leverage the power of abstraction. By hiding implementation details, they allow programmers to use a structure by only being concerned about their behaviors and not how the structure works inside.

This gives programmers tools to think at a higher level, focused on the problem to solve.

# History

Abstract data types (ADT) were proposed in 1974 by, 2008 Turing Award winner, Barbara Liskov and her coauthor Stephen Zilles in the paper *Programming with abstract data types*[^Liskov]. This paper wasn't only a theoretical paper, they implemented the concept in a programming language. Liskov and her students created the programming language CLU that included abstract data types. ADTs are often seen as a step in the development of object-oriented programming.

ADTs were proposed in the 70s, around the time when the term *software crisis* was coined. People were wanted to build sophisticated software programs but didn't know how to build them effectively. Projects often ran over-budget, over-time, and the resulting software was often unmanageable, hard to maintain, and of low quality.

It was around that time that the use of the Go To statement was still controversial. Dijkstra wrote *Go To Statement Considered Harmful*[^Dijkstra] in 1968. At that time, the use of Go To statements was widespread, which led to hard to debug and maintain codes.

The only kind of abstraction commonly used was procedures that weren't necessarily used for abstraction per see but save space. If a bit of code was called often, they'd factor it out in a procedure, but not necessarily in a logical module. [^Keynote]

Moreover, languages like Algol60 used global variables for the communication between modules, which led to spaghetti code when scaling up. [^Keynote]

The landscape of software programming was a bit messy, people were building software programs in a non-structured manner.

The ideas discussed in Liskov & Zilles's paper may seem obvious now but remember the time when they were proposed. In the last 50 years of building software programs, we learned a lot. This concept paved the way for object-oriented programming and better software design.

# Definitions

## ADT

Liskov & Zilles describe ADT as following:

> An abstract data type defines a class of abstract objects which is completely characterized by the operations available on those objects. This means that an abstract data type can be defined by defining the characterizing operations for that type. [...] Implementation information, such as how the object is represented in storage, is only needed when defining how the characterizing operations are to be implemented. The user of the object is not required to know or supply this information.
>
> -- Liskov & Zilles[^Liskov]

We learn from the definition that an ADT defines a type and a set of operations. From the perspective of the user, the type is completely opaque, meaning we can't see the inner representation of the data it contains.

The type is completely opaque from outside of its operations. This contributes to build abstraction. For the user, the type is nothing particular, he has to use the operations.

If we want to have multiple representations for an ADT, the operations need to be aware of them. Adding a new representation in an ADT is therefore costly, we need to modify the existing operations. We will discuss later the implications of that fact.

We can observe two categories of operations: essentials and non-essential. Basically, non-essential can be defined from essential operations. We will see an example later in this article.

## Abstraction

Liskov & Zilles describe abstraction:

> What we desire from an abstraction is a mechanism which permits the expression of relevant details and the suppression of irrelevant details.
>
> -- Liskov & Zilles[^Liskov]

This allows programmers to use complex objects by being only concerned by their behaviors and not how they are implemented. This helps to have a higher level of reasoning, we can solve the problem using abstraction, then solve the subproblems that are those abstractions. This allows splitting the source code in logical modules, thus improving code reusability. We also separate the level of abstraction, the high-level code isn't polluted by low-level details, therefore improving code readability.

As Robert C. Martin said in *Clean Code*:

> Mixing levels of abstraction within a function is always confusing. Readers may not be able to tell whether a particular expression is an essential concept or a detail.
>
> -- Robert C. Martin[^Martin]

## A small example

To make it concrete, here a simple example.

Abstract data types are like the built-in types of a programming language. When a programmer uses the type *Integer* of a programming language, he's usually not concerned about the binary representation of the integer, i.e. a string of bits. He thinks about the *Integer* and the operations related to it as indivisible and atomic, when in fact they can be translated to multiple machine instructions. We define the operations on *Integer* by their behaviors. We expect (+) to add two *Integer* and (\*) to multiply them, but we're usually not concerned about how those operations are made under the hood. Abstract data types bring that idea of abstraction to user-defined structures. The client code can use those structures "as-is", much like *Integers*, without knowing the implementation details.

However, the abstraction is not perfect for most types. In the case of *Integer*, we may be interested in knowing if an overflow happened. The overflow depends on the implementation. A 32 bits *Integer* will overflow at a lower value than 64 bits one. More generally, most built-in types are not perfect abstraction because, in practice, we need to know when the implementation fails to represent the data.

## Computational complexity and ADT

In a more practical context, we consider that the behavior of the object isn't enough to characterize completely the type. Let's imagine we have two implementations of the Stack ADT (see example below). In the first implementation, the push operation is done in $$O(1)$$. The second one was written poorly and the push operation is done in $$O(n!)$$. From a behavioral perspective, both are equivalent. They both correctly implement the expected behavior of a Stack, but in a real software program, it would be better to use the first implementation. That's the reason why some authors include the complexity of the operations as well in the definition of abstract data types.

# Simple examples

The Stack is an example of an abstract data type. We can define the behavior of a stack by giving it two operations.

**Push**: Add an element on the stack

**Pop**: Remove the most recently added element and return it

With those two operations, we can completely define the Stack. We note that those two operations are essential to a stack to effectively be a stack. We can derive other operations from those two. We can, for example, define the **Peek** operator from a pop followed by a push and then returning the value that was popped. **Peek** isn't essential because it can be derived from other operations.

# Differences with object-oriented programming

To help demonstrate the differences and trade-offs between object-oriented programming and abstract data type. Here is an adapted version of the Shape example from chapter 6 of *Clean Code* of Robert C. Martin[^Martin]

## Procedural Shape (modified)

{% highlight java %}
public class Geometry {
    public final double PI = 3.141592653589793;

    public class Square {
        private Point topLeft;
        private double side;
    }

    public class Rectangle {
        private Point topLeft;
        private double height;
        private double width;
    }

    public class Circle {
        private Point center;
        private double radius;
    }

    public Square createSquare(Point topLeft, double side) {
        Square s = new Square();
        s.topLeft = topLeft;
        s.side = side;
        return s;
    }

    public Rectangle createRectangle(Point topLeft, double height, double width) {
        Rectangle r = new Rectangle();
        r.topLeft = topLeft;
        r.height = height;
        r.width = width;
        return r;
    }

    public Circle createCircle(Point center, double radius) {
        Circle c = new Circle();
        c.center = center;
        c.radius = radius;
        return c;
    }

    public double area(Object shape) throws NoSuchShapeException
    {
        if (shape instanceof Square) {
            Square s = (Square)shape;
            return s.side * s.side;
        }
        else if (shape instanceof Rectangle) {
            Rectangle r = (Rectangle)shape;
            return r.height * r.width;
        }
        else if (shape instanceof Circle) {
            Circle c = (Circle)shape;
            return PI * c.radius * c.radius;
        }
        throw new NoSuchShapeException();
    }
}
{% endhighlight %}

Firstly, we notice that outside of the class Geometry; Square, Rectangle and Circle are completely opaque. This hides the implementation details of the shapes.

We also notice that if we want to add a new shape, we have to modify all the operations of the Geometry class. Here, we would need to add another clause to handle the new kind of shape.

On the contrary, if we wanted to add an operation, we would only need to add a method. The types of shape don't need to change. The process of adding operations is additive, meaning we do not have to modify existing code.

## Polymorphic shapes

{% highlight java %}
public interface Shape {
    double area();
}

public class Square implements Shape {
    private Point topLeft;
    private double side;

    public double area() {
        return side*side;
    }
}

public class Rectangle implements Shape {
    private Point topLeft;
    private double height;
    private double width;

    public double area() {
        return height * width;
    }
}

public class Circle implements Shape {
    private Point center;
    private double radius;
    public final double PI = 3.141592653589793;

    public double area() {
        return PI * radius * radius;
    }
}
{% endhighlight %}

Here, we notice that if we want to add a new type of shape, we don't have to modify anything, the process is purely additive. We create a new class that implements Shape and that's it.

On the other side, if we want to add an operation to Shape, we would need to modify all existing classes that implement Shape.

## ADT and OOP

Briefly, we can say that it is easy to add operations on ADT without modifying the existing structure. On the other hand, object-oriented code makes it easy to add new representation without modifying existing operations. [^Martin]

Another way to say it: ADTs make it difficult to add new structures because we would need to modify all existing operations. OO code makes it difficult to add new operations because we would need to modify all existing classes. [^Martin]

OO and ADT are complementary concepts. Sometimes we want to be able to easily add new representation while other times we want to be able to add operation at our heart's content. Not everything is an object.

# Advantages of ADT

ADT allows abstraction. As stated above, abstraction allows the programmer to think at a higher level, using tools to solve his problems without being embarrassed by the implementation details. This is achieved by hiding implementation details behind an opaque type. This allows separating the level of abstractions. High-level operations are not punctuated of low-level operations that hinder the understanding of the code.

Moreover, ADTs allow the implementation to change without changing the calling code because the interface is kept secret. This allows the user code to be protected against changes in the implementation because they are hidden behind a fixed interface.

Another implementation of the ADT can be used interchangeably because of their characterizing behaviors. This allows for performance increase when some implementations are faster in some situations without having to rewrite the client code.

As stated above, ADTs make it easy to add new operations on a type. In a context where the number of representations won't change, but you will often add operations, ADTs are preferable to object.

# Summary

In this article, we discussed the concept of an abstract data type. They are an important historical step in the way we build software programs. They are complementary to object in the way they make it easy to add operation while objects make it easy to add new representation.

# References

[^Liskov]: Liskov, Barbara & Zilles, Stephen. Programming with Abstract Data Types. 1974.
[^Keynote]: Barbara Liskov. [Keynote: The Power of Abstraction](https://www.infoq.com/presentations/programming-abstraction-liskov). 2013.
[^Dijkstra]: Edsger W. Dijkstra. Go To Statement Considered Harmful. 1968.
[^Martin]: Robert C. Martin. Clean Code. 2008.