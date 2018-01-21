"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Metalsmith = require("metalsmith");
var markdown = require("metalsmith-markdown");
var layouts = require("metalsmith-layouts");
var permalinks = require("metalsmith-permalinks");
var multiLanguage = require("metalsmith-multi-language");
var writemetadata = require("metalsmith-writemetadata");
var m_express = require("metalsmith-express");
var watch = require("metalsmith-watch");
var assets = require("metalsmith-assets");
var languages = ['de', 'en'];
Metalsmith(__dirname)
    .metadata({
    languages: languages
})
    .use(multiLanguage({
    default: languages[0],
    locales: languages
}))
    .source('./content')
    .destination('./dist')
    .clean(true)
    .use(markdown())
    .use(permalinks({
    pattern: ':locale/:slug'
}))
    .use(layouts({
    engine: 'jade',
    default: 'default.jade',
    pattern: '**/*.html',
    directory: 'theme/templates/'
}))
    .use(writemetadata({
    pattern: ['**/*'],
    ignorekeys: ['next', 'previous'],
    bufferencoding: 'utf8'
}))
    .use(assets({
    source: './theme/css',
    destination: './css' // relative to the build directory
}))
    .use(m_express())
    .use(watch({
    paths: {
        './content/**/*': true,
        './theme/**/*': true
    },
    livereload: true
}))
    .build(function (err, files) {
    if (err) {
        throw err;
    }
});
