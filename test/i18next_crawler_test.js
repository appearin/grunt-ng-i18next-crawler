'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.ng_i18next_crawler = {
  test: function (test) {
    var actual = grunt.file.readJSON('tmp/translations/raw/nb-NO.json');
    var expected = grunt.file.readJSON('test/expected/raw/nb-NO.json');

    test.deepEqual(actual.unused, {}, "there should not be any unused keys");
    test.deepEqual(actual.translated, {}, "there should not be any translated keys");
    test.deepEqual(actual.fixed, {}, "there should not be any fixed keys");

    test.deepEqual(actual.missing['root.html'], expected.missing['root.html'], "should parse templates in the template root folder");
    test.deepEqual(actual.missing['subfolder/subfile.html'], expected.missing['subfolder/subfile.html'], "should parse templates in a subfolder");
    test.deepEqual(actual.missing['subfolder/subsubfolder/subsubfile.html'], expected.missing['subfolder/subsubfolder/subsubfile.html'], "should parse templates in an even deeper folder");

    test.done();
  }
};
