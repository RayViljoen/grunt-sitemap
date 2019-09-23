# grunt-sitemap

> A Grunt plugin for generating sitemaps

[![NPM version](https://img.shields.io/npm/v/grunt-sitemap.svg)](https://www.npmjs.com/package/grunt-sitemap)
[![Build Status](https://img.shields.io/travis/com/RayViljoen/grunt-sitemap/master.svg)](https://travis-ci.com/RayViljoen/grunt-sitemap)
[![Dependency Status](https://img.shields.io/david/RayViljoen/grunt-sitemap.svg)](https://david-dm.org/RayViljoen/grunt-sitemap)
[![devDependencies Status](https://img.shields.io/david/dev/RayViljoen/grunt-sitemap.svg)](https://david-dm.org/RayViljoen/grunt-sitemap?type=dev)

## Installation

This plugin requires Grunt `>=0.4.0`.

If you haven't used [Grunt](https://gruntjs.com/) before, be sure to check out
the [Getting Started](https://gruntjs.com/getting-started) guide, as it explains
how to create a [Gruntfile](https://gruntjs.com/sample-gruntfile) as well as
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

#### filename

* Type: `string`
* Default: `sitemap`

Set this to override the name of the output file, which is usually `sitemap.xml`.

#### extension

* Type: `object`
* Default: `{ required: true }`

E.g.

```js
extension: {
  required: false
}
```

If you need a trailing slash just set the attribute `trailingSlash: true`. E.g.

```js
extension: {
  required: false,
  trailingSlash: true
}
```

By default the `<loc>` tag is generated for paths that contain file extensions.
E.g.: `.html` or `.htm`. If you don't want URLs with file extensions to be included
in your sitemap, just add the attribute `extension: { required: false }`.
This will output URLs without file extensions.

## Contributing

We accept pull requests! A special thanks to XhmikosR for keeping things rolling.
