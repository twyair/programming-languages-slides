# Standard ML

## lists

---

a list is an __immutable__ finite sequence of elements

```sml
[3, 5, 9]: int list
["a", "list"]: str list
["🍏", "🍊", "🍌"]: str list
[]: 'a list
```

---vert---

order matters

```sml
[1, 2, 3] <> [3, 2, 1];
(*val it = true: bool*)
```

and repetitions count

```sml
[3, 3, 3] <> [3];
(*val it = true: bool*)
```

---vert---

elements may have any type

```sml
[(1,"One"),(2,"Two")] : (int*string) list
[[3.1],[],[5.7, ~0.6]]: real list list
```

... but all elements must have the same type

```sml
[5, "five"];
(*stdIn:2.1-2.12 Error: ...*)
```

---vert---

the empty list has a polymorphic type

```sml
[]: 'a list
```

`nil` is a synonym of `[]`

```sml
nil;
(*val it = []: 'a list*)
```

---

### building a list

a list is either *empty* or *a head followed by a tail*

`[1,2,3]` ➭ head: `1` tail: `[2,3]`

---vert---

use the infix operator `::` (aka. `cons`) to build a list

```sml
1 :: [2, 3];
(*val it = [1,2,3]: int list*)

1 :: 2 :: 3 :: [];
(*val it = [1,2,3]: int list*)
```

---vert---

`::` associates to the right, so

`x1 :: x2 :: ... :: xn :: nil`

\=

`(x1 :: (x2 :: (... :: (xn :: nil)...)`

---vert---

`::` is a *constructor* so it can be used in patterns

```sml
fun replace_head (_::t) x = x :: t
  | replace_head [] _ = []
;
```

---

### builtin fundamental functions

---vert---

`null` - tests whether a list is empty

```sml
fun null [] = true
  | null (_::_) = false;
(*val null = fn : ‘a  list -> bool*)
```

---vert---

`hd` - evaluates to the head of a non-empty list

```sml
fun hd (x::_) = x;​
(*Warning: Patterns not exhaustive​
val hd = fn : ‘a  list -> ‘a*)
```

---vert---

`tl` - evaluates to the tail of a non-empty list​

```sml
fun tl (_::xs) = xs;​
(**Warning: Patterns not exhaustive​
val tl = fn : ‘a  list -> ‘a  list*)
```

---vert---

<!-- .slide: data-background-iframe="http://localhost:8888/notebooks/tut4-hd-tl-examples.ipynb" data-background-interactive -->

---

### building a list of integers

```sml
fun range (m, n) =
  if m = n then []
  else m :: (range (m+1, n));
(*val range = fn : int * int -> int list*)

range (2, 5);
(*val it = [2,3,4] : int list*)

infix --;
val op-- = range;

2 -- 5;
(*val it = [2,3,4] : int list*)
```

---

### `take` and `drop`

`$$xs = [x_1, x_2, x_3, \ldots, x_k, x_{k+1}, \ldots, x_n]$$`
`$$take(k, xs) = [x_1, x_2, x_3, \ldots, x_k]$$`
`$$drop(k, xs) = [x_{k+1}, \ldots, x_n]$$`

---vert---

### the computation of `take`

```sml
fun take (0, _)     = []​
  | take (i, x::xs) = x :: take (i-1, xs);

take (3, [9,8,7,6,5,4])​
9 :: take (2, [8,7,6,5,4])​
9 :: (8 :: take (1, [7,6,5,4]))​
9 :: (8 :: (7 :: take (0, [6,5,4])))​
9 :: (8 :: (7 :: []))​
9 :: (8 :: [7])​
9 :: [8,7]​
[9,8,7]
```

---vert---

### the computation of `drop`

```sml
fun drop (0, xs)    = xs​
  | drop (i, _::xs) = drop (i-1, xs);

drop (3, [9,8,7,6,5,4])​
drop (2,   [8,7,6,5,4])​
drop (1,     [7,6,5,4])
drop (0,       [6,5,4])​
[6,5,4]
```

---

### tail recursion

---vert---

normal recursion

```sml
fun take(0, _)     = []​
  | take(i, x::xs) = x::take(i-1, xs);
```

tail recursion

```sml
fun drop (0, xs)    = xs​
  | drop (i, _::xs) = drop (i-1, xs);
```

---vert---

### normal to tail recursive

```sml
fun length []      = 0​
  | length (_::xs) = 1 + length xs;
```

use an **accumulator** to make it iterative

```sml
local​
  fun ilen (n, [])    = n​
    | ilen (n, _::xs) = ilen (n+1, xs)​
in​
  fun length xs = ilen (0, xs)​
end;
```

---

### builtin append operator

`[x1,...,xm] @ [y1,...,yn] = [x1,...,xm,y1,...,yn]`

```sml
infix @;
fun []      @ ys = ys
  | (x::xs) @ ys = x :: (xs @ ys);

["Append", "is"] @ ["never", "boring"];
(*["Append","is","never","boring"] : string list*)
```

* is it tail recursive?
* why can't it be used in patterns?

---

### side note - `orelse` and `andalso`

they are short-circuiting boolean operators

```sml
B1 andalso B2 = if B1 then B2  else false​;

B1 orelse  B2 = if B1 then true else B2;
```

---vert---

