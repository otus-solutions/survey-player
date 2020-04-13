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
    'ActivityIndexedDbService',
    'CollectIndexedDbService',
    'SurveyApiService',
    'ActivityCollectionRestService',
    '$rootScope'
  ];

  /**
   * ActivityCollectionService represents to application the activity collection. It abstracts to
   * other layers the storage implementation. Currently, are two storages wrapped in this service: a
   * remote storage and a local storage. Basically the oprations workflow is try to send/retrieve data
   * from remote storage and after the same operation is done into local storage.
   * @namespace ActivityCollectionService
   * @memberof Services
   */
  function Service($q, ActivityRemoteStorageService, ActivityIndexedDbService, CollectIndexedDbService, SurveyApiService) {
    var self = this;
    var _remoteStorage = ActivityRemoteStorageService;

    /* Public methods */

    self.getById = getById;
    self.update = update;
    self.getSurveyList = getSurveyList;
    self.getByAcronymOffline = getByAcronymOffline;
    self.getAllActivities = getAllActivities;

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

    function getByAcronymOffline(code, acronym) {
      var request = $q.defer();
      CollectIndexedDbService.getCollection(code)
        .then(function (response) {
          var _activity = response[0].activities.find(function (activity) {
            return activity.surveyForm.acronym == acronym;
          });
          request.resolve(_activity);
        }).catch(function () {
        request.reject();
      });

      return request.promise;
    }

    function update(activity) {
      var request = $q.defer();
      var _code = SurveyApiService.getSelectedCollection();
      if (!_code) {
        _remoteStorage.update(activity)
          .then(function (response) {
            request.resolve(response);
          }).catch(function () {
          request.reject();
        });
      } else {
        return _updateInCollection(_code, JSON.parse(JSON.stringify(activity[0])));
      }
      return request.promise;
    }

    function _updateInCollection(code, activity) {
      var request = $q.defer();
      CollectIndexedDbService.getAllCollections(SurveyApiService.getLoggedUser().email)
        .then(function (collections) {
          collections.forEach(function (collection) {
            if (collection.code === code) {
              collection.activities = collection.activities.map(function (offlineActivity) {
                if (offlineActivity.surveyForm.acronym === activity.surveyForm.acronym) {
                  return activity;
                }
                return offlineActivity;
              });
              CollectIndexedDbService.updateCollection(collection);
              request.resolve();
            }
          });

        }).catch(function () {
        request.reject();
      });
      return request.promise;
    }

    function getSurveyList() {
      var request = $q.defer();
      _remoteStorage.getSurveys()
        .then(function (response) {
          ActivityIndexedDbService.update(response);
          request.resolve(response.map(function (survey) {
            return {
              acronym: survey.acronym,
              version: survey.version,
              name: survey.surveyTemplate.identity.name
            };
          }));
        }).catch(function (err) {
        ActivityIndexedDbService.getSurveyList().then(function (response) {
          request.resolve(response);
        }).catch(function () {
          request.reject(err);
        });
      });

      return request.promise;
    }

    function getAllActivities() {
      var request = $q.defer();

      _remoteStorage.getSurveys()
        .then(function (response) {
          ActivityIndexedDbService.update(response);
          request.resolve(response);
        }).catch(function (err) {
        ActivityIndexedDbService.getAllActivities().then(function (response) {
          request.resolve(response);
        }).catch(function () {
          request.reject(err);
        });
      });

      return request.promise;
    }
  }
}());
