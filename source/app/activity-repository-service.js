(function () {
  'use strict';

  angular
    .module('otusjs.player.standalone')
    .service('ActivityRepositoryService', Service);

  Service.$inject = [
    '$q',
    'otusjs.model.activity.ActivityFactory',
    'SurveyFormFactory',
    'ActivityCollectionService'
  ];

  function Service($q, ActivityFactory, SurveyFormFactory, ActivityCollectionService) {
    var self = this;
    var _existsWorkingInProgress = null;

    /* Public methods */

    self.save = save;
    self.discard = discard;
    self.getById = getById;
    self.getSurveys = getSurveys;
    self.getOfflineSurveys = getOfflineSurveys;
    self.getListSurveys = getListSurveys;
    self.getByAcronymOffline = getByAcronymOffline;


    function getById(activityInfo) {
      return ActivityCollectionService.getById(activityInfo).then(_toEntity);
    }

    function getByAcronymOffline(id, acronym) {
      return ActivityCollectionService.getByAcronymOffline(id, acronym).then(function (survey) {
        return ActivityFactory.fromJsonObject(survey);
      });
    }

    function getSurveys(user) {
      return ActivityCollectionService.getSurveys().then(function (surveys) {
        return surveys.map(function (survey) {
          return ActivityFactory.createOfflineActivity(SurveyFormFactory.fromJsonObject(survey), user);
        });
      }).catch(function (err) {
        return Promise.reject(err);
      });
    }

    function getOfflineSurveys(user) {
      return ActivityCollectionService.getOfflineSurveys().then(function (surveys) {
        return surveys.map(function (survey) {
          return ActivityFactory.createOfflineActivity(SurveyFormFactory.fromJsonObject(survey), user);
        });
      });
    }

    function getListSurveys() {
      return ActivityCollectionService.getListSurveys();
    }


    function save(activity) {
      return _update([_toDbObject(activity)]);
    }

    function discard(activities) {
      return _update(activities.map(_toDbObject));
    }

    function _update(toUpdate) {
      if (!toUpdate || !toUpdate.length) {
        throw new Error('No activity to update.', 'activity-repository-service.js', 50);
      } else {
        var work = _setupWorkProgress();
        return ActivityCollectionService.update(toUpdate).then(work.finish);
      }
    }

    function _setupWorkProgress() {
      var defer = $q.defer();
      _existsWorkingInProgress = defer.promise;

      return {
        finish: function () {
          defer.resolve();
        }
      };
    }

    /*************************************************************************************************
     * The next methods (_toEntity, _restoreEntity and _toDbObject) must be moved to another object
     * that will be responsible for the work of mapping the database objects to entities and
     * vice versa.
     ************************************************************************************************/
    function _toEntity(dbObjects) {
      if (Array.isArray(dbObjects)) {
        return dbObjects.map(function (dbObject) {
          return _restoreEntity(dbObject);
        });
      } else {
        return [_restoreEntity(dbObjects)];
      }
    }

    function _restoreEntity(dbObject) {
      var entity = ActivityFactory.fromJsonObject(dbObject);
      entity.$loki = dbObject.$loki;
      entity.meta = dbObject.meta;
      return entity;
    }

    function _toDbObject(entity) {
      var dbObject = entity.toJSON();
      dbObject.$loki = entity.$loki;
      dbObject.meta = entity.meta;
      dbObject.isDiscarded = entity.isDiscarded;
      return dbObject;
    }

  }
}());
