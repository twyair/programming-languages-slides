var fs = require('fs');
var path = require('path');
var Handlebars = require("handlebars");

function buildHtml(output_dir, renderTemplate, name) {
    console.log("generating slide for ", name);
    var html = renderTemplate({tutorial_name: name});
    fs.writeFile(`${output_dir}/${name}.html`, html, err => {
        if (err) console.log(err);
        console.log("File written succesfully");
    });
}

const output_dir = path.join(__dirname, "./slides");
const md_dir = path.join(__dirname, "./md");


function generate_slides(template_name, prefix) {
    fs.readdir(md_dir, (err, files) => {
        if (err) {
            console.error("Could not list the directory.", err);
            process.exit(1);
        }

        var template = fs.readFileSync(path.resolve(path.join(__dirname, template_name)), "utf-8");
        var renderTemplate = Handlebars.compile(template);

        files.forEach((file, _index) => {
            if (file.endsWith(".md") && file.startsWith(prefix)) {
                buildHtml(output_dir, renderTemplate, file.substring(0, file.length - 3));
            }
        });
    });
}

generate_slides('ocaml-slide-template.hbs', 'ocaml-');
generate_slides('prolog-slide-template.hbs', 'prolog-');
generate_slides('racket-slide.hbs', 'racket-');