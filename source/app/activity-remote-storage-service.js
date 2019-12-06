/**
 * ActivityRemoteStorageService
 * @namespace Services
 */
(function() {
  'use strict';

  angular
    .module('otusjs.player.standalone')
    .service('ActivityRemoteStorageService', Service);

  Service.$inject = [
    '$q',
    'ActivityRestService'
  ];

  /**
   * ActivityRemoteStorageService creates a communication between the application and
   * ActivityRestService. Thus, layers above this service doesn't really know from
   * where the storage is coming, considering that a remote storage not necessarily
   * is accessed through a REST service. The interface of this service has the
   * intent of represents to the client code that it is an collection like an
   * MongoDB or IndexDB collection. If new storage sources are created, this service
   * should wrap it.
   * @see {ActivityRestService}
   * @namespace ActivityRemoteStorage
   * @memberof Services
   */
  function Service($q, ActivityRestService) {
    var self = this;

    /* Public methods */
    self.getById = getById;
    self.update = update;

    /**
     * Find activity in collection. An object-like query can be passed to filter
     * the results.
     * @param {object} activityInfo - the query object to be applied like filter
     * @returns {Promise} promise with activity or activities updated when resolved
     * @memberof ActivityRemoteStorageService
     */

    function getById(activityInfo) {
      var deferred = $q.defer();

      ActivityRestService
        .getById(activityInfo)
        .then(function(response) {
          deferred.resolve(response);
        }).catch(function () {
        deferred.reject();
      });

      return deferred.promise;
    }

    function update(activity) {
      var deferred = $q.defer();

      ActivityRestService
        .update(activity)
        .then(function(response) {
          deferred.resolve(response);
        }).catch(function () {
        deferred.reject();
      });

      return deferred.promise;
    }





  }
}());
