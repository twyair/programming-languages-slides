# Racket Essentials

(the following slides are based on [the Racket Guide](https://docs.racket-lang.org/guide/to-scheme.html))

<!-- to-scheme.md -->

---

## Simple Values <!-- 1 -->

---vert---

### numbers

```scheme
1       3.14
1/2     6.02e+23
1+2i    9999999999999999999999
```

---vert---

### booleans

__booleans__ are `#t` for true and `#f` for false

```scheme
(= 3 2)
;; #f

(= 4 4)
;; #t
```

in conditionals all non-`#f` values are treated as true

---vert---

### strings

__strings__ are written between double-quotes and a `\` is used for escaping

```scheme
"Hello, world!"
"Benjamin \"Bugsy\" Siegel"
"λx:(μα.α→α).xx" ; any unicode character is allowed
```

---vert---

a constant is typically printed by the REPL the same as its input syntax (up to normalization)

```scheme
1.0000
;; 1.0
"Bugs \u0022Figaro\u0022 Bunny"
;; "Bugs \"Figaro\" Bunny"
```

---

## Simple Definitions and Expressions <!-- 2 -->

A program module is written as

```scheme
#lang <langname> <topform>*
```

(we'll talk about `<topform>`s later)

---

### Definitions <!-- 2.1 -->

---vert---

#### define a constant

```scheme
(define <id> <expr> )
```

binds `<id>` to the result of `<expr>`

```scheme
(define pie 3)             ; defines pie to be 3

pie
;; 3
```

---vert---

#### define a function

```scheme
(define (<id> <id>*) <expr>+)
```

* binds the first `<id>` to a function that takes arguments as named by the remaining `<id>`s
* the `<expr>`s are the body of the function
* when called it returns the result of the last `<expr>`.

```scheme
(define (piece str)        ; defines piece as a function
  (substring str 0 pie))   ;  of one argument

(piece "key lime")
;; "key"
```

---vert---

a function definition is really the same as a non-function definition

a function is just another kind of value

```scheme
piece
;; #<procedure:piece>
substring
;; #<procedure:substring>
```

---vert---

* a function definition can include multiple expressions for its body
* when called only the value of the last expression is returned
* the other expressions are evaluated only for some side-effects (e.g. printing).

```scheme
(define (bake flavor)
  (printf "preheating oven...\n")
  (string-append flavor " pie"))

(bake "apple")
;; preheating oven...
;; "apple pie"
```

---

### Identifiers <!-- 2.3 -->

Racket's syntax for identifiers excludes numbers and the special characters

  `(` `)` `[` `]` `{` `}` `"` `,` `'` `;` `#` `|` `\`

the following are valid identifiers:

```scheme
+
integer?
pass/fail
Hfuhruhurr&Uumellmahaye
john-jacob-jingleheimer-schmidt
a-b-c+1-2-3
```

---

### Function Calls <!-- 2.4 -->

the syntax of a function call is

```scheme
(<id> <expr>*)
```

---vert---

Racket pre-defines many function identifiers

```scheme
(string-append "rope" "twine" "yarn")  ; append strings
;; "ropetwineyarn"
(substring "corduroys" 0 4)            ; extract a substring
;; "cord"
(string-prefix? "shoelace" "shoe")     ; recognize string prefix/suffix
;; #t
(string? "Ceci n'est pas une string.") ; recognize strings
;; #t
(string? 1)
;; #f
(sqrt 16)                              ; find a square root
;; 4
(sqrt -16)
;; 0+4i
```

---vert---

```scheme
(+ 1 2)                                ; add numbers
;; 3
(< 2 1)                                ; compare numbers
;; #f
(number? "c'est une number")           ; recognize numbers
;; #f
(number? 1)
;; #t
(equal? 6 "half dozen")                ; compare anything
;; #f
(equal? 6 6)
;; #t
(equal? "half dozen" "half dozen")
;; #t
```

---

### Conditionals <!-- 2.5 -->

---vert---

#### `if` expression

the syntax of an `if` conditional

```scheme
( if <expr1> <expr2> <expr3> )
```

* `<expr1>` is the condition
* if it produces a non-`#f` value - then `<expr2>` is the result of the whole `if` expression
* otherwise - `<expr3>` is evaluated for the result.

---vert---

```scheme
(if (> 2 3)
    "2 is bigger than 3"
    "2 is smaller than 3")
;; "2 is smaller than 3"
```

---vert---

```scheme
(define (reply s)
  (if (string-prefix? s "hello ")
      "hi!"
      "huh?"))

(reply "hello racket")
;; "hi!"
(reply "λx:(μα.α→α).xx")
;; "huh?"
```

---vert---

#### `and` and `or`

the syntax:

```scheme
( and <expr>* )
( or <expr>* )
```

`and` and `or` are short-circuiting

---vert---

```scheme
(define (reply-non-string s)
  (if (and (string? s) (string-prefix? s "hello "))
      "hi!"
      "huh?"))

(reply-non-string "hello racket")
;; "hi!"
(reply-non-string 17)
;; "huh?"
```

---vert---

note that the `and` and `or` forms work with any number of expressions

```scheme
(define (reply-only-enthusiastic s)
  (if (and (string? s)
           (string-prefix? s "hello ")
           (string-suffix? s "!"))
      "hi!"
      "huh?"))

(reply-only-enthusiastic "hello racket!")
;; "hi!"
(reply-only-enthusiastic "hello racket")
;; "huh?"
```

---vert---

#### `cond` expression

the shorthand for a sequence of tests is the `cond` form:

```scheme
( cond {[ <expr> <expr>* ]}* )
```

TODO

it contains a sequence of clauses between square brackets. In
each clause, the first `<expr>` is a test expression. If it produces
true, then the clause's remaining <_expr_>s are evaluated, and the last
one in the clause provides the answer for the entire `cond` expression;
the rest of the clauses are ignored. If the test `<expr>` produces `#f`,
then the clause's remaining `<expr>`s are ignored, and evaluation
continues with the next clause. The last clause can use `else` as a
synonym for a `#t` test expression.

---vert---

```scheme
(define (reply-more s)
  (cond
   [(string-prefix? s "hello ") "hi!"]
   [(string-prefix? s "goodbye ") "bye!"]
   [(string-suffix? s "?") "I don't know"]
   [else "huh?"]))

(reply-more "hello racket")
;; "hi!"
(reply-more "goodbye cruel world")
;; "bye!"
(reply-more "what is your favorite color?")
;; "I don't know"
(reply-more "mine is lime green")
;; "huh?"
```

---vert---

parentheses and square brackets are actually interchangeable in Racket

the use of square brackets for `cond` clauses is for readability

---

### Function Calls, Again <!-- 2.6  -->

a function call actually allows an arbitrary expression for the function instead of just an `<id>`:

```scheme
( <expr> <expr>* )
```

the first `<expr>` can be anything that evaluates to a function

---vert---

```scheme
(define (double v)
  ((if (string? v) string-append +) v v))

(double "mnah")
;; "mnahmnah"
(double 5)
;; 10
```

---vert---

syntactically, the first expression in a function call could even be a
number—but that leads to an error, since a number is not a function.

```scheme
(1 2 3 4)
;; application: not a procedure;
;;  expected a procedure that can be applied to arguments
;;  given: 1
```

---

### Anonymous Functions <!-- 2.7  -->

the syntax:

```scheme
( lambda ( <id>* ) <expr>+ )
```

* the `<id>`s are the identifier for the function's arguments
* the `<expr>`s are the function's body expressions

---vert---

evaluating a `lambda` form by itself produces a function:

```scheme
(lambda (s) (string-append s "!"))
;; #<procedure>
```

---vert---

one use of `lambda` is as an argument

```scheme
(define (twice f v)
  (f (f v)))

(twice (lambda (s) (string-append s "!"))
       "hello")
;; "hello!!"
(twice (lambda (s) (string-append s "?!"))
       "hello")
;; "hello?!?!"
```

---vert---

another use of `lambda` is as a return value

```scheme
(define (make-add-suffix s2)
  (lambda (s) (string-append s s2)))

(twice (make-add-suffix "!") "hello")
;; "hello!!"
(twice (make-add-suffix "?!") "hello")
;; "hello?!?!"
(twice (make-add-suffix "...") "hello")
;; "hello......"
```

---vert---

Racket is __lexically scoped__ (as opposed to some other lisp dialects):

```scheme
(define louder (make-add-suffix "!"))
(define less-sure (make-add-suffix "?"))
(twice less-sure "really")
;; "really??"
(twice louder "really")
;; "really!!"
```

---vert---

the following two definitions of `louder` are equivalent (both define a function)

```scheme
(define (louder s)
  (string-append s "!"))

(define louder
  (lambda (s)
    (string-append s "!")))
```

---

### Local Binding <!-- 2.8 -->

---vert---

definitions can appear before the body expressions of a function

```scheme
( define ( <id> <id>* ) <definition>* <expr>+ )
( lambda ( <id>* ) <definition>* <expr>+ )
```

definitions at the start of a function body are local to the function body

---vert---

```scheme
(define (converse s)
  (define (starts? s2) ; local to converse
    (define spaced-s2 (string-append s2 " ")) ; local to starts?
    (string-prefix? s spaced-s2))
  (cond
   [(starts? "hello") "hi!"]
   [(starts? "goodbye") "bye!"]
   [else "huh?"]))

(converse "hello world")
;; "hi!"
(converse "hellonearth")
;; "huh?"
(converse "goodbye friends")
;; "bye!"
(converse "urp")
;; "huh?"
starts? ; outside of converse, so...
;; starts?: undefined;
;;   cannot reference an identifier before its definition
;;   in module: top-level
```

---vert---

#### `let` form

`let` can bind many identifiers at once

```scheme
( let ( {[ <id> <expr> ]}* ) <expr>+ )
```

* each binding clause is an `<id>` and an `<expr>`
* the expressions after the clauses are the body
* in each clause, the `<id>` is bound to the `<expr>`
* the bindings are local to the body

---vert---

```scheme
(let ([x (random 4)]
      [o (random 4)])
  (cond
    [(> x o) "X wins"]
    [(> o x) "O wins"]
    [else "cat's game"]))
;; "X wins"
```

---vert---

`let` can be used in any expression position

```scheme
(+
  (let ([x (long-computation 5)]) (* x x))
  7)
```

---vert---

the binding clauses of `let` cannot refer to each other

the `let*` form allows later clauses to use earlier bindings

```scheme
(let* ([x (random 4)]
        [o (random 4)]
        [diff (number->string (abs (- x o)))])
  (cond
    [(> x o) (string-append "X wins by " diff)]
    [(> o x) (string-append "O wins by " diff)]
    [else "cat's game"]))
;; "cat's game"
```

---

## Lists, Iteration, and Recursion <!-- 3 -->

---

### list

the `list` function takes any number of values and returns a list
containing the values

```scheme
(list "red" "green" "blue")
;; '("red" "green" "blue")
(list 1 2 3 4 5)
;; '(1 2 3 4 5)
```

> a list usually prints with `'`, but the printed form of a list depends on its content

---vert---

#### predefined list functions

Many predefined functions operate on lists. Here are a few examples:

```scheme
(length (list "hop" "skip" "jump"))        ; count the elements
;; 3
(list-ref (list "hop" "skip" "jump") 0)    ; extract by position
;; "hop"
(list-ref (list "hop" "skip" "jump") 1)
;; "skip"
(append (list "hop" "skip") (list "jump")) ; combine lists
;; '("hop" "skip" "jump")
(reverse (list "hop" "skip" "jump"))       ; reverse order
;; '("jump" "skip" "hop")
(member "fall" (list "hop" "skip" "jump")) ; check for an element
;; #f
```

---

### Predefined List Loops <!-- 3.1 -->

#### the `map` function

`map` uses per-element results to create a new list:

```scheme
(map sqrt (list 1 4 9 16))
;; '(1 2 3 4)

(map (lambda (i)
        (string-append i "!"))
      (list "peanuts" "popcorn" "crackerjack"))
;; '("peanuts!" "popcorn!" "crackerjack!")
```

---vert---

`andmap` and `ormap` combine the results by `and`ing or `or`ing

```scheme
(andmap string? (list "a" "b" "c"))
;; #t
(andmap string? (list "a" "b" 6))
;; #f
(ormap number? (list "a" "b" 6))
;; #t
```

---vert---

`map`, `andmap`, and `ormap` can all handle multiple lists

```scheme
(map (lambda (s n) (substring s 0 n))
      (list "peanuts" "popcorn" "crackerjack")
      (list 6 3 7))
;; '("peanut" "pop" "cracker")
```

* the lists must all have the same length
* the given function must accept one argument for each list

---vert---

#### the `filter` function

`filter` discards elements for which the function's result is `#f`:

```scheme
(filter string? (list "a" "b" 6))
;; '("a" "b")
(filter positive? (list 1 -2 6 7 0))
;; '(1 6 7)
```

---vert---

#### the `foldl` function

`foldl` generalizes some iteration functions

```scheme
(foldl (lambda (elem v)
          (+ v (* elem elem)))
        0
        '(1 2 3))
;; 14
```

---

### List Iteration from Scratch <!-- 3.2 -->

---vert---

the two core operations on a non-empty list are `first` and `rest`

```scheme
(first (list 1 2 3))
;; 1
(rest (list 1 2 3))
;; '(2 3)
```

---vert---

to create a new node - use `cons`

to get an empty list - use the `empty` constant

```scheme
empty
;; '()
(cons "head" empty)
;; '("head")
(cons "dead" (cons "head" empty))
;; '("dead" "head")
```

---vert---

`empty?` detects empty lists

`cons?` detects non-empty lists

```scheme
(empty? empty)
;; #t
(empty? (cons "head" empty))
;; #f
(cons? empty)
;; #f
(cons? (cons "head" empty))
;; #t
```

---vert---

we can now write out own `length` function

```scheme
(define (my-length lst)
  (cond
   [(empty? lst) 0]
   [else (+ 1 (my-length (rest lst)))]))

(my-length empty)
;; 0
(my-length (list "a" "b" "c"))
;; 3
```

---vert---

and our own `map` function

```scheme
(define (my-map f lst)
  (cond
   [(empty? lst) empty]
   [else (cons (f (first lst))
               (my-map f (rest lst)))]))

(my-map string-upcase (list "ready" "set" "go"))
;; '("READY" "SET" "GO")
```

---

### Tail Recursion <!-- 3.3 -->

Both `my-length` and `my-map` run in `O(n)` (stack) space for a list of length `n`

```scheme
(my-length (list "a" "b" "c"))
= (+ 1 (my-length (list "b" "c")))
= (+ 1 (+ 1 (my-length (list "c"))))
= (+ 1 (+ 1 (+ 1 (my-length (list)))))
= (+ 1 (+ 1 (+ 1 0)))
= (+ 1 (+ 1 1))
= (+ 1 2)
= 3
```

---vert---

#### tail-recursive `length`

```scheme
(define (my-length lst)
  ; local function iter:
  (define (iter lst len)
    (cond
     [(empty? lst) len]
     [else (iter (rest lst) (+ len 1))]))
  ; body of my-length calls iter:
  (iter lst 0))
```

---vert---

now evaluation looks like this

```scheme
(my-length (list "a" "b" "c"))
= (iter (list "a" "b" "c") 0)
= (iter (list "b" "c") 1)
= (iter (list "c") 2)
= (iter (list) 3)
3
```

the revised `my-length` runs in constant space

---vert---

in Racket **tail call optimization** is guaranteed (if the function is tail recursive of course)

more precisely, an expression in _tail position_ with respect to another expression does not take extra computation space over the other expression

---vert---

<!-- In the case of `my-map`, _O_\(_n_)__ space complexity is reasonable,
since it has to generate a result of size _O_\(_n_)__. Nevertheless, you
can reduce the constant factor by accumulating the result list. The only
catch is that the accumulated list will be backwards, so you'll have to
reverse it at the very end:

> Attempting to reduce a constant factor like this is usually not
> worthwhile, as discussed below. -->

#### tail-recursive `map`

```scheme
(define (my-map f lst)
  (define (iter lst backward-result)
    (cond
     [(empty? lst) (reverse backward-result)]
     [else (iter (rest lst)
                 (cons (f (first lst))
                       backward-result))]))
  (iter lst empty))
```

---vert---

a solution that generates the same code:

```scheme
(define (my-map f lst)
  (for/list ([i lst])
    (f i)))
```

---

## Pairs, Lists, and Racket Syntax <!-- 4 -->

`cons` actually accepts any two values and creates a __pair__

```scheme
(cons 1 2)
;; '(1 . 2)
(cons "banana" "split")
;; '("banana" . "split")
```

---vert---

note that a pair is printed differently than a list

```scheme
(cons 1 2)
;; '(1 . 2)
(list 1 2)
;; '(1 2)
```

---vert---

`car` and `cdr` get the first and second elements (respectively) of a pair

```scheme
(car (cons 1 2))
;; 1
(cdr (cons 1 2))
;; 2
```

! remember `a` comes before `d`

---vert---

the more traditional name for `cons?` is `pair?`

```scheme
(pair? empty)
;; #f
(pair? (cons 1 2))
;; #t
(pair? (list 1 2 3))
;; #t
```

<!-- The only thing more confusing to new Racketeers than non-list pairs is
the printing convention for pairs where the second element _is_ a pair,
but _is not_ a list:

```scheme
> (cons 0 (cons 1 2))
'(0 1 . 2)
```

In general, the rule for printing a pair is as follows: use the dot
notation unless the dot is immediately followed by an open parenthesis.
In that case, remove the dot, the open parenthesis, and the matching
close parenthesis. Thus, `'(0 . (1 . 2))` becomes `'(0 1 . 2)`, and `'(1
. (2 . (3 . ())))` becomes `'(1 2 3)`. -->

---

### TODO: Quoting Pairs and Symbols with `quote` <!-- 4.1 -->

A list prints with a quote mark before it, but if an element of a list
is itself a list, then no quote mark is printed for the inner list:

```scheme
> (list (list 1) (list 2 3) (list 4))
'((1) (2 3) (4))
```

For nested lists, especially, the `quote` form lets you write a list as
an expression in essentially the same way that the list prints:

```scheme
> (quote ("red" "green" "blue"))
'("red" "green" "blue")
> (quote ((1) (2 3) (4)))
'((1) (2 3) (4))
> (quote ())
'()
```

The `quote` form works with the dot notation, too, whether the quoted
form is normalized by the dot-parenthesis elimination rule or not:

```scheme
> (quote (1 . 2))
'(1 . 2)
> (quote (0 . (1 . 2)))
'(0 1 . 2)
```

Naturally, lists of any kind can be nested:

```scheme
> (list (list 1 2 3) 5 (list "a" "b" "c"))
'((1 2 3) 5 ("a" "b" "c"))
> (quote ((1 2 3) 5 ("a" "b" "c")))
'((1 2 3) 5 ("a" "b" "c"))
```

If you wrap an identifier with `quote`, then you get output that looks
like an identifier, but with a `'` prefix:

```scheme
> (quote jane-doe)
'jane-doe
```

A value that prints like a quoted identifier is a _symbol_. In the same
way that parenthesized output should not be confused with expressions, a
printed symbol should not be confused with an identifier. In particular,
the symbol `(quote map)` has nothing to do with the `map` identifier or
the predefined function that is bound to `map`, except that the symbol
and the identifier happen to be made up of the same letters.

Indeed, the intrinsic value of a symbol is nothing more than its
character content. In this sense, symbols and strings are almost the
same thing, and the main difference is how they print. The functions
`symbol->string` and `string->symbol` convert between them.

Examples:

```scheme
> map
#<procedure:map>
> (quote map)
'map
> (symbol? (quote map))
#t
> (symbol? map)
#f
> (procedure? map)
#t
> (string->symbol "map")
'map
> (symbol->string (quote map))
"map"
```

In the same way that `quote` for a list automatically applies itself to
nested lists, `quote` on a parenthesized sequence of identifiers
automatically applies itself to the identifiers to create a list of
symbols:

```scheme
> (car (quote (road map)))
'road
> (symbol? (car (quote (road map))))
#t
```

When a symbol is inside a list that is printed with `'`, the `'` on the
symbol is omitted, since `'` is doing the job already:

```scheme
> (quote (road map))
'(road map)
```

The `quote` form has no effect on a literal expression such as a number
or string:

```scheme
> (quote 42)
42
> (quote "on the record")
"on the record"
```

### Abbreviating `quote` with `'` <!-- 4.2 -->

`'` is used to abbreviate the use of `quote`

```scheme
'(1 2 3)
;; '(1 2 3)
'road
;; 'road
'((1 2 3) road ("a" "b" "c"))
;; '((1 2 3) road ("a" "b" "c"))
```

---vert---

a `'` expands to a `quote` form in quite a literal way

```scheme
(car ''road)
;; 'quote
(car '(quote road))
;; 'quote
```

<!-- ---vert---

The `'` abbreviation works in output as well as input. The REPL's
printer recognizes the symbol `'quote` as the first element of a
two-element list when printing output, in which case it uses `'` to
print the output:

```scheme
(quote (quote road))
;; ''road
'(quote road)
;; ''road
''road
;; ''road
``` -->

<!-- 4.3 -->