import angular from 'angular';
import 'angular-ui-router';
import config from './config.js';
import './view-one/module.js';
import './view-two/module.js';

angular
  .module('myApp', [
    'ui.router',
    'myApp.view-one',
    'myApp.view-two'
  ])
  .config(config);
