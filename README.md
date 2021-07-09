# programming languages slides

## requirements

- npm
- nodejs
- jupyter-notebook
- ocaml 4.12
- ocaml-merlin <https://github.com/ocaml/merlin>
- ocaml-jupyter <https://github.com/akabe/ocaml-jupyter>

## install

```bash
git clone --recurse-submodules https://github.com/twyair/programming-languages-slides

npm install

cd reveal.js
npm install

cd ../thebe
npm install
npm run build
```

## build

```bash
npm run generate-slides
```

## run

```bash
npm start
```

and on a different terminal:

```bash
npm run notebook
```

go to <http://localhost:8000/>

## TODO

- [ ] write an OCaml tutorial about:
  - [ ] functors
  - [X] lazy expressions
  - [ ] imperative features
  - [ ] references, mutable data structures
  - [ ] objects and classes (?)
  - [ ] standard library modules (?)
- [X] adapt the SML notebooks to OCaml
- [ ] write the prolog tutorials
- [X] autogenerate the files in slides/
- [ ] find a way to call `Reveal.layout()` whenever a slide changes
- [ ] feature idea for `thebe`: make the kernel execute certain cells on load or when they first appear
