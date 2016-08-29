
const Q = new WeakMap();
class LoginController {

    constructor ($scope, $q, $window, service) {
        this.service = service;
        this.window = $window;
        Q.set(this, $q);
        $('body').css({'background-color': '#323232'});
        if(this.service.user !== null && this.service.authenticated === true) {
            this.goBack();
        }
        this.initModel();
    }
    
    initModel () {
        this.model = {
            email: '',
            password: ''
        };
    }
    
    
    goBack() {
        this.window.history.back();
    }

    submit () {
        let context = this;
        context.errors = [];
        $('.form-group', '.login-form').removeClass('has-error');
        Q.get(this).when(this.service.login(this.model)).then(function (response) {
            if(typeof response.errors !== "undefined") {
                context.errors = response.errors;
                $('.form-group', '.login-form').addClass('has-error');
            }
            if(typeof response.created_at !== 'undefined' && response.created_at !== null) {
                context.goBack();
            }
        });
    }
}

export default LoginController;