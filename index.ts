import * as Metalsmith from 'metalsmith';
import * as markdown from 'metalsmith-markdown';
import * as layouts from 'metalsmith-layouts';
import * as permalinks from 'metalsmith-permalinks';
import * as debug from 'metalsmith-debug';
import * as multiLanguage from 'metalsmith-multi-language';
import * as writemetadata from 'metalsmith-writemetadata';
import * as m_express from 'metalsmith-express';
import * as watch from 'metalsmith-watch';
import * as assets from 'metalsmith-assets';

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
    source: './theme/css', // relative to the working directory
    destination: './css' // relative to the build directory
  }))
  //.use(debug())
  .use(m_express())
  .use(
  watch({
    paths: {
      './content/**/*': true,
      './theme/**/*': true
    },
    livereload: true
  })
  )
  .build((err, files) => {
    if (err) { throw err; }
  });
