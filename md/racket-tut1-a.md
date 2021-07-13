# Welcome to Racket

(the following slides are based on [the Racket Guide](https://docs.racket-lang.org/guide/intro.html))

<!-- welcome.md -->

---

## introduction

Depending on how you look at it, **Racket** is

* a _programming language_ - a dialect of Lisp and a descendant of Scheme
* a _family_ of programming languages - variants of Racket, and more
* a set of _tools_ for using a family of programming languages

---vert---

Racket's main tools are

* **`racket`** - the core compiler, interpreter, and run-time system
* **DrRacket** - the programming environment
* **`raco`** - a command-line tool for installing packages, building libraries, and more

---vert---

using DrRacket write the following at the top of the editor:

```scheme
#lang racket
```

that directive specifies the language with which you're working

---

## Interacting with Racket

DrRacket's bottom panel and the `racket` program both act as __REPLs__

you type an expression, hit Enter and the answer is printed

---vert---

a number by itself is an expression

```scheme
5
; 5
```

---vert---

a string is also an expression that evaluates to itself

```scheme
"Hello, world!"
; "Hello, world!"
```

---vert---

Racket uses parentheses to wrap larger expressions - almost any expression, other than simple constants

the following calls the builtin function `substring`

```scheme
(substring "the boy out of the country" 4 7)
; "boy"
```

---

## Definitions and Interactions

You can define your own functions:

```scheme
(define (extract str)
  (substring str 4 7))

(extract "the boy out of the country")
; "boy"

(extract "the country out of the boy")
; "cou"
```

---vert---

definitions are normally put in the top panel of DrRacket called the __definitions area__

```scheme
#lang racket

(define (extract str)
  (substring str 4 7))
```

---vert---

when using command-line `racket` you'd save the program in a file `"extract.rkt"` and load it using `enter!`

```scheme
(enter! "extract.rkt")
(extract "the gal out of the city")
; "gal"
```

---

## Creating Executables

if your file (or definitions area) contains

```scheme
#lang racket

(define (extract str)
  (substring str 4 7))

(extract "the cat out of the bag")
```

then it is a complete program that prints `"cat"` when run

---vert---

run in in DrRacket by clicking `run` or save it in `extract.rkt` and run it by

```bash
racket extract.rkt
```

---vert---

to package the program as an executable, you have a few options:

* in DrRacket, you can select the `Racket|Create Executable` menu item
* run `raco exe <filename>`
* in a Unix-like system insert the following at the beginning of the file to make it executable

    ```scheme
    #! /usr/bin/env racket
    ```

    and don't forget to run `chmod +x <filename>`
