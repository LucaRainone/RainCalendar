var fs          = require('fs');
var path        = require('path');
var argv        = require('yargs').argv;
var gulp        = require('gulp');
var addsrc      = require('gulp-add-src');
var runSequence = require('run-sequence');

// Load all gulp plugins automatically
// and attach them to the `plugins` object
var plugins = require('gulp-load-plugins')();

// hand made gulp plugin
var definerCutter = require("./gulp-custom/definer-cutter");

var pkg  = require('./package.json');
var dirs = pkg['_config'].directories;

// get all supported target (target-*.js files)
var targets = fs.readdirSync("src/target/").filter(function (el) {
    return el.substring(0, 7) === "target-";
}).map(function (el) {
    return el.substring(7, el.length - 3);
});


// build
function build(targetName) {

    // check if it's a known target
    if (targets.indexOf(targetName) === -1) {
        throw "unknown target " + targetName;
    }

    var targetFile       = 'src/target/target-' + targetName + '.js';
    var domEngine        = targetName === "jquery" ? "jquery" : "jquasi";
    var filenameModifier = targetName === "window" ? "" : "." + targetName;

    var distName          = pkg.name + filenameModifier + ".min.js";
    var requirejsOptimize = require('gulp-requirejs-optimize');


    var paths                     = {
        "domEngine" : "../domEngine/" + domEngine
    };
    paths["target-" + targetName] = "../target/target-" + targetName;

    return gulp.src([dirs.core + "/**/*.js"])
    .pipe(addsrc.append(targetFile))
    .pipe(requirejsOptimize(
        {
            skipModuleInsertion : false,
            optimize            : "none",
            baseUrl             : "src/core",
            paths               : paths
        }
    ))
    .pipe(plugins.concat(distName))
    .pipe(definerCutter())
    .pipe(plugins.uglify(
        {
            compress : {
                drop_console : true
            }
        }
    ))
    .pipe(plugins.header("/*! " + pkg.name + " " + pkg.version + " Copyright " + pkg.author + " " +
                         "| MIT License https://github.com/LucaRainone/RainCalendar/master/LICENSE.txt*/\n"))
    .pipe(gulp.dest('./' + dirs.dist));
}


/* **** TASKS **** */

// accept target as argument
gulp.task('build', function () {
    return build(argv.target);
});

// dynamic creation of build-*target* taskss
targets.map(function (target) {
    gulp.task('build-' + target, function () {
        return build(target);
    });
});

// task for build all targets known
gulp.task('build-all', function (done) {
    var tasks = targets.map(function (el) {
        return 'build-' + el;
    });
    tasks.push(done);
    runSequence.apply(this, tasks);
});



gulp.task('test', function() {
    var jasmine = require('gulp-jasmine');

    return gulp.src('./tests/spec/jasmine.js')

    .pipe(jasmine({verbose:true}));
});

gulp.task('test-coverage', function() {
    var jasmine = require('gulp-jasmine');
    var cover = require('gulp-coverage');


    return gulp.src('./tests/spec/jasmine.js')
    .pipe(cover.instrument({pattern: ['src/core/**/*.js', '!src/core/locale/*.js']}))
    .pipe(jasmine({verbose:true}))
    .pipe(cover.gather())
    .pipe(cover.format( ['lcov','html','json']))
    .pipe(gulp.dest('reports'));
});

gulp.task('increment-version', function(done) {
    var pck = JSON.parse(fs.readFileSync("package.json"));
    var versionParts = pck.version.split(".");
    var newVersion = versionParts[0]+"."+versionParts[1]+"." +(++versionParts[2])
    pck.version = newVersion;
    fs.writeFileSync("package.json", JSON.stringify(pck,null, 2));
    done();

});

// defaault task
gulp.task('default', ['build-all']);

