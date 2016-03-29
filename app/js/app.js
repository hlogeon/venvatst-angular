import angular from 'angular';
import 'angular-ui-router';
import './view-one/module.js';
import './view-two/module.js';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ui.router',
  'myApp.view-one',
  'myApp.view-two'
]).
config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('view-one', {
      url: '/view-one',
      templateUrl: 'templates/view-one/view-one.html',
      controller: 'ViewOneController as ViewOneCtrl'
    })
    .state('view-two', {
      url: '/view-two',
      templateUrl: 'templates/view-two/view-two.html',
      controller: 'ViewTwoController as ViewTwoCtrl'
    });
  $urlRouterProvider.otherwise('view-one');
}]);
