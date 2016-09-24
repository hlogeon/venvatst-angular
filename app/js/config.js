let configRouter = function ($stateProvider, $locationProvider, $urlRouterProvider, localStorageServiceProvider) {
    // $locationProvider.html5Mode(true).hashPrefix('!');


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
        .state('venvast.events.category', {
            url: '/category/{slug}',
            parent: 'venvast.events',
            abstract: false
        })
        .state('venvast.events.favorites', {
            url: '/favorites',
            parent: 'venvast.events',
            abstract: false,
            views: {
                'content@venvast': {
                    templateUrl: 'templates/events/list.html',
                    controller: 'EventsListController as ListCtrl'
                }
            },
            data: {
                mode: 'favorites'
            }
        })
        .state('venvast.events.attend', {
            url: '/attend',
            parent: 'venvast.events',
            abstract: false,
            views: {
                'content@venvast': {
                    templateUrl: 'templates/events/list.html',
                    controller: 'EventsListController as ListCtrl'
                }
            },
            data: {
                mode: 'going'
            }
        })
        .state('venvast.events.drafts', {
            url: '/organize/drafts',
            parent: 'venvast.events',
            abstract: false,
            views: {
                'content@venvast': {
                    templateUrl: 'templates/events/organize/list.html',
                    controller: 'OrganizerListController as ListCtrl'
                }
            },
            data: {
                drafts: true
            }
        })
        .state('venvast.events.organize', {
            url: '/organize',
            parent: 'venvast.events',
            abstract: false,
            views: {
                'content@venvast': {
                    templateUrl: 'templates/events/organize/list.html',
                    controller: 'OrganizerListController as ListCtrl'
                }
            },
            data: {
                drafts: false
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
        .state('venvast.events.edit', {
            url: '/edit/{slug}',
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
            url: '/view/:slug',
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
        .state('venvast.venues.drafts', {
            url: '/organize/drafts',
            parent: 'venvast.venues',
            views: {
                'content@venvast': {
                    templateUrl: 'templates/venues/organize/drafts.html',
                    controller: 'DraftsListController as ListCtrl'
                }
            },
            data: {
                drafts: true
            }
        })
        .state('venvast.venues.organize', {
            url: '/organize',
            parent: 'venvast.venues',
            views: {
                'content@venvast': {
                    templateUrl: 'templates/venues/organize/drafts.html',
                    controller: 'DraftsListController as ListCtrl'
                }
            },
            data: {
                drafts: false
            }
        })
        .state('venvast.venues.favorites', {
            url: '/favorites',
            parent: 'venvast.venues',
            abstract: false,
            views: {
                'content@venvast': {
                    templateUrl: 'templates/venues/list.html',
                    controller: 'VenuesListController as ListCtrl'
                }
            },
            data: {
                favorites: true
            }
        })
        .state('venvast.venues.create', {
            url: '/create',
            parent: 'venvast.venues',
            abstract: false,
            views: {
                'content@venvast': {
                    templateUrl: 'templates/venues/create.html',
                    controller: 'VenuesCreateController as CreateCtrl'
                }
            }
        })
        .state('venvast.venues.edit', {
            url: '/edit/{slug}',
            parent: 'venvast.venues',
            abstract: false,
            views: {
                'content@venvast': {
                    templateUrl: 'templates/venues/create.html',
                    controller: 'VenuesCreateController as CreateCtrl'
                }
            }
        })
        .state('venvast.venues.category', {
            url: '/category/{slug}',
            parent: 'venvast.venues',
            abstract: false
        })
        .state('venvast.venues.details', {
            url: '/view/{slug}',
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
            },
            data: {
                bodyClass: 'black'
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
            },
            data: {
                bodyClass: 'black'
            }
        });
    $urlRouterProvider.otherwise('/venues');
    localStorageServiceProvider.setPrefix('venvast');

};

configRouter.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'localStorageServiceProvider'];

export default configRouter;
