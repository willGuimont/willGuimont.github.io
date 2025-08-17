+++
authors = ["William Guimont-Martin"]
title = "Element of Errors Handling"
description = ""
date = 2025-07-25
# updated = ""
# draft = false
[taxonomies]
tags = ["Computing Sciences", "Programming", "Software Development"]
[extra]
# banner = ""
# toc = true
toc_inline = true
toc_ordered = true
# trigger = ""
# disclaimer = ""
+++

Errors are everywhere. Any computation, IO operation, database access, or API call - any of them can fail. Despite this, most programming languages either struggle to make error handling correct or make it painful. It's almost always easy to write the happy path. The moment something goes wrong, though, most languages make the not-so-happy path either verbose, implicit, or dangerously ignorable.

Handling errors well should be a first-class concern. It feels as if errors are just an afterthought in mainstream languages, added inelegantly out of necessity.

This blog post stems from some experimentation on error handling I did back in 2021. At the end of my undergraduate studies in software engineering, we were assigned a final project in collaboration with an industry partner. They gave us _carte blanche_ on the choice of technology. Looking to try less mainstream languages and explore new paradigms, we decided to explore and compare several less conventional stacks - paying particular attention to how each one approached error handling.

## `Try`ing to `Catch` ~~Lightning in a Bottle~~ Exceptions (Java and Friends)
The most well-known model is the `try/catch` mechanism. You throw something and hope someone, somewhere, catches it.

It’s _easy_ - throw the exception and forget about it - but not simple. As Rich Hickey pointed out in his talk "<a class="external" href="https://www.infoq.com/presentations/Simple-Made-Easy/" target="_blank">Simple Made Easy</a>", easy means accessible, simple means minimal. Exceptions are neither minimal nor predictable. They are easy, until they inevitably _complect_ and create a mess.

They let you skip instructions, bubble errors up several layers, and bypass normal control flow. They’re sugar-coated `goto`s that jump through stack frames instead of lines of code.

Yes, `try/catch/finally` blocks and RAII (in C++/Java with try-with-resources) can clean things up nicely, but you're still left with a system where it's not obvious what code might throw. And don't even get me started on null - <a class="external" href="https://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare/" target="_blank">the billion-dollar mistake</a>. Every value might be absent, which means every line might throw. Sure, coding standards can help limit these kinds of errors, until you realize that Java's standard library liberally uses `null` (e.g., `Map.get`). Unless your team is being very cautious, you are vulnerable to unexpected `NullPointerException`s.

Java attempted to solve the uncertainty around which operations might throw exceptions through checked exceptions, but that just shifted the problem. You now have to annotate everything, tracing all possible failure paths and punting the problem upstream. Most Java developers end up defaulting to unchecked exceptions anyway, sacrificing safety for sanity. Even Robert C. Martin said in Clean Code:

> Checked exceptions can sometimes be useful if you are writing a critical library: You must catch them. But in general application development, the dependency costs outweigh the benefits.
>
> -- Robert C. Martin. Clean Code. 2008.

Despite their limitations, exceptions are still very much useful for their convenience and ease of use in simple cases. That said, while it can be convenient to let domain exceptions bubble up - for instance, in a REST API handler where you want a 400 Bad Request - you’re still playing with a runtime grenade.

## Errors as Values (Go)
Go brought back the C-style return code (i.e., non-zero return for errors), modernized as error values returned by the function, now with `nil` as the successful return value. You call a function, and it returns both result and error:

```go
result, err := doSomething()
if err != nil {
    return err
}
```

This makes error handling explicit, which is a good thing. You can follow the code, and you should be able to know exactly what happens when an error is returned. You can handle the error here and there, or return it to the function's caller.

But despite its explicitness, Go doesn't force you to handle errors - you’re completely free to ignore them in a haze of `if err != nil` overdose apathy. You just have to put the error in a variable called `_` and the Go compiler will let you ignore it.

Also, Go gives you no tools to help with error handling. You’re on your own. No try, no pattern matching, no syntactic sugar. Just `if err != nil` over and over. This gets old fast. You end up either duplicating error propagation boilerplate or using helper functions to hide the verbosity (e.g., <a class="external" href="https://pkg.go.dev/errors" target="_blank">errors.Join</a>) - at which point you’ve reinvented a monad poorly.

