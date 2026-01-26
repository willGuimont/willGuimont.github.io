+++
authors = ["William Guimont-Martin"]
title = "Element of Errors Handling"
description = "A deep dive into error handling mechanisms"
date = 2025-07-25
# updated = ""
# draft = false
[taxonomies]
tags = ["Computing Sciences", "Programming", "Software Development"]
[extra]
# banner = ""
toc = true
toc_inline = true
toc_ordered = true
# trigger = ""
# disclaimer = ""
+++

Errors are everywhere.
Any computation, IO operation, database access, or API call -- any of them can fail.
Despite this, most programming languages either struggle to make error handling correct or make it painful.
It's almost always easy to write the happy path.
The moment something goes wrong, though, most languages make the not-so-happy path either verbose, implicit, or dangerously ignorable.

Handling errors well should be a first-class concern.
It feels as if errors are just an afterthought in mainstream languages, added inelegantly out of necessity.

This blog post stems from some experimentation on error handling I did back in 2021.
At the end of my undergraduate studies in software engineering, we were assigned a final project in collaboration with an industry partner.
They gave us *carte blanche* on the choice of technology.
Looking to try less mainstream languages and explore new paradigms, we decided to explore and compare several less conventional stacks -- paying particular attention to how each one approached error handling, since our project required high reliability and robustness.

## `Try`ing to `Catch` ~~Lightning in a Bottle~~ Exceptions (Java and Friends)

The most well-known model is the `try/catch` mechanism.
You throw an error and hope someone, somewhere, catches it.
Otherwise, your program crashes unceremoniously.

It’s an *easy* method for the error generating code, throw the exception and forget about it, but not simple.
This is similar to the distinction between *simple* and *easy* made by Rich Hickey in his talk "<a class="external" href="https://www.infoq.com/presentations/Simple-Made-Easy/" target="_blank">Simple Made Easy</a>".
Exceptions are **complecting** by nature, they intertwine normal control flow with error handling.
The control flow is no longer linear and predictable, you climb back up the stack looking for a handler.

They let you skip instructions, bubble errors up several layers, and bypass normal control flow.
In a way, they are sugar-coated `goto`s that jump through stack frames.

Yes, `try/catch/finally` blocks and RAII (in C++/Java with try-with-resources) can clean things up nicely (although, I prefer using `defer` or `err_defer`), but you're still left with a system where it's not obvious what code might throw.

Java attempted to solve the uncertainty around which operations might throw exceptions through checked exceptions, but that just shifted the problem.
You now have to annotate everything, tracing all possible failure paths and punting the problem upstream.
Most Java developers end up defaulting to unchecked exceptions anyway, sacrificing safety for sanity.
Even Robert C. Martin said in Clean Code:

> Checked exceptions can sometimes be useful if you are writing a critical library: You must catch them.
> But in general application development, the dependency costs outweigh the benefits.
>
> -- Robert C. Martin. Clean Code. 2008.

Despite their limitations, exceptions are still very much useful for their convenience and ease of use in simple cases.
That said, while it can be convenient to let domain exceptions bubble up -- for instance, in a REST API handler where you want a 400 Bad Request -- you’re still playing with possibly impossible-to-predict, and more importantly difficult to debug, control flow.
This is especially true in large codebases with many layers of abstraction, where an exception thrown deep in the stack can be caught and handled far away from its origin, making it hard to trace the error's source.
While you can try to limit this with coding standards and best practices, it remains challenging and cumbersome if the language does not provide good alternatives.

## `Go`ing Somewhere with Errors (Go)

Go brought back the C-style return code (i.e., non-zero return for errors), modernized as error values returned by the function, now with `nil` as the successful return value.
You call a function, and it returns both result and error.
By convention, the error is the last return value.

