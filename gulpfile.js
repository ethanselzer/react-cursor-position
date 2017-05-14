'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var coveralls = require('gulp-coveralls');
var isparta = require('isparta');
var runSequence = require('run-sequence');

process.env.BABEL_ENV = 'cjs';
require('babel-core/register');

var TEST_FILES = 'test/*.spec.js';
var SRC_FILES = 'src/*.js';

var isWatching = false;
function onError(err) {
    gutil.log(err);
    if (isWatching) {
        this.emit('end');
    } else {
        process.exit(1);
    }
}

gulp.task('test', function () {
    return gulp.src(TEST_FILES, { read: false })
        .pipe(mocha({
            require: [__dirname + '/scripts/jsdom'], // Prepare jsdom environement
            bail: false
        }).on('error', onError));
});

gulp.task('coverage:instrument', function () {
    return gulp.src(SRC_FILES)
        // https://github.com/SBoudrias/gulp-istanbul#istanbulopt
        .pipe(istanbul({
            instrumenter: isparta.Instrumenter
        }))
        // https://github.com/SBoudrias/gulp-istanbul#istanbulhookrequire
        .pipe(istanbul.hookRequire()); // Force `require` to return covered files
});

gulp.task('coverage:report', function () {
    return gulp.src(SRC_FILES, { read: false })
        // https://github.com/SBoudrias/gulp-istanbul#istanbulwritereportsopt
        .pipe(istanbul.writeReports());
});

gulp.task('test:coverage', function (done) {
    runSequence('coverage:instrument', 'test', 'coverage:report', done);
});

gulp.task('coveralls', function() {
    return gulp.src('./coverage/lcov.info')
        .pipe(coveralls());
});

gulp.task('test:coveralls', function (done) {
    runSequence('test:coverage', 'coveralls', done);
});

gulp.task('set:watching', function() {
    isWatching = true;
});

gulp.task('watch:test', function() {
    gulp.watch([TEST_FILES, SRC_FILES], ['test']);
});

gulp.task('test:watch', ['set:watching', 'test', 'watch:test']);
