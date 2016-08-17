var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');

gulp.task('default',['dev'],function() {
     
});

gulp.task('browser-sync', ['nodemon'], function () {
  return browserSync.init(null, {
    proxy: 'http://localhost:3000',
    files: ['public/**/*.*', 'app/**/*.*'],
    browser: 'google chrome',
    notify: false,
    port: 5000,
    reloadDelay:1000
  });
});

gulp.task('nodemon', function () {
  return nodemon({
    script: 'bin/www',
    ignore: ['node_modules','public','app/views/**/*'],
    env: {
      'NODE_ENV': 'development'
    }
  }).on('start',function () {
    console.log('server on start.');
    browserSync.reload();
  });
});


gulp.task('dev',['browser-sync']);


