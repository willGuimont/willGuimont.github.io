# Stack ADT

The Stack ADT is defined by the following operations

**Push**: Add an element on the stack

**Pop**: Remove the most recently added element and return it

We can add non-essential operations to ease the programming. We note that non-essential operations.

**Peek**: Return the most recently added element without removing it

Peek can be defined in term of **Push** and **Pop**

In imperative programming language, we have instances of the ADT that is mutable. That means that the instance can change state in time.

We usually add the following principal operations to the definitions:

**Create**: Create a new Stack

**Empty**: Return a Boolean value specifying if the stack is empty

In a functional language, each state is considered another entity. The operations on the ADT are simply functions that map one state to another.