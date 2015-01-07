# grunt-sitemap

> A Grunt plugin for generating sitemaps

[![NPM version](https://badge.fury.io/js/grunt-sitemap.svg)](http://badge.fury.io/js/grunt-sitemap)
[![Dependency Status](https://david-dm.org/RayViljoen/grunt-sitemap.svg)](https://david-dm.org/RayViljoen/grunt-sitemap)
[![devDependency Status](https://david-dm.org/RayViljoen/grunt-sitemap/dev-status.svg)](https://david-dm.org/RayViljoen/grunt-sitemap#info=devDependencies)


## Installation

This plugin requires Grunt `~0.4.5`.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out
the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains
how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as
install and use Grunt plugins. Once you're familiar with that process, you may
install this plugin with this command:

```sh
npm install grunt-sitemap --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with
this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-sitemap');
```


## Configuration

`sitemap` is a multitask, so you can use it similarly to `lint`, `watch` etc...

```js
grunt.initConfig({

    sitemap: {
        dist: {
            pattern: ['**/*.html', '!**/google*.html'], // this will exclude 'google*.html'
            siteRoot: 'public/'
        }
    }

});
```


### Options

#### siteRoot

* Type: `string`
* Default: `./`

Site (public root) directory relative to your Gruntfile.js file.
This is where indexing will begin and your sitemap be saved to.

#### pattern

* Type: `string`
* Default: `/**/*.html`

Pattern to match website files. Excludes `404.html` by default and converts `index.html` to directory path `/`.
See [minimatch](https://github.com/isaacs/minimatch) for more on pattern matching.

#### homepage

* Type: `string`
* Default: `read from package.json`

Site URL including protocol: e.g. `http://www.example.com`
If the `homepage` field is specified in your package.json, it will be used from there.

#### changefreq

* Type: `string`
* Default: `daily`

Set this to override `<changefreq>` in sitemap.

#### priority

* Type: `string`
* Default: `0.5`

Set this to override `<priority>` in sitemap.

#### extension

* Type: `object`
* Default: `{ required: true }`

Eg.

````js
extension: {
  required: false
}
````

and if you need a trailing slash simply add the attribute `trailingSlash: true` Eg.

````javascript
extension: {
  required: false
  trailingSlash: true
}
````

By default the `<loc>` is generated with a path that contains extension. Eg: '.html' or '.htm'.
If you don't want extensions to be included in your sitemap, just add `extension: { required: false }`. This will give you clean URL endings.

## Contributing
We accept pull requests! A special thanks to XhmikosR for keeping things rolling.
