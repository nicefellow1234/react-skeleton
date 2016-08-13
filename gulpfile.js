"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect'); // Runs a local Dev Server
var open = require('gulp-open'); // Open a URL in a Web Browser
var browserify = require('browserify'); // Bundles JS
var reactify = require('reactify'); // Transforms React JSX to JS
var source = require('vinyl-source-stream'); // Use Conventional text strams with Gulp
var concat = require('gulp-concat'); // Concatenates files
var lint = require('gulp-eslint'); // Lint JS files, including JSX

var config = {
	port: 80,
	devBaseUrl: 'http://react-skeleton.herokuapp.com/',
	paths: {
		html: './src/*.html',
		js: './src/**/*.js',
		images: './src/images/*',
		css : [
			'node_modules/bootstrap/dist/css/bootstrap.min.css',
			'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
		],
		dist: './dist',
		mainJs: './src/main.js'
	}
}

gulp.task('connect', function(){
	connect.server({
		root: ['dist'],
		port: config.port,
		base: config.devBaseUrl,
		livereload: true
	});
});

gulp.task('open', ['connect'], function() {
	gulp.src(__filename)
	.pipe(open({ uri : config.devBaseUrl + ':' + config.port + '/'}))

});

gulp.task('html', function() {
	gulp.src(config.paths.html)
	.pipe(gulp.dest(config.paths.dist))
	.pipe(connect.reload());
});

gulp.task('js', function() {
	browserify(config.paths.mainJs)
	.transform(reactify)
	.bundle()
	.on('error',function() { 
		console.error(console)})
	.pipe(source('bundle.js'))
	.pipe(gulp.dest(config.paths.dist + '/scripts'))
	.pipe(connect.reload());
});


gulp.task('css', function() {
	gulp.src(config.paths.css)
	.pipe(concat('bundle.css'))
	.pipe(gulp.dest(config.paths.dist + '/css'));
});

gulp.task('images', function() {
	gulp.src(config.paths.images)
	.pipe(gulp.dest(config.paths.dist + '/images'))
	.pipe(connect.reload());

	gulp.src('./src/favicon.ico')
	.pipe(gulp.dest(config.paths.dist));

});

gulp.task('lint', function() {
	return gulp
    .src(config.paths.js)
    .pipe(lint({config : 'eslint.config.json'}))
    .pipe(lint.format());
});


gulp.task('watch', function(){
	gulp.watch(config.paths.html, ['html']);
	gulp.watch(config.paths.js, ['js','lint']);
});

gulp.task('default',['html','js','lint','css','images','open','watch']);