```go
import (
    "errors"
    "fmt"
)

// formatNaturalNumber validates the input is non-negative and returns it as a string.
func formatNaturalNumber(input int) (string, error) {
    if input < 0 {
        return "", errors.New("input is not a natural number: value is negative")
    }

    return fmt.Sprintf("Natural Number: %d", input), nil
}

func main() {
    input := 42

    result, err := formatNaturalNumber(input)
    if err != nil {
        // Handle error and exit early
        fmt.Printf("Error: %v\n", err)
        return
    }

    // Continue with the success path
    fmt.Println(result)
}
```

This makes error handling explicit, which is a good thing: you see where errors can occur and have to deal with them directly.
You can follow the code, and you should be able to know exactly what happens when an error is returned.
You can handle the error here and there, or return it to the function's caller.

But this explicitness comes at the cost of verbosity and boilerplate.
You will see `if err != nil` peppered everywhere.
Also, Go gives you no tools to help with error handling.
You’re mostly on your own to handle errors consistently.
Go does not provide any syntactic sugar for error handling, i.e., no `try/catch`, no pattern matching, no monadic operators.
Just `if err != nil` over and over.
The little Go I did write felt like it required a lot of duplicate boilerplate code to handle errors properly.
I had to keep `if err != nil {}` in my clipboard for quick pasting.

You end up either duplicating error propagation boilerplate or using helper functions to hide the verbosity (e.g., <a class="external" href="https://pkg.go.dev/errors#Join" target="_blank">errors.Join</a>) -- at which point you’ve reinvented a monad poorly.

To its credit, Go includes one elegant feature for cleanup after an error might have occurred: `defer`.
It allows you to schedule resource cleanup (like closing files or releasing locks) regardless of how the function exits, which pairs well with manual error handling:

```go
f, err := os.Open("file.txt")
if err != nil {
    return err
}
defer f.Close() // Yes, this could also return an error and would need to be handled correctly

result, err := doSomething()
if err != nil {
    // f will still be closed!
    return err
}
```

### Zig

Zig handles errors a bit differently.
Instead of adding an explicit error return value, Zig uses error union types.
By adding `!` before a type, you indicate that the function can return either a value of that type or an error, e.g., `fn doSomething() !i32`.
Thus taking the union of the error set and the normal return type.
You can optionally narrow down the error set to specific errors prefixing the error type, e.g., `fn doSomethingElse() ErrorType!ReturnType`.

In addition, Zig has built-in syntax for propagating errors with `try` and `catch`.
When you call a function that can return an error, you can use `try` to automatically propagate the error if it occurs, or get the value if it succeeds.
With `catch`, you can provide a default value or handle the error in place passing the error to a lambda.

```zig
const std = @import("std");

const DivisionError = error{
    DivisionByZero,
};

fn divide(x: i32, y: i32) !i32 {
    if (y == 0) return DivisionError.DivisionByZero;
    return @divTrunc(x, y);
}

// performCalculation uses 'try' to propagate errors to its caller
fn performCalculation(a: i32, b: i32) !i32 {
    // If divide returns an error, performCalculation exits here and returns the error
    const val = try divide(a, b);

    // This line only executes if divide was successful
    return val + 10;
}

pub fn main() !void {
    const result = performCalculation(10, 0) catch |err| {
        std.debug.print("Flow interrupted by error: {}\n", .{err});
        return;
    };

    std.debug.print("Final Result: {}\n", .{result});
}
```

This minimizes boilerplate while keeping error handling explicit.
I quite like this approach, as it makes error propagation concise without losing clarity.

Zig also has `defer` for cleanup, similar to Go, but it adds `errdefer`.
`errdefer` is used when you want to clean up resources only if an error occurs.
For example, if you allocate a struct and an error happens later, you can use `errdefer` to free that struct only in the error case, and return the created struct on success.