```sml
fun even n = (n mod 2 = 0); ​
(*val even = fn : int -> bool​*)​

fun powoftwo n =
  (n=1) orelse​
  (even n andalso powoftwo (n div 2));​
(*val powoftwo = fn : int -> bool*)
```

is `powoftwo` tail-recursive?

---

### builtin function `map`

```sml
fun map f []      = []​
  | map f (x::xs) = (f x) :: (map f xs);​
(*val map = fn:('a -> 'b)-> 'a list -> 'b list*)

val sqlist = map (fn x => x*x);​
(*val sqlist = fn : int list -> int list​*)

sqlist [1,2,3];​
(*val it = [1,4,9] : int list*)
```

---vert---

transposing a matrix using `map`

![transp gif](./../imgs/matrix_transpose.gif)

```sml
fun transp ([]::_) = []​
  | transp rows =​
      (map hd rows) :: transp (map tl rows);
```

---

### builtin function `filter`

```sml
fun filter pred []      = []​
  | filter pred (x::xs) =​
       if pred x then (x:: filter pred xs)​
                 else      filter pred xs;​
(*val filter = fn : ('a -> bool) -> 'a list-> 'a list*)

filter (fn x => x mod 2 = 0) [1,2,3,4,5];
(*val it = [2,4] : int list*)
```

`filter` is bound as `List.filter`

---

### using `map` and `filter`

a polynomial is represented as a list of `$(coeff,degree)$` pairs

`$$5x^3 + 2x + 7$$`

```sml
type polynomial = (int*int) list;
val a = [(5,3), (2,1), (7,0)]: polynomial;
```

---vert---

taking the derivative of a polynomial

```sml
fun derive (p: polynomial): polynomial =
    List.filter
        (fn (coeff, deg) => deg >= 0)
        (map
            (fn (coeff, deg) => (coeff*deg, deg-1))
            p
        )
;
(*val derive = fn : polynomial -> polynomial*)

derive a;
(*val it = [(15,2),(2,0)] : polynomial*)
```

---

### `foldl` and `foldr`

---vert---

### builtin function `foldl`

```sml
fun foldl f init []      = init​
  | foldl f init (x::xs) = foldl f (f (x, init)) xs;​​
(*val foldl = fn : ('a * 'b -> 'b) -> 'b -> 'a list -> 'b*)
```

calculates `$[x_1, x_2, … ,x_n] \rightarrow f(x_n, … ,f(x_2, f(x_1,init)))$`

---vert---

### builtin function `foldr`

```sml
fun foldr f init []      = init​
  | foldr f init (x::xs) = f (x, foldr f init xs);​
(*val foldr = fn : ('a * 'b -> 'b) -> 'b -> 'a list -> 'b*)
```

calculates `$[x_1, x_2, … ,x_n] \rightarrow f(x1, … ,f(xn-1, f(xn,init)))$`

---vert---

### using `foldl` and `foldr`

let's redefine some functions...

```sml
fun sum l = foldl op+ 0 l;​
(*val sum = fn : int list -> int​*)
​
fun reverse l = foldl op:: [] l;​
(*val sum = fn : ’a list -> ’a list​*)

fun xs @ ys = foldr op:: ys xs;​
(*val @ = fn : ’a list * ’a list -> ’a list*)
```

---

### `exists` and `all`

---vert---

### builtin function `exists`

```sml
fun exists p []      = false​
  | exists p (x::xs) = (p x) orelse exists p xs;
(*val exists = fn:('a -> bool)-> 'a list -> bool*)
```

checks if the predicate `p` is satisfied by at least one element of the list

```sml
exists (fn x => x < 0) [1, 2, ~3, 4];
(*val it = true : bool*)
```

bound as `List.exists`

---vert---

### builtin function `all`

```sml
fun all p []      = true​
  | all p (x::xs) = (p x) andalso all p xs;​
(*val forall = fn:('a -> bool) -> 'a list -> bool*)
```

checks if the predicate `p` is satisfied by **all** elements of the list

```sml
all (fn x => x >= 0) [1, 2, ~3, 4];
(*val it = false : bool*)
```

bound as `List.all`

---vert---

```sml
fun disjoint (xs, ys) =​
  all (fn x => all (fn y => x<>y) ys) xs;​
(*val disjoint = fn : ''a list * ''a list -> bool*)
```

---

### equality in polymorphic functions

equality is polymorphic in a restricted sense

* defined for values constructed of integers, strings, booleans, chars, tuples, lists and datatypes​
* not defined for values containing​
  * functions: equality is undecidable (halting problem)​
  * reals, because e.g. nan != nan​
  * elements of abstract types

---vert---

ML has a polymorphic equality type `''a`

```sml
op= : (''a * ''a) -> bool
```

somewhat like an interface in other languages

---

![list functions](./../imgs/list-fns.png)

---

### a list of functions - example

a list of functions is a perfectly legitimate value

```sml
[fn x => 2 * x, fn x => 3 * x];
(*val it = [fn,fn] : (int -> int) list*)

map (fn f => f 3) it;
(*val it = [6,9] : int list*)
```

---

### exam questions

---vert---

<!-- .slide: data-background-iframe="http://localhost:8888/notebooks/tut4-exam-questions.ipynb" data-background-interactive -->

---

### extra questions

---vert---

<!-- .slide: data-background-iframe="http://localhost:8888/notebooks/tut4-extra-questions.ipynb" data-background-interactive -->
