
const Q = new WeakMap();

class LogoutController {

    constructor ($scope, $q, $window, service) {
        this.service = service;
        this.window = $window;
        this.service.logout();
        this.goBack();
    }

    goBack() {
        this.window.history.back();
    }
}

export default LogoutController;