```zig
const std = @import("std");

const ProcessError = error{
    StepTwoFailed,
};

fn complexOperation() !void {
    std.debug.print("Step 1: Resource allocated.\n", .{});

    // errdefer will ONLY run if this function returns an error
    errdefer {
        std.debug.print("Cleanup: Rolling back Step 1 due to failure.\n", .{});
    }

    const failure_condition = true;
    if (failure_condition) {
        std.debug.print("Step 2: Encountered an issue.\n", .{});
        return ProcessError.StepTwoFailed;
    }

    std.debug.print("Step 3: Success! errdefer will not run.\n", .{});
}

pub fn main() !void {
    complexOperation() catch |err| {
        std.debug.print("Final result: {}\n", .{err});
    };
}

```

### Odin

I recently started experimenting with Odin, which has some interesting ideas around error handling.
Instead of considering errors as exceptions or special types, Odin treats them as regular return values.
As it is the case for Go, Odin conventionally returns an error as the last return value of a function.
Unlike Zig, which uses error unions that require declaring error types using `error{}`, Odin simply treats non-zero return values as errors.
This is paired with Odin's commitment to make zero values useful defaults, so a function returning zero for an error indicates success.

```odin
package main

import "core:fmt"

Division_Error :: enum {
    None, // This is the zero value, indicating no error. Variables of this type default to None (0).
    Division_By_Zero,
    Negative_Input,
}

// Function returns a result and an error enum
divide_positive :: proc(x, y: int) -> (int, Division_Error) {
    if y == 0 do return 0, .Division_By_Zero
    if y < 0 || x < 0 do return 0, .Negative_Input

    return x / y, .None
}

main :: proc() {
    x, y := 10, 0

    res, err := divide_positive(x, y)
    
    if err != .None {
        fmt.printf("Error encountered: %v\n", err)
        return
    }

    fmt.printf("Result: %d\n", res)
}
```

But Odin goes further with built-in operators to streamline error handling.
Assuming the last return value is the error, and that any non-zero value indicates an error, Odin provides `or_else`, `or_return`, `or_continue`, and `or_break` operators to handle errors concisely:

- `or_else` allows you to provide a default value if an error occurs.
- `or_return` will return from the current function if an error occurs.
- `or_continue` and `or_break` can be used in loops to skip iterations or exit loops on errors.

```odin
package main

import "core:fmt"

Division_Error :: enum {
    None,
    Division_By_Zero,
    Negative_Input,
}

divide_positive :: proc(x, y: int) -> (int, Division_Error) {
    if y == 0 do return 0, .Division_By_Zero
    if y < 0 || x < 0 do return 0, .Negative_Input
    return x / y, .None
}

// wrapper_proc demonstrates or_return
wrapper_proc :: proc(a, b: int) -> (val: int, error_out: Division_Error) {
    // Because parameters are named, or_return knows to put 
    // the error into 'error_out' and return.
    // Named return values, as everything in Odin, are zero-initialized.
    res := divide_positive(a, b) or_return 
    return res + 100, .None
}

main :: proc() {
    // 1. Example using or_return (via wrapper)
    val, err := wrapper_proc(10, 0)
    if err != .None {
        fmt.printf("wrapper_proc failed: %v\n", err)
    } else {
        fmt.printf("wrapper_proc result: %d\n", val)
    }

    // 2. Example using or_else
    // or_else provides a fallback value if the second return is not .None/false
    final_res := divide_positive(20, -5) or_else 999
    fmt.printf("divide_positive with or_else fallback: %d\n", final_res)
}
```

Odin's approach is reminiscent of Go's explicit error handling but adds syntactic sugar to reduce boilerplate.
From these *errors as values* methods, this is probably my favorite.
It builds on Go's explicit error handling while providing operators like `or_return` to streamline common patterns.
It does not require separate error construction like Zig, making it conceptually simpler.
Overall, Odin strikes a nice balance between explicitness and elegance in error handling.

## Playing Tag with Errors (Rust)

