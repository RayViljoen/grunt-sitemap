grunt-sitemap
=============

**Grunt plugin for generating sitemaps.**


## Installation

Install npm package, next to your project's `grunt.js` file:

    npm install grunt-sitemap

Add this line to your project's `grunt.js`:

    grunt.loadNpmTasks('grunt-sitemap');


## Configuration

`sitemap` is a multitask, so you can use it similarly to `lint`, `watch` etc...


	grunt.initConfig({
	
	    sitemap: {
	      dist: {
	      	siteRoot: 'public/'
	      }
	    }
	
	});

### Options


* **siteRoot**: `String` *(`./` by default)*

	Site (public root) directory relative to your grunt.js file.
	This is where indexing will begin and your sitemap be saved to.

* **homepage**: `String` *(pulled from package.json by default)*
	
	Site URL including protocol: e.g. `http://www.example.com`
	If the `homepage` field is specified in your package.json it will be used from there.

* **changefreq**: `String` *(`daily` by default)*

	Set this to override `<changefreq>` in the site map. Defaults to `daily`.

* **priority**: `String` *(`0.5` by default)*

	Set this to override `<priority>` in the site map. Defaults to `0.5`.