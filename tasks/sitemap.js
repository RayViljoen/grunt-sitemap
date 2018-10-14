/*
 * grunt-sitemap
 * https://github.com/RayViljoen/grunt-sitemap
 *
 * Copyright (c) 2013 Ray Viljoen
 * Licensed under the MIT license.
 */

/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

module.exports = function(grunt) {
    // Node modules
    const path = require('path');
    const fs = require('fs');
    const _ = require('lodash');
    const slash = require('slash');

    // Please see the grunt documentation for more information regarding task and
    // helper creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md

    // ==========================================================================
    //     TASKS
    // ==========================================================================

    return grunt.registerMultiTask('sitemap', 'sitemap description', function() {

        // Read `homepage` from package.json
        const pkg = grunt.file.readJSON('package.json');
        let url = this.data.homepage || pkg.homepage;

        // Check if `homepage` property is set
        if (!url) { grunt.fail.warn('Requires "homepage" parameter. Sitemap was not created.', 3); }

        // Site root dir
        let root = path.normalize(this.data.siteRoot || '.');

        // Convert the paths to Unix paths
        const tempRoot = slash(root);
        if (tempRoot !== './') { root = tempRoot; }

        // Check a `siteRoot` was set
        if (root === '.') { grunt.log.subhead('No "siteRoot" parameter defined. Using current directory.'); }

        // Add trailing slash to url if not there
        if ((url.slice(-1) !== '/') && (root.slice(-1) !== '/')) { url += '/'; }

        // changereq setting
        const changefreq = this.data.changefreq || 'daily';

        // extension setting
        const extension = (this.data.extension != null) ? this.data.extension : { required: true };

        // priority setting
        // Must be string
        const priority = (this.data.priority || 0.5).toString();

        // File pattern
        const pattern = this.data.pattern || path.join(root, '/**/*.html');

        // Glob root
        let files = grunt.file.expand(pattern);

        // Remove root from path and prepend homepage url
        files = _.map(files, function(file) {

            // Do not include 404 page
            let rawUrlPath;
            if (file.match(/404\.html$/i)) { return false; }

            // Create object with url an mtime
            const fileStat = {};

            // Get path relative to root, but still containing index paths
            if (root === '.') {
              rawUrlPath = file;
            } else {
              rawUrlPath = file.replace(root, '');
        }

            // If the rawUrlPath has a slash in the beginning, remove it
            // since we add it in url
            if (rawUrlPath.indexOf('/') === 0) { rawUrlPath = rawUrlPath.replace('/', ''); }

            // Remove index.html
            rawUrlPath = rawUrlPath.replace(/(index)\.[A-z]+$/, '', 'i');

            const urlPath = (() => { switch (false) {
                case (typeof(extension) !== 'object') || !!extension.required || !extension.trailingSlash:
                    // Remove extension with trailing slash
                    return rawUrlPath.replace(/\.html/, '/', 'i');
                case (typeof(extension) !== 'object') || !!extension.required || !!extension.trailingSlash:
                    // Remove extension without trailing slash
                    return rawUrlPath.replace(/(\.html|\/)$/, '', 'i');
                default:
                    // only return path with extension
                    return rawUrlPath;
            } })();

            // Join path with homepage url
            fileStat.url = url + urlPath;

            // Get last modified time
            const mtime = (fs.statSync(file).mtime).getTime();

            // Format mtime to ISO (same as +00:00)
            fileStat.mtime = new Date(mtime).toISOString();

            // Return fileStat object
            return fileStat;
        });

        // Remove any falsy values (404.html returns false)
        files = _.compact(files);

        // -----------------------
        // Build xml
        // -----------------------

        let xmlStr  = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xmlStr += '<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"';
        xmlStr += ' xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"';
        xmlStr += ' xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        // Create url nodes
        for (let file of Array.from(files)) {
            xmlStr += '  <url>\n';
            xmlStr += `    <loc>${file.url}</loc>\n`;
            xmlStr += `    <lastmod>${file.mtime}</lastmod>\n`;
            xmlStr += `    <changefreq>${changefreq}</changefreq>\n`;
            xmlStr += `    <priority>${priority}</priority>\n`;
            xmlStr += "  </url>\n";
        }

        // Close xml
        xmlStr += '</urlset>';

        // Write sitemap to root
        const sitemapPath = path.join(root, 'sitemap.xml');
        grunt.file.write(sitemapPath, xmlStr);

        grunt.log.ok('Sitemap created successfully');

        // Return true / false
        if (grunt.task.current.errorCount) { return false; } else { return true; }
    });
};
