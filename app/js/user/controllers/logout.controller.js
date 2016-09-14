
const Q = new WeakMap();

class LogoutController {

    constructor ($scope, $state, $q, $window, service) {
        this.service = service;
        this.window = $window;
        this.state = $state;
        this.service.logout();
        this.goBack();
    }

    goBack() {
        this.state.go('venvast.venues');
    }
}

export default LogoutController;