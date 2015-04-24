var fs = require('fs'),
    path = require('path'),
    es = require('event-stream'),
    gutil = require('gulp-util'),
    glob = require('glob');

var DIRECTIVE_REGEX = /\s*?\/\/=\s*?require(_tree|_directory)? (.*)/;

module.exports = function (params) {
    function include(file, callback) {
        if (file.isNull()) {
            return callback(null, file);
        }

        if (file.isStream()) {
            throw new gutil.PluginError('gulp-require-file', 'stream not supported');
        }

        if (file.isBuffer()) {
            var newText = expand(file.path);
            file.contents = new Buffer(newText);
        }

        callback(null, file);
    }

    return es.map(include);
};

// Expands a file by recursively processing any require directives that it contains. Returns a string
function expand(filePath, requiredFiles) {
    requiredFiles = requiredFiles || {};

    if(requiredFiles[filePath]) return ''; // just return if already required

    requiredFiles[filePath] = true;

    var result = '';
    var lines = String(fs.readFileSync(filePath)).split(/\n/);

    lines.forEach(function(line) {
        var match = line.match(DIRECTIVE_REGEX);

        if(match) {
            var dirFiles = getFiles(filePath, match);

            dirFiles.forEach(function(dirFile) {
                result = result + expand(dirFile, requiredFiles) + "\n";
            });
        }
        else {
            result = result + line + "\n";
        }
    });

    return result;
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
            relPath = path.extname(directivePath) ? directivePath : directivePath + fileExt;

    }

    return glob.sync(path.join(baseDir, relPath), {nodir: true});
}