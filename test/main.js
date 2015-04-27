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

function testByFile(fileName, done) {
  var file = buildTestFile(fileName);

  testRequireFile = requireFile();
  testRequireFile.on("data", function (newFile) {
    expect(newFile).to.exist;
    expect(newFile.contents).to.exist;

    var expectedString = String(fs.readFileSync("test/expected/" + fileName), "utf8");
    expect(String(newFile.contents)).to.equal(expectedString);
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
  })
});