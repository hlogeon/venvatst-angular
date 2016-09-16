/**
 * Created by hlogeon on 8/10/16.
 */
import Venue from '../models/venue.js';

const Q = new WeakMap();
const SERVICE = new WeakMap();


class VenueForm {
    
    constructor (UserService, GotLocationEvent, VenuesService, VenueCategoriesService, Notification, $q, $state, $stateParams, $rootScope) {
        let context = this;
        Q.set(this, $q);
        this.params = $stateParams;
        SERVICE.set(this, VenuesService);

        this.categoriesService = VenueCategoriesService;
        this.notificationService = Notification;
        this.GotLocationEvent = GotLocationEvent;
        this.UserService = UserService;
        this.rootScope = $rootScope;
        this.userService = UserService;
        this.state = $state;
        

        this.restrict = 'EA';
        this.replace = true;
        this.templateUrl = 'templates/venues/directives/form.html';
        this.scope = {
            model: '='
        };
        this.service = VenuesService;
    }

    link (scope, element) {
        scope.toggleBusinessDay = this.toggleBusinessDay;
        scope.deleteExistingImage = this.deleteExistingImage;
        scope.selectImage = this.selectImage;
        scope.deleteImage = this.deleteImage;
        scope.addImage = this.addImage;
        scope.submit = this.submit;
        scope.userService = this.UserService;
        scope.service = SERVICE.get(this);
        scope.notificationService = this.notificationService;
        scope.notifyNeedsLogin = this.notifyNeedsLogin;
        scope.notifySuccessDraft = this.notifySuccessDraft;
        scope.notifySuccessCreate = this.notifySuccessCreate;
        scope.state = this.state;
        scope.getZoom = this.getZoom;
        let context = this;
        context.scope = scope;
        this.UserService.gettingLocation();
        this.initModel(this.GotLocationEvent);
        scope.model = scope.venue;
        this.categoriesService.gettingCategories().then((categories) => {
            scope.categories = categories;
            context.initAddressAutocomplete();
        });
    }


