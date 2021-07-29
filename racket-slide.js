function thebe_init() {
    thebelab.bootstrap({
        bootstrap: true,
        requestKernel: true,
        outputSelector: '[data-output]',
        kernelOptions: {
            name: "racket",
            kernelName: "racket",
            path: ".",
            serverSettings: {
                "baseUrl": "http://localhost:16789",
                "wsUrl": "ws://localhost:16789"
            }
        },
        selector: "[data-thebe-executable-racket]",
        mathjaxUrl: "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js",
        mathjaxConfig: "TeX-AMS_CHTML-full,Safe",
        codeMirrorConfig: {
            mode: "text/x-scheme",
            theme: "monokai"
        },
        on_output_change: (node) => {
            const code = node.querySelector("code");
            if (code) {
                code.remove();
                const pre = document.createElement("pre");
                pre.innerHTML = code.innerHTML;
                node.querySelector("div.jp-OutputArea-output").appendChild(pre);
            }
            Reveal.layout();
        },
        on_execute: (cm) => {
            cm.display.input.blur();
        }
    });
}

// More info about initialization & config:
// - https://revealjs.com/initialization/
// - https://revealjs.com/config/
Reveal.initialize({
    hash: true,

    // Learn about plugins: https://revealjs.com/plugins/
    plugins: [ RevealMarkdown, RevealHighlight, RevealNotes, RevealMath ],
    keyboard: {
        39: 'next',
        37: 'prev'
    }
}).then(() => {thebe_init();});