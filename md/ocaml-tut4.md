# OCaml

## lists

---

a list is an __immutable__ finite sequence of elements

```ocaml
[3; 5; 9]: int list
["a"; "list"]: string list
["🍏"; "🍊"; "🍌"]: string list
[]: 'a list
```

---vert---

order matters

```ocaml
[1; 2; 3] <> [3; 2; 1];;
(*- : bool = true*)
```

and repetitions count

```ocaml
[3; 3; 3] <> [3];;
(*- : bool = true*)
```

---vert---

elements may have any type

```ocaml
[(1,"One"); (2,"Two")] : (int*string) list
[[3.1]; []; [5.7; ~0.6]]: real list list
```

... but all elements must have the same type

```ocaml
[5; "five"];;
(*  ^^^^^^
Error: This expression has type string but an expression was expected of type int*)
```

---vert---

the empty list has a polymorphic type

```ocaml
[]: 'a list
```

---

### building a list

a list is either *empty* or *a head followed by a tail*

`[1; 2; 3]` ➭ head: `1` tail: `[2; 3]`

---vert---

use the infix operator `::` (aka. `cons`) to build a list

```ocaml
1 :: [2; 3];;
(*- : int list = [1; 2; 3]*)

1 :: 2 :: 3 :: [];;
(*- : int list = [1; 2; 3]*)
```

---vert---

`::` associates to the right, so

`x1 :: x2 :: ... :: xn :: nil`

\=

`(x1 :: (x2 :: (... :: (xn :: nil)...)`

---vert---

`::` is a *constructor* so it can be used in patterns

```ocaml
let replace_head = function
  | ((_::t), x) -> x :: t
  | ([], _) -> [];;
(*val replace_head : 'a list * 'a -> 'a list = <fun>*)
```

---

### builtin fundamental functions

---vert---

`List.hd` - evaluates to the head of a non-empty list

```ocaml
let hd (x::_) = x;;
(*Warning 8: this pattern-matching is not exhaustive.*)
(*val hd : 'a list -> 'a = <fun>*)
```

---vert---

`List.tl` - evaluates to the tail of a non-empty list

```ocaml
let tl (_::xs) = xs;;
(*Warning 8: this pattern-matching is not exhaustive.*)
(*val tl : 'a list -> 'a list = <fun>*)
```

---vert---

<!-- .slide: data-background-iframe="http://localhost:16789/notebooks/tut4-hd-tl-examples.ipynb" data-background-interactive -->

---

### building a list of integers

```ocaml
let rec range m n = if m = n
    then []
    else m :: (range (m+1) n);;
(*val range : int -> int -> int list = <fun>*)

range 2 5;;
(*- : int list = [2; 3; 4]*)

let (--) = range;;

2 -- 5;;
(*- : int list = [2; 3; 4]*)
```

---

### `take` and `drop`

`$$xs = [x_1, x_2, x_3, \ldots, x_k, x_{k+1}, \ldots, x_n]$$`
`$$take(k, xs) = [x_1, x_2, x_3, \ldots, x_k]$$`
`$$drop(k, xs) = [x_{k+1}, \ldots, x_n]$$`

---vert---

### the computation of `take`

```ocaml
let rec take = function
  | (0, _) -> []
  | (i, x::xs) -> x :: take (i-1, xs);;
(*val take : int * 'a list -> 'a list = <fun>*)

take (3, [9;8;7;6;5;4])
9 :: take (2, [8;7;6;5;4])
9 :: (8 :: take (1, [7;6;5;4]))
9 :: (8 :: (7 :: take (0, [6;5;4])))
9 :: (8 :: (7 :: []))
9 :: (8 :: [7])
9 :: [8;7]
[9;8;7]
```

---vert---

### the computation of `drop`

```ocaml
let rec drop = function
  | (0, xs)    -> xs
  | (i, _::xs) -> drop (i-1, xs);;
(*val drop : int * 'a list -> 'a list = <fun>*)

drop (3, [9;8;7;6;5;4])
drop (2,   [8;7;6;5;4])
drop (1,     [7;6;5;4])
drop (0,       [6;5;4])
[6;5;4]
```

---

### tail recursion

---vert---

normal recursion

```ocaml
let rec take = function
  | (0, _) -> []
  | (i, x::xs) -> x :: take (i-1, xs);;
```

tail recursion

```ocaml
let rec drop = function
  | (0, xs)    -> xs
  | (i, _::xs) -> drop (i-1, xs);;
```

---vert---

### normal to tail recursive

```ocaml
let rec length = function
  | [] -> 0
  | (_::xs) -> 1 + length xs;;
```

use an **accumulator** to make it iterative

```ocaml
let rec ilen = function
  | (n, [])    -> n
  | (n, _::xs) -> ilen (n+1, xs);;

let length xs = ilen (0, xs);;
```

---

### builtin append operator

`[x1;...;xm] @ [y1;...;yn] = [x1;...;xm;y1;...;yn]`

```ocaml
let rec (@) l1 l2 = match (l1, l2) with
  | ([], ys) -> ys
  | (x::xs, ys) -> x::(xs @ ys);;
(*val ( @ ) : 'a list -> 'a list -> 'a list = <fun>*)

["Append"; "is"] @ ["never"; "boring"];;
(*- : string list = ["Append"; "is"; "never"; "boring"]*)
```

* is it tail recursive?
* why can't it be used in patterns?

---

### side note - `||` and `&&`

they are short-circuiting boolean operators

```ocaml
B1 && B2 = if B1 then B2  else false;;

B1 ||  B2 = if B1 then true else B2;;
```

---vert---