To its credit, Go includes one elegant feature for cleanup after an error might have occurred: `defer`. It allows you to schedule resource cleanup (like closing files or releasing locks) regardless of how the function exits, which pairs well with manual error handling:

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

Still, `defer` only solves the cleanup part. You’re still manually threading error values through the entire call chain. But at least nothing is hidden. Errors are values, not ghosts in the stack trace. You see them, you pass them, or you drop them - but nothing happens behind your back.

## Playing Tag with Errors (Rust)
Rust’s tagged unions `Result<T, E>` and `Option<T>` types give you a better tradeoff. Errors are in the type system. The compiler forces you to handle them - or explicitly ignore them (e.g., with `unwrap`, `expect`, etc.).

```rust
fn foo() -> Result<T, E> { ... }

let val = foo()?; // propagates if Err
```

The `?` operator propagates errors, and makes code readable - until it doesn’t. It’s just a tiny symbol, but it does a lot. This single symbol rewires control flow and introduces implicit short-circuiting, which can obscure the data path.

Still, it's structured. It composes. It’s not just `return err`; it’s a limited but practical form of monad. This is arguably one of Rust's strengths, it makes functional programming ideas more mainstream.

Of course, Rust doesn’t force you to propagate or handle errors safely - you can always opt out:
```rust
let val = foo().unwrap(); // panics if Err
let val = foo().expect("better crash message"); // same, but with context
```

### A Monadic Digression
Before writing this document, I assumed that Rust's `?` operator was limited to built-in types like `Result<T, E>` and `Option<T>`, effectively restricting its use to these specific monads. While this holds true on stable Rust, the nightly-only `try_trait_v2` feature extends the language’s capabilities by allowing custom types to participate in `?`-based control flow through the implementation of the `Try` and `FromResidual` traits.

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

Despite this flexibility, Rust’s `?` operator remains fundamentally tied to error-handling semantics. Unlike Haskell, where monads generalize sequencing of computations across various effects, Rust’s monadic ergonomics, through `?`, are constrained to types modelling control flow interruption.

## A monad is just a monoid in the category of endofunctors, what's the problem? (Haskell)
Where Rust brings functional error handling into a systems programming language - with `Result<T, E>`, `Option<T>`, and `?` - Haskell generalizes the idea far beyond.

Monads give you composable effects, including errors. You can throw, catch, pattern match, and compose computations in `Either`, `Maybe`, or more complex stacks using monad transformers. 

As in Rust, `Either Error Value` encodes a computation that can fail. But in Haskell, you can manipulate it using the full suite of monadic tools.

The example below shows how `ExceptT`—a monad transformer—extends any base monad (typically `IO`) with error-handling capabilities. It generalizes the `Either e a` pattern, allowing you to compose error propagation with other effects (like `IO`, `State`, etc.).

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

This is elegant - you get typed, structured error handling that composes seamlessly with `IO`.

But once you start stacking more than one effect - say, `ReaderT`, `StateT`, and `ExceptT` - it quickly becomes hard to manage. Libraries like `mtl`, `freer`, or `polysemy` try to reduce this friction, but the conceptual weight remains high. The learning curve is steep, and yes, monads still confuse people. Not because they’re inherently difficult, but because most programming education doesn’t equip you to think in algebraic structures.

### Excepting Monads
Despite Haskell’s emphasis on pure functions and strong static typing, it still includes support for runtime exceptions. Why? Because not all errors fit cleanly into a type-level model—especially when dealing with I/O or legacy code. However, these exceptions can be safely and idiomatically captured and transformed into more composable types like `Either`, making them compatible with the broader functional ecosystem.

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
This brings us to 2021, where this blog post really began. During my final undergraduate project with a company, we decided to step away from the mainstream and explore more functional tooling. That led us to Scala, and more specifically, to Cats.

In many real-world domains - especially parsing, validation, and data ingestion - you don't just want to know _if_ something failed. You want to know _everything_ that failed.

Scala’s `Cats` library handles this elegantly with `Validated` and `NonEmptyChain`. Unlike `Either`, which short-circuits on the first failure, `Validated` accumulates all errors.

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

If name and email both fail, you get both errors, not just the first. That’s the kind of 
robustness you want in real-world parsing, form validation, or config loading. And all that without much boilerplate code.

