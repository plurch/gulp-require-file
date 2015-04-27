# gulp-require-file

## Description
Processes 'require', 'require_directory', and 'require_tree' directives for inclusion of source files similar to [Sprockets](https://github.com/sstephenson/sprockets). Built with inspiration from [gulp-include](https://github.com/wiledal/gulp-include).

## Installation
*Not yet published to NPM*
> $ npm install --save-dev gulp-require-file

## Usage
```javascript
var gulp = require('gulp'),
    requireFile = require('gulp-require-file');

gulp.task("scripts", function() {
    return gulp.src('src/js/app.js')
        .pipe( requireFile() )
        .pipe( gulp.dest("dist/js") );
});

gulp.task("default", "scripts");
```