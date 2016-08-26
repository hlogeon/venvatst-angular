/**
 * Created by hlogeon on 8/10/16.
 */
import $ from 'jquery';
class LoadingButton {
    constructor () {
        this.restrict = 'EA';
        this.replace = true;
        this.transclude = true;
        this.template = '<button class="{{ class }}"><i class="fa {{ icon }}"></i> {{ value }} </button>';
        this.scope = {
            class: '@',
            icon: '@',
            value: '@',
            loading: '=',
            styleDisabled: '=styleDisabled'
        };
    }

    link (scope, element) {
        let context = this;
        $(document).ready(function() {
            context.setState(scope.loading, element);
        });
        scope.$watch('loading', function(newValue, oldValue) {
            context.setState(newValue, element);
        });
    }

    setDisabled (disabled, element) {
        if(disabled === true) {
            $(element)[0].classList.add('disabled');
            $('i', element)[0].classList.remove(this.scope.icon);
            $('i', element)[0].classList.add('fa-times-circle');
        } else {
            $(element)[0].classList.remove('disabled');
            $('i', element)[0].classList.add(this.scope.icon);
            $('i', element)[0].classList.remove('fa-times-circle');
        }
    }

    setState (loading, element) {
        if(loading === true) {
            $('i', element)[0].classList.add('fa-spin');
            $(element)[0].classList.add('disabled');
        } else {
            $('i', element)[0].classList.remove('fa-spin');
            $(element)[0].classList.remove('disabled');
        }
    }

    // Based on: http://www.sitepoint.com/writing-angularjs-apps-using-es6/
    static directiveFactory () {
        LoadingButton.instance = new LoadingButton();
        return LoadingButton.instance;
    }
}

LoadingButton.directiveFactory.$inject = [];

export default LoadingButton;