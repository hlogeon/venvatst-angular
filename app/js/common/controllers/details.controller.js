

const Q = new WeakMap();


class DetailsController {


    constructor ($stateParams, $scope, $q, service) {
        this.setService(service);
        this.params = $stateParams;
        this.setQ($q);
        this.scope = $scope;
        this.init();
    }


    init () {
        this.getQ().when(this.getService().gettingOne(this.params.id)).then((event) => {
            this.scope.object = event;
            this.initCarousel();
            this.initMap()
        });
    }

    initMap () {
        let context = this;
        $('#event-map').gmap3({
            map: context.getMapObject(),
            overlay: context.getMapOverlay()
        });
    }

    initCarousel () {
        $(this.getGallerySelector()).owlCarousel({
            autoplay: false,
            loop: true,
            items: 1,
            nav: true,
            navText: ['<i class="entypo-chevron-with-circle-left"></i>', '<i class="entypo-chevron-with-circle-right"></i>']
        });
    }


    getDetailsMarker () {
        return {
            latLng: this.getMapCenter(),
            data: 1,
            options: {
                content: '<div class="map-marker"><i class="fa fa-star"></i></div>',
                offset: {
                    x: -18,
                    y: -42
                }
            }
        };
    }


    getMapCenter () {
        let pos = this.scope.object.getLatLng();
        console.log("pos: ", pos);
        return new google.maps.LatLng(pos.latitude, pos.longitude);
    }


    getMapObject () {
        return {
            options:{
                styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}],
                center: this.getMapCenter(),
                scrollwheel: false,
                zoom: 16
            },
        };
    }

    getMapOverlay() {
        return {
            values: [this.getDetailsMarker()]
        }
    }




    /**
     * Set an API service instance
     * @param {Object} service
     */
    setService (service) {
        this.service = service;
    }

    getService () {
        return this.service;
    }

    /**
     * Set promise helper service
     *
     * @param $q
     */
    setQ ($q) {
        Q.set(this, $q);
    }

    /**
     * Get promise helper service
     * @returns {V}
     */
    getQ () {
        return Q.get(this);
    }




    getGallerySelector () {
        return '.event-gallery';
    }

}

export default DetailsController;