    getMapStyles() {
        return [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}];
    }




    submit (draft = false) {
        let venue = this.venue;
        venue.submitting = true;
        let context = this;
        for (var i = 0; i < venue.images.length; i++) {
            if (typeof venue.images[i] === 'string') {
                continue;
            } else {
                let img = $('#'+venue.images[i].id).cropit('export');
                if(!img) {
                    context.venue.images.splice(i, 1);
                    continue;
                }
                venue.images[i] = img;
            }
        }
        if(this.existingImages && this.existingImages.length > 0) {
            for(var i = 0; i < this.existingImages.length; i++) {
                venue.images.push(this.existingImages[i]);
            }
        }

        if(draft === true) {
            venue.draft = draft;
        }

        if(!this.userService.authenticated) {
            this.service.addUnsentVenue(venue);
            this.notifyNeedsLogin();
            this.userService.goLogin();
            return;
        }


        this.service.submit(venue).then(function (response) {
            venue.submitting = false;
            if(response.success === false) {
                context.errors = response.errors;
                window.scrollTo(0, 0);
            } else {
                if(draft) {
                    context.notifySuccessDraft(response.venue.name);
                    context.state.go('venvast.venues.drafts');
                } else {
                    context.notifySuccessCreate(response.venue.name);
                    context.state.go('venvast.venues.organize');
                }
            }
        });
    }




    initMap(GotLocationEvent) {
        let context = this;
        let coordinates = this.scope.venue.contact.address.coordinates;
        if(coordinates.lat && coordinates.lng) {
            context.map = $('#map-google').gmap3({
                    map: {
                        options : {
                            styles: context.getMapStyles(),
                            center: new google.maps.LatLng(coordinates.lat, coordinates.lng),
                            scrollwheel: false,
                            zoom: 16
                        }
                    } 
                });
            context.updateMap(coordinates.lat, coordinates.lng);
        } else {
            GotLocationEvent.subscribe(context.rootScope, function(event, params) {
                context.map = $('#map-google').gmap3({
                    map: {
                        options : {
                            styles: context.getMapStyles(),
                            center: new google.maps.LatLng(params.lat, params.lng),
                            scrollwheel: false,
                            zoom: 10
                        }
                    } 
                });
            });
        }
    }

    initAddressAutocomplete() {
        let context = this;
        var autocomplete = new google.maps.places.Autocomplete(
            (document.getElementById('address_autocomplete')),
            {types: ['geocode']}
        );
        autocomplete.addListener('place_changed', function() {
            let placeInfo = autocomplete.getPlace();
            if(placeInfo.geometry && placeInfo.geometry.location) {
                context.updateMap(placeInfo.geometry.location.lat(), placeInfo.geometry.location.lng());
            }
            context.placeInfoToModel(placeInfo);
        });
    }

    updateMap (lat,lng) {
        let context = this;
        context.map.gmap3({
                    marker: context.getMapMarker(lat, lng),
                    map: {
                        options : {
                            styles: context.getMapStyles(),
                            center: new google.maps.LatLng(lat, lng),
                            scrollwheel: false,
                            zoom: 16
                        }
                    },
                });
    }

    getMapMarker (lat, lng) {
        let context = this;
        return  {
                    latLng: {lat: lat, lng: lng},
                    options:{
                        draggable:true
                    },
                    events: context.getMapMarkerEvents()
                }
    }

    getMapMarkerEvents () {
        let context = this;
        let geocoder = new google.maps.Geocoder;
        let inputGroup = $('.contact-address-group');
        //TODO: input group
        return {
                dragend: function(marker) {
                    geocoder.geocode({'location': marker.getPosition()}, function(results, status) {
                        // if (status !== google.maps.GeocoderStatus.OK) {
                        //     inputGroup.addClass('has-error');
                        //     inputGroup.append(errorELement);
                        //     $('.address-error').remove();
                        //     return;
                        // }
                        for(var o = 0; o < results.length; o++) {
                            if(context.validateAddress(results[o])) {
                                context.placeInfoToModel(results[o]);
                                $('#address_autocomplete').val(results[o].formatted_address);
                                return;
                            }
                        }
                        context.addressError();
                    });
                }
            };
    }


    addressError () {
        let inputGroup = $('.contact-address-group');
        let errorELement = '<p class="help-block address-error" id="address-error">Invalid address, try to enter more exact address</p>';
        inputGroup.addClass('has-error');
        inputGroup.append(errorELement);
    }

    placeInfoToModel (placeInfo) {
        let address = this.scope.venue.contact.address;
        let inputGroup = $('.contact-address-group');
        let context = this;
        if(context.validateAddress(placeInfo)) {
            inputGroup.removeClass('has-error');
            $('#address-error').remove();
            let components = context.getAddressComponents(placeInfo);
            address.country = components.country;
            address.city = components.city;
            address.coordinates.lat = placeInfo.geometry.location.lat();
            address.coordinates.lng = placeInfo.geometry.location.lng();
            context.rootScope.$apply(function() {
                address.house = components.house;
                address.street = components.street;
                address.district = components.district;
            });
        } else {
            context.addressError();
        }
    }

    /**
     * Validate if affress provided contains street address
     * @param  {[type]} place [description]
     * @return {[type]}       [description]
     */
    validateAddress(place) {
        if(!place || !place.types) {
            return false;    
        }
        for(var i = 0; i < place.types.length; i++) {
            if(place.types[i] === 'street_address') {
                return true;
            }
        }
        return false;
    }

    getAddressComponents(place) {
        let house_number = this.extractHouseNumber(place.address_components);
        let street = this.extractStreet(place.address_components);
        let district = this.extractDistrict(place.address_components);
        let subdistrict = this.extractSubDistrict(place.address_components);
        let city = this.extractCity(place.address_components);
        let country = this.extractCountry(place.address_components);
        return {
            house: house_number,
            street: street,
            district: district,
            subdistrict: subdistrict,
            city: city,
            country: country
        };
    }

    extractHouseNumber(components) {
        for(var i = 0; i < components.length; i++) {
            for(var j = 0; j < components[i].types.length; j++) {
                if(components[i].types[j] === 'street_number') {
                    return components[i].short_name;
                }
            }
        }
        return null;
    }

    extractStreet(components) {
        for(var i = 0; i < components.length; i++) {
            for(var j = 0; j < components[i].types.length; j++) {
                if(components[i].types[j] === 'route') {
                    return components[i].long_name;
                }
            }
        }
        return null;
    }

    extractDistrict(components) {
        for(var i = 0; i < components.length; i++) {
            for(var j = 0; j < components[i].types.length; j++) {
                if(components[i].types[j] === 'sublocality_level_1') {
                    return components[i].long_name;
                }
            }
        }
        return null;
    }

    extractSubDistrict(components) {
        for(var i = 0; i < components.length; i++) {
            for(var j = 0; j < components[i].types.length; j++) {
                if(components[i].types[j] === 'sublocality_level_2') {
                    return components[i].long_name;
                }
            }
        }
        return null;
    }

    extractCity(components) {
        for(var i = 0; i < components.length; i++) {
            for(var j = 0; j < components[i].types.length; j++) {
                if(components[i].types[j] === 'locality') {
                    return components[i].long_name;
                }
            }
        }
        return null;
    }

    extractCountry(components) {
        for(var i = 0; i < components.length; i++) {
            for(var j = 0; j < components[i].types.length; j++) {
                if(components[i].types[j] === 'country') {
                    return components[i].long_name;
                }
            }
        }
        return null;
    }

    initModel(GotLocationEvent) {
        let context = this;
        if (this.params.slug) {
            this.initExistingModel();
        } else {
            this.initEmptyModel(GotLocationEvent);
        }
        context.scope.dayAliases = [
            'Sun', 'Mon', 'Tue',
            'Wed', 'Thu', 'Fri',
            'Sat'
        ];
    }

    initExistingModel () {
        let context = this;
        SERVICE.get(this).gettingEditable(this.params.slug).then(function (resposne) {
            context.scope.venue = resposne;
            console.log(context.scope.venue.business_hours);
            context.scope.venue.submitting = false;
            context.scope.venue.acceptTerms = false;
            context.addExistingImages(context.scope.venue);
            context.initImageCropper(context.scope.venue);
            context.initMap();
        });
    }    

    initEmptyModel (GotLocationEvent) {
        let context = this;
        this.scope.venue = {
            name: null,
            submitting: false,
            categories: [],
            description: null,
            contact: {
                phone: null,
                email: null,
                website: null,
                additional_info: null,
                address: {
                    house: null,
                    street: null,
                    district: null,
                    sub_district: null,
                    city: null,
                    country: null,
                    coordinates: {
                        lat: null,
                        lng: null,
                    }
                }
            },
            business_hours: context.makeDefaultBusinessHours(),
            host: false,
            host_message: null,
            host_categories: null,
            listed: false,
            acceptTerms: true,
            locale: 'en',
            images: []
        };
        context.initImageCropper(context.scope.venue);
        context.initMap(GotLocationEvent);
    }

    toggleBusinessDay(businessDay) {
        if(!businessDay.start && businessDay.start !== 0) {
            businessDay.start = 900;
            businessDay.end = 2000;
        } else {
            businessDay.start = false;
            businessDay.end = null;
        }
    }

    makeDefaultBusinessHours() {
        return {
            days: [
                {day: 0, start: false},
                {day: 1, start: 900, end: 2000},
                {day: 2, start: 900, end: 2000},
                {day: 3, start: 900, end: 2000},
                {day: 4, start: 900, end: 2000},
                {day: 5, start: 900, end: 2000},
                {day: 6, start: false}
            ]
        };
    }

    addImage() {
        var finalWidth  = 900;
        var finalHeight = 300;
        let venue = {};
        let context = null;
        if(!this.scope) {
            venue = this.$parent.venue;
            context = this.$parent;
        } else {
            venue = this.scope.venue;
            context = this;
        }
        let length = venue.images.length;
        let image = {id: 'image-'+ length};
        venue.images.push(image);
        setTimeout(function(image) {
            $('#'+image.id).cropit({
                exportZoom: context.getZoom(finalHeight, finalWidth, '#'+image.id)
            });
        }, 1000, image);
    }

    initImageCropper(venue) {
        if(venue.images.length === 0) {
            this.addImage();
        }
    }

    addExistingImages (venue) {
        this.scope.existingImages = venue.images.slice();
        venue.images = [];
    }

    deleteExistingImage (index) {
        this.$parent.existingImages.splice(index, 1);
        // this.scope.existingImages.splice(index, 1);
    }

    getZoom(finalHeight, finalWidth, selectContext) {
        let sizeRatio = finalHeight / finalWidth;
        let newWidth = $('.cropit-preview').width();
        let newHeight = newWidth * sizeRatio;
        return finalWidth / newWidth;
    }


    selectImage(image) {
        $('.cropit-image-input', '#'+image.id).click();
    }

    deleteImage(image) {
        let venue = null;
        if(!this.scope) {
            venue = this.$parent.venue;
        } else {
            venue = this.scope.venue;
        }
        if (venue.images.length > 1) {
            for (var i = 0; i < venue.images.length; i++) {
                let img = venue.images[i];
                if(img.id === image.id) {
                    venue.images.splice(i, 1);
                }
            }
        }
        $('.cropit-preview-image', '#'+image.id).attr('src', '');
    }

    notifySuccessCreate(name) {
        this.notificationService.success({title: "Venue saved", message: "New venue <b>" + name + "</b> successfully created! You can now check it at <b>organizer panel<b> <br/>Menu -> Venues -> Organize", delay: 10000});
    }

    notifySuccessDraft(name) {
        this.notificationService.primary({title: "Draft saved", message: "New draft of venue <b>" + name + "</b> successfully saved! You can find it at <b>organizer panel<b> <br/>Menu -> Venues -> Drafts", delay: 10000});
    }

    notifyNeedsLogin() {
        this.notificationService.warning({title: "Success, but you have to login first!", message: "You are almost done but to be sure that you are not a robot, login to your account please. <b>Don't worry you will not loose your data!</b> <br/>You'll be redirected to the login page in a moment.", delay: 10000});
    }





    // Based on: http://www.sitepoint.com/writing-angularjs-apps-using-es6/
    static directiveFactory (UserService, GotLocationEvent, VenuesService, VenueCategoriesService, Notification, $q, $state, $stateParams, $rootScope) {
        VenueForm.instance = new VenueForm(UserService, GotLocationEvent, VenuesService, VenueCategoriesService, Notification, $q, $state, $stateParams, $rootScope);
        return VenueForm.instance;
    }
}

VenueForm.$inject = ['UserService', 'GotLocationEvent', 'VenuesService', 'VenueCategoriesService', 'Notification', '$q', '$state', '$stateParams', '$rootScope']

export default VenueForm;