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
  setUp: function (done) {
    // setup here if necessary
    done();
  },
  filters: function (test) {
    // Test that all occurrences of i18next filters are correctly parsed and inserted into the translation file
    // test.expect(1);

    // var actual = grunt.file.read('tmp/translations.json');
    // var expected = grunt.file.read('test/expected/translations.json');
    // test.equal(actual, expected, 'should parse all ng-i18next filter uses correctly');

    test.done();
  }
};
