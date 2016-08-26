/**
 * Created by hlogeon on 8/10/16.
 *
 * Simple footer for VenVast application
 */
class VenvastFooter {
    constructor () {
        this.restrict = 'EA';
        this.replace = true;
        this.templateUrl = 'templates/common/directives/venvast-footer.html';
        this.scope = {

        };
    }

    link (scope, element) {

    }

    // Based on: http://www.sitepoint.com/writing-angularjs-apps-using-es6/
    static directiveFactory () {
        VenvastFooter.instance = new VenvastFooter();
        return VenvastFooter.instance;
    }
}

VenvastFooter.directiveFactory.$inject = [];

export default VenvastFooter;