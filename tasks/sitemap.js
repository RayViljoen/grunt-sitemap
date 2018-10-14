/*
 * grunt-sitemap
 * https://github.com/RayViljoen/grunt-sitemap
 *
 * Copyright (c) 2013 Ray Viljoen
 * Licensed under the MIT license.
 */

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

'use strict';

const fs = require('fs');
const path = require('path');

module.exports = function(grunt) {
    grunt.registerMultiTask('sitemap', 'sitemap description', function() {
        // Read `homepage` from package.json
        const pkg = grunt.file.readJSON('package.json');
        let url = this.data.homepage || pkg.homepage;

        // Check if `homepage` property is set
        if (!url) {
            grunt.fail.warn('Requires "homepage" parameter. Sitemap was not created.', 3);
        }

        // Site root dir
        let root = path.normalize(this.data.siteRoot || '.');

        // Replace Windows slashes to unix ones
        const tempRoot = root.replace(/\\/g, '/');

        if (tempRoot !== './') {
            root = tempRoot;
        }

        // Check a `siteRoot` was set
        if (root === '.') {
            grunt.log.subhead('No "siteRoot" parameter defined. Using current directory.');
        }

        // Add trailing slash to url if not there
        if (!url.endsWith('/') && !root.endsWith('/')) {
            url += '/';
        }

        // changereq setting
        const changefreq = this.data.changefreq || 'daily';

        // extension setting
        const extension = this.data.extension ? this.data.extension : { required: true };

        // priority setting; must be a string
        const priority = (this.data.priority || 0.5).toString();

        // File pattern
        const pattern = this.data.pattern || path.join(root, '/**/*.html');

        // Glob root
        let files = grunt.file.expand(pattern);

        // Remove root from path and prepend homepage url
        files = files.map(file => {
            let rawUrlPath;

            // Do not include 404 page
            if (file.match(/404\.html$/i)) {
                return false;
            }

            // Create object with url an mtime
            const fileStat = {};

            // Get path relative to root, but still containing index paths
            if (root === '.') {
                rawUrlPath = file;
            } else {
                rawUrlPath = file.replace(root, '');
            }

            // If the rawUrlPath has a slash in the beginning,
            // remove it since we add it in url
            if (rawUrlPath.startsWith('/')) {
                rawUrlPath = rawUrlPath.replace('/', '');
            }

            // Remove index.html
            rawUrlPath = rawUrlPath.replace(/(index)\.[A-z]+$/, '', 'i');

            const urlPath = (() => {
                switch (false) {
                    case (typeof extension !== 'object') || Boolean(extension.required) || !extension.trailingSlash:
                        // Remove extension with trailing slash
                        return rawUrlPath.replace(/\.html/, '/', 'i');
                    case (typeof extension !== 'object') || Boolean(extension.required) || Boolean(extension.trailingSlash):
                        // Remove extension without trailing slash
                        return rawUrlPath.replace(/(\.html|\/)$/, '', 'i');
                    default:
                        // only return path with extension
                        return rawUrlPath;
                }
            })();

            // Join path with homepage url
            fileStat.url = url + urlPath;

            // Get last modified time
            const mtime = fs.statSync(file).mtime.getTime();

            // Format mtime to ISO (same as +00:00)
            fileStat.mtime = new Date(mtime).toISOString();

            // Return fileStat object
            return fileStat;
        });

        // Remove any falsy values (404.html returns false)
        files = files.filter(Boolean);

        // -----------------------
        // Build xml
        // -----------------------

        let xmlStr = '<?xml version="1.0" encoding="UTF-8"?>\n';

        xmlStr += '<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"';
        xmlStr += ' xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"';
        xmlStr += ' xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        // Create url nodes
        for (const file of files) {
            xmlStr += '  <url>\n';
            xmlStr += `    <loc>${file.url}</loc>\n`;
            xmlStr += `    <lastmod>${file.mtime}</lastmod>\n`;
            xmlStr += `    <changefreq>${changefreq}</changefreq>\n`;
            xmlStr += `    <priority>${priority}</priority>\n`;
            xmlStr += '  </url>\n';
        }

        // Close xml
        xmlStr += '</urlset>';

        // Write sitemap to root
        grunt.file.write(path.join(root, 'sitemap.xml'), xmlStr);

        grunt.log.ok('Sitemap created successfully');

        if (grunt.task.current.errorCount) {
            return false;
        }
        return true;
    });
};
