

class Loader {
	constructor () {
        this.restrict = 'E';
        this.replace = true;
        this.transclude = false;
        this.template = '<div class="adjust"><div class="loader4"></div></div>';
        this.scope = {
        };
    }

    static directiveFactory () {
        Loader.instance = new Loader();
        return Loader.instance;
    }

}

export default Loader;