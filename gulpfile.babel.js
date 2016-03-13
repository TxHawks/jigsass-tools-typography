import browserSync from 'browser-sync';
import del from 'del';

import fs from 'fs';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

import sassdoc from 'sassdoc';

import runSequence from 'run-sequence';

// postCss plugins
import autoprefixer from 'autoprefixer';
import mdcss from 'mdcss';
import reporter from 'postcss-reporter';
import scssSyntax from 'postcss-scss';
import stylelint from 'stylelint';

import jigsassMdcss from 'mdcss-theme-jigsass';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('sass:lint', () =>
  gulp.src('scss/**/*.scss')
    .pipe($.plumber())
    .pipe($.postcss([
      stylelint(),
      reporter({
        clearMessages: true,
        throwError: true,
      }),
    ],
    { syntax: scssSyntax }))
);

gulp.task('sass:test', () =>
  gulp.src('test/*.js')
    .pipe($.mocha({ reporter: 'spec' }))
);

gulp.task('sass:doc', () => {
  if (genDocs()) {
    runSequence(
      ['sass:lint', 'sass:test'],
      runSassDoc);
  }

  function runSassDoc() {
    return gulp.src('scss/**/*.scss')
      .pipe($.plumber())
      .pipe(sassdoc());
  }

  function genDocs() {
    try {
      fs.accessSync('noSassDocs', fs.F_OK); return false;
    }
    catch (e) { return true; }
  }
});

gulp.task('serve:sassdoc', ['sass:doc'], () => {
  browserSync({
    notify: true,
    port: 9000,
    reloadDelay: 4000,
    server: {
      baseDir: 'sassdoc',
    },
  });

  gulp.watch(['sassdoc/**/*']).on('change', reload);

  gulp.watch(['scss/**/*.scss', 'DOCS.md'], ['sass:doc']);
});

gulp.task('clean', del.bind(null, ['styleguide']));

gulp.task('tdd', ['sass:lint', 'sass:test'], () => {
  gulp.watch('scss/**/*.scss', ['sass:lint', 'sass:test']);
  gulp.watch('test/**/*', ['sass:test']);
});

gulp.task('prepublish', ['sass:lint', 'sass:test']);

gulp.task('build', ['sass:doc']);

gulp.task('default', () => { gulp.start('tdd'); });
