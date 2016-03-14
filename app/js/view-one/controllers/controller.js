(ng => {
  'use strict';
  class ViewOneController {
    constructor (EventStore) {
      this.EventStore = EventStore;
      this.init();
    }

    init () {
      this.EventStore.resetStore();
    }
  }

  ViewOneController.$inject = ['EventStore'];

  ng
    .module('myApp.view-one')
    .controller('ViewOneController', ViewOneController);
})(angular);
