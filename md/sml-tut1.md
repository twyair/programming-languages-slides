# Standard ML

## introduction

---

### loading and Saving

* interpreter
* first prompt (-) and secondary prompt (=)
* semicolon terminated

```text
Standard ML of New Jersey v110.79 [built: Sat Oct 26 12:27:04 2019]
- 5 + 5;
val it = 10 : int
```

---vert---

* create a file named `myfile.sml`
* start ML and

    ```sml
    use "c:\\myfile.sml";
    ```

* or redirect the input and output

    ```bash
    sml < myfile.sml > output
    ```

---

### a simple tutorial

* ML is usually used as an interpreter (a compiler is also available)
* expressions followed by a semicolon yield a response

    ```sml
    2 + 2;
    (*val it = 4 : int*)
    ```

* doing simple arithmetic

    ```sml
    3.2 - 2.3;
    (*val it = 0.9 : real*)

    Math.sqrt 2.0;
    (*val it = 1.414213562 : real*)
    ```

---

### declaring constants

---vert---

naming constants

```sml
val seconds = 60;
(*val seconds = 60 : int*)
```

---vert---

using names in expressions

```sml
val minutes = 60;
(*val minutes = 60 : int*)

val hours = 24;
(*val hours = 24 : int*)

seconds * minutes * hours;
(*val it = 86400 : int*)
```

---vert---

the identifier `it`

```sml
seconds * minutes * hours;
(*val it = 86400 : int*)

it div 24;
(*val it = 3600 : int*)

val secs_in_hour = it;
(*val secs_in_hour = 3600 : int*)
```

---

### legal names

---vert---

### alphabetic names

* begins with a letter
* followed by letters, digits, underscore, or single quotes
* case sensitive

```sml
x
x'
uB40
hamlet_prince_of_denmark
h''3_H
```

---vert---

### symbolic names

* permitted over the characters:

    ```sml
    ! % & $ # + - * / : < = > ? @ \ ~ \ ^ |
    ```

* should not be one of:

    ```sml
    : _ | = => -> #
    ```

* allowed wherever an alphabetic name is
* try to avoid using it

```sml
val +-+-+ = 1415;
(*val +-+-+ = 1415 : int*)
```

---

### ML keywords

`abstype` | `and` | `andalso` | `as` | `case` | `datatype` | `do` | `else​` | `end |` `eqtype` | `exception` | `fn` | `fun` | `functor` | `handle` | `if​` | `in |` `include` | `infix` | `infixr` | `let` | `local` | `nonfix` | `of` | `op​` | `open |` `orelse` | `raise` | `rec` | `sharing` | `sig` | `signature​` | `struct |` `structure` | `then` | `type` | `val` | `while` | `with​` | `withtype`

---

### ML Primitive Types

`int`, `real`, `string`, `char`, `bool`, `unit`

---

### int

* constants
  * sequence of digits
    * 0
    * 01234
  * `~` for a unary minus sign
    * `~23`
    * `~85601435654638`
* infix operations: `+` `-` `*` `div` `mod`

---vert---

* conventional precedence (parenthesis can be dropped without change of meaning)

    ```sml
    (((m * n) * l) - (m div j)) + j​
    ```

---

### real

* constants
  * decimal point
    * `0.01`
    * `2.718281828`
  * e notation
    * `7E~5`
    * `~1.2E12`
    * `~123.4E~2` is the same as `~1.234`
* infix operators: `+` `-` `*` `/`

---vert---

* functions
  * `floor(r)` converts `real` to `int`
  * `real(i)` converts `int` to `real`
  * `sqrt`, `sin`, `cos`, `tan`, `exp`, `ln` all of type `real->real`
  * all need the `Math.` prefix: `Math.sqrt`

---

### strings

---vert---

constants are written in double quotes

```sml
"ML is the best";
(*val it = "ML is the best" : string*)
```

special characters `\n`, `\t`, `\"`, `\\`

---vert---

concatenation

```sml
"Standard" ^ " ML";
(*val it = "Standard ML" : string*)
```

---vert---

comparison

