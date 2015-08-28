# gulp-require-file [![npm version](https://img.shields.io/npm/v/gulp-require-file.svg)](https://www.npmjs.com/package/gulp-require-file)

## Description
Processes 'require', 'require_directory', and 'require_tree' directives for inclusion of source files similar to [Sprockets](https://github.com/sstephenson/sprockets). Built with inspiration from [gulp-include](https://github.com/wiledal/gulp-include).

## Installation
```
npm install --save-dev gulp-require-file
```

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

## Options
- `globOptions` (optional)

	Options that will be passed through to [glob.sync](https://github.com/isaacs/node-glob). Can be used to customize the matching files to include.

  Example:

  ```javascript
  // Ignore files with ".es6.js" extension
  requireFile({ globOptions: { ignore: '**/*.es6.js' }})
  ```

## Supported Directives

#### The `require` Directive

`require` *path* inserts the contents of the asset source file
specified by *path*. If the file is required multiple times, it will
appear in the bundle only once.

#### The `require_directory` Directive

`require_directory` *path* requires all source files of the same
format in the directory specified by *path*. Files are required in
alphabetical order.

#### The `require_tree` Directive

`require_tree` *path* works like `require_directory`, but operates
recursively to require all files in all subdirectories of the
directory specified by *path*.

## Run Tests
```
cd path/to/gulp-require-file
npm install
npm test
```
