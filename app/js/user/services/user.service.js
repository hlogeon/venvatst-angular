import BaseApiService from '../../common/services/base-api.service.js';

class UserService extends BaseApiService {
    /**
     * Class constructor.
     * Set the http service and api end point
     * @param {Object} $http
     **/
    constructor ($http, $state, $rootScope, localStorageService, GotLocationEvent) {
        super($http, localStorageService);
        this.gotLocationEvent = GotLocationEvent;
        this.state = $state;
        this.apiEndPoint = 'user';
        this.rootScope = $rootScope;
        this.initRequestParams();
        this.gettingLocation();
        this.authenticated = false;
        this.errors = [];
        this.user = null;
        this.init();
    }

    goLogin() {
        this.state.go('login', {}, {reload: true});
    }


    init () {
        let localToken = this.getLocalToken();
        let context = this;
        this.requestHome();
    }

    initRequestParams () {
        this.params = {};
        let localToken = this.getLocalToken();
        if(localToken) {
            this.params.token = localToken;
        }
    }

    getLocalToken () {
        return this.getLocalStorage().get('user_token');
    }


    setLocalToken (token) {
        if(token !== null && typeof token !== "undefined") {
            this.getLocalStorage().set('user_token', token);
            this.params.token = token;
        }
    }

    logout () {
        this.getLocalStorage().set('user_token', null);
        this.params.token = null;
        this.authenticated = false;
        this.rootScope.authenticated = false;
        this.rootScope.user = null;
        this.user = null;
    }

    localTokenIsSet () {
        return this.getLocalToken() !== null && typeof this.getLocalToken() !== 'undefined';
    }

    login (data) {
        let http = this.getHttpObject();
        let context = this;
        return http({
            'method': 'POST',
            'url': context.apiPath + context.apiEndPoint + '/authenticate',
            'params': data
        }).then((successResponse) => {
            let response = successResponse.data;
            if(response.error) {
                return {
                    errors: [response.error],
                }
            }
            context.setLocalToken(response.token);
            if(context.localTokenIsSet()) {
                return context.requestHome();
            } else {
                return false;
            }
        }, (errorResponse) => {
            return errorResponse.data;
        });
    }


    register (data) {
        let http = this.getHttpObject();
        let context = this;
        return http({
            'method': 'POST',
            'url': context.apiPath + 'user/register',
            'params': data
        }).then((successResponse) => {
            return successResponse.data;
        }, (errorResponse) => {
            if(errorResponse.status === 422) {
                return {
                    errors: errorResponse.data
                };
            }
        });
    }

    requestHome () {
        let context = this;
        let http = this.getHttpObject();
        if(this.getLocalToken()) {
            return http({
                'method': 'GET',
                'url': context.apiPath + 'user/home',
                'params': context.params
            }).then(function(userResponse) {
                userResponse = userResponse.data;
                if(userResponse.user !== null && typeof userResponse.user !== "undefined") {
                    context.authenticated = true;
                    context.user = userResponse.user;
                    context.rootScope.authenticated = true;
                    context.rootScope.user = userResponse.user;
                } else {
                    context.authenticated = false;
                    context.user = null;
                    context.rootScope.authenticated = false;
                    context.rootScope.user = null;
                }
                return context.user;
            }, function(errorResponse) {
                if(errorResponse.data && errorResponse.data.error === 'token_expired') {
                    context.state.go('login');
                }
                return errorResponse;

            });
        } else {
            return null;
        }
    }


    gettingLocation () {
        let context = this;
        if (navigator.geolocation) {
            return navigator.geolocation.getCurrentPosition(function(position) {
                let params = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                context.lat = params.lat;
                context.lng = params.lng;
                context.gotLocationEvent.notify(params);
            }, function() {
                //error!
            });
        } else {
            // Browser doesn't support Geolocation
        }
    }

    /**
     * Create service
     *
     * @param $http
     * @param localStorageService
     *
     * @returns {BaseApiService}
     */
    static factory ($http, $state, $rootScope, localStorageService, GotLocationEvent) {
        return new UserService($http, $state, $rootScope, localStorageService, GotLocationEvent);
    }

}

export default UserService;