It is important to note, though, that `Validated` <a class="external" href="https://typelevel.org/cats/datatypes/validated.html#of-flatmaps-and-eithers" target="_blank">is not a monad</a> due to the accumulation of errors.

## Effect Systems (Haskell++)
Effect systems bring error handling - and side effects more broadly - under rigorous control. Rather than wrapping all effects in a monad like `IO`, these systems explicitly track them in the type signature. This means you can determine exactly which effects a function might perform (I/O, logging, error handling, state, etc.) directly from its type - not by convention, but enforced by the compiler.

The <a class="external" href="https://hackage.haskell.org/package/polysemy" target="_blank">polysemy</a> library in Haskell is a good example of such a system. Here's an example that combines state, logging, and error handling, all visible in the type signature. Here's a simple example extracted from <a class="external" href="https://github.com/willGuimont/exercises_api" target="_blank">willGuimont/exercises_api</a>:

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

This makes exception handling more explicit and modular - you can define and run separate interpreters for each type of error, allowing each subsystem to handle its own failures independently.

## Trust, but ~~verify~~ `assert` (D)
Some languages, like Eiffel and D, support design by contract, a declarative way to specify preconditions, postconditions, and invariants. If a contract is violated, the program crashes or throws, often with minimal recovery. They are often even omitted when compiled in release mode. Thus, they are not, as the other techniques overviewed in this document, ways to validate user input or alternatives to exceptions.

Design by contract is about catching programmer mistakes, not handling external failures. If a function says "I expect a non-empty list," and you give it an empty one, that's not a runtime error to recover from - it's a logic bug. The contract makes that explicit.

In contrast, exceptions, `Either`, `Result`, and `Validated` are about handling real-world uncertainty: invalid input, missing files, network timeouts, and corrupted data. These are expected failures that your program should handle gracefully.

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

Contracts in D  -  namely `in`, `out`, and `invariant` blocks  -  act like free unit tests embedded directly within your code. They document and verify the intended behaviour of functions and invariants of types, automatically checked at runtime in debug builds. For instance, a precondition on `withdraw` guarantees that the withdrawal amount is valid before the function runs, while a postcondition ensures the balance decreases. Unlike traditional unit tests, which are often separate and may omit corner cases, contracts enforce correctness systematically and immediately during development, catching logic errors as soon as they are introduced. They don't replace unit tests entirely, but they eliminate many boilerplate checks, serving as a robust safety net and specification tool during implementation.
## Let It ~~Go~~ Crash (Elixir)

Elixir (and its Erlang foundation) embraces a fundamentally different philosophy: don’t prevent all errors - expect them, isolate them, and recover from them.

Instead of striving for defensive, error-free code at every level, Elixir leverages lightweight, isolated processes and robust supervision trees. Each process operates independently. When a failure occurs, it doesn't propagate through shared memory or unwind a global stack. The process simply crashes - and a supervisor decides what to do next.

```elixir
case do_something() do
   -> result
   -> handle(reason)
end
```

This design makes fault tolerance an architectural feature, not an implementation detail. Pattern matching ensures that error handling remains explicit and readable. Elixir’s paradigm forces you to think about the not-so-happy path from the beginning. Every function that returns `` or `` reminds you that failure is part of the domain. You can’t ignore it - you have to model it.

Unlike Go, where the programmer is responsible for inspecting and propagating every error manually, Elixir encourages you to crash early and let the system self-heal. Resilience is not patched in - it's built in.

## Conclusion: Errors Are the Norm, Not the Exception
There is no perfect model. But there are better tradeoffs.

Every meaningful computation—every I/O operation, API call, database query - can fail. Yet most programming languages treat error handling as a second-class concern: either overly verbose, dangerously ignorable, or both. The happy path is easy to write. The hard part is everything else.

There’s <a class="external" href="https://worrydream.com/refs/Brooks_1986_-_No_Silver_Bullet.pdf" target="_blank">no silver bullet</a>. But there are better tradeoffs - depending on your constraints, goals, and team culture. Personally, I prefer systems where errors are explicit in the type system - like Rust or Haskell - and where failure is an architectural concern, as in Elixir, forcing you to confront it from the start.

Errors are the norm, not the exception. The best systems are those that make handling them not only simple, but obvious.