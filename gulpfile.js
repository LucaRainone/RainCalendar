var fs   = require('fs');
var path = require('path');
var argv = require('yargs').argv;
var gulp = require('gulp');

// Load all gulp plugins automatically
// and attach them to the `plugins` object
var plugins       = require('gulp-load-plugins')();
var definerCutter = require("./gulp-custom/definer-cutter");

var pkg  = require('./package.json');
var dirs = pkg['_config'].directories;


gulp.task('build', function (done) {
    var asJqueryPlugin    = !!argv.jquery;
    var distName          = pkg.name + (asJqueryPlugin ? ".jquery" : "") + ".min.js";
    var requirejsOptimize = require('gulp-requirejs-optimize');

    return gulp.src([dirs.core+"/**/*.js"])
    .pipe(requirejsOptimize({
                                skipModuleInsertion : false,
                                optimize            : "none",
                                baseUrl             : "src/core",
                                paths               : {
                                    "domEngine" : "../domEngine/" + (asJqueryPlugin ? "jquery" : "jquasi")
                                }
                            }))
    .pipe(plugins.concat(distName))
    .pipe(definerCutter({
                            exportName : pkg.name
                        }))
    .pipe(plugins.uglify({
                             mangle   : {
                                 except : ['jQuery']
                             },
                             compress : {
                                 drop_console : true
                             }
                         }))
    .pipe(plugins.header("/*! " + pkg.name + " " + pkg.version + " Copyright " + pkg.author + " " +
                         "| MIT License https://github.com/LucaRainone/RainCalendar/master/LICENSE.txt*/\n"))
    .pipe(gulp.dest('./' + dirs.dist));
});

gulp.task('default', ['build']);

