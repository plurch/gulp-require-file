var fs = require('fs'),
    path = require('path'),
    es = require('event-stream'),
    gutil = require('gulp-util'),
    glob = require('glob');

var DIRECTIVE_REGEX = /\s*?\/\/=\s*?require(_tree|_directory)? (.*)/;

var extensions = [];

module.exports = function (params) {
    params = params || {};
    var extensions = [];

    if (params.extensions) {
        extensions = typeof params.extensions === 'string' ? [params.extensions] : params.extensions;
    }

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

function expand(filePath, requiredFiles) {
    debugger;
    requiredFiles = requiredFiles || {};

    if(requiredFiles[filePath]) return ''; // just return if already required

    requiredFiles[filePath] = true;

    var result = '';

    var lines = String(fs.readFileSync(filePath)).split(/\n/);

    lines.forEach(function(line) {
        if(DIRECTIVE_REGEX.test(line)) {
            var dirFiles = getFiles(filePath, line);

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

function getFiles(filePath, line) {
    // support single file, directory, or tree ...
    var res = line.match(DIRECTIVE_REGEX);

    var baseDir = path.dirname(filePath);
    var directivePath = res[2];

    var relPath = directivePath;

    switch(res[1]) {
        case '_directory':
            relPath = path.join(directivePath, '/*');
            break;

        case '_tree':
            relPath = path.join(directivePath, '**/*');
            break;
    }

    return glob.sync(path.join(baseDir, relPath));
}