gulp = require 'gulp'
gutil = require 'gulp-util'

coffee = require 'gulp-coffee'
concat = require 'gulp-concat'
uglify = require 'gulp-uglify'
#sass = require 'gulp-sass'
refresh = require 'gulp-livereload'
watchify = require('watchify');
browserify = require('browserify');

connect = require 'connect'
serveStatic = require('serve-static');
http = require 'http'
path = require 'path'
lr = require 'tiny-lr'
server = do lr

# Starts the webserver (http://localhost:3000)
gulp.task 'webserver', ->
  port = 3000
  hostname = null # allow to connect from anywhere
  base = path.resolve '.'
  directory = path.resolve 'examples'

  app = connect()
  .use(serveStatic 'examples', {'index': ['examples/index.html', 'examples/index.htm']})
#  .use(connect.directory directory)

  http.createServer(app).listen port, hostname

# Starts the livereload server
gulp.task 'livereload', ->
  server.listen 35729, (err) ->
    console.log err if err?

# Compiles CoffeeScript files into js file
# and reloads the page
gulp.task 'scripts', ->
  gulp.src('src/**/*.coffee')
  .pipe(concat 'scripts.coffee')
  .pipe(do coffee)
  .pipe(gulp.dest 'scripts/js')
  .pipe(refresh server)

# Compiles Sass files into css file
# and reloads the styles
#gulp.task 'styles', ->
#  gulp.src('styles/scss/init.scss')
#  .pipe(sass includePaths: ['styles/scss/includes'])
#  .pipe(concat 'styles.css')
#  .pipe(gulp.dest 'styles/css')
#  .pipe(refresh server)

# Reloads the page
gulp.task 'html', ->
  gulp.src('*.html')
  .pipe(refresh server)

# The default task
gulp.task 'default', ->
  gulp.run 'webserver', 'livereload', 'scripts'

  # Watches files for changes
  gulp.watch 'scripts/coffee/**', ->
    gulp.run 'scripts'

#  gulp.watch 'styles/scss/**', ->
#    gulp.run 'styles'

  gulp.watch '*.html', ->
    gulp.run 'html'
