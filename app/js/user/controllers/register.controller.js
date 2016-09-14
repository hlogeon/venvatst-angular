
const Q = new WeakMap();
class RegisterController {

    constructor ($rootScope, $state, $scope, $q, $window, service, Notification, RegisterEvent) {
        $rootScope.$state = $state;
        this.state = $state;
        this.event = RegisterEvent;
        this.service = service;
        this.window = $window;
        this.notificationService = Notification;
        Q.set(this, $q);
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
        this.state.go('venvast.venues');
    }

    submit () {
        let context = this;
        context.errors = [];
        $('.form-group', '.login-form').removeClass('has-error');
        Q.get(this).when(this.service.register(this.model)).then(function (response) {
            if(typeof response.errors !== "undefined" && response.errors !== false) {
                for(var key in response.errors) {
                    context.notificationService.error({title: key, message: response.errors[key][0], delay: 10000});
                }
            } else {
                context.notificationService.success({title: 'Registered successfully', message: 'Check your email for activation letter and come back to venvast after you activate your account!', delay: 10000});
                context.event.notify();
                context.goBack();
            }
        });
    }
}

export default RegisterController;