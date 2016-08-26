
const Q = new WeakMap();
class RegisterController {

    constructor ($scope, $q, $window, service) {
        this.service = service;
        this.window = $window;
        Q.set(this, $q);
        $('body').css({'background-color': '#323232'});
    }
    
    
    goBack() {
        this.window.history.back();
    }
}

export default RegisterController;