```sml
"abc" < "cba";
(*val it = true : bool*)

"zzz" > "aaa";
(*val it = true : bool*)
```

---vert---

`size` returns the number of characters

```sml
size(it);
(*val it = 11 : int*)
```

---

### characters

---vert---

chars are distinguished from strings of length 1 by `#`

```sml
"0";
(*val it = "0" : string*)

#"0";
(*val it = #"0" : char*)
```

---vert---

conversion between strings and chars

```sml
str(#"0");
(*val it = "0" : string*)

String.sub("hello", 0);
(*val it = #"h" : char*)
```

---vert---

conversion between chars and ASCII

```sml
ord(#"0");
(*val it = 48 : int*)

chr(it);
(*val it = #"0": char*)
```

---

### boolean

the two values are

```sml
true;
(*val it = true : bool*)

false;
(*val it = false : bool*)
```

---

### tuples - cartesian product type

* the n-tuple whose components are `x1`, ..., `xn`:

    ```sml
    (x1, x2, ..., xn)
    ```

* the components can be of any type, including tuples

```sml
val a = (1.5, 6.8);​
(*val a = (1.5, 6.8) : real * real​*)

(1, 1.5);​
(*val it = (1, 1.5) : int * real​*)

("str",1,true,(#"0",0.1));​
(*val it = ("str",1,true,(#"0",0.1)) : string * int * bool * (char * real)*)
```

---

### records

* records have components (fields) identified by name

    ```sml
    val me = { name="Ofir", age=30 };
    (*val me = {age=30,name="Ofir"} : {age:int, name:string}*)
    ```

* type lists each field as `label : type`
* enclosed in braces `{...}`

---vert---

* selecting a field

    ```sml
    #name(me);
    (*val it = "Ofir" : string*)
    ```

* tuples **can be seen as** records with numbers as implicit field labels

    ```sml
    #2 ("one", "two", "three");
    (*val it = "two" : string*)
    ```

* note that the numbering starts with 1

---

### lists

* a list is a finite sequence of elements

    ```sml
    [3, 5, 9];
    ["a", "list"];
    [];
    ```

* elements may appear more than once

    ```sml
    [3,4,3];
    ```

* elements may have any type but all elements must have the same type

    ```sml
    [(1, "one"), (2, "two")] : (int*string) list
    [[3.1], [], [5.7, ~0.6]] : (real list) list
    ```

---

### mapping - functions

```sml
fun sq(x: int) = x*x;
(*val sq = fn : int -> int*)
```

* keyword `fun` starts the function declaration
* `sq` is the function name
* `x:int` is the formal parameter with type constraint
* `x*x` is the body and it is an **expression**

---vert---

* the result of the function is the result of evaluating the **expression** of the function body with the actual parameter
* `int->int` is the standard mathematical notation for a function type that takes an integer and returns an integer

---

### applying a function

* simple function call

    ```sml
    sq (3);
    (*val it = 9 : int*)
    ```

* when a function is called the parameter is evaluated and then passed to the function

    ```sml
    sq (sq (3));
    (*val it = 81 : int*)
    ```

* the parentheses are optional

    ```sml
    sq 3;
    (*val it = 9 : int*)
    ```

---vert---

* parentheses are also optional in function definitions

    ```sml
    fun sq x:int = x*x;
    (*val sq = fn: int -> int*)
    ```

---

### arguments and results

* every function has one argument and one result
* any type can be passed/returned!!!
* tuples are used to pass/return several arguments

```sml
val a = (3, 4);
(*val a = (3, 4) : real*real*)

fun lengthvec (x:real, y:real) = sqrt(x*x + y*y)
(*val lengthvec = fn: real*real -> real*)

lengthvec a;
(*val it = 5.0 : real*)

lengthvec (5.0, 12.0);
(*val it = 13.0 : real*)
```

---

### functions as values

* anonymous functions with `fn` notation

    ```sml
    fn x:int => x*x;
    (*val it = fn : int -> int*)

    it 3;
    (*val it = 9 : int*)
    ```

* the following declarations are identical

    ```sml
    fun sq x:int = x*x;
    val sq = fn x:int => x*x;
    ```

