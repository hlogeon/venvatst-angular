(ng => {
  'use strict';
  class ViewTwoController {
    constructor (EventStore) {
      this.init();
    }

    init () {
    }
  }

  ViewTwoController.$inject = [];

  ng
    .module('myApp.view-one')
    .controller('ViewTwoController', ViewTwoController);
})(angular);
