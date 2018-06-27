import * as Metalsmith from 'metalsmith';
import * as changed from 'metalsmith-changed';
import * as layouts from 'metalsmith-layouts';
import * as markdown from 'metalsmith-markdown';
import * as permalinks from 'metalsmith-permalinks';
import * as multiLanguage from 'metalsmith-multi-language';
import * as writemetadata from 'metalsmith-writemetadata';
import * as watch from 'metalsmith-watch';
import * as assets from 'metalsmith-assets';
import * as sass from 'metalsmith-sass';
import * as ignore from 'metalsmith-ignore';
import * as collections from 'metalsmith-collections';
import * as localizeCollection from 'metalsmith-localize-collection';
import * as PATH from 'path';
import * as beautify from 'metalsmith-beautify';

import { report } from 'metalsmith-debug-ui'


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
}
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
}
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
  .use((files, ms, done) => {
    var languages = ms.metadata().languages;
    for (let file in files) {
      let path = PATH.parse(file)
      if (path.ext == '.html') {
        let path0 = path.dir.split(/(\\|\/)/)[0];
        //console.log(path0)
        if (languages.includes(path0)) {
          files[file].lang = path0;
        } else {
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
    directory: `${__dirname}/source/theme/templates/`
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
  .use(
    ignore('theme/**/*')
  )
  .use(assets({
    source: './static', // relative to the working directory
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
  .build((err, files) => {
    if (err) { throw err; }
  });
