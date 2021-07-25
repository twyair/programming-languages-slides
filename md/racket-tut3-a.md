# Exceptions and Control

(the following slides are based on [the Racket Guide](https://docs.racket-lang.org/guide/control.html))

<!-- control.md -->

---

## Exceptions <!-- 1 -->

---vert---

whenever a run-time error occurs an __exception__ is raised

```scheme
(/ 1 0)
;; /: division by zero

(car 17)
;; car: contract violation
;;  expected: pair?
;;  given: 17
```

---vert---

to catch an exception use `with-handlers`:

```scheme
(with-handlers ([predicate-expr handler-expr] ...)
  body ...+)
```

* `predicate-expr`s are called to determine whether to catch an exception
* the handler function is produced by `handler-expr`
* the result of `handler-expr` is the result of the `with-handlers` expression

---vert---

For example, a divide-by-zero error raises an instance of the
`exn:fail:contract:divide-by-zero` structure type:

```scheme
> (with-handlers ([exn:fail:contract:divide-by-zero?
                   (lambda (exn) +inf.0)])
    (/ 1 0))
+inf.0
> (with-handlers ([exn:fail:contract:divide-by-zero?
                   (lambda (exn) +inf.0)])
    (car 17))
car: contract violation
  expected: pair?
  given: 17
```

---vert---

The `error` function is one way to raise your own exception. It packages
an error message and other information into an `exn:fail` structure:

```scheme
> (error "crash!")
crash!
> (with-handlers ([exn:fail? (lambda (exn) 'air-bag)])
    (error "crash!"))
'air-bag
```

---vert---

The `exn:fail:contract:divide-by-zero` and `exn:fail` structure types
are sub-types of the `exn` structure type. Exceptions raised by core
forms and functions always raise an instance of `exn` or one of its
sub-types, but an exception does not have to be represented by a
structure. The `raise` function lets you raise any value as an
exception:

```scheme
> (raise 2)
uncaught exception: 2
> (with-handlers ([(lambda (v) (equal? v 2)) (lambda (v) 'two)])
    (raise 2))
'two
> (with-handlers ([(lambda (v) (equal? v 2)) (lambda (v) 'two)])
    (/ 1 0))
/: division by zero
```

---vert---

Multiple `predicate-expr`s in a `with-handlers` form let you handle
different kinds of exceptions in different ways. The predicates are
tried in order, and if none of them match, then the exception is
propagated to enclosing contexts.

```scheme
> (define (always-fail n)
    (with-handlers ([even? (lambda (v) 'even)]
                    [positive? (lambda (v) 'positive)])
      (raise n)))
> (always-fail 2)
'even
> (always-fail 3)
'positive
> (always-fail -3)
uncaught exception: -3
> (with-handlers ([negative? (lambda (v) 'negative)])
   (always-fail -3))
'negative
```

---vert---

Using `(lambda (v) #t)` as a predicate captures all exceptions, of
course:

```scheme
> (with-handlers ([(lambda (v) #t) (lambda (v) 'oops)])
    (car 17))
'oops
```

---vert---

Capturing all exceptions is usually a bad idea, however. If the user
types Ctl-C in a terminal window or clicks the Stop button in DrRacket
to interrupt a computation, then normally the `exn:break` exception
should not be caught. To catch only exceptions that represent errors,
use `exn:fail?` as the predicate:

```scheme
> (with-handlers ([exn:fail? (lambda (v) 'oops)])
    (car 17))
'oops
> (with-handlers ([exn:fail? (lambda (v) 'oops)])
    (break-thread (current-thread)) ; simulate Ctl-C
    (car 17))
user break
```

---vert---

Exceptions carry information about the error that occurred. The
`exn-message` accessor provides a descriptive message for the exception.
The `exn-continuation-marks` accessor provides information about the
point where the exception was raised.

> The `continuation-mark-set->context` procedure provides best-effort structured backtrace information

```scheme
(with-handlers ([exn:fail?
                   (lambda (v)
                     ((error-display-handler) (exn-message v) v))])
    (car 17))
;; car: contract violation
;;  expected: pair?
;;  given: 17
;;  context...:
;;   .../private/more-scheme.rkt:148:2: call-with-break-parameterization
;;   .../racket/sandbox.rkt:882:7
;;   .../racket/sandbox.rkt:853:2: user-process
```

---

## Prompts and Aborts <!-- 2 -->

---vert---

When an exception is raised, control escapes out of an arbitrary deep
evaluation context to the point where the exception is caught—or all the
way out if the exception is never caught:

```scheme
(+ 1 (+ 1 (+ 1 (+ 1 (+ 1 (+ 1 (/ 1 0)))))))
;; /: division by zero
```

---vert---

But if control escapes "all the way out," why does the REPL keep going
after an error is printed? You might think that it's because the REPL
wraps every interaction in a `with-handlers` form that catches all
exceptions, but that's not quite the reason.

The actual reason is that the REPL wraps the interaction with a
_prompt_, which effectively marks the evaluation context with an escape
point. If an exception is not caught, then information about the
exception is printed, and then evaluation _aborts_ to the nearest
enclosing prompt. More precisely, each prompt has a _prompt tag_, and
there is a designated _default prompt tag_ that the uncaught-exception
handler uses to abort.

---vert---

The `call-with-continuation-prompt` function installs a prompt with a
given prompt tag, and then it evaluates a given thunk under the prompt.
The `default-continuation-prompt-tag` function returns the default
prompt tag. The `abort-current-continuation` function escapes to the
nearest enclosing prompt that has a given prompt tag.

---vert---

```scheme
(define (escape v)
  (abort-current-continuation
   (default-continuation-prompt-tag)
   (lambda () v)))
(+ 1 (+ 1 (+ 1 (+ 1 (+ 1 (+ 1 (escape 0)))))))
;; 0
(+ 1
   (call-with-continuation-prompt
    (lambda ()
      (+ 1 (+ 1 (+ 1 (+ 1 (+ 1 (+ 1 (escape 0))))))))
    (default-continuation-prompt-tag)))
;; 1
```

In `escape` above, the value `v` is wrapped in a procedure that is
called after escaping to the enclosing prompt.

---vert---

Prompts and aborts look very much like exception handling and raising.
Indeed, prompts and aborts are essentially a more primitive form of
exceptions, and `with-handlers` and `raise` are implemented in terms of
prompts and aborts. The power of the more primitive forms is related to
the word "continuation" in the operator names, as we discuss in the next
section.

---

## Continuations <!-- 3 -->

A __continuation__ is a value that encapsulates a piece of an expression's
evaluation context. The `call-with-composable-continuation` function
captures the _current continuation_ starting outside the current
function call and running up to the nearest enclosing prompt. (Keep in
mind that each REPL interaction is implicitly wrapped in a prompt.)

For example, in

```scheme
(+ 1 (+ 1 (+ 1 0)))
```

---vert---

at the point where `0` is evaluated, the expression context includes three nested addition expressions. We can grab that context by changing `0` to grab the continuation before returning 0:

```scheme
(define saved-k #f)
(define (save-it!)
  (call-with-composable-continuation
    (lambda (k) ; k is the captured continuation
      (set! saved-k k)
      0)))
(+ 1 (+ 1 (+ 1 (save-it!))))
;; 3
```

---vert---

The continuation saved in `save-k` encapsulates the program context `(+ 1 (+ 1 (+ 1 ?)))`, where `?` represents a place to plug in a result value—because that was the expression context when `save-it!` was called. The continuation is encapsulated so that it behaves like the function `(lambda (v) (+ 1 (+ 1 (+ 1 v))))`:

```scheme
(saved-k 0)
;; 3
(saved-k 10)
;; 13
(saved-k (saved-k 0))
;; 6
```

---vert---

The continuation captured by `call-with-composable-continuation` is determined dynamically, not syntactically. For example, with

```scheme
(define (sum n)
  (if (zero? n)
      (save-it!)
      (+ n (sum (sub1 n)))))
(sum 5)
;; 15
```

the continuation in `saved-k` becomes `(lambda (x) (+ 5 (+ 4 (+ 3 (+ 2 (+ 1 x))))))`:

```scheme
(saved-k 0)
;; 15
(saved-k 10)
;; 25
```

---vert---

A more traditional continuation operator in Racket (or Scheme) is
`call-with-current-continuation`, which is usually abbreviated
`call/cc`. It is like `call-with-composable-continuation`, but applying
the captured continuation first aborts (to the current prompt) before
restoring the saved continuation. In addition, Scheme systems
traditionally support a single prompt at the program start, instead of
allowing new prompts via `call-with-continuation-prompt`. Continuations
as in Racket are sometimes called _delimited continuations_, since a
program can introduce new delimiting prompts, and continuations as
captured by `call-with-composable-continuation` are sometimes called
_composable continuations_, because they do not have a built-in abort.
