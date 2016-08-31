let configRouter = function ($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
    $stateProvider
        .state('venvast', {
            url: '/',
            views: {
                '': {
                    templateUrl: 'templates/common/main.html'
                },
                'header@venvast': {
                    templateUrl: 'templates/common/partials/venvast-header.html',
                    controller: 'BaseHeaderController',
                    controllerAs: 'HeaderCtrl'
                },
                'sticky-header@venvast': {
                    templateUrl: 'templates/common/partials/sticky-header.html',
                    controller: 'StickyHeaderController',
                    controllerAs: 'StickyHeaderCtrl'
                },
                'footer@venvast': {
                    templateUrl: 'templates/common/partials/footer.html'
                }
            },
            abstract: true
        })
        .state('venvast.events', {
            url: 'events',
            parent: 'venvast',
            abstract: false,
            views: {
                'content@venvast': {
                    templateUrl: 'templates/events/list.html',
                    controller: 'EventsListController as ListCtrl'
                },
                'sticky-header@venvast': {
                    templateUrl: 'templates/common/partials/sticky-header.html',
                    controller: 'EventsStickyHeaderController',
                    controllerAs: 'StickyHeaderCtrl'
                },
                'header@venvast': {
                    templateUrl: 'templates/common/partials/venvast-header.html',
                    controller: 'EventsHeaderController',
                    controllerAs: 'HeaderCtrl'
                }
            }
        })
        .state('venvast.events.create', {
            url: '/create',
            parent: 'venvast.events',
            abstract: false,
            views: {
                'content@venvast': {
                    templateUrl: 'templates/events/create.html',
                    controller: 'EventsCreateController as CreateCtrl'
                }
            }
        })
        .state('venvast.events.details', {
            url: '/:id',
            parent: 'venvast.events',
            abstract: false,
            views: {
                'content@venvast': {
                    templateUrl: 'templates/events/details.html',
                    controller: 'EventsDetailsController',
                    controllerAs: 'DetailsCtrl'
                }
            }
        })
        .state('venvast.venues', {
            url: 'venues',
            parent: 'venvast',
            abstract: false,
            views: {
                'content@venvast': {
                    templateUrl: 'templates/venues/list.html',
                    controller: 'VenuesListController as ListCtrl'
                },
                'sticky-header@venvast': {
                    templateUrl: 'templates/common/partials/sticky-header.html',
                    controller: 'VenuesStickyHeaderController',
                    controllerAs: 'StickyHeaderCtrl'
                },
                'header@venvast': {
                    templateUrl: 'templates/common/partials/venvast-header.html',
                    controller: 'VenuesHeaderController',
                    controllerAs: 'HeaderCtrl'
                }
            }
        })
        .state('venvast.venues.details', {
            url: '/:id',
            parent: 'venvast.venues',
            abstract: false,
            views: {
                'content@venvast': {
                    templateUrl: 'templates/venues/details.html',
                    controller: 'VenuesDetailsController',
                    controllerAs: 'DetailsCtrl'
                }
            }
        })
        .state('login', {
            url: '/login',
            views: {
                '': {
                    templateUrl: 'templates/user/login.html',
                    controller: 'LoginController',
                    controllerAs: 'LoginCtrl'
                }
            }
        })
        .state('logout', {
            url: '/logout',
            controller: 'LogoutController'
        })
        .state('register', {
            url: '/register',
            views: {
                '': {
                    templateUrl: 'templates/user/register.html',
                    controller: 'RegisterController',
                    controllerAs: 'RegisterCtrl'
                }
            }
        });
    $urlRouterProvider.otherwise('/events');
    localStorageServiceProvider.setPrefix('venvast');

};

configRouter.$inject = ['$stateProvider', '$urlRouterProvider', 'localStorageServiceProvider'];

export default configRouter;
