var fs   = require('fs');
var path = require('path');
var argv = require('yargs').argv;
var gulp = require('gulp');
var addsrc = require('gulp-add-src');
// Load all gulp plugins automatically
// and attach them to the `plugins` object
var plugins       = require('gulp-load-plugins')();
var definerCutter = require("./gulp-custom/definer-cutter");

var pkg  = require('./package.json');
var dirs = pkg['_config'].directories;


gulp.task('build', function () {
    var asJqueryPlugin    = !!argv.jquery;
    var distName          = pkg.name + (asJqueryPlugin ? ".jquery" : "") + ".min.js";
    var requirejsOptimize = require('gulp-requirejs-optimize');
    var targetFile = asJqueryPlugin? 'jquery' : 'window';
    return gulp.src([dirs.core+"/**/*.js"])
    .pipe(addsrc.append('src/target/target-'+targetFile+'.js'))
    .pipe(requirejsOptimize({
                                skipModuleInsertion : false,
                                optimize            : "none",
                                baseUrl             : "src/core",
                                paths               : {
                                    "domEngine" : "../domEngine/" + (asJqueryPlugin ? "jquery" : "jquasi"),
                                    "target-jquery" : "../target/target-jquery",
                                    "target-window" : "../target/target-window"
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

