// Generated by CoffeeScript 1.8.0
(function() {
  module.exports = function(grunt) {
    var fs, path, slash, _;
    path = require('path');
    fs = require('fs');
    _ = require('lodash');
    slash = require('slash');
    return grunt.registerMultiTask('sitemap', 'sitemap description', function() {
      var changefreq, extension, file, files, homeErrMess, pattern, pkg, priority, root, rootWarnMess, sitemapPath, url, xmlStr, _i, _len;
      pkg = grunt.file.readJSON('package.json');
      url = this.data.homepage || pkg.homepage;
      homeErrMess = 'Requires "homepage" parameter. Sitemap was not created.';
      if (!url) {
        grunt.fail.fatal(homeErrMess, 3);
      }
      root = path.normalize(this.data.siteRoot || '.');
      if (slash(root) !== './') {
        root = slash(root);
      }
      rootWarnMess = 'No "siteRoot" parameter defined. Using current directory.';
      if (root === '.') {
        grunt.log.subhead(rootWarnMess);
      }
      if (url.slice(-1) !== '/' && root.slice(-1) !== '/') {
        url += '/';
      }
      changefreq = this.data.changefreq || 'daily';
      extension = this.data.extension != null ? this.data.extension : true;
      priority = (this.data.priority || 0.5).toString();
      pattern = this.data.pattern || path.join(root, '/**/*.html');
      files = grunt.file.expand(pattern);
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
        urlPath = extension ? rawUrlPath.replace(/(index)\.[A-z]+$/, '', 'i').replace(/\.html/, '/', 'i') : rawUrlPath.replace(/(index)\.[A-z]+$/, '', 'i');
        fileStat.url = url + urlPath;
        mtime = (fs.statSync(file).mtime).getTime();
        fileStat.mtime = new Date(mtime).toISOString();
        return fileStat;
      });
      files = _.compact(files);
      xmlStr = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xmlStr += '<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"';
      xmlStr += ' xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"\n';
      xmlStr += '	xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        xmlStr += '<url>\n';
        xmlStr += "  <loc>" + file.url + "</loc>\n";
        xmlStr += "  <lastmod>" + file.mtime + "</lastmod>\n";
        xmlStr += "  <changefreq>" + changefreq + "</changefreq>\n";
        xmlStr += "  <priority>" + priority + "</priority>\n";
        xmlStr += "</url>\n";
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
