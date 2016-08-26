
const Q = new WeakMap();
class LoginController {

    constructor ($scope, $q, $window, service) {
        this.service = service;
        this.window = $window;
        this.model = {
            email: '',
            password: ''
        };
        Q.set(this, $q);
        $('body').css({'background-color': '#323232'});
        if(this.service.user !== null && this.service.authenticated === true) {
            this.goBack();
        }
    }
    
    
    goBack() {
        this.window.history.back();
    }

    submit () {
        let context = this;
        // console.log("Request data: ", this.model);
        Q.get(this).when(this.service.login(this.model)).then(function (response) {
            console.log("Got response: ", response);
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