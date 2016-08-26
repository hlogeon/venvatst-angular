
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
                    overlay: {
                        values: data.items,
                        events: {
                            click: data.clickHandler
                        }
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