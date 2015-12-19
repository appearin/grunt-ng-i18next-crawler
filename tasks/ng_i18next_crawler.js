/*
 * grunt-ng-i18next-crawler
 * 
 *
 * Copyright (c) 2014 Thomas Bruun
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  var _ = require('underscore');
  var cheerio = require('cheerio');
  var $;

  grunt.registerMultiTask('ng_i18next_crawler', 'Crawl templates files, find uses of ng-i18next, and generate keys in your translation files', function () {
    var fileContent, match, keys, key, templateTranslations, translationPath;
    
    var options = this.options({
      languages: ['en_US'],
      compileDir: '/compiled',
      rawDir: '/raw'
    });
    var translations = {};
    var languages = options.languages;

    // Get or create translations directories
    var translationsDir = this.files[0].dest[0];
    var getCompilePath = generateTranslationDir(translationsDir + options.compileDir);
    var getRawPath = generateTranslationDir(translationsDir + options.rawDir);

    ensureDirectories([translationsDir, getCompilePath(), getRawPath()]);
    
    // Get or create translation files
    options.languages.forEach(function (language) {
      var existingTranslations = getTranslationsForLanguage(getRawPath(language), language);
      translations[language] = getLanguageObject(language);
      translations[language].populate(existingTranslations);
    });

    // Find all HTML template files
    var rootTemplateDir = this.files[0].src[0];
    var templates = grunt.file.expand({cwd: rootTemplateDir }, '**/*.html');
    var fileTranslations = getKeysFromTemplates(rootTemplateDir, templates);
    

    // Associate keys with languages
    languages.forEach(function (language) {
      _.each(fileTranslations, function (fileTranslation, fileName) {
        translations[language].addFile(fileName);
        fileTranslation.forEach(function (key) {
          translations[language].addKey(fileName, key);
        });
        translations[language].updateUnused(fileName, fileTranslation);
      });
    });

    // Write back to JSON translation files
    languages.forEach(function (language) {
      grunt.file.write(getRawPath(language), JSON.stringify(translations[language].getRaw(), null, "    "), { encoding: "utf8"});
      grunt.file.write(getCompilePath(language), JSON.stringify(translations[language].flatten(), null, "    "), { encoding: "utf8"});
    });
  });

  function getLanguageObject(language) {
    var translations = {
      unused: {},
      missing: {},
      translated: {}
    };

    var fixed = {};
    
    function exists(file, key) {
      return (key in translations.unused[file] || key in translations.missing[file] || key in translations.translated[file]);
    }

    function clearEmptyFiles() {
      for (var type in translations) {
        for (var file in translations[type]) {
          if (!Object.keys(translations[type][file]).length) {
            delete translations[type][file];
          } 
        }
      }
    }

    return {
      addFile: function(file) {
        if (!(file in translations.translated)) {
          translations.translated[file] = {};
        }
        if (!(file in translations.missing)) {
          translations.missing[file] = {};
        }
        if (!(file in translations.unused)) {
          translations.unused[file] = {};
        }
      },
      addKey: function(file, key) {
        if (key in translations.missing[file] && !!translations.missing[file][key]) {
          translations.translated[file][key] = translations.missing[file][key];
          delete translations.missing[file][key];
        } else if (key in translations.unused[file] && !!translations.unused[file][key]){
          translations.translated[file][key] = translations.unused[file][key];
          delete translations.unused[file][key];
        } else if (!(key in translations.translated[file])){
            translations.missing[file][key] = "";
        }
      },
      updateUnused: function(file, keysInFile) {
        // Move translated keys to the unused object
        _.each(translations.translated[file], function (key) {
          if (keysInFile.indexOf(key) === -1) {
            translations.unused[file][key] = translations.translated[file][key];
            delete translations.translated[file][key];
          }
        });
        // Delete untranslated keys that are no longer used
        _.each(translations.missing[file], function (key) {
          if (keysInFile.indexOf(key) === -1) {
            delete translations.missing[file][key];
          }
        });
      },
      flatten: function() {
        var flat = {};
        for (var file in translations.translated) {
          for (var key in translations.translated[file]) {
            flat[key] = translations.translated[file][key];
          }
        }
        _.each(fixed, function (key) {
          flat[key] = fixed[key];
        });

        return flat;
      },
      getRaw: function() {
        clearEmptyFiles();
        var raw = translations;
        raw["fixed"] = fixed;
        return raw;
      },
      populate: function(input) {
        for (var type in translations) {
          if (type in input) {
            translations[type] = input[type];
          }
        }
        if ("fixed" in input) {
          fixed = input.fixed;
        }
      }
    };
  } 
  
  function generateTranslationDir(dir) {
    return function (language) {
      return (language ? (dir + '/' + language + '.json') : dir);
    };
  }

  function ensureDirectories(dirs) {
    dirs.forEach(function (dir) {
      if (!grunt.file.isDir(dir)) {
        grunt.verbose.writeln("Directory '" + dir + "' does not exist – Creating...");
        grunt.file.mkdir(dir);
      }
    });
  }

  function getTranslationsForLanguage(path, language) {
    var translations = {
      unused: {},
      missing: {},
      translated: {}
    };
    if (!grunt.file.exists(path)) {
      grunt.verbose.writeln("Translation file for '" + language + "' does not exist – Creating...");
      grunt.file.write(path, translations, { encoding: "utf8"});
    } else {
      translations = grunt.file.readJSON(path, { encoding: "utf8"});
    }
    return translations;
  }

  function getKeysFromTemplates(rootTemplateDir, templates) {
    var $, fileContent, templateTranslations,
        keys = {};

    templates.forEach(function(file) {
      keys[file] = [];
      fileContent = grunt.file.read(rootTemplateDir + '/' + file, { encoding: "utf8" });
      $ = cheerio.load(fileContent, {
        decodeEntities: false
      });
      templateTranslations = {};

      // Find all uses of the attribute, and extract the translation key
      $('[ng-i18next]').map(function(index, element) {

        var elementContent = $(element).html();
        var attributeValue = element.attribs['ng-i18next'];

        var match = attributeValue.match(/(?:\[.*\])?(?:\(.*\))?([\s\S]*)?/); // Fuck me, right?
        var attributeContent = match && match[1];

        var key = (attributeContent || elementContent);
        if (key) {
          key = key.replace(/\n/g, " ").replace(/^\s+|\s+$/g,"").replace(/[ \t]{2,}/g, " ");
          if (key.substr(0,2) === '{{' && key.substr(key.length-2,2) === '}}') {
            return;
          }
          keys[file].push(key);
        }
      });
    });
    return keys;
  }
};
