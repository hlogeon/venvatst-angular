import angular from 'angular';
import 'moment';

import UserService from './services/user.service.js';
import GotLocationEvent from './events/got-location.event.js';
import LoginController from './controllers/login.controller.js';
import RegisterController from './controllers/register.controller.js';
import LogoutController from './controllers/logout.controller.js';

let userDependencies = [
    'venvast.common'
];

UserService.factory.$inject = ['$http', '$rootScope', 'localStorageService', 'GotLocationEvent'];
LoginController.$inject = ['$scope', '$q', '$window', 'UserService'];
LogoutController.$inject = ['$scope', '$q', '$window', 'UserService'];
RegisterController.$inject = ['$scope', '$q', '$window', 'UserService'];

angular.module('venvast.user', userDependencies)
    .controller('LoginController', LoginController)
    .controller('LogoutController', LogoutController)
    .controller('RegisterController', RegisterController)
    .factory('GotLocationEvent', GotLocationEvent.factory)
    .factory('UserService', UserService.factory);


export default 'venvast.user';