/**
 * ActivityCollectionService
 * @namespace Services
 */
(function () {
  'use strict';

  angular
    .module('otusjs.player.standalone')
    .service('ActivityCollectionService', Service);

  Service.$inject = [
    '$q',
    'ActivityRemoteStorageService'
  ];

  /**
   * ActivityCollectionService represents to application the activity collection. It abstracts to
   * other layers the storage implementation. Currently, are two storages wrapped in this service: a
   * remote storage and a local storage. Basically the oprations workflow is try to send/retrieve data
   * from remote storage and after the same operation is done into local storage.
   * @namespace ActivityCollectionService
   * @memberof Services
   */
  function Service($q, ActivityRemoteStorageService) {
    var self = this;
    var _remoteStorage = ActivityRemoteStorageService;

    /* Public methods */

    self.getById = getById;

    function getById(activityInfo) {
      var request = $q.defer();
      _remoteStorage.getById(activityInfo)
            .then(function (response) {
              request.resolve(response);
            }).catch(function () {
            request.reject();
          });

      return request.promise;
    }


  }
}());
