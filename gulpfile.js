'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var coveralls = require('gulp-coveralls');
var isparta = require('isparta');
var runSequence = require('run-sequence');

// Transform all required files with Babel
process.env.BABEL_ENV = 'cjs';
require('babel-core/register');

var TEST_FILES = 'test/*.spec.js';
var SRC_FILES = 'src/*.js';

gulp.task('test', function () {
    return gulp.src(TEST_FILES, { read: false })
        .pipe(mocha({
            require: [__dirname + '/scripts/jsdom'] // Prepare jsdom environement
        }));
});

gulp.task('coverage:instrument', function () {
    return gulp.src(SRC_FILES)
        .pipe(istanbul({
            instrumenter: isparta.Instrumenter // Use the isparta instrumenter (code coverage for ES6)
            // https://github.com/SBoudrias/gulp-istanbul#istanbulopt
        }))
        .pipe(istanbul.hookRequire()); // Force `require` to return covered files
        // https://github.com/SBoudrias/gulp-istanbul#istanbulhookrequire
});

gulp.task('coverage:report', function () {
    return gulp.src(SRC_FILES, { read: false })
        .pipe(istanbul.writeReports({
            // https://github.com/SBoudrias/gulp-istanbul#istanbulwritereportsopt
        }));
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

gulp.task('test:watch', ['test'], function () {
    gulp.watch([
        TEST_FILES,
        SRC_FILES
    ], ['test']).on('error', gutil.log);
});