Rust’s tagged unions `Result<T, E>` and `Option<T>` types offers a different approach.
Errors are in the type system.
The compiler forces you to handle them - or explicitly ignore them (e.g., with `unwrap`, `expect`, etc.).
You can use Rust's pattern matching to destructure and handle errors explicitly.

Rust also provides the `?` operator for concise error propagation:

```rust
#[derive(Debug)]
enum MyError { InvalidInput }

fn divide(x: i32, y: i32) -> Result<i32, MyError> {
    if y == 0 { return Err(MyError::InvalidInput); }
    Ok(x / y)
}

fn calculate() -> Result<i32, MyError> {
    // If divide returns Err, calculate returns Err immediately
    let result = divide(10, 0)?; 
    
    Ok(result + 100)
}

fn main() {
    // Pattern match on the Result
    match calculate() {
        Ok(val) => println!("Result: {}", val),
        Err(e)  => println!("Error: {:?}", e),
    }
}
```

The `?` operator propagates errors up, and makes code shorter, but it can also obscure control flow.
The whole flow of the function can be interrupted by a single `?`.
This single symbol rewires control flow and introduces implicit short-circuiting, which can obscure the data path.
At least, the `?` operator is limited to functions returning `Result` or `Option`, so its use is explicit in the function signature.

This is a limited form of monadic error handling.
This is arguably one of Rust's strengths, it makes functional programming ideas more mainstream, e.g., algebraic data types, pattern matching, higher-order functions, and monadic error handling.

Of course, Rust doesn’t force you to propagate or handle errors safely --- you can always opt out:

```rust
let val = foo().unwrap(); // panics if Err
let val = foo().expect("better crash message"); // same, but with context
```

### A Monadic Digression

Before writing this document, I assumed that Rust's `?` operator was limited to built-in types like `Result<T, E>` and `Option<T>`, effectively restricting its use to these specific monads.
While this holds true on stable Rust, the nightly-only `try_trait_v2` feature extends the language’s capabilities by allowing custom types to participate in `?`-based control flow through the implementation of the `Try` and `FromResidual` traits.

```rust
#![feature(try_trait_v2)]

use std::convert::Infallible;
use std::ops::{ControlFlow, FromResidual, Try};

#[derive(Debug)]
enum MyResult<T, E> {
    Ok(T),
    Err(E),
}

impl<T, E> Try for MyResult<T, E> {
    type Output = T;
    type Residual = MyResult<Infallible, E>;

    fn from_output(output: T) -> Self {
        MyResult::Ok(output)
    }

    fn branch(self) -> ControlFlow<Self::Residual, Self::Output> {
        match self {
            MyResult::Ok(val) => {
                println!("Encountered Ok with value.");
                ControlFlow::Continue(val)
            },
            MyResult::Err(e) => {
                println!("Encountered Err with value.");
                ControlFlow::Break(MyResult::Err(e))
            },
        }
    }
}

impl<T, E> FromResidual<MyResult<Infallible, E>> for MyResult<T, E> {
    fn from_residual(residual: MyResult<Infallible, E>) -> Self {
        match residual {
            MyResult::Err(e) => {
                println!("Converting residual Err to MyResult.");
                MyResult::Err(e)
            },
            _ => unreachable!(),
        }
    }
}

fn do_something() -> MyResult<i32, &'static str> {
    let x = MyResult::Ok(10)?;
    let y: i32 = MyResult::Err("oops")?;
    MyResult::Ok(x + y)
}

fn main() {
    println!("Output: ", do_something());
}

```

Outputs:
```
Encountered Ok with value.
Encountered Err with value.
Converting residual Err to MyResult.
Output: Err("oops")
```

In this implementation:

- `from_output` is analogous to Haskell’s `return` (or `pure` in the applicative context), lifting a value into the monadic type.
- `branch` corresponds to the monadic bind (`>>=`), determining whether to propagate the value or short-circuit.
- `from_residual` is required for integrating with other `Try`-compatible types and enabling error propagation across type boundaries.

