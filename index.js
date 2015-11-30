var fs = require('fs'),
    path = require('path'),
    es = require('event-stream'),
    gutil = require('gulp-util'),
    glob = require('glob'),
    applySourceMap = require('vinyl-sourcemaps-apply'),
    lineConcat = require('./lib/line_concat');

var DIRECTIVE_REGEX = /\s*?\/\/=\s*?require(_tree|_directory)? (.*)/;
var globOptions;

module.exports = function (options) {
    function include(file, callback) {
        options = options || {};
        if (file.sourceMap) {
            options.makeSourceMaps = true;
        }

        if (file.isNull()) {
            return callback(null, file);
        }

        if (file.isStream()) {
            throw new gutil.PluginError('gulp-require-file', 'stream not supported');
        }

        if (file.isBuffer()) {
            globOptions = options.globOptions || {};
            globOptions.nodir = true;
            this.lineConcat = new lineConcat(true, file.path, '\n');
            expand(file.path, null, options);
            file.contents = this.lineConcat.content;
            if (options.makeSourceMaps) {
              file.sourceMap = this.lineConcat.sourceMap;
            }
        }

        if (options.makeSourceMaps) {
            applySourceMap(file, file.sourceMap);
        }

        callback(null, file);
    }

    return es.map(include);
};

// Expands a file by recursively processing any require directives that it contains. Returns a string
function expand(filePath, requiredFiles) {
    requiredFiles = requiredFiles || {};

    if(requiredFiles[filePath]) {
        this.lineConcat.add(filePath, '', null, 0);
        return;
    } // just return if already required

    requiredFiles[filePath] = true;

    var lines = String(fs.readFileSync(filePath)).split(/\n/);

    lines.forEach(function(line, index) {
        var match = line.match(DIRECTIVE_REGEX);

        if(match) {
            var dirFiles = getFiles(filePath, match);

            dirFiles.forEach(function(dirFile) {
                expand(dirFile, requiredFiles);
            });
        }
        else {
            this.lineConcat.add(filePath, line, null, index);
        }
    });
    this.lineConcat.add(filePath, '', null, lines.length);
}

// Returns an array of absolute file paths matching the directive
function getFiles(filePath, match) {
    var baseDir = path.dirname(filePath);
    var fileExt = path.extname(filePath);
    var directiveType = match[1];
    var directivePath = match[2];
    var relPath;

    switch(directiveType) {
        case '_directory':
            relPath = path.join(directivePath, '/*' + fileExt);
            break;

        case '_tree':
            relPath = path.join(directivePath, '**/*' + fileExt);
            break;

        default:
            // Add extension of containing file if not already there
            relPath = path.extname(directivePath) == fileExt ? directivePath : directivePath + fileExt;

    }

    return glob.sync(path.join(baseDir, relPath), globOptions);
}
