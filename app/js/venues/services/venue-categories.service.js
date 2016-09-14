import BaseApiService from '../../common/services/base-api.service.js';

class VenueCategoriesService extends BaseApiService {


    constructor ($http, localStorageService) {
        super($http, localStorageService);
        this.apiEndPoint = 'category';
    }


    /**
     * Getting events with the event request object
     *
     * @returns {Promise.<TResult>}
     */
    gettingCategories () {
        var context = this;
        let http = this.getHttpObject();
        return http({
            'method': 'GET',
            'url': context.apiPath + context.apiEndPoint + '/venues'
        }).then(function(categories) {
            categories = categories.data.categories;
            context.getLocalStorage().set('venueCategories', categories);
            return categories;
        });
    }
    

    /**
     * Create service
     * @param $http
     * @param localStorageService
     *
     * @returns {VenueCategoriesService}
     */
    static factory ($http, localStorageService) {
        return new VenueCategoriesService($http, localStorageService);
    }

}

export default VenueCategoriesService;