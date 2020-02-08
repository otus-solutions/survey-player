(function () {
  'use strict';

  angular
    .module('otusjs.player.standalone')
    .service('StorageLoaderService', Service);

  Service.$inject = [
    '$q',
    '$injector',
    'IndexedDbStorageService',
    'OtusLocalStorage'
  ];

  function Service($q, $injector, IndexedDbStorageService, OtusLocalStorage) {
    var self = this;

    /* Public methods */
    self.createIndexedStorage = createIndexedStorage;
    self.loadIndexedStorage = loadIndexedStorage;
    self.dbExists = dbExists;
    self.deleteDatabase = deleteDatabase;


    function createIndexedStorage(dbName) {
      var deferred = $q.defer();

      IndexedDbStorageService
        .newDb(dbName, _instantiateStorages(OtusLocalStorage))
        .then(function () {
          deferred.resolve();
        });

      return deferred.promise;
    }

    function loadIndexedStorage(dbName) {
      var deferred = $q.defer();

      IndexedDbStorageService
        .loadDb(dbName, _instantiateStorages(OtusLocalStorage))
        .then(function () {
          deferred.resolve();
        });

      return deferred.promise;
    }

    function dbExists(dbName) {
      return IndexedDbStorageService.dbExists(dbName);
    }

    function _instantiateStorages(storages) {
      return storages.map(function (storage) {
        return $injector.get(storage);
      });
    }

    function deleteDatabase() {
      return IndexedDbStorageService.deleteDatabase();
    }
  }
}());
