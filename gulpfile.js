// Gulp.js configuration
"use strict";

// options for src and build folders
const dir = {
    src: "./assets/src/",
    build: "./assets/build/",
    root: "./"
  },
  // gulp plugins etc
  gulp = require("gulp"),
  gutil = require("gulp-util"),
  sass = require("gulp-sass"),
  cssnano = require("cssnano"),
  autoprefixer = require("autoprefixer"),
  sourcemaps = require("gulp-sourcemaps"),
  stylish = require("jshint-stylish"),
  uglify = require("gulp-uglify"),
  reload = require("browser-sync").reload(),
  rename = require("gulp-rename"),
  plumber = require("gulp-plumber"),
  babel = require("gulp-babel"),
  postcss = require("gulp-postcss"),
  gulpImport = require("gulp-imports"),
  stripdebug = require("gulp-strip-debug"),
  browserSync = require("browser-sync").create();

// Browser-sync
//var browsersync = false;

// BrowserSync
gulp.task("browserSync", function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});

//- CSS
//config
var css = {
  src: dir.src + "scss/*.scss",
  watch: dir.src + "scss/**/*.scss",
  build: dir.build,
  sassOpts: {
    outputStyle: "expanded",
    precision: 3,
    errLogToConsole: true
  },
  processors: [autoprefixer(), cssnano()]
};

// CSS processing
gulp.task(
  "scss",
  gulp.series(() => {
    return gulp
      .src(css.src)
      .pipe(sourcemaps.init())
      .pipe(sass(css.sassOpts))
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest(css.build));
  })
);

gulp.task(
  "scssProd",
  gulp.series(() => {
    return gulp
      .src(css.src)
      .pipe(sourcemaps.init())
      .pipe(sass(css.sassOpts))
      .pipe(postcss(css.processors))
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest(css.build));
  })
);

//- JS
//config
var js = {
  src: dir.src + "js/*.js",
  watch: dir.src + "js/**/*.js",
  build: dir.build + "./"
};

// Compile JS task
gulp.task(
  "js",
  gulp.series(() => {
    return gulp
      .src(js.src)
      .pipe(sourcemaps.init())
      .pipe(gulpImport())
      .pipe(uglify())
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest(js.build));
  })
);

//- watch tasks
// just watch
gulp.task(
  "watch",
  gulp.parallel(() => {
    gulp.watch(css.watch, gulp.series("scss"));
    gulp.watch(js.watch, gulp.series("js"));
  })
);

// watch and perform browser reload
gulp.task(
  "dev",
  gulp.parallel(() => {
    gulp.watch(css.watch, gulp.series("scss")).on("change", browserSync.reload);
    gulp.watch(js.watch, gulp.series("js")).on("change", browserSync.reload);
  })
);

// render new files and update browser
gulp.task("run", gulp.parallel("browserSync", "scss", "js"));

// build files minified for final dist
gulp.task("prod", gulp.parallel("scssProd", "js"));

// render js and scss
gulp.task("default", gulp.parallel("dev", "run"));