```ocaml
let even n = n mod 2 = 0;;
(*val even : int -> bool = <fun>*)

let rec powoftwo n =
  (n = 1) ||
  (even n && powoftwo (n / 2));;
(*val powoftwo : int -> bool = <fun>*)
```

is `powoftwo` tail-recursive?

---

### builtin function `map`

```ocaml
let rec map f = function
  | [] -> []
  | x::xs -> (f x) :: (map f xs)
;;
(*val map : ('a -> 'b) -> 'a list -> 'b list = <fun>*)

let sqlist = map (fun x -> x * x);;
(*val sqlist : int list -> int list = <fun>*)

sqlist [1;2;3];;
(*- : int list = [1; 4; 9]*)
```

---vert---

transposing a matrix using `map`

![transp gif](./../imgs/matrix_transpose.gif)

```ocaml
let rec transp = function
  | []::_ -> []
  | rows -> (map hd rows) :: transp (map tl rows);;
(*val transp : 'a list list -> 'a list list = <fun>*)

transp [[1;2;3];[4;5;6];[7;8;9]];;
(*- : int list list = [[1; 4; 7]; [2; 5; 8]; [3; 6; 9]]*)
```

---

### builtin function `filter`

```ocaml
let rec filter pred = function
  | [] -> []
  | x::xs when (pred x) -> x::(filter pred xs)
  | x::xs -> filter pred xs;;
(*val filter : ('a -> bool) -> 'a list -> 'a list = <fun>*)

filter (fun x -> x mod 2 = 0) [1; 2; 3; 4; 5];;
(*- : int list = [2; 4]*)
```

---

### builtin function `filter_map`

```ocaml
let rec filter_map f = function
  | [] -> []
  | x::xs -> let tail = filter_map f xs in
    match (f x) with
      | None -> tail
      | Some x' -> x'::tail;;
(*val filter_map : ('a -> 'b option) -> 'a list -> 'b list = <fun>*)
```

---vert---

### using `filter_map`

a polynomial is represented as a list of `$(coeff,degree)$` pairs

`$$5x^3 + 2x + 7$$`

```ocaml
type polynomial = (int*int) list;;
let a: polynomial = [(5,3); (2,1); (7,0)];;
```

---vert---

taking the derivative of a polynomial

```ocaml
let aux (coeff, deg) = if deg = 0 then None else Some (coeff*deg, deg-1);;

let derive (p: polynomial): polynomial = filter_map aux p;;
(*val derive : polynomial -> polynomial = <fun>*)

derive a;;
(*- : polynomial = [(15, 2); (2, 0)]*)
```

---

### `fold_left` and `fold_right`

---vert---

### builtin function `fold_left`

```ocaml
let rec fold_left f init = function
  | [] -> init
  | x::xs -> fold_left f (f init x) xs;;
(*val fold_left : ('a -> 'b -> 'a) -> 'a -> 'b list -> 'a = <fun>*)
```

calculates `$[x_1, x_2, … ,x_n] \rightarrow f(x_n, … ,f(x_2, f(x_1,init)))$`

---vert---

### builtin function `fold_right`

```ocaml
let rec fold_right f init = function
  | [] -> init
  | x::xs -> f (fold_right f init xs) x;;
(*val fold_right : ('a -> 'b -> 'a) -> 'a -> 'b list -> 'a = <fun>*)
```

calculates `$[x_1, x_2, … ,x_n] \rightarrow f(x1, … ,f(xn-1, f(xn,init)))$`

---vert---

### using `fold_left` and `fold_right`

let's redefine some functions...

```ocaml
let sum l = List.fold_left (+) 0 l;;
(*val sum : int list -> int = <fun>*)

let reverse l = List.fold_left (fun l x -> x::l) [] l;;
(*val reverse : 'a list -> 'a list = <fun>*)

let (@) xs ys = List.fold_right List.cons xs ys;;
(*val ( @ ) : 'a list -> 'a list -> 'a list = <fun>*)
```

---

### `exists` and `for_all`

---vert---

### builtin function `exists`

```ocaml
let rec exists pred = function
  | [] -> false
  | x::xs -> (pred x) || exists pred xs;;
(*val exists : ('a -> bool) -> 'a list -> bool = <fun>*)
```

checks if the predicate `pred` is satisfied by at least one element of the list

```ocaml
List.exists ((>) 0) [1; 2; -3; 4];;
(*- : bool = true*)
```

---vert---

### builtin function `for_all`

```ocaml
let rec for_all pred = function
  | [] -> true
  | x::xs -> (pred x) && for_all pred xs;;
(*val for_all : ('a -> bool) -> 'a list -> bool = <fun>*)
```

checks if the predicate `pred` is satisfied by **all** elements of the list

```ocaml
List.for_all ((<=) 0) [1; 2; -3; 4];;
(*- : bool = false*)
```

---vert---

```ocaml
let disjoint xs ys =
    List.for_all (fun x -> List.for_all ((<>) x) ys) xs;;
(*val disjoint : 'a list -> 'a list -> bool = <fun>*)
```

---

### polymorphic equality

equality is polymorphic

* defined for all values constructed of ints, floats, strings, bools, chars, tuples, lists and datatypes
* will raise an exception for values containing
  * functions: equality is undecidable (halting problem)

```ocaml
(=);;
(*- : 'a -> 'a -> bool = <fun>*)
```

---

### exam questions

---vert---

<!-- .slide: data-background-iframe="http://localhost:16789/notebooks/tut4-exam-questions.ipynb" data-background-interactive -->

---

### extra questions

---vert---

<!-- .slide: data-background-iframe="http://localhost:16789/notebooks/tut4-extra-questions.ipynb" data-background-interactive -->