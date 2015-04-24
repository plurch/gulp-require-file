# gulp-require-file

## Description
Processes 'require', 'require_directory', and 'require_tree' directives for inclusion of source files similar to [Sprockets](https://github.com/sstephenson/sprockets).

## Installation
> $ npm install --save-dev gulp-require-file

## Usage
```
var gulp        = require('gulp'),
    include     = require('gulp-require-file');

gulp.task("scripts", function() {
    gulp.src('src/js/app.js')
        .pipe( include() )
        .pipe( gulp.dest("dist/js") )
});

gulp.task("default", "scripts");
```