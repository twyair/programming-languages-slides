# OCaml

## setup

---

## on windows

---vert---

### install cygwin + ocaml

taken from the [OCaml for Windows project](https://fdopen.github.io/opam-repository-mingw/installation/)

[32bit installer](https://github.com/fdopen/opam-repository-mingw/releases/download/0.0.0.2/OCaml32.exe)

[64bit installer](https://github.com/fdopen/opam-repository-mingw/releases/download/0.0.0.2/OCaml64.exe)

---vert---

### install tools

* click on the OCaml shortcut created on your desktop
* run the following:

```bash
opam install dune utop ocaml-lsp-server ocamlformat
```

---vert---

### the OCaml REPL

in the same terminal run:

```bash
utop
```

and you can start running code!

![utop](../imgs/utop-repl.png)

---

## on ubuntu

---vert---

### install ocaml + opam + tools

```bash
sudo apt install ocaml opam

opam install dune utop ocaml-lsp-server ocamlformat
```

---vert---

### utop

to start the REPL, enter the following in a terminal:

```bash
utop
```

---

## vscode

---vert---

### install vscode

installers are available for Windows, Linux, and MacOS on the [VS Code website](https://code.visualstudio.com/)

there's also a snap package in linux:

```bash
sudo snap install --classic code
```

---vert---

### the OCaml extension

* open vscode
* click on ![img](../imgs/vscode-extensions.png)
* search "OCaml Platform" (by OCaml Labs)

    ![img](../imgs/ocaml-vscode-extension.png)

* install it

---vert---

### running vscode in windows

* go to `C:\OCaml64\home\NAME` where `NAME` is your cygwin username
* create a file named `.bashrc` with the following contents

    ```bash
    alias vscode="/cygdrive/c/Users/USERNAME/AppData/Local/Programs/Microsoft\ VS\ Code/Code.exe &> /dev/null &"
    eval $(opam env)
    ```

* `USERNAME` should be replaced by your windows username with spaces escaped (that is `John Doe` -> `John\ Doe`)

---vert---

now to run vscode:

* start the cygwin terminal
* run the command `vscode`
