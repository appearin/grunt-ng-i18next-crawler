# grunt-ng-i18next-crawler

> Crawl templates files, find uses of i18next, and generate keys in your translation files

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. 

<!-- Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-ng-i18next-crawler --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-ng-i18next-crawler');
```
 -->
## The "ng_i18next_crawler" task

### Overview
For now, this grunt plugin is very best-effort, and only support the directive usage of ng-i18next, not the filter.

In your project's Gruntfile, add a section named `ng_i18next_crawler` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  ng_i18next_crawler: {
    options: {
      languages: ['en_US, no_NB'] // Your supported languages
    },
    src: [], // Your template files
    dest: [] // Your translation files
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.languages
Type: `Array`
Default value: `[en_US]`


### Usage Examples


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2014 Thomas Bruun. Licensed under the MIT license.