---

### returning functions

* functions can also be __returned__ from other functions

    ```sml
    fun inttwice(f: (int->int)) =
        fn x => f (f x);
    (*val inttwice = fn : (int -> int) -> int -> int*)
    ```

* the arrow is right associative so the last line is equivalent to:

    ```sml
    (*val inttwice = fn : (int -> int) -> (int -> int)*)
    ```

* example

    ```sml
    inttwice (fn x => x*x);
    (*val it = fn : int -> int*)

    it 3;
    (*val it = 81 : int*)
    ```

---

### type inference

* ML deduces the types in expressions
* type checking the function:

    ```sml
    fun facti (n, p) =
        if n=0 then p else facti (n-1, n*p);
    (*val facti = fn : int * int -> int*)
    ```

  * <span class="fragment" data-fragment-index="1">constants `0` and `1` have type `int`.</span>
  * <span class="fragment" data-fragment-index="2">therefore `n=0` and `n-1` involve integers so `n` has type `int`</span>
  * <span class="fragment" data-fragment-index="3">`n*p` must be integer multiplication, so `p` has type `int`</span>
  * <span class="fragment" data-fragment-index="4">`facti` returns type `int`</span>

---

### type constraints

* certain functions are overloaded, e.g. `abs`, `+`, `-`, `~`, `*`, `<`
* the type of an overloaded function is determined from context, or is set to `int` by default
* types can be stated explicitly

---
<!-- .slide: data-background-iframe="http://localhost:8888/notebooks/tut2-type_constraints.ipynb" data-background-interactive -->

---

### polymorphic type checking

|                           |        | flexibility | security |
|:-------------------------:|:------:|:-----------:|:--------:|
|        weakly typed       |  lisp  |      ✔      |          |
|       strongly typed      | Pascal |             |     ✔    |
| polymorphic type checking |   ML   |      ✔      |     ✔    |

and in ML most types are deduced automatically 😎

---

### polymorphic function definitions

* an object is polymorphic if it can be regarded as having any kind of type
* If type inference leaves some types completely unconstrained then the definition is polymorphic
* A polymorphic type contains a type variable, e.g. 'a, 'b

```sml
fun pairself x = (x, x);
(*val pairself = fn : 'a -> 'a * 'a*)

pairself 4.0;
(*val it = (4.0,4.0) : real * real*)

fun pair (x,y) = (y,x);
(*val pair = fn: ('a * 'b) -> ('b * 'a)*)
```

---

### functions as values - the polymorphic case

---vert---
<!-- .slide: data-background-iframe="http://localhost:8888/notebooks/tut2-functions-polymorphic.ipynb" data-background-interactive -->

---vert---

* sometimes ML gives us a hard time when we give a polymorphic value to a polymorphic function.

    ```sml
    twice ident;
    (*stdIn:… Warning: type vars not generalized because...)
    (*val it = fn : ?.X1 -> ?.X1*)
    ```

* you usually may ignore it. or use a workaround:

    ```sml
    fn x => (twice ident) (x);
    (*val it = fn : 'a -> 'a*)
    ```

---

### functional vs. imperative

* imperative - using commands to change the state
* functional - stateless. using expressions recursively to calculate the result
* example: Euclid's algorithm for the Greatest Common Divisor (GCD) of two natural numbers:

`$$gcd(m,n) = \begin{cases}n,\;m = 0&\\gcd(n\;mod\;m,m), \;m>0\end{cases}$$`

---vert---

### GCD - Pascal vs. ML

* an imperative Pascal program:

    ```pascal
    function gcd(m,n: integer): integer;​
    var prevm: integer;​
    begin​
        while m<>0 do begin​
            prevm := m;
            m := n mod m;
            n := prevm​
        end;​
        gcd := n​
    end;
    ```

* a functional program in Standard ML:

    ```sml
    fun gcd(m,n) =​
        if m=0 then n else gcd(n mod m, m);
    ```

* which one is more efficient? 🧐

---

### help me improve! 😊

[tiny.cc/tirgul](http://tiny.cc/tirgul)