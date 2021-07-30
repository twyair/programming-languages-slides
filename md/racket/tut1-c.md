# Built-In Datatypes

(the following slides are based on [the Racket Guide](https://docs.racket-lang.org/guide/datatypes.html))

<!-- data.md -->

---

## Booleans <!-- 1 -->

the boolean constants are `#t` and `#f`

`boolean?` recognizes the two boolean constants

```scheme
(= 2 (+ 1 1))
;; #t
(boolean? #t)
;; #t
(boolean? #f)
;; #t
(boolean? "no")
;; #f
```

---vert---

in the result of a test expression for `if`, `cond`, `and`, `or`, etc., any value other than `#f` counts as true.

```scheme
(if "no" 1 0)
;; 1
```

---

## Numbers <!-- 2 -->

---vert---

a Racket _number_ is either exact or inexact

an __exact__ number is one of:

* an arbitrarily large or small integer, such as `5`, `9999999`, or `-17`
* a rational that is exactly the ratio of two integers, such as `1/2`, `9999999/2`, or `-3/4`
* a complex number with exact real and imaginary parts, such as `1+2i` or `1/2+3/4i`

---vert---

an __inexact__ number is one of:

* a float, such as `2.0`, `3.14e+87`, `+inf.0`, `-inf.0`, and `+nan.0` (or `-nan.0`)
* a complex number with real and imaginary parts that are floats, such as `2.0+3.0i` or `-inf.0+nan.0i`

---vert---

* inexact numbers print with a decimal point or exponent specifier
* exact numbers print as integers and fractions

```scheme
0.5
;; 0.5
12/34
;; 6/17
```

---vert---

* `#e` or `#i` can prefix a number to force its parsing as an exact or inexact number
* the prefixes `#b`, `#o`, and `#x` specify binary, octal, and hexadecimal interpretation

```scheme
#e0.5
;; 1/2
#x03BB
;; 955
```

---vert---

Computations that involve an inexact number produce inexact results

```scheme
(/ 1 2)
;; 1/2
(/ 1 2.0)
;; 0.5
(if (= 3.0 2.999) 1 2)
;; 2
```

---vert---

`exact->inexact` and `inexact->exact` convert between the two types of numbers

```scheme
(exact->inexact 1/2)
;; 0.5
(inexact->exact 0.1)
;; 3602879701896397/36028797018963968
```

<!-- ---vert---

Inexact results are also produced by procedures such as `sqrt`, `log`, and `sin` when an exact result would require representing real numbers that are not rational. Racket can represent only rational numbers and complex numbers with rational parts.

```scheme
(sin 0)   ; rational...
;; 0
(sin 1/2) ; not rational...
;; 0.479425538604203
``` -->

<!-- ---vert---

In terms of performance, computations with small integers are typically the fastest, where "small" means that the number fits into one bit less than the machine's word-sized representation for signed numbers. Computation with very large exact integers or with non-integer exact numbers can be much more expensive than computation with inexact numbers.

```scheme
(define (sigma f a b)
  (if (= a b)
      0
      (+ (f a) (sigma f (+ a 1) b))))

(time (round (sigma (lambda (x) (/ 1 x)) 1 2000)))
;; cpu time: 415 real time: 415 gc time: 0
;; 8
(time (round (sigma (lambda (x) (/ 1.0 x)) 1 2000)))
;; cpu time: 0 real time: 0 gc time: 0
;; 8.0
``` -->

---vert---

the number categories _integer_, _rational_, _real_, and _complex_ are defined in the usual way, 
<!-- A few mathematical procedures accept only real numbers, but most implement standard extensions to complex numbers. -->

```scheme
(integer? 5)
;; #t
(complex? 5)
;; #t
(integer? 5.0)
;; #t
(integer? 1+2i)
;; #f
(complex? 1+2i)
;; #t
(complex? 1.0+2.0i)
;; #t
```

---vert---

`=` compares numbers for numerical equality

<!-- If it is given both inexact and exact numbers to compare, it essentially converts the inexact numbers to exact before comparing. -->

```scheme
(= 1 1.0)
;; #t
```

---vert---

`eqv?` (and `equal?`) compares numbers considering both exactness and numerical equality

```scheme
(eqv? 1 1.0)
;; #f
```

<!-- ---vert---

Beware of comparisons involving inexact numbers, which by their nature can have surprising behavior. Even apparently simple inexact numbers may not mean what you think they mean; for example, while a base-2 IEEE floating-point number can represent `1/2` exactly, it can only approximate `1/10`:

```scheme
(= 1/2 0.5)
;; #t
(= 1/10 0.1)
;; #f
(inexact->exact 0.1)
;; 3602879701896397/36028797018963968
``` -->

---

## Characters <!-- 3 -->

---vert---

a Racket _character_ corresponds to a Unicode _scalar value_

a character literal is `#\` followed by the represented character

exceptions: `#\space` and `#\newline`

```scheme
(integer->char 65)
;; #\A
(char->integer #\A)
;; 65
#\λ
;; #\λ
```

---vert---

a character literal can be given as a hexadecimal number prefixed by `#\u`

```scheme
#\u03BB
;; #\λ
(integer->char 17)
;; #\u0011
(char->integer #\space)
;; 32
```

---vert---

`display` directly writes a character (i.e without `#\`)

```scheme
#\A
;; #\A
(display #\A)
;; A
```

---vert---

some builtin functions on characters:

```scheme
(char-alphabetic? #\A)
;; #t
(char-numeric? #\0)
;; #t
(char-whitespace? #\newline)
;; #t
(char-downcase #\A)
;; #\a
(char-upcase #\ß)
;; #\ß
```

---vert---

`char=?` compares two or more characters and `char-ci=?` compares characters ignoring case

```scheme
(char=? #\a #\A)
;; #f
(char-ci=? #\a #\A)
;; #t
(eqv? #\a #\A)
;; #f
```

---

## Strings (Unicode) <!-- 4 -->

---vert---

a _string_ is a fixed-length array of characters

```scheme
"racket\n"
;; "racket\n"
```

---vert---

`display` directly writes the characters of a string

```scheme
"Apple"
;; "Apple"
"\u03BB"
;; "λ"
(display "Apple")
;; Apple
(display "a \"quoted\" thing")
;; a "quoted" thing
(display "two\nlines")
;; two
;; lines
(display "\u03BB")
;; λ
```

---vert---

* `make-string` creates a mutable string
* `string-ref` accesses a character from a string
* `string-set!` changes a character in a mutable string.

```scheme
(string-ref "Apple" 0)
;; #\A
(define s (make-string 5 #\.))
s
;; "....."
(string-set! s 2 #\λ)
s
;; "..λ.."
```

---vert---

string procedures:

```scheme
(string<? "apple" "Banana")
;; #f
(string-ci<? "apple" "Banana")
;; #t
(string-upcase "racket")
;; "RACKET"
```

---

## Bytes and Byte Strings <!-- 5 -->

---vert---

a _byte_ is an exact integer between `0` and `255`, inclusive

```scheme
(byte? 0)
;; #t
(byte? 256)
;; #f
```

---vert---

a _byte string_ is a sequence of bytes

```scheme
#"Apple"
;; #"Apple"
(bytes-ref #"Apple" 0)
;; 65
(make-bytes 3 65)
;; #"AAA"
(define b (make-bytes 2 0))
b
;; #"\0\0"
(bytes-set! b 0 1)
(bytes-set! b 1 255)
b
;; #"\1\377"
```

---

## Symbols <!-- 6 -->

---vert---

a _symbol_ is an atomic value that prints like an identifier preceded with `'`

```scheme
'a
;; 'a
(symbol? 'a)
;; #t
```

---vert---

any string can be supplied to `string->symbol` to obtain the corresponding symbol

any character can appear directly in an identifier, except for whitespace and the following special characters: `(` `)` `[` `]` `{` `}` `"` `,` `'` `` ` `` `;` `#` `|` `\`

<!--Actually, `#` is disallowed only at the beginning of a symbol, and then only if not followed by `%`; otherwise, `#` is allowed, too. Also, `.` by itself is not a symbol. -->

---vert---

whitespace or special characters can be included in an identifier by quoting them with `|` or `\`

```scheme
(string->symbol "one, two")
;; '|one, two|
(string->symbol "6")
;; '|6|
'\6
;; '|6|
```

---

## Keywords <!-- 7 -->

---vert---

a _keyword_ value is similar to a symbol but prefixed by `#:`

```scheme
(string->keyword "apple")
;; '#:apple
'#:apple
;; '#:apple
(eq? '#:apple (string->keyword "apple"))
;; #t
```

---vert---

an unquoted keyword is not an expression, just as an unquoted identifier does not produce a symbol

```scheme
not-a-symbol-expression
;; not-a-symbol-expression: undefined;
;;  cannot reference an identifier before its definition
;;  in module: top-level
#:not-a-keyword-expression
;; eval:2:0: #%datum: keyword misused as an expression
;;   at: #:not-a-keyword-expression
```

---

## Pairs and Lists <!-- 8 -->

---vert---

a _pair_ joins two arbitrary values

* pairs are immutable
* `cons` constructs pairs
* `car` and `cdr` extract the first and second elements of the pair, respectively

<!-- Some pairs print by wrapping parentheses around the printed forms of the two pair elements, putting a `'` at the beginning and a `.` between the elements. -->

```scheme
(cons 1 2)
;; '(1 . 2)
(cons (cons 1 2) 3)
;; '((1 . 2) . 3)
(car (cons 1 2))
;; 1
(cdr (cons 1 2))
;; 2
(pair? (cons 1 2))
;; #t
```

---vert---

a _list_ is either:

* the empty list `null`
* or a pair whose first element is an element and whose second element is a list

<!-- A list normally prints as a `'` followed by a pair of parentheses wrapped around the list elements. -->

```scheme
null
;; '()
(cons 0 (cons 1 (cons 2 null)))
;; '(0 1 2)
(list? null)
;; #t
(list? (cons 1 (cons 2 null)))
;; #t
(list? (cons 1 2))
;; #f
```

<!-- ---vert---

A list or pair prints using `list` or `cons` when one of its elements cannot be written as a `quote`d value. For example, a value constructed with `srcloc` cannot be written using `quote`, and it prints using `srcloc`:

```scheme
> (srcloc "file.rkt" 1 0 1 (+ 4 4))
(srcloc "file.rkt" 1 0 1 8)
> (list 'here (srcloc "file.rkt" 1 0 1 8) 'there)
(list 'here (srcloc "file.rkt" 1 0 1 8) 'there)
> (cons 1 (srcloc "file.rkt" 1 0 1 8))
(cons 1 (srcloc "file.rkt" 1 0 1 8))
> (cons 1 (cons 2 (srcloc "file.rkt" 1 0 1 8)))
(list* 1 2 (srcloc "file.rkt" 1 0 1 8))
```

As shown in the last example, `list*` is used to abbreviate a series of `cons`es that cannot be abbreviated using `list`. -->

<!-- ---vert---

The `write` and `display` functions print a pair or list without a leading `'`, `cons`, `list`, or `list*`. There is no difference between `write` and `display` for a pair or list, except as they apply to elements of the list:

```scheme
> (write (cons 1 2))
(1 . 2)
> (display (cons 1 2))
(1 . 2)
> (write null)
()
> (display null)
()
> (write (list 1 2 "3"))
(1 2 "3")
> (display (list 1 2 "3"))
(1 2 3)
``` -->

---vert---

predefined procedures that iterate through a list's elements:

```scheme
(map (lambda (i) (/ 1 i))
     '(1 2 3))
;; '(1 1/2 1/3)
(andmap (lambda (i) (< i 3))
       '(1 2 3))
;; #f
(ormap (lambda (i) (< i 3))
       '(1 2 3))
;; #t
(filter (lambda (i) (< i 3))
        '(1 2 3))
;; '(1 2)
```

---vert---

```scheme
(foldl (lambda (v i) (+ v i))
       10
       '(1 2 3))
;; 16
(for-each (lambda (i) (display i))
          '(1 2 3))
;; 123
(member "Keys"
        '("Florida" "Keys" "U.S.A."))
;; '("Keys" "U.S.A.")
(assoc 'where
       '((when "3:30") (where "Florida") (who "Mickey")))
;; '(where "Florida")
```

---vert---

`mcons` creates a _mutable pair_

* `set-mcar!` and `set-mcdr!` set the first and second element
* `mcar` and `mcdr` extract the first and second element

<!-- , while `write` and `display` print mutable pairs with `{` and `}`: -->

```scheme
(define p (mcons 1 2))
p
;; (mcons 1 2)
(pair? p)
;; #f
(mpair? p)
;; #t
(set-mcar! p 0)
p
;; (mcons 0 2)
```

---

## Vectors <!-- 9 -->

---vert---

A _vector_ is a fixed-length array of arbitrary values. Unlike a list, a vector supports constant-time access and update of its elements.

A vector prints similar to a list—as a parenthesized sequence of its elements—but a vector is prefixed with `#` after `'`, or it uses `vector` if one of its elements cannot be expressed with `quote`.

---vert---

For a vector as an expression, an optional length can be supplied. Also, a vector as an expression implicitly `quote`s the forms for its content, which means that identifiers and parenthesized forms in a vector constant represent symbols and lists.

```scheme
> #("a" "b" "c")
'#("a" "b" "c")
> #(name (that tune))
'#(name (that tune))
> #4(baldwin bruce)
'#(baldwin bruce bruce bruce)
> (vector-ref #("a" "b" "c") 1)
"b"
> (vector-ref #(name (that tune)) 1)
'(that tune)
```

---vert---

Like strings, a vector is either mutable or immutable, and vectors written directly as expressions are immutable.

---vert---

Vectors can be converted to lists and vice versa via `vector->list` and `list->vector`; such conversions are particularly useful in combination with predefined procedures on lists. When allocating extra lists seems too expensive, consider using looping forms like `for/fold`, which recognize vectors as well as lists.

```scheme
> (list->vector (map string-titlecase
                     (vector->list #("three" "blind" "mice"))))
'#("Three" "Blind" "Mice")
```

---

## Hash Tables <!-- 10 -->

---vert---

A _hash table_ implements a mapping from keys to values, where both keys and values can be arbitrary Racket values, and access and update to the table are normally constant-time operations. Keys are compared using `equal?`, `eqv?`, or `eq?`, depending on whether the hash table is created with `make-hash`, `make-hasheqv`, or `make-hasheq`.

```scheme
> (define ht (make-hash))
> (hash-set! ht "apple" '(red round))
> (hash-set! ht "banana" '(yellow long))
> (hash-ref ht "apple")
'(red round)
> (hash-ref ht "coconut")
hash-ref: no value found for key
  key: "coconut"
> (hash-ref ht "coconut" "not there")
"not there"
```

---vert---

The `hash`, `hasheqv`, and `hasheq` functions create immutable hash tables from an initial set of keys and values, in which each value is provided as an argument after its key. Immutable hash tables can be extended with `hash-set`, which produces a new immutable hash table in constant time.

```scheme
> (define ht (hash "apple" 'red "banana" 'yellow))
> (hash-ref ht "apple")
'red
> (define ht2 (hash-set ht "coconut" 'brown))
> (hash-ref ht "coconut")
hash-ref: no value found for key
  key: "coconut"
> (hash-ref ht2 "coconut")
'brown
```

---vert---

A literal immutable hash table can be written as an expression by using `#hash` (for an `equal?`-based table), `#hasheqv` (for an `eqv?`-based table), or `#hasheq` (for an `eq?`-based table). A parenthesized sequence must immediately follow `#hash`, `#hasheq`, or `#hasheqv`, where each element is a dotted key-value pair. The `#hash`, etc. forms implicitly `quote` their key and value sub-forms.

```scheme
> (define ht #hash(("apple" . red)
                   ("banana" . yellow)))
> (hash-ref ht "apple")
'red
```

---vert---

Both mutable and immutable hash tables print like immutable hash tables, using a quoted `#hash`, `#hasheqv`, or `#hasheq` form if all keys and values can be expressed with `quote` or using `hash`, `hasheq`, or `hasheqv` otherwise:

```scheme
> #hash(("apple" . red)
        ("banana" . yellow))
'#hash(("apple" . red) ("banana" . yellow))
> (hash 1 (srcloc "file.rkt" 1 0 1 (+ 4 4)))
(hash 1 (srcloc "file.rkt" 1 0 1 8))
```

---vert---

A mutable hash table can optionally retain its keys _weakly_, so each mapping is retained only so long as the key is retained elsewhere.

```scheme
> (define ht (make-weak-hasheq))
> (hash-set! ht (gensym) "can you see me?")
> (collect-garbage)
> (hash-count ht)
0
```

---vert---

Beware that even a weak hash table retains its values strongly, as long as the corresponding key is accessible. This creates a catch-22 dependency when a value refers back to its key, so that the mapping is retained permanently. To break the cycle, map the key to an _ephemeron_ that pairs the value with its key (in addition to the implicit pairing of the hash table).

```scheme
> (define ht (make-weak-hasheq))
> (let ([g (gensym)])
    (hash-set! ht g (list g)))
> (collect-garbage)
> (hash-count ht)
1
```

```scheme
> (define ht (make-weak-hasheq))
> (let ([g (gensym)])
    (hash-set! ht g (make-ephemeron g (list g))))
> (collect-garbage)
> (hash-count ht)
0
```

---

## Boxes <!-- 11 -->

A _box_ is like a single-element vector. It can print as a quoted `#&` followed by the printed form of the boxed value. A `#&` form can also be used as an expression, but since the resulting box is constant, it has practically no use.

```scheme
> (define b (box "apple"))
> b
'#&"apple"
> (unbox b)
"apple"
> (set-box! b '(banana boat))
> b
'#&(banana boat)
```

---

## Void and Undefined <!-- 12 -->

---vert---

Some procedures or expression forms have no need for a result value. For example, the `display` procedure is called only for the side-effect of writing output. In such cases the result value is normally a special constant that prints as `#<void>`.  When the result of an expression is simply `#<void>`, the REPL does not print anything.

---vert---

The `void` procedure takes any number of arguments and returns `#<void>`. (That is, the identifier `void` is bound to a procedure that returns `#<void>`, instead of being bound directly to `#<void>`.)

```scheme
> (void)
> (void 1 2 3)
> (list (void))
'(#<void>)
```

---vert---

The `undefined` constant, which prints as `#<undefined>`, is sometimes used as the result of a reference whose value is not yet available. In previous versions of Racket (before version 6.1), referencing a local binding too early produced `#<undefined>`; too-early references now raise an exception, instead.

> The `undefined` result can still be produced in some cases by the `shared` form.

```scheme
(define (fails)
  (define x x)
  x)
```

```scheme
> (fails)
x: undefined;
 cannot use before initialization
```
