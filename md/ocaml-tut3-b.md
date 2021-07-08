# OCaml

## modules

---

a module is a collection of bindings

```ocaml
module MyModule = struct
    (*bindings*)
end
```

---vert---

a module can contain any kind of binding

```ocaml
module MyModule = struct
    let answer = 42
    exception Failure of int
    type key = int
end;;
```
<!-- .element: data-thebe-executable -->

---vert---

outside a module refer to a binding from another module by:

```ocaml
MyModule.answer;;
(*- : int = 42*)
```
<!-- .element: data-thebe-executable -->

---vert---

a file `foo.ml` implicitly defines a module `Foo` as if its contents are surrounded by:

```ocaml
module Foo = struct
    (*the contents of foo.ml*)
end
```

---vert---

```ocaml
open MyModule;;
```
<!-- .element: data-thebe-executable -->

* used to get direct access to the bindings of a module
* considered bad style

---

### signatures

a signature is a type for a module

```ocaml
module type SIGNAME = sig
    (*types for bindings*)
end

module ModuleName : SIGNAME = struct
    (*bindings*)
end
```

---vert---

```ocaml
module type MATHLIB = sig
    val pi: float
    val div: float -> float -> float
    exception DivideByZero
end;;

module MathLib: MATHLIB = struct
    let pi = 3.14
    let div x y = x /. y
    exception DivideByZero
end;;
```
<!-- .element: data-thebe-executable -->

---vert---

a module will not type-check unless it matches the signature

```ocaml
module type CONSTANTS = sig
    val pi: float
    val e: float
end;;

module MathConstants: CONSTANTS = struct
    let pi = 3.14
end;;
(*Error: Signature mismatch*)
```
<!-- .element: data-thebe-executable -->

---

### signature matching

```ocaml
module Foo: BAR
```

* every non-abstract type in `BAR` is provided in `Foo` as specified
* every abstract type in `BAR` is provided in `Foo`
* every val binding in `BAR` is provided in `Foo`
  * possibly with a more general and/or less abstract internal type
* every exception in `BAR` is provided in `Foo`
* `Foo` can have more bindings than specified by `BAR`

---

### local `open`

```ocaml
let word, idx = "OCaml", 2;;

String.sub word idx ((String.length word) - idx);;
```
<!-- .element: data-thebe-executable -->

can be rewritten as:

```ocaml
let open String in
sub word idx ((length word) - idx);;
```
<!-- .element: data-thebe-executable -->

---vert---

and there's a more concise syntax

```ocaml
String.(sub word idx ((length word) - idx));;
```
<!-- .element: data-thebe-executable -->

---vert---

the general syntax is:

```ocaml
let open Module in
expr;;
```

or

```ocaml
Module.(expr);;
```

---

### TODO

* nesting modules
