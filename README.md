# grunt-ng-i18next-crawler

> Crawl templates files, find uses of i18next, and generate keys in your translation files

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

## License
Copyright (c) 2014 Thomas Bruun. Licensed under the MIT license.
