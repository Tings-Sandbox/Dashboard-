var gulp        = require('gulp');
var insert      = require('gulp-insert');
var sass        = require('gulp-sass');
var runSequence = require('run-sequence');
var $           = require('gulp-load-plugins')();
var babel       = require('gulp-babel');

var minifyHTML  = require('gulp-minify-html');
var minifyInline= require('gulp-minify-inline');

var browserify  = require('browserify');
var reactify    = require('reactify');
var source      = require('vinyl-source-stream');
var streamify   = require('gulp-streamify');
var watchify    = require('watchify');
var nodemon     = require('gulp-nodemon');



//More seemless Gulp Task Management
var path = {
  HTML: './app/index.html',
  MINIFIED_OUT: 'build.min.js',
  OUT: 'build.js',
  DEST: 'dist',
  DEST_BUILD: 'dist/build',
  DEST_SRC: 'dist/src',
  ENTRY_POINT: './app/main.jsx'
};

//Default Tasks
gulp.task('sass', function () {
    gulp.src('app/css/*.scss')
        .pipe(sass())
        .pipe(gulp.dest("app/css"))
        
    gulp.src('app/css/skins/default/*.scss')
        .pipe(sass())
        .pipe(gulp.dest("app/css/skins/default"))
        
    gulp.src('app/pages/auth/*.scss')
        .pipe(sass())
        .pipe(gulp.dest("app/pages/auth"))
});

gulp.task('insert', function(){
    gulp.src(['app/css/skins/default/color-vars.css'])
        .pipe(insert.append('</style>'))
        .pipe(insert.prepend('<style is=\'custom-style\'>'))
        .pipe(gulp.dest('app/css/skins/default/'));
});

gulp.task('sass-copy', function(){

    var colorVars = gulp.src(['app/css/skins/default/color-vars-body.css'])
        .pipe($.rename('color-vars.css'))
        .pipe(gulp.dest('app/css/skins/default'));

                
    gulp.src(['app/components/pd-dashboard/pd-dashboard.html'])
        .pipe($.rename('pd-dashboard.vulcanized.html'))
        .pipe(gulp.dest('app/components/pd-dashboard'));
        
    return colorVars;
});

gulp.task('vulcanize', function () {
    return gulp.src('app/components/pd-dashboard/pd-dashboard.vulcanized.html')
        .pipe($.vulcanize({
            stripComments: true,
            inlineCss: false,
            inlineScripts: true,
            excludes: [
                'bower_components/polymer/polymer.html'
            ],
            stripExcludes: []
        }))
        .pipe(gulp.dest('app/components/pd-dashboard'));
});

gulp.task('minify-html', function() {
    var opts = {
        conditionals: true,
        spare:true,
        quotes: true,
        empty: true
    };

    return gulp.src('app/components/pd-dashboard/pd-dashboard.vulcanized.html')
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest('app/components/pd-dashboard'));
});

gulp.task('minify-inline', function() {
    gulp.src('app/components/pd-dashboard/pd-dashboard.vulcanized.html')
        .pipe(minifyInline())
        .pipe(gulp.dest('app/components/pd-dashboard'))
});



//*MINE*//


gulp.task('copy', function(){
  gulp.src(path.HTML)
    .pipe(gulp.dest(path.DEST));
});

//Concatenates and Minifies our JS files
//concates all JSX files, renames it then saves it in the dist folder

gulp.task('build', function(){
  browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify]
  })
  .bundle()
  .pipe(source(path.MINIFIED_OUT))
  .pipe(gulp.dest(path.DEST_BUILD))
  console.log('One moment creating minified source build');

  browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify]
  })
  .bundle()
  .pipe(source(path.OUT))
  .pipe(gulp.dest(path.DEST_SRC))
  console.log('One moment creating source build');

});

//Watches for any changes in our JSX files to javascript
gulp.task('watch', function(){
  gulp.watch(path.HTML, ['copy'])

  var watcher = watchify(browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true
  }));

  return watcher.on('update', function(){
    watcher.bundle()
      .pipe(source(path.MINIFIED_OUT))
      .pipe(gulp.dest(path.DEST_BUILD))
      console.log('Updated Minified Source Build');
  })
    .bundle()
    .pipe(source(path.MINIFIED_OUT))
    .pipe(gulp.dest(path.DEST_BUILD))
})

//restarts the server whenever there is any change on server/server.js
gulp.task('nodemon', function(){
  console.log('in nodemon')
  nodemon({
    script: './demo-server/app.js',
    ext: 'js',
    // tasks: [],
    env: {'NODE_ENV': 'development'}
  })
  .on('start', function(){
    console.log('Server Started!!!');
  })
  .on('restart', function(){
    console.log('Server Restarted!!!');
  })
});


gulp.task('default',  function (cb) {
    runSequence(
        ['sass', 'sass-copy'],
        ['insert',
        'vulcanize'],
        'minify-html',
        'minify-inline',
        cb)
});

gulp.task('run', ['copy', 'build','watch', 'nodemon']);