Despite this flexibility, Rust’s `?` operator remains fundamentally tied to error-handling semantics.
Unlike Haskell, where monads generalize sequencing of computations across various effects, Rust’s monadic ergonomics, through `?`, are constrained to types modelling control flow interruption.

Despite how tempting it might look to generalize `?` to arbitrary monads, I would caution against it.
Unlike Haskell, where monads are a first-class abstraction for sequencing computations with various effects, using `?` with arbitrary monads could lead to confusion.

## A monad is just a monoid in the category of endofunctors, what's the problem? (Haskell)

Where Rust brings functional error handling into a systems programming language -- with `Result<T, E>`, `Option<T>`, and `?` -- Haskell has far more powerful abstractions.

Monads give you composable effects, including errors.
You can throw, catch, pattern match, and compose computations in `Either`, `Maybe`, or more complex stacks using monad transformers.

As in Rust, `Either Error Value` encodes a computation that can fail.
But in Haskell, you can manipulate it using the full suite of monadic tools.

The example below shows how `ExceptT`—a monad transformer—extends any base monad (typically `IO`) with error-handling capabilities.
It generalizes the `Either e a` pattern, allowing you to compose error propagation with other effects (like `IO`, `State`, etc.).

```haskell
import Control.Monad.Except

-- Define error type and a type alias for our error-handling monad
data AppError
  = DivideByZero
  | UnexpectedError String
  deriving (Show)

type AppM = ExceptT AppError IO

-- A function that fails safely
safeDivide :: Int -> Int -> AppM Int
safeDivide _ 0 = throwError DivideByZero
safeDivide x y
  | y < 0     = throwError (UnexpectedError "Negative denominator")
  | otherwise = return (x `div` y)

-- Composed computation
compute :: Int -> Int -> Int -> AppM Int
compute a b c = do
  x <- safeDivide a b
  y <- safeDivide x c
  return y

-- Entry point
main :: IO ()
main = do
  result <- runExceptT (compute 10 2 0)
  case result of
    Left DivideByZero           -> putStrLn "Error: division by zero"
    Left (UnexpectedError msg)  -> putStrLn $ "Unexpected error: " ++ msg
    Right val                   -> putStrLn $ "Success: " ++ show val
```

This is elegant -- you get typed, structured error handling that composes seamlessly with `IO`.

But once you start stacking more than one effect - say, `ReaderT`, `StateT`, and `ExceptT` -- it quickly becomes hard to manage.
Libraries like `mtl`, `freer`, or `polysemy` try to reduce this friction, but the conceptual weight remains high.
The learning curve is steep, and yes, monads still confuse people.
Not because they’re inherently difficult, but because most programming education doesn’t equip you to think in algebraic structures.

### Excepting Monads

Despite Haskell’s emphasis on pure functions and strong static typing, it still includes support for runtime exceptions.
Why? Because not all errors fit cleanly into a type-level model—especially when dealing with I/O or legacy code.
However, these exceptions can be safely and idiomatically captured and transformed into more composable types like `Either`, making them compatible with the broader functional ecosystem.

```haskell
import Control.Exception (SomeException, try, Exception, throwIO)
import Data.Typeable (Typeable)

-- Example function that may fail at runtime
failingIO :: IO Int
failingIO = throwIO $ userError "Something went wrong"

main :: IO ()
main = do
  result <- try failingIO :: IO (Either SomeException Int)
  case result of
    Left e  -> putStrLn $ "Caught error: " ++ show e
    Right v -> print v
```

### Parsing and Non-Empty Chains (Scala)

This brings us to 2021, where this blog post really began.
During my final undergraduate project with a company, we decided to step away from the mainstream and explore more functional tooling.
That led us to Scala, and more specifically, to Cats.

In many real-world domains -- especially parsing, validation, and data ingestion -- you don't just want to know *if* something failed.
You want to know *everything* that failed.

