
# VenVast public web app

This project is a VenVast public web app built on top of [AngularJS 1.x](http://angularjs.org/) using the [best practices](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md) and with **ES6**.

The seed contains a sample AngularJS application and is preconfigured to install the Angular
framework and a bunch of development tools for instant web development gratification.

The seed app doesn't do much, just shows how to wire two controllers and views together.

## Features

Please see the [gulpfile](./gulpfile.babel.js) for up to date information on what it supports.

* ES6 out of the box
* Browserify
* Built-in hot-reload preview server with BrowserSync
* Compile Sass with [libsass](http://sass-lang.com/libsass)
* Map compiled JS/CSS to source with source maps
* HTML and CSS minification
* Cache-busting to all JS and CSS files


## Getting Started

- Install dependencies: `npm install`
- Configure your gulpfile to interact with your browser
- Run `npm start` to preview and watch for changes with hot reload
- Run `npm run build` to generate a distributable, production-ready, `build` directory

## Directory Layout for development

```
app/                    --> all compiled files for the application
  assets/               --> static files
    favicon.ico
  js/                   --> js files
    view-one/
      controllers/
        controllers.js    --> controller logic
      services/
        count-store.js    --> service logic
      directives/
        title-example.js  --> directive logic
      modules.js          --> define the module dependencies
    view-two/
      controllers/
        controllers.js    --> controller logic
      modules.js          --> define the module dependencies
    modules.js            --> main application module, load all states for the page.
  scss/                   --> sass files
    section/
      components/         -> styles for components
        _includable_file.scss
      helpers/              -> style helpers
        _includable_file.scss
    variables/
      _colors.scss
      _index.scss
    eve.scss           --> main sass
  templates/            --> html files
    view-one/
      view-one.html
    view-two/
      view-two.html
  index.html            --> the main html template file of the app
```


## Directory Layout  for production

```
build/                  --> all compiled files for the application
  assets/               --> static files
    favicon.ico
  css/                  --> css files
    main.min.css        --> compiled scss
    main.min.css.map    --> source map for scss
    libs.min.css        --> compiled third-party styles
    libs.min.css.map    --> source map for third-party styles
  js/                   --> js files
    app.js              --> minify angular files
    libs.js             --> minify third-party librarys
  templates/            --> html files
    view-one/
      view-one.html     --> minify html
    view-two/
      view-two.html     --> minify html
  index.html            --> the main html template file of the app
```

## Inspired by
- [anuglar-seed-es6](https://github.com/gusgard/angular-seed-es6)
