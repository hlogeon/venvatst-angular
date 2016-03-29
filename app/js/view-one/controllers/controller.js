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

export default ViewOneController;