Scala’s `Cats` library handles this elegantly with `Validated` and `NonEmptyChain`.
Unlike `Either`, which short-circuits on the first failure, `Validated` accumulates all errors.

```scala
import cats.data.{Validated, NonEmptyChain}
import cats.syntax.all._

// Types
type Error = String
type Result[A] = Validated[NonEmptyChain[Error], A]

// Domain model
case class User(name: String, email: String, age: Int)

// Input model (e.g., raw user-submitted data)
case class RawInput(name: String, email: String, age: String)

// Validation functions
def validateName(name: String): Result[String] =
  if (name.trim.nonEmpty) name.validNec
  else "Name cannot be empty".invalidNec

def validateEmail(email: String): Result[String] =
  if (email.contains("@")) email.validNec
  else "Email must contain '@'".invalidNec

def validateAge(ageStr: String): Result[Int] =
  ageStr.toIntOption match {
    case Some(age) if age >= 0 => age.validNec
    case Some(_)               => "Age must be non-negative".invalidNec
    case None                  => "Age must be a valid number".invalidNec
  }

// Aggregate all validations
def validateUser(input: RawInput): Result[User] =
  (
    validateName(input.name),
    validateEmail(input.email),
    validateAge(input.age)
  ).mapN(User.apply)

@main def runValidation(): Unit = {
  val goodInput = RawInput("Alice", "alice@example.com", "30")
  val badInput  = RawInput("", "no-at-symbol", "-5")

  println("Valid input result:")
  println(validateUser(goodInput))

  println("\nInvalid input result:")
  println(validateUser(badInput))
}
```

Outputs:
```
Valid input result:
Valid(User(Alice,alice@example.com,30))

Invalid input result:
Invalid(Chain(Name cannot be empty, Email must contain '@', Age must be non-negative))
```

If name and email both fail, you get both errors, not just the first.
That’s the kind of robustness you want in real-world parsing, form validation, or config loading.
And all that without much boilerplate code.

It is important to note, though, that `Validated` <a class="external" href="https://typelevel.org/cats/datatypes/validated.html#of-flatmaps-and-eithers" target="_blank">is not a monad</a> due to the accumulation of errors.

## Effect Systems (Haskell++)

Effect systems bring to error handling -- and to side effects more broadly -- more powerful tools.
Rather than wrapping all effects in a monad like `IO`, these systems explicitly track them in the type signature.
This means you can determine exactly which effects a function might perform (I/O, logging, error handling, state, etc.) directly from its type -- not by convention, but enforced by the compiler.

The <a class="external" href="https://hackage.haskell.org/package/polysemy" target="_blank">polysemy</a> library in Haskell is a good example of such a system.
Here's a simple example extracted from <a class="external" href="https://github.com/willGuimont/exercises_api" target="_blank">willGuimont/exercises_api</a>.
It combines state, logging, and error handling, all visible in the type signature.

