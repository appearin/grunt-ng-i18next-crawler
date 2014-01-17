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
    var fileContent, match, key, templateTranslations;
    var filterRegex = /{{ ['|"]([\s\S]*?)["|'] \| i18next }}/g;
    var directiveRegex = /ng-i18next="(?:\[\w\])?([\s\S]*?)"/g;

    // Get or create translation file
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
      fileContent = grunt.file.read(rootTemplateDir + '/' + templateDir, { encoding: "utf8" });
    
      templateTranslations = {
        filter: {},
        directive: {}
      };

      // Search for filter uses
      while ((match = filterRegex.exec(fileContent)) !== null) {
        // Remove newlines and more than 1 spaces in a row.
        key = match[1].replace(/\n/g, " ").replace(/[ \t]{2,}/g, " ");

        // Leave existing keys be!
        if (!(key in translations)) {
          templateTranslations.filter[key] = "";
        }
      }

      // Search for directive uses
      while ((match = directiveRegex.exec(fileContent)) !== null) {
        // Remove newlines and more than 1 spaces in a row.
        key = match[1];//.replace(/\n/g, " ").replace(/[ \t]{2,}/g, " ");
        grunt.log.writeln(key);
        // Leave existing keys be!
        if (!(key in translations)) {
          templateTranslations.directive[key] = "";
        }
      }

      translations[templateDir] = templateTranslations;
  
    });

    /*
      TODO

      1. Parse list of languages, and get/create translation file for each one
      2. Split into "existing" and "new" in order for translators to be able to see what needs translating.
      3. Find outdated translations and move to "unused" key
      
    */

    // Write back to JSON translation file
    grunt.file.write(translationFile, JSON.stringify(translations, null, "    "), { encoding: "utf8"});
  });

};
