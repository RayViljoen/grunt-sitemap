
# grunt-sitemap
# https://github.com/RayViljoen/grunt-sitemap
# Copyright (c) 2013 Ray Viljoen
# Licensed under the MIT license.

module.exports = (grunt) ->

	# Node modules
	path = require 'path'
	fs = require 'fs'

	# https://github.com/oozcitak/xmlbuilder-js
	xml = require 'xmlbuilder'

	# http://momentjs.com/
	moment = require 'moment'

	# Please see the grunt documentation for more information regarding task and
	# helper creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md

	# ==========================================================================
	# TASKS
	# ==========================================================================

	grunt.registerMultiTask 'sitemap', 'sitemap description', ->
		
		# Homepage from pkg
		url = grunt.config.get('pkg.homepage') or @data.homepage

		# Add trailing slash to url if not there
		url += '/' unless url[-1..] is '/'

		# Site root dir
		root = path.normalize (@data.siteRoot or '.')

		# changereq setting
		changefreq = @data.changefreq or 'daily'

		# priority setting
		# Must be string
		priority = (@data.priority or 0.5).toString()

		# File pattern
		pattern = path.join root, (@data.pattern or '/**/*.html')

		# Check homepage is set
		homeErrMess = 'Requires "homepage" parameter. Sitemap was not created.'
		grunt.fail.warn(homeErrMess, 3) unless url

		# Check a site root was set
		rootWarnMess = 'No "siteRoot" parameter defined. Using current directory.'
		grunt.log.subhead rootWarnMess if root is '.'
		
		# Glob root
		files = grunt.file.expand pattern

		# Remove root from path and prepend homepage url
		files = grunt.utils._.map files, (file) ->

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

			# Format mtime
			fileStat.mtime = moment(mtime).format()

			# Return fileStat object
			fileStat

		# -----------------------
		# 		Build xml
		# -----------------------
		
		# Create xml root
		sitemap = xml.create 'urlset',
				{'version':'1.0', 'encoding':'UTF-8'}

		# Add root schema
		sitemap.attribute 'xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9/'

		# Create url nodes
		for file in files
			urlNode = sitemap.e 'url'
			urlNode.e 'loc', file.url
			urlNode.e 'lastmod', file.mtime
			urlNode.e 'changefreq', changefreq
			urlNode.e 'priority', priority

		# Finalise xml to string
		sitemapStr = sitemap.end
			'pretty': true, 'indent': '  '
			'newline': '\n'

		# Write sitemap to root
		sitemapPath = path.join root, 'sitemap.xml'
		grunt.file.write sitemapPath, sitemapStr


		grunt.log.writeln 'Sitemap created successfully'
		grunt.log.writeln 'OK'

		# Return true / false
		if grunt.task.current.errorCount then no else yes