```haskell
-- Error type
data ExerciseError
  = ExerciseNotFound ExerciseId
  -- And other types of errors...
  deriving (Show, Eq, Generic)

-- Persistence effect to query exercices
data Persistence m a where
  -- Exercise
  GetExerciseById :: ExerciseId -> Persistence m (Maybe Exercise)
  -- And other effects...

makeSem ''Persistence

runPersistenceOnIO :: (Member (Embed IO) r) => Sem (Persistence ': r) a -> Sem r a
runPersistenceOnIO =
  interpret $
    \case
      -- Exercise
      GetExerciseById eId -> embed @IO . runSqlite sqliteDbName $ do
        let key = toSqlKey eId :: DbExerciseId
        eDb <- getEntity key
        pure $ toExercise <$> eDb
    -- and others...

-- Example function using persistence
getExercise :: Members [Persistence, Logging, Error ExerciseError] r => ExerciseId -> Sem r Exercise
getExercise eId = do
  logInfo "getExercise"
  getExerciseById eId >>= \case
    Nothing -> throw $ ExerciseNotFound eId -- Error if the exercise is not found
    Just e -> pure e

-- Server
formatNotFoundError :: Show a => BLU.ByteString -> a -> Either ServerError b
formatNotFoundError entityType eId  = Left err404 {errBody = LBS.concat [entityType <> " ", BLU.fromString $ show eId, " does not exist"]}

createApp :: IO Application
createApp = do
  loggerStdout <- fst <$> newFastLogger (LogStdout defaultBufSize)

  _ <- runM $ runPersistenceManagingOnIO executeMigration
  _ <- runM $ runLoggingOnLogger loggerStdout . logInfo $ "Starting server on port " <> pack (show port)

  return (serve exerciseApi $ hoistServer exerciseApi (`interpretServer` loggerStdout) server)
  where
    interpretServer sem loggerStdout =
      sem
        & runPersistenceOnIO
        & runLoggingOnLogger loggerStdout
        & runError @ExerciseError -- Transforms thrown ExerciceError into Either ExerciseError a
        & runM
        & exerciseErrorHandler

    -- Convert Either ExerciseError a into a Servant error
    exerciseErrorHandler = Handler . ExceptT . fmap handleExerciseErrors
    handleExerciseErrors (Left (ExerciseNotFound eId)) = formatNotFoundError "Exercise" eId
    -- and other errors
    handleExerciseErrors (Right value) = Right value

port :: Port
port = 8080

startServer :: IO ()
startServer = do
  app <- createApp
  withStdoutLogger $ \appLogger -> do
    let settings = setPort port $ setLogger appLogger defaultSettings
    runSettings settings $ simpleCors app
```

This makes exception handling more explicit and modular -- you can define and run separate interpreters for each type of error, allowing each subsystem to handle its own failures independently.

This approach tickles my functional programming itch, but it comes with complexity.
It is very elegant of thinking of your program as a series of composable effects, that are then interpreted at the edges of your system.
More complex operations can be decomposed into smaller effects, before being interpreter.
In some ways, it feels like a sort of interpreter that compiles your source code into a simpler bytecode (core language primitive operations) that is then executed.
However, the learning curve is steep, and the abstraction overhead can be significant for small to medium projects.

## Trust, but ~~verify~~ `assert` (D)

Some languages, like Eiffel and D, support design by contract, a declarative way to specify preconditions, postconditions, and invariants.
If a contract is violated, the program crashes or throws, often with minimal recovery.
They are often even omitted when compiled in release mode.
Thus, they are not, as the other techniques overviewed in this document, ways to validate user input or alternatives to exceptions.

Design by contract is about catching programmer mistakes, not handling external failures.
If a function says "I expect a non-empty list," and you give it an empty one, that's not a runtime error to recover from -- it's a logic bug.
The contract makes that explicit.

In contrast, exceptions, `Either`, `Result`, and `Validated` are about handling real-world uncertainty: invalid input, missing files, network timeouts, and corrupted data.
These are expected failures that your program should handle gracefully.

