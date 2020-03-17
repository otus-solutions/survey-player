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
    'ActivityRemoteStorageService',
    'ActivityIndexedDbService'
  ];

  /**
   * ActivityCollectionService represents to application the activity collection. It abstracts to
   * other layers the storage implementation. Currently, are two storages wrapped in this service: a
   * remote storage and a local storage. Basically the oprations workflow is try to send/retrieve data
   * from remote storage and after the same operation is done into local storage.
   * @namespace ActivityCollectionService
   * @memberof Services
   */
  function Service($q, ActivityRemoteStorageService, ActivityIndexedDbService) {
    var self = this;
    var _remoteStorage = ActivityRemoteStorageService;

    /* Public methods */

    self.getById = getById;
    self.update = update;
    self.getSurveys = getSurveys;
    self.getOfflineSurveys = getOfflineSurveys;

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

    function update(activity) {
      var request = $q.defer();
      _remoteStorage.update(activity)
        .then(function (response) {
          request.resolve(response);
        }).catch(function () {
        request.reject();
      });

      return request.promise;
    }

    function getSurveys() {
      var request = $q.defer();
      _remoteStorage.getSurveys()
        .then(function (response) {
          ActivityIndexedDbService.update(response);
          request.resolve(response);
        }).catch(function () {
        request.reject();
      });

      return request.promise;
    }

    function getOfflineSurveys() {
      var request = $q.defer();
      ActivityIndexedDbService.getAllActivities().then(function (response) {
        request.resolve(response);
      }).catch(function (err) {
        request.reject(err);
      });
      return request.promise;
    }

    self.getListSurveys = getListSurveys;

    function getListSurveys() {
      return ActivityIndexedDbService.getList();
    }


  }
}());
