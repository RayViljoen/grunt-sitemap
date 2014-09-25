fs = require 'fs'

{print} = require 'sys'
{spawn} = require 'child_process'
cmd = if process.platform in ['win32'] then 'coffee.cmd' else 'coffee'

build = (callback) ->
  coffee = spawn cmd, ['-c', '-o', 'tasks', 'src']
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  coffee.stdout.on 'data', (data) ->
    print data.toString()
  coffee.on 'exit', (code) ->
    callback?() if code is 0

task 'build', 'Build tasks/ from src/', ->
  build()

task 'watch', 'Watch src/ for changes', ->
  coffee = spawn cmd, ['-w', '-c', '-o', 'tasks', 'src']
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  coffee.stdout.on 'data', (data) ->
    print data.toString()
