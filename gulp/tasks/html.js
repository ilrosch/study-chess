import fileInclude from "gulp-file-include";
// import webpHtmlNosvg from "gulp-webp-html-nosvg";
import versionNumber from "gulp-version-number";
import htmlMinify from "gulp-minify-html";
import { htmlValidator } from 'gulp-w3c-html-validator';
import minifyInline from "gulp-minify-inline";
//import pug from "gulp-pug";

export const html = () => {
  return app.gulp
    .src(app.path.src.html)
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: "HTML",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(fileInclude())
    .pipe(app.plugins.replace(/@img\//g, "img/"))
    // .pipe(app.plugins.if(app.isBuild, webpHtmlNosvg()))
    .pipe(app.plugins.if(app.isBuild, htmlMinify({
      collapseWhitespace: true,
    })))
    .pipe(app.plugins.if(app.isBuild, minifyInline()))
    .pipe(
      app.plugins.if(
        app.isBuild,
        versionNumber({
          value: "%DT%",
          append: {
            key: "_v",
            cover: 0,
            to: ["css", "js"],
          },
          output: {
            file: "gulp/version.json",
          },
        })
      )
    )
    .pipe(htmlValidator.analyzer({ ignoreMessages: 'Trailing slash on void elements has no effect and interacts badly with unquoted attribute values.', }))
    .pipe(htmlValidator.reporter())
    .pipe(app.gulp.dest(app.path.build.html))
    .pipe(app.plugins.browsersync.stream())
};
