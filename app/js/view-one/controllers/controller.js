(ng => {
  'use strict';
  class ViewOneController {
    constructor (CountStore) {
      this.CountStore = CountStore;
      this.init();
    }

    init () {
      this.name = 'ONE';
      this.CountStore.increment();
    }
  }

  ViewOneController.$inject = ['CountStore'];

  ng
    .module('myApp.view-one')
    .controller('ViewOneController', ViewOneController);
})(angular);
