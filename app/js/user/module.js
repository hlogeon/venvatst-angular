import angular from 'angular';
import 'moment';
import 'angular-jwt';

import UserService from './services/user.service.js';
import GotLocationEvent from './events/got-location.event.js';
import RegisterEvent from './events/register.event.js';
import LoginEvent from './events/login.event.js';
import LoginController from './controllers/login.controller.js';
import RegisterController from './controllers/register.controller.js';
import LogoutController from './controllers/logout.controller.js';

let userDependencies = [
    'venvast.common',
    'angular-jwt'
];
GotLocationEvent.factory.$inject = ['$rootScope'];
LoginEvent.factory.$inject = ['$rootScope'];
RegisterEvent.factory.$inject = ['$rootScope'];


UserService.factory.$inject = ['$http', '$state', '$rootScope', 'localStorageService', 'GotLocationEvent'];
LoginController.$inject = ['$rootScope', '$state', '$scope', '$q', '$window', 'UserService', 'Notification', 'LoginEvent'];
RegisterController.$inject = ['$rootScope', '$state', '$scope', '$q', '$window', 'UserService', 'Notification', 'RegisterEvent'];
LogoutController.$inject = ['$scope', '$state', '$q', '$window', 'UserService'];

angular.module('venvast.user', userDependencies)
    .controller('LoginController', LoginController)
    .controller('LogoutController', LogoutController)
    .controller('RegisterController', RegisterController)
    .factory('GotLocationEvent', GotLocationEvent.factory)
    .factory('LoginEvent', LoginEvent.factory)
    .factory('RegisterEvent', RegisterEvent.factory)
    .factory('UserService', UserService.factory);


export default 'venvast.user';