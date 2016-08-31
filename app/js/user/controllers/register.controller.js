
const Q = new WeakMap();
class RegisterController {

    constructor ($scope, $q, $window, service) {
        this.service = service;
        this.window = $window;
        Q.set(this, $q);
        $('body').css({'background-color': '#323232'});
        this.initModel();
    }

    initModel () {
        this.model = {
            email: '',
            password: ''
        };
        this.errors = [];
    }
    
    
    goBack() {
        this.window.history.back();
    }

    submit () {
        let context = this;
        context.errors = [];
        $('.form-group', '.login-form').removeClass('has-error');
        Q.get(this).when(this.service.register(this.model)).then(function (response) {
            if(typeof response.errors !== "undefined" && response.errors !== false) {
                for(var key in response.errors) {
                    context.errors.push(response.errors[key]);
                }
                $('.form-group', '.login-form').addClass('has-error');
            } else {
                context.initModel();
                context.errors.push('Successful registration!');
            }
        });
    }
}

export default RegisterController;