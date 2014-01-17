/*
 * grunt-i18next-crawler
 * 
 *
 * Copyright (c) 2014 Thomas Bruun
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('i18next_crawler', 'Crawl templates files, find uses of i18next, and generate keys in your translation files', function () {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

    // Load JSON output file
    var translationFile = this.files[0].dest[0];
    if (!grunt.file.exists(translationFile)) {
      grunt.log.writeln("Translation file doesn't exist – Creating new...");
      grunt.file.write(translationFile, "{}", { encoding: "utf8"});
    }
    var translations = grunt.file.readJSON(translationFile, { encoding: "utf8"});

    // Find all HTML template files
    var rootTemplateDir = this.files[0].src[0];
    var templates = grunt.file.expand({cwd: rootTemplateDir }, '**/*.html');

    templates.forEach(function(templateDir) {
      var fileContent = grunt.file.read(rootTemplateDir + '/' + templateDir, { encoding: "utf8" });
      // fileContent = fileContent.replace(/\r\n/g, "").replace(/[\r\n]/g, "");
      grunt.log.write(fileContent);
      
      var re = /{{ ['|"]([\s\S]*?)["|'] \| i18next }}/g;
      
      var match;
      var templateTranslations = {};
      while ((match = re.exec(fileContent)) !== null) {
        if (!(match[1] in translations)) {
          templateTranslations[match[1]] = "";
        }
      }
      translations[templateDir] = templateTranslations;

      grunt.file.write(translationFile, JSON.stringify(translations, null, "    "), { encoding: "utf8"});
  
    });
  });

};
