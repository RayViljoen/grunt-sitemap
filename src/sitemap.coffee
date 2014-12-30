# grunt-sitemap
# https://github.com/RayViljoen/grunt-sitemap
# Copyright (c) 2013 Ray Viljoen
# Licensed under the MIT license.

module.exports = (grunt) ->
	# Node modules
	path = require 'path'
	fs = require 'fs'
	_ = require 'lodash'
	slash = require 'slash'

	# Please see the grunt documentation for more information regarding task and
	# helper creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md

	# ==========================================================================
	# 	TASKS
	# ==========================================================================

	grunt.registerMultiTask 'sitemap', 'sitemap description', ->

		# Homepage from pkg
		pkg = grunt.file.readJSON('package.json');
		url = @data.homepage or pkg.homepage

		# Check homepage is set
		homeErrMess = 'Requires "homepage" parameter. Sitemap was not created.'
		grunt.fail.fatal(homeErrMess, 3) unless url

		# Site root dir
		root = path.normalize(@data.siteRoot or '.')

		# Convert the paths to Unix paths
		root = slash(root) unless slash(root) is './'

		# Check a site root was set
		rootWarnMess = 'No "siteRoot" parameter defined. Using current directory.'
		grunt.log.subhead rootWarnMess if root is '.'

		# Add trailing slash to url if not there
		if url[-1..] isnt '/' and root.slice(-1) isnt '/' then url += '/'

		# changereq setting
		changefreq = @data.changefreq or 'daily'

		# extension setting
		extension = if @data.extension? then @data.extension else true

		# priority setting
		# Must be string
		priority = (@data.priority or 0.5).toString()

		# File pattern
		pattern = this.data.pattern or path.join root, '/**/*.html'

		# Glob root
		files = grunt.file.expand pattern

		# Remove root from path and prepend homepage url
		files = _.map files, (file) ->

			# Do not include 404 page
			return no if file.match /404\.html$/i

			# Create object with url an mtime
			fileStat = {}

			# Get path relative to root, but still containing index paths
			if root is '.'
			  rawUrlPath = file
			else
			  rawUrlPath = file.replace root, ''

			# If the rawUrlPath has a slash in the beginning, remove it
			# since we add it in url
			if rawUrlPath.indexOf('/') is 0 then rawUrlPath = rawUrlPath.replace '/', ''

			urlPath = if extension
				# Remove extension
				rawUrlPath
					.replace /(index)\.[A-z]+$/, '', 'i'
					.replace /\.html/, '/', 'i'
			else
				# Remove index.html
				rawUrlPath.replace /(index)\.[A-z]+$/, '', 'i'

			# Join path with homepage url
			fileStat.url = url + urlPath

			# Get last modified time
			mtime = (fs.statSync(file).mtime).getTime()

			# Format mtime to ISO (same as +00:00)
			fileStat.mtime = new Date(mtime).toISOString()

			# Return fileStat object
			fileStat

		# Remove any falsy values (404.html returns false)
		files = _.compact files

		# -----------------------
		# 		Build xml
		# -----------------------

		xmlStr  = '<?xml version="1.0" encoding="UTF-8"?>\n'
		xmlStr += '<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'
		xmlStr += ' xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"\n'
		xmlStr += '	xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

		# Create url nodes
		for file in files
			xmlStr += '<url>\n'
			xmlStr += "  <loc>#{file.url}</loc>\n"
			xmlStr += "  <lastmod>#{file.mtime}</lastmod>\n"
			xmlStr += "  <changefreq>#{changefreq}</changefreq>\n"
			xmlStr += "  <priority>#{priority}</priority>\n"
			xmlStr += "</url>\n"

		# Close xml
		xmlStr += '</urlset>'

		# Write sitemap to root
		sitemapPath = path.join root, 'sitemap.xml'
		grunt.file.write sitemapPath, xmlStr

		grunt.log.ok 'Sitemap created successfully'

		# Return true / false
		if grunt.task.current.errorCount then no else yes
