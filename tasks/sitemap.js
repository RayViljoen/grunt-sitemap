// Generated by CoffeeScript 1.9.2
(function() {
  module.exports = function(grunt) {
    var _, fs, path, slash;
    path = require('path');
    fs = require('fs');
    _ = require('lodash');
    slash = require('slash');
    return grunt.registerMultiTask('sitemap', 'sitemap description', function() {
      var changefreq, extension, file, files, i, len, pattern, pkg, priority, root, sitemapPath, tempRoot, url, xmlStr;
      pkg = grunt.file.readJSON('package.json');
      url = this.data.homepage || pkg.homepage;
      if (!url) {
        grunt.fail.warn('Requires "homepage" parameter. Sitemap was not created.', 3);
      }
      root = path.normalize(this.data.siteRoot || '.');
      tempRoot = slash(root);
      if (tempRoot !== './') {
        root = tempRoot;
      }
      if (root === '.') {
        grunt.log.subhead('No "siteRoot" parameter defined. Using current directory.');
      }
      if (url.slice(-1) !== '/' && root.slice(-1) !== '/') {
        url += '/';
      }
      changefreq = this.data.changefreq || 'daily';
      extension = this.data.extension != null ? this.data.extension : {
        required: true
      };
      priority = (this.data.priority || 0.5).toString();
      pattern = this.data.pattern || path.join(root, '/**/*.html');
      files = grunt.file.expand({ cwd: root }, pattern);
      files = _.map(files, function(file) {
        var fileStat, mtime, rawUrlPath, urlPath;
        if (file.match(/404\.html$/i)) {
          return false;
        }
        fileStat = {};
        if (root === '.') {
          rawUrlPath = file;
        } else {
          rawUrlPath = file.replace(root, '');
        }
        if (rawUrlPath.indexOf('/') === 0) {
          rawUrlPath = rawUrlPath.replace('/', '');
        }
        rawUrlPath = rawUrlPath.replace(/(index)\.[A-z]+$/, '', 'i');
        urlPath = (function() {
          switch (false) {
            case !(typeof extension === 'object' && !extension.required && extension.trailingSlash):
              return rawUrlPath.replace(/\.html/, '/', 'i');
            case !(typeof extension === 'object' && !extension.required && !extension.trailingSlash):
              return rawUrlPath.replace(/(\.html|\/)$/, '', 'i');
            default:
              return rawUrlPath;
          }
        })();
        fileStat.url = url + urlPath;
        mtime = (fs.statSync(file).mtime).getTime();
        fileStat.mtime = new Date(mtime).toISOString();
        return fileStat;
      });
      files = _.compact(files);
      xmlStr = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xmlStr += '<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"';
      xmlStr += ' xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"';
      xmlStr += ' xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      for (i = 0, len = files.length; i < len; i++) {
        file = files[i];
        xmlStr += '  <url>\n';
        xmlStr += "    <loc>" + file.url + "</loc>\n";
        xmlStr += "    <lastmod>" + file.mtime + "</lastmod>\n";
        xmlStr += "    <changefreq>" + changefreq + "</changefreq>\n";
        xmlStr += "    <priority>" + priority + "</priority>\n";
        xmlStr += "  </url>\n";
      }
      xmlStr += '</urlset>';
      sitemapPath = path.join(root, 'sitemap.xml');
      grunt.file.write(sitemapPath, xmlStr);
      grunt.log.ok('Sitemap created successfully');
      if (grunt.task.current.errorCount) {
        return false;
      } else {
        return true;
      }
    });
  };

}).call(this);
