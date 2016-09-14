/**
 * Created by hlogeon on 8/12/16.
 *
 * Search elements by text using TypeHead
 * 
 */
    
const Q = new WeakMap();
    
class TextSearchTypehead {

    constructor ($q) {
        this.name = 'text-search-typehead';
        this.templateUrl = 'templates/common/forms/elements/text-search-typehead.element.html';
        Q.set(this, $q);
    }

    link (scope, element, attributes) {
        let input = $('input', element)[0];
        scope.to.service.setText($(input).val());
        $(input).typeahead({
            source: function(query, process) {
                scope.to.service.setText(query);
                scope.to.modelService.typeAheadRequest().then(function(data) {
                    return process(data);
                });

            },
            select: function () {
                var val = this.$menu.find('.active').data('value');
                this.$element.data('active', val);
                if(this.autoSelect || val) {
                    var newVal = this.updater(val);

                    if (!newVal) {
                        newVal = "";
                    }

                    this.$element
                        .val(newVal.name)
                        .change();
                    this.afterSelect(newVal);
                }
                return this.hide();
            },
            afterSelect: function (element) {
                if (scope.to.modelService.apiEndPoint === 'venue') {
                    delete(scope.to.service.params.text);
                    window.location.href = '/#/venues/view/' + element.slug;
                } else if (scope.to.modelService.apiEndPoint === 'event') {
                    delete(scope.to.service.params.text);
                    window.location.href = '/#/events/' + element.id;
                }
            },
            displayText: function(item) {
                return '<div class="typeahead_wrapper">' +
                '<div class="typeahead_content">' + item.name + '</div> <div class="typeahead_addon"><span>' + item.category + '</span></div></div>'; //<div class="typeahead_image"><img src="' + item.image + '"></div>
            },
            highlighter: function(item) {
                return unescape(item);
            },
            minLength: 3,
            maxItem: 5,
            autoSelect: true
        });
    }

}


export default TextSearchTypehead;
