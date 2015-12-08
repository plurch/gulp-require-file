var gulp = require('gulp');
var gutil = require("gulp-util");
var fs = require("fs");
var expect = require('chai').expect;
var requireFile = require('../');

function buildTestFile(fileName) {
  return new gutil.File({
    base: "test/fixtures/",
    path: "test/fixtures/" + fileName,
    contents: fs.readFileSync("test/fixtures/" + fileName)
  });
}

function testByFile(fileName, done, opts) {
  opts = opts || {};
  opts.makeSourceMaps = true;
  var file = buildTestFile(fileName);

  testRequireFile = requireFile(opts);
  testRequireFile.on("data", function (newFile) {
    expect(newFile).to.exist;
    expect(newFile.contents).to.exist;
    expect(newFile.sourceMap).to.exist;

    var expectedString = String(fs.readFileSync("test/expected/" + fileName), "utf8");
    expect(String(newFile.contents)).to.equal(expectedString);
    var expectedMap = String(fs.readFileSync("test/expected/maps/" + fileName.split(".")[0] + ".map"), "utf8");
    expect(JSON.stringify(newFile.sourceMap)).to.equal(expectedMap);
    done();
  });
  testRequireFile.write(file);
}

describe('gulp-require-file', function(){
  describe('requireFile()', function(){
    it("should not require the same file multiple times", function (done) {
      testByFile('app.js', done);
    });

    it("should require a directory of source files", function (done) {
      testByFile('app_directory.js', done);
    });

    it("should require a tree of source files", function (done) {
      testByFile('app_tree.js', done);
    });

    it("should process a nested structure of source files", function (done) {
      testByFile('app_recursive.js', done);
    });

    it("should ignore files based on glob pattern", function (done) {
      testByFile('app_ignore.js', done, {globOptions: {ignore: '**/b.js'}});
    });
  })
});
