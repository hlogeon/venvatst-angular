class CategoriesList {


    constructor () {
        this.restrict = 'EA';
        this.replace = true;
        this.templateUrl = 'templates/events/directives/categories-list.html';
        this.scope = {
            changeEvent: '=',
            categories: '='
        };
    }

    /**
     * @param $scope
     */
    controller ($scope) {
        $scope.select = function (event, category) {
            event.preventDefault();
            let navLink = $('.hero-categories .nav-link');
            if(event.target.classList.contains('active')) {
                $scope.changeEvent.notify(null);
                event.target.classList.remove('active');
                navLink.removeClass('active');
            } else {
                navLink.removeClass('active');
                event.target.classList.add('active');
                $scope.changeEvent.notify(category);
            }
        };
    }

    static directiveFactory () {
        CategoriesList.instance = new CategoriesList();
        return CategoriesList.instance;
    }
    
}


export default CategoriesList;