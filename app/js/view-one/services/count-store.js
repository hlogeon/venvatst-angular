(ng => {
  'use strict';

  class CountStore {
    constructor () {
      this.init();
    }

    init () {
      this.count = 0;
    }

    increment () {
      this.count++;
    }
  }
  CountStore.$inject = [];

  ng.module('myApp.view-one')
    .service('CountStore', CountStore);
})(angular);
