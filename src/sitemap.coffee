
# grunt-sitemap
# https://github.com/RayViljoen/grunt-sitemap
# Copyright (c) 2013 Ray Viljoen
# Licensed under the MIT license.

module.exports = (grunt) ->

	# Node modules
	path = require 'path'
	fs = require 'fs'
	_ = require 'lodash'

	# Please see the grunt documentation for more information regarding task and
	# helper creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md

	# ==========================================================================
	# 	TASKS
	# ==========================================================================

	grunt.registerMultiTask 'sitemap', 'sitemap description', ->
		
		# Homepage from pkg
		url = @data.homepage or grunt.config.get('pkg.homepage')

		# Check homepage is set
		homeErrMess = 'Requires "homepage" parameter. Sitemap was not created.'
		grunt.fail.warn(homeErrMess, 3) unless url

		# Add trailing slash to url if not there
		url += '/' unless url[-1..] is '/'

		# Site root dir
		root = path.normalize (@data.siteRoot or '.')

		# Check a site root was set
		rootWarnMess = 'No "siteRoot" parameter defined. Using current directory.'
		grunt.log.subhead rootWarnMess if root is '.'

		# changereq setting
		changefreq = @data.changefreq or 'daily'

		# priority setting
		# Must be string
		priority = (@data.priority or 0.5).toString()

		# File pattern
		pattern = path.join root, (@data.pattern or '/**/*.html')
		
		# Glob root
		files = grunt.file.expand pattern

		# Remove root from path and prepend homepage url
		files = _.map files, (file) ->

			# Do not include 404 page
			return no if file.match /404\.html$/i

			# Create object with url an mtime
			fileStat = {}

			# Get path relative to root, but still containing index paths
			rawUrlPath = file.replace root, ''

			# Remove index.html
			urlPath = rawUrlPath.replace /(index)\.[A-z]+$/, '', 'i'

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
		xmlStr += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

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

		grunt.log.writeln 'Sitemap created successfully'
		grunt.log.writeln 'OK'

		# Return true / false
		if grunt.task.current.errorCount then no else yes

