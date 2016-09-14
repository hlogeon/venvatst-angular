
const Q = new WeakMap();

class LoginController {

    constructor ($rootScope, $state, $scope, $q, $window, service, Notification, LoginEvent) {
        this.service = service;
        this.event = LoginEvent;
        // this.storage = localStorageService;
        this.state = $state;
        $rootScope.$state = $state;
        this.notificationService = Notification;
        this.window = $window;
        Q.set(this, $q);
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
        this.state.go('venvast.venues');
    }

    submit () {
        let context = this;
        $('.form-group', '.login-form').removeClass('has-error');
        Q.get(this).when(this.service.login(this.model)).then(function (response) {
            console.log("R: ", response);
            if(typeof response.errors !== "undefined" && response.errors !== false) {
                for(var key in response.errors) {
                    context.notificationService.error({title: key, message: response.errors[key], delay: 10000});
                    return;
                }
            }
            if(response.id && response.activated) {
                context.event.notify();
                context.goBack();
            } else {
                context.notificationService.error("Whoops! Something went wrong!");
            }
        });
    }
}

export default LoginController;