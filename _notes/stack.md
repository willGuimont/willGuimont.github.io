# Stack ADT

<!-- TODO check notes -->

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

## New stack properties

$$ empty(create()) $$ is true. A new stack is empty.

$$ size(create()) = 0$$. A new stack has size 0.

$$ peek(create()) $$ generates an error.

$$ pop(create()) $$ generates an error.

### Operations

$$ peek(push(S, x)) = x $$

$$ pop(push(S, x)) $$ leaves the stack unchanged.

$$ empty(push(S, x)) $$ is always false.

### Size operation

$$ size(push(S, x)) = size(S) + 1 $$

$$ size(pop(S)) = size(S) - 1 $$