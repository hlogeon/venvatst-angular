/**
 * Created by hlogeon on 8/10/16.
 */
class VenvastCard {
    constructor () {
        this.restrict = 'EA';
        this.replace = true;
        this.transclude = true;
        this.templateUrl = 'templates/common/directives/venvast-card.html';
        this.scope = {
            image: '@'
        };
    }

    link (scope, element) {

    }

    // Based on: http://www.sitepoint.com/writing-angularjs-apps-using-es6/
    static directiveFactory () {
        VenvastCard.instance = new VenvastCard();
        return VenvastCard.instance;
    }
}


export default VenvastCard;