# Ocaml

## imperative programming

---

### mutable fields

ocaml records are immutable by default but you can declare record fields as mutable

```ocaml
type point = { mutable x_coord: float; mutable y_coord: float }

let point = { x_coord=0.; y_coord=0.};;
```
<!-- .element: data-thebe-executable -->

---vert---

`<-` is used for setting a mutable field

```ocaml
let () = point.x_coord <- 5.;;
point;;
```
<!-- .element: data-thebe-executable -->

---

### ref cells

the builtin `ref` type represents a single mutable cell

```ocaml
type 'a ref = { mutable contents: 'a };;
```

---vert---

use `ref` to create a single mutable cell

```ocaml
let x = ref 4;;
```
<!-- .element: data-thebe-executable -->

implementation:

```ocaml
let ref x = { contents = x };;
```

---vert---

use `:=` to replace the cell's contents

```ocaml
x := 15;;
x;;
```
<!-- .element: data-thebe-executable -->

implementation:

```ocaml
let ( := ) r v = r.contents <- v;;
```

---vert---

use `!` to get the the cell's contents

```ocaml
!x;;
```
<!-- .element: data-thebe-executable -->

implementation:

```ocaml
let ( ! ) r = r.contents;;
```

---

### sequencing with `;`

`;` is used to sequence expressions with side-effects

```ocaml
let swap x y =
    x := !x lxor !y ;
    y := !y lxor !x ;
    x := !y lxor !x;;
```
<!-- .element: data-thebe-executable -->

---vert---

an expression created by `;` evaluates to the value of the last expression

```ocaml
let x = ref 42;;
x := !x * !x; !x
```
<!-- .element: data-thebe-executable -->

---vert---

all non-final expressions should be of type `unit` otherwise you'd get a warning

```ocaml
123; 456;;
```
<!-- .element: data-thebe-executable -->