Here's a simple example of contract programming using D:
```d
import std.stdio;

struct BankAccount {
    private {
        string owner;
        double balance;
    }

    this(string owner, double initialDeposit)
    in {
        assert(owner.length > 0, "Owner name cannot be empty.");
        assert(initialDeposit >= 0, "Initial deposit must be non-negative.");
    }
    do {
        this.owner = owner;
        this.balance = initialDeposit;
    }

    invariant() {
        assert(balance >= 0, "Invariant failed: balance must be non-negative.");
    }

    void deposit(double amount)
    in {
        assert(amount > 0, "Deposit amount must be positive.");
    }
    do {
        double oldBalance = balance;
        balance += amount;
        assert(balance >= oldBalance, "Postcondition failed: balance didn't increase.");
    }

    void withdraw(double amount)
    in {
        assert(amount > 0, "Withdrawal amount must be positive.");
        assert(amount <= balance, "Insufficient funds.");
    }
    do {
        double oldBalance = balance;
        balance -= amount;
        assert(balance <= oldBalance, "Postcondition failed: balance didn't decrease.");
    }

    double getBalance() const {
        return balance;
    }

    string getOwner() const {
        return owner;
    }
}

void main() {
    auto acc = BankAccount("Alice", 1000.0);
    acc.deposit(500.0);
    acc.withdraw(200.0);

    writeln("Owner: ", acc.getOwner());
    writeln("Balance: ", acc.getBalance());

    // Uncomment to test contract violations
    // acc.withdraw(2000); // Insufficient funds
    // acc.deposit(-100);  // Negative deposit
    // auto bad = BankAccount("", -10); // Invalid initial values
}

```

Contracts in D  --  namely `in`, `out`, and `invariant` blocks  -  act like free unit tests embedded directly within your code.
They document and verify the intended behaviour of functions and invariants of types, automatically checked at runtime in debug builds.
For instance, a precondition on `withdraw` guarantees that the withdrawal amount is valid before the function runs, while a postcondition ensures the balance decreases.
Unlike traditional unit tests, which are often separate and may omit corner cases, contracts enforce correctness systematically and immediately during development, catching logic errors as soon as they are introduced.
They don't replace unit tests entirely, but they eliminate many boilerplate checks, serving as a robust safety net and specification tool during implementation.

## Let It ~~Go~~ Crash (Elixir)

Elixir (and its Erlang foundations) embraces a fundamentally different philosophy: don’t prevent all errors - expect them, isolate them, and recover from them.

Instead of striving for defensive, error-free code at every level, Elixir leverages lightweight, isolated processes and robust supervision trees.
Each process operates independently.
When a failure occurs, it doesn't propagate through shared memory or unwind a global stack.
The process simply crashes -- and a supervisor decides what to do next.

Here, errors are also values, represented as tagged tuples `{:ok, value}` and `{:error, reason}`.
Functions return these tuples, and you pattern match on them to handle success and failure cases explicitly.

```elixir
case do_something() do
  {:ok, result} -> 
    next_step(result)
    
  {:error, reason} -> 
    handle(reason)
    
  _ -> 
    # Catch-all for any other return value
    IO.puts("Unexpected result")
end
```

This design makes fault tolerance an architectural feature, not an implementation detail.
Pattern matching ensures that error handling remains explicit and readable.
Elixir’s paradigm forces you to think about the not-so-happy path from the beginning.
Every function that returns ``:ok`` or ``:error`` reminds you that failure is part of the domain.
You can’t ignore it -- you have to model it.

Unlike Go, where the programmer is responsible for inspecting and propagating every error manually, Elixir encourages you to crash early and let the system self-heal.
Resilience is not patched in -- it's built in.

## Conclusion: Errors Are the Norm, Not the Exception

There is no perfect model.
But there are better tradeoffs.

Every meaningful computation—every I/O operation, API call, database query -- can fail.
Yet most programming languages treat error handling as a second-class concern: either overly verbose, dangerously ignorable, or both.
The happy path is (almost) always easy to write.
The hard part is everything else.

There’s <a class="external" href="https://worrydream.com/refs/Brooks_1986_-_No_Silver_Bullet.pdf" target="_blank">no silver bullet</a>.
But there are better tradeoffs -- depending on your constraints, goals, and team culture.
Personally, my thoughts on error handling have evolved over time.
In the past, I leaned towards leveraging the type system to make errors explicit, like Haskell and Rust.
But lately, I've come to appreciate the simplicity of Odin's approach, which balances explicitness with conciseness and Elixir's philosophy of embracing failure as a first-class concern rather than defensive coding.

Errors are the norm, not the exception.
The best systems are those that make handling them not only simple, but obvious.
