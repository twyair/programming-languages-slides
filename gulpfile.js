const yargs = require('yargs')
const gulp = require('gulp')
const connect = require('gulp-connect')

const root = yargs.argv.root || '.'
const port = yargs.argv.port || 8000

gulp.task('reload', () => gulp.src(['*.html', '*.md'])
    .pipe(connect.reload()));

gulp.task('serve', () => {

    const cors = function(req, res, next) {
        res.setHeader("Access-Control-Allow-Private-Network", "true");
        next();
    };

    connect.server({
        root: root,
        port: port,
        host: 'localhost',
        livereload: true,
        middleware: function() {
            return [cors];
        }
    })

    gulp.watch(['./md/*/*.md', 'index.html'], gulp.series('reload'))
})