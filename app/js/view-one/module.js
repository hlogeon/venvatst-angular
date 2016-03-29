import angular from 'angular';
import ViewOneController from './controllers/controller.js';
import CountStore from './services/count-store.js';

angular
  .module('myApp.view-one', [])
  .controller('ViewOneController', ViewOneController)
  .service('CountStore', CountStore);
