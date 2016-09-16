

class Loader {
	constructor () {
        this.restrict = 'E';
        this.replace = true;
        this.transclude = false;
        this.template = '<div class="col-md-3" id="map-loader" style="margin-left: 45%; margin-top: 100px"><div class="adjust"><div class="loader4"></div></div></div>';
        this.scope = {
        };
    }

    link(scope, element) {  
    }

    static directiveFactory () {
        Loader.instance = new Loader();
        return Loader.instance;
    }

}

export default Loader;