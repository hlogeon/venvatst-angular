import angular from 'angular';
import configRouter from './config.js';
import formsConfig from './forms-config.js';
import analyticsConfig from './analytics-config.js';
import './common/module.js';
import './user/module.js';
import './events/module.js';
import './venues/module.js';

let dependencies = [
  'venvast.common',
  'venvast.user',
  'venvast.events',
  'venvast.venues'
];

angular
  .module('venvast', dependencies)
  .config(configRouter)
  .config(analyticsConfig)
  .config(formsConfig);
