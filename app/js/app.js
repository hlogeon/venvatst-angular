import angular from 'angular';
import 'angular-ui-router';
import configRouter from './config.js';
import './view-one/module.js';
import './view-two/module.js';

let dependencies = [
  'ui.router',
  'myApp.view-one',
  'myApp.view-two'
];

angular
  .module('myApp', dependencies)
  .config(configRouter);
