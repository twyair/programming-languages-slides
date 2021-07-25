# Programmer-Defined Datatypes

(the following slides are based on [the Racket Guide](https://docs.racket-lang.org/guide/define-struct.html))

<!-- define-struct.md -->

---

## Simple Structure Types: `struct` <!-- 1 -->

---vert---

the syntax of `struct` is

```scheme
(struct struct-id (field-id ...))

;; example
(struct posn (x y))
```

`struct` binds `struct-id` and a number of identifiers that are built from `struct-id` and the `field-id`s

---vert---

`struct-id` : a __constructor__ function that takes as many arguments as the number of `field-id`s, and returns an instance of the structure type.

```scheme
(posn 1 2)
;; #<posn>
```

---vert---

`struct-id?` : a __predicate__ function that takes a single argument and returns `#t` if it is an instance of the structure type, `#f` otherwise.

```scheme
(posn? 3)
;; #f
(posn? (posn 1 2))
;; #t
```

---vert---

`struct-id-field-id` : for each `field-id`, an __accessor__ that extracts the value of the corresponding field from an instance of the structure type.

```scheme
(posn-x (posn 1 2))
;; 1
(posn-y (posn 1 2))
;; 2
```

---vert---

`struct:struct-id` : a __structure type descriptor__, which is a value that represents the structure type as a first-class value

---

## Copying and Update <!-- 2 -->

---vert---

`struct-copy` clones a structure and optionally updates specified fields in the clone.

```scheme
(struct-copy struct-id struct-expr [field-id expr] ...)
```

* `struct-id`  must be a structure type name
* `struct-expr` must produce an instance of the structure type

---vert---

```scheme
(define p1 (posn 1 2))
(define p2 (struct-copy posn p1 [x 3]))
(list (posn-x p2) (posn-y p2))
;; '(3 2)
(list (posn-x p1) (posn-y p1))
;; '(1 2)
```

---vert---

This process is called a __functional update__, because the result is a structure with updated field values, but the original structure is not modified.

---

## Structure Subtypes <!-- 3 -->

```scheme
(struct struct-id super-id (field-id ...))
```

`super-id` must be a structure type name

```scheme
(struct posn (x y))
(struct 3d-posn posn (z))
```

---vert---

a structure subtype inherits the fields of its supertype

```scheme
(define p (3d-posn 1 2 3))
p
;; #<3d-posn>
(3d-posn-z p)
;; 3
```

---vert---

an instance of a structure subtype can be used with the predicate and accessors of the supertype

```scheme
(posn? p)
;; #t

(posn-x p)
;; 1
```

---vert---

a `3d-posn` has an `x` field, but there is no `3d-posn-x`

```scheme
(3d-posn-x p)
;; 3d-posn-x: undefined;
;;  cannot reference an identifier before its definition
;;   in module: top-level

(posn-x p)
;; 1
```

---

## Opaque versus Transparent Structure Types <!-- 4 -->

---vert---

structure types are _opaque_ by default

```scheme
(struct posn (x y))
```

so an instance prints without the fields' values

```scheme
(posn 1 2)
;; #<posn>
```

---vert---

use `#:transparent` to make a structure type _transparent_

```scheme
(struct posn (x y) #:transparent)
```

```scheme
(posn 1 2)
;; (posn 1 2)
```

---

## Structure Comparisons <!-- 5 -->

`equal?` automatically recurs on the fields of a transparent structure type

```scheme
(struct glass (width height) #:transparent)
(equal? (glass 1 2) (glass 1 2))
;; #t
```

---vert---

but `equal?` defaults to instance identity for opaque structure types

```scheme
(struct lead (width height))
(define slab (lead 1 2))
(equal? slab slab)
;; #t
(equal? slab (lead 1 2))
;; #f
```

---vert---

To support instances comparisons via `equal?` without making the
structure type transparent, you can use the `#:methods` keyword,
`gen:equal+hash`, and implement three methods:

```scheme
(struct lead (width height)
  #:methods
  gen:equal+hash
  [(define (equal-proc a b equal?-recur)
     ; compare a and b
     (and (equal?-recur (lead-width a) (lead-width b))
          (equal?-recur (lead-height a) (lead-height b))))
   (define (hash-proc a hash-recur)
     ; compute primary hash code of a
     (+ (hash-recur (lead-width a))
        (* 3 (hash-recur (lead-height a)))))
   (define (hash2-proc a hash2-recur)
     ; compute secondary hash code of a
     (+ (hash2-recur (lead-width a))
             (hash2-recur (lead-height a))))])
```

```scheme
(equal? (lead 1 2) (lead 1 2))
;; #t
```

---vert---

The first function in the list implements the `equal?` test on two
`lead`s; the third argument to the function is used instead of `equal?`
for recursive equality testing, so that data cycles can be handled
correctly. The other two functions compute primary and secondary hash
codes for use with hash tables:

```scheme
> (define h (make-hash))
> (hash-set! h (lead 1 2) 3)
> (hash-ref h (lead 1 2))
3
> (hash-ref h (lead 2 1))
hash-ref: no value found for key
  key: #<lead>
```

---vert---

The first function provided with `gen:equal+hash` is not required to
recursively compare the fields of the structure. For example, a
structure type representing a set might implement equality by checking
that the members of the set are the same, independent of the order of
elements in the internal representation. Just take care that the hash
functions produce the same value for any two structure types that are
supposed to be equivalent.

---

## Structure Type Generativity <!-- 6 -->

Each time that a `struct` form is evaluated, it generates a structure
type that is distinct from all existing structure types, even if some
other structure type has the same name and fields.

This generativity is useful for enforcing abstractions and implementing
programs such as interpreters, but beware of placing a `struct` form in
positions that are evaluated multiple times.

```scheme
(define (add-bigger-fish lst)
  (struct fish (size) #:transparent) ; new every time
  (cond
   [(null? lst) (list (fish 1))]
   [else (cons (fish (* 2 (fish-size (car lst))))
               lst)]))

(add-bigger-fish null)
;; (list (fish 1))
(add-bigger-fish (add-bigger-fish null))
;; fish-size: contract violation
;;   expected: fish?
;;   given: (fish 1)
```

---vert---

```scheme
(struct fish (size) #:transparent)
(define (add-bigger-fish lst)
  (cond
   [(null? lst) (list (fish 1))]
   [else (cons (fish (* 2 (fish-size (car lst))))
               lst)]))
```

```scheme
(add-bigger-fish (add-bigger-fish null))
;; (list (fish 2) (fish 1))
```

---

## Prefab Structure Types <!-- 7 -->

Although a transparent structure type prints in a way that shows its
content, the printed form of the structure cannot be used in an
expression to get the structure back, unlike the printed form of a
number, string, symbol, or list.

A _prefab_ ("previously fabricated") structure type is a built-in type
that is known to the Racket printer and expression reader. Infinitely
many such types exist, and they are indexed by name, field count,
supertype, and other such details. The printed form of a prefab
structure is similar to a vector, but it starts `#s` instead of just
`#`, and the first element in the printed form is the prefab structure
type's name.

The following examples show instances of the `sprout` prefab structure
type that has one field. The first instance has a field value `'bean`,
and the second has field value `'alfalfa`:

```scheme
> '#s(sprout bean)
'#s(sprout bean)
> '#s(sprout alfalfa)
'#s(sprout alfalfa)
```

Like numbers and strings, prefab structures are "self-quoting," so the
quotes above are optional:

```scheme
> #s(sprout bean)
'#s(sprout bean)
```

When you use the `#:prefab` keyword with `struct`, instead of generating
a new structure type, you obtain bindings that work with the existing
prefab structure type:

```scheme
> (define lunch '#s(sprout bean))
> (struct sprout (kind) #:prefab)
> (sprout? lunch)
#t
> (sprout-kind lunch)
'bean
> (sprout 'garlic)
'#s(sprout garlic)
```

The field name `kind` above does not matter for finding the prefab
structure type; only the name `sprout` and the number of fields matters.
At the same time, the prefab structure type `sprout` with three fields
is a different structure type than the one with a single field:

```scheme
> (sprout? #s(sprout bean #f 17))
#f
> (struct sprout (kind yummy? count) #:prefab) ; redefine
> (sprout? #s(sprout bean #f 17))
#t
> (sprout? lunch)
#f
```

A prefab structure type can have another prefab structure type as its
supertype, it can have mutable fields, and it can have auto fields.
Variations in any of these dimensions correspond to different prefab
structure types, and the printed form of the structure type's name
encodes all of the relevant details.

```scheme
> (struct building (rooms [location #:mutable]) #:prefab)
> (struct house building ([occupied #:auto]) #:prefab
    #:auto-value 'no)
> (house 5 'factory)
'#s((house (1 no) building 2 #(1)) 5 factory no)
```

Every prefab structure type is transparent—but even less abstract than a
transparent type, because instances can be created without any access to
a particular structure-type declaration or existing examples. Overall,
the different options for structure types offer a spectrum of
possibilities from more abstract to more convenient:

* Opaque (the default) : Instances cannot be inspected or forged without
  access to the structure-type declaration. As discussed in the next
  section, constructor guards and properties can be attached to the
  structure type to further protect or to specialize the behavior of its
  instances.

* Transparent : Anyone can inspect or create an instance without access
  to the structure-type declaration, which means that the value printer
  can show the content of an instance. All instance creation passes
  through a constructor guard, however, so that the content of an
  instance can be controlled, and the behavior of instances can be
  specialized through properties. Since the structure type is generated
  by its definition, instances cannot be manufactured simply through the
  name of the structure type, and therefore cannot be generated
  automatically by the expression reader.

* Prefab : Anyone can inspect or create an instance at any time, without
  prior access to a structure-type declaration or an example instance.
  Consequently, the expression reader can manufacture instances
  directly. The instance cannot have a constructor guard or properties.

Since the expression reader can generate prefab instances, they are
useful when convenient serialization is more important than abstraction.
Opaque and transparent structures also can be serialized, however, if
they are defined with `serializable-struct` as described in \[missing\].

---

## More Structure Type Options <!-- 8 -->

The full syntax of `struct` supports many options, both at the
structure-type level and at the level of individual fields:

```scheme
(struct struct-id maybe-super (field ...)
        struct-option ...)

maybe-super =
            | super-id

field       = field-id
            | [field-id field-option ...]
```

A `struct-option` always starts with a keyword:

```scheme
#:mutable
```
Causes all fields of the structure to be mutable, and introduces  for
each `field-id` a _mutator_   `set-struct-id-field-id!`  that sets the
value of the corresponding field in an instance of  the structure type.

```scheme
> (struct dot (x y) #:mutable)
(define d (dot 1 2))

> (dot-x d)
1
> (set-dot-x! d 10)
> (dot-x d)
10
```
The `#:mutable` option can also be used as a `field-option`, in which
case it makes an individual field mutable.

```scheme
> (struct person (name [age #:mutable]))
(define friend (person "Barney" 5))

> (set-person-age! friend 6)
> (set-person-name! friend "Mary")
set-person-name!: undefined;
 cannot reference an identifier before its definition
  in module: top-level
```

```scheme
#:transparent
```
Controls reflective access to structure instances, as discussed in a
previous section, Opaque versus Transparent Structure Types.

```scheme
#:inspector inspector-expr
```
Generalizes `#:transparent` to support more controlled access to
reflective operations.

```scheme
#:prefab
```
Accesses a built-in structure type, as discussed in a previous section,
Prefab Structure Types.

```scheme
#:auto-value auto-expr
```
Specifies a value to be used for all automatic fields in the structure
type, where an automatic field is indicated by the `#:auto` field
option. The constructor procedure does not accept arguments for
automatic fields. Automatic fields are implicitly mutable (via
reflective operations), but mutator functions are bound only if
`#:mutable` is also specified.

```scheme
> (struct posn (x y [z #:auto])
               #:transparent
               #:auto-value 0)
> (posn 1 2)
(posn 1 2 0)
```

```scheme
#:guard guard-expr
```
Specifies a  _constructor guard_ procedure to be called whenever an
instance of the structure type is created. The guard takes as many
arguments as non-automatic fields in the structure type, plus one  more
for the name of the instantiated type (in case a sub-type is
instantiated, in which case it's best to report an error using the
sub-type's name). The guard should return the same number of values  as
given, minus the name argument. The guard can raise an exception  if one
of the given arguments is unacceptable, or it can convert an  argument.

```scheme
> (struct thing (name)
          #:transparent
          #:guard (lambda (name type-name)
                    (cond
                      [(string? name) name]
                      [(symbol? name) (symbol->string name)]
                      [else (error type-name
                                   "bad name: ~e"
                                   name)])))
> (thing "apple")
(thing "apple")
> (thing 'apple)
(thing "apple")
> (thing 1/2)
thing: bad name: 1/2
```
The guard is called even when subtype instances are created. In that
case, only the fields accepted by the constructor are provided to  the
guard (but the subtype's guard gets both the original fields and  fields
added by the subtype).

```scheme
> (struct person thing (age)
          #:transparent
          #:guard (lambda (name age type-name)
                    (if (negative? age)
                        (error type-name "bad age: ~e" age)
                        (values name age))))
> (person "John" 10)
(person "John" 10)
> (person "Mary" -1)
person: bad age: -1
> (person 10 10)
person: bad name: 10
```

```scheme
#:methods interface-expr [body ...]
```

Associates method definitions for the structure type that correspond to
a _generic interface_.  For example, implementing the methods for
`gen:dict` allows instances of a structure type to be used as
dictionaries. Implementing the methods for `gen:custom-write` allows the
customization of how an instance of a structure type is `display`ed.

```scheme
> (struct cake (candles)
          #:methods gen:custom-write
          [(define (write-proc cake port mode)
             (define n (cake-candles cake))
             (show "   ~a   ~n" n #\. port)
             (show " .-~a-. ~n" n #\| port)
             (show " | ~a | ~n" n #\space port)
             (show "---~a---~n" n #\- port))
           (define (show fmt n ch port)
             (fprintf port fmt (make-string n ch)))])
> (display (cake 5))
   .....
 .-|||||-.
 |       |
-----------
```

```scheme
#:property prop-expr val-expr
```

Associates a _property_ and value with the structure type.   For
example, the `prop:procedure` property allows a   structure instance to
be used as a function; the property value   determines how a call is
implemented when using the structure as a   function.

```scheme
> (struct greeter (name)
          #:property prop:procedure
                     (lambda (self other)
                       (string-append
                        "Hi " other
                        ", I'm " (greeter-name self))))
(define joe-greet (greeter "Joe"))

> (greeter-name joe-greet)
"Joe"
> (joe-greet "Mary")
"Hi Mary, I'm Joe"
> (joe-greet "John")
"Hi John, I'm Joe"
```

```scheme
#:super super-expr
```
An alternative to supplying a `super-id` next to `struct-id`. Instead of
the name of a structure type (which is not an expression), `super-expr`
should produce a structure type descriptor value. An advantage of
`#:super` is that structure type descriptors are values, so they can be
passed to procedures.

```scheme
(define (raven-constructor super-type)
  (struct raven ()
          #:super super-type
          #:transparent
          #:property prop:procedure (lambda (self)
                                      'nevermore))
  raven)

> (let ([r ((raven-constructor struct:posn) 1 2)])
    (list r (r)))
(list (raven 1 2) 'nevermore)
> (let ([r ((raven-constructor struct:thing) "apple")])
    (list r (r)))
(list (raven "apple") 'nevermore)
```
