
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
                                content: "<div class='cluster cluster-1'>CLUSTER_COUNT</div>",
                                width: 53,
                                height: 52
                            },
                            events: {
                                click: function(cluster, event, data){
                                    console.log("Cluster clicked", cluster, event, data);
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