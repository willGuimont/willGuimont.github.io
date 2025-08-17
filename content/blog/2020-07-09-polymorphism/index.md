+++
authors = ["William Guimont-Martin"]
title = "Inward and Outward Polymorphism"
description = "A discussion on inward and outward polymorphism in software architecture"
date = 2020-07-09
# updated = ""
# draft = false
[taxonomies]
tags = ["Computer Sciences", "Software Engineering"]
[extra]
# banner = ""
# toc = true
toc_inline = true
toc_ordered = true
# trigger = ""
# disclaimer = ""
+++

I've recently become fond of Algebraic Data Types (ADT).

Languages like Haskell and Rust allows you to model your domain in a concise way using ADT. What would take several classes (and files) in Java (Interface-Oriented Programming (IOP)) can be expressed in a couple of lines. This got me thinking about software architecture using those two.

Both IOP and ADT have advantages and disadvantages. 

ADT is a lot more concise but requires to use pattern-matching. Adding a new ADT type would then mean that you'll have to add a case to every function matching on the type. Whereas adding a new function acting on an ADT is easy, you simply need to write the function.

For IOP on the other hand, adding a new implementation of the interface is easy. You simply implement the needed methods. Whereas adding a new function in the interface can quickly become expensive, you'll have to add the method to every class implementing the interface. I'll include Haskell's type-classes and Rust's traits as IOP.

I discussed that compromise a bit more in [a previous post on abstract data types](@/blog/2019-01-27-abstract-data-type/index.md). Albeit about a different type of ADT (algebraic vs abstract), the post is still relevant to understand the difference between ADT and IOP.

Here, I would like to discuss the software engineering aspect of using IOP and ADT when designing modules. I'll introduce the concept of inward and outward polymorphism.

# Motivation
To motivate the introduction of those concepts, let's start with two small examples.

## Algebraic Data Type

You are charged to build a networking library in Rust. You want to support both IPv4 and IPv6. Each one represents addresses in different ways, IPv4 stores address using four 8 bits numbers, while IPv6 stores it as a string. Using Rust, and having recently read the <a class="external" href="https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html" target="_blank">Rust Book's chapter on enums</a>, you decide to declare them the following way:

```rust
enum IpAddr {
    V4(u8, u8, u8, u8),
    V6(String),
}
```

The user will call your functions, like `connect_to(ip: IpAddr)`, using the polymorphic nature of `IpAddr` to use either IPv4 or IPv6.

## Interface-Oriented Programming
The next day, you are writing Java (poor you). You have to implement an application that provides support for plugins. So, you make an interface and write your code calling that interface. The user can then implement your interface with their code, and you can call their class since it implements your interface.

So, your library calls the user's code polymorphically.

## Inward or Outward
In the last two examples, we can see two different uses of polymorphism. In the first example, the user called your library passing polymorphic data type, while the second one, the user implemented an interface so that your library would call their code.

We can see that the flow of control is different in both cases. In the first example, the flow moves **into** your code whereas, in the other example, the flow moves **out of** your code.

Based on the control flow, we can define **inward polymorphism** as polymorphism used when the user calls your code. **Outward polymorphism** would then be the use of polymorphism when your code is expected to call the user's code.

The examples were about libraries, but the same concept of inward or outward can be applied to modules.

# ADT or IOP
Inward and outward polymorphism impose different types of constraints. 

When I need to write inward polymorphic code, I like to use the expressiveness of ADT. This can make the code elegant and concise.

For outward polymorphism, you have to use IOP, so that both your module and the user's code can communicate using a common interface.

The choice between ADT and IOP can be really difficult and, as always, there is no *apply to all solutions* in software architecture. The only real answer you'll receive is "it depends".
