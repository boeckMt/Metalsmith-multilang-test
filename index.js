"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Metalsmith = require("metalsmith");
var layouts = require("metalsmith-layouts");
var markdown = require("metalsmith-markdown");
var assets = require("metalsmith-assets");
var sass = require("metalsmith-sass");
var ignore = require("metalsmith-ignore");
var collections = require("metalsmith-collections");
var PATH = require("path");
var beautify = require("metalsmith-beautify");
var languages = ['de', 'en'];
var data = {};
data['de'] = {
    headermenu: {
        Home: "home",
        Impressum: "imprint",
        Kontakt: "contact",
        Datenschutz: "privacy",
        Englisch: "en"
    },
    menu: {
        posts: '/posts'
    }
};
data['en'] = {
    headermenu: {
        home: "home",
        Imprint: "imprint",
        Contact: "contact",
        Privacy: "privacy",
        German: "de"
    },
    menu: {
        posts: '/posts'
    },
};
Metalsmith(__dirname)
    .metadata({
    languages: languages,
    sitedata: data,
    baseurl: 'http://localhost:3000/'
})
    .source('./source/')
    .destination('./dist/')
    .clean(true)
    //.use(changed())
    .use(markdown())
    /**
    * get lang from path if in languages
    */
    .use(function (files, ms, done) {
    var languages = ms.metadata().languages;
    for (var file in files) {
        var path = PATH.parse(file);
        if (path.ext == '.html') {
            var path0 = path.dir.split(/(\\|\/)/)[0];
            //console.log(path0)
            if (languages.includes(path0)) {
                files[file].lang = path0;
            }
            else {
                files[file].lang = 'no lang';
            }
        }
    }
    done();
})
    .use(collections({
    activations: {
        pattern: ['*/myposts/items/**/*.html'],
        sortBy: 'date',
    }
}))
    .use(layouts({
    engine: 'pug',
    default: 'default.pug',
    pattern: '**/*.html',
    directory: __dirname + "/source/theme/templates/"
}))
    .use(beautify({
    "js": false,
    "html": {
        "wrap_line_length": 80
    }
}))
    /*
    .use(writemetadata({
      pattern: ['**'],
      ignorekeys: ['next', 'previous'],
      bufferencoding: 'utf8'
    }))
    */
    .use(sass({
    outputDir: 'css/'
}))
    //exclude theme from build folder
    .use(ignore('theme/**/*'))
    .use(assets({
    source: './static',
    destination: './static' // relative to the build directory
}))
    /*
    .use(
      watch({
        paths: {
          './source/**': true,
          './static/**': true
        },
        livereload: true
      })
    )
    */
    //.use(report('stage 2'))
    .build(function (err, files) {
    if (err) {
        throw err;
    }
});
