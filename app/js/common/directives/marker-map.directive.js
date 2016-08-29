
class MarkerMap {
    
    constructor () {
        this.restrict = 'EA';
        this.replace = true;
        this.transclude = false;
        this.templateUrl = 'templates/common/directives/marker-map.html';
        this.scope = {
            mapOptions: '=',
            loaded: '='
        };
    }

    link (scope, element) {
        if(scope.loaded) {
            scope.loaded.subscribe(scope, function(evt, data) {
                $('#map-google').gmap3('destroy');
                $('#map-google').gmap3({
                    map: {
                        options: scope.mapOptions
                    },
                    marker: {
                        values: data.items,
                        cluster: {
                            radius: 50,
                            0: {
                                content: "<div class='cluster cluster-1'>" +
                                '<div class="map-popup-content-wrapper"><div class="map-popup-content"><div class="listing-window-image-wrapper">' +
                                '<a href="#">' +
                                '<div class="listing-window-image">Some cool content here</div>' +
                                '<div class="listing-window-content">' +
                                '<div class="info">' +
                                '</div>' +
                                '</div>' +
                                '</a>' +
                                '</div></div><i class="fa fa-close close"></i></div>' +
                                "CLUSTER_COUNT" +
                                "</div>",
                                width: 32,
                                height: 32
                            },
                            events: {
                                click: function (overlay, event, context){
                                    $(this).gmap3({
                                        infowindow:{
                                            latLng: context.data.latLng,
                                            options:{
                                                content: '<ul>' + $.map(context.data.markers, function (marker) {
                                                    return "<li>" + marker.options.content.itemLink + '<br/><small> ' + marker.options.content.category +'</small>' + '</li>';
                                                }).join('') + '</ul>'
                                            }
                                        }
                                    });
                                }
                            }
                        },
                        events: {
                            click: data.clickHandler
                        }
                    },
                    overlay: {
                        values: data.overlay
                    }
                });
            })
        }
    }


    // Based on: http://www.sitepoint.com/writing-angularjs-apps-using-es6/
    static directiveFactory () {
        MarkerMap.instance = new MarkerMap();
        return MarkerMap.instance;
    }
}

export default MarkerMap;