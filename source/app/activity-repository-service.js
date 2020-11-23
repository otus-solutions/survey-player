(function () {
  'use strict';

  angular
    .module('otusjs.player.standalone')
    .service('ActivityRepositoryService', Service);

  Service.$inject = [
    '$q',
    'otusjs.model.activity.ActivityFactory',
    'SurveyFormFactory',
    'ActivityCollectionService',
    '$state',
    'STATE',
    'otusjs.player.core.player.PlayerService'
  ];

  function Service($q, ActivityFactory, SurveyFormFactory, ActivityCollectionService, $state, STATE, PlayerService) {
    var self = this;
    var _existsWorkingInProgress = null;

    /* Public methods */

    self.save = save;
    self.discard = discard;
    self.getById = getById;
    self.getSurveys = getSurveys;
    self.getAllActivities = getAllActivities;
    self.getByAcronymOffline = getByAcronymOffline;


    function getById(activityInfo) {
      return ActivityCollectionService.getById(activityInfo)
        .then(_toEntity)
        .catch(error => {  return Promise.reject(error); })
    }

    function getByAcronymOffline(id, acronym) {
      return ActivityCollectionService.getByAcronymOffline(id, acronym).then(function (survey) {
        return ActivityFactory.fromJsonObject(survey);
      });
    }

    function getSurveys() {
      return ActivityCollectionService.getSurveyList().then(function (surveys) {
        return surveys;
      }).catch(function (err) {
        return Promise.reject(err);
      });
    }

    function getAllActivities(user, filter) {
      return ActivityCollectionService.getAllActivities().then(function (surveys) {
        return Array.prototype.concat.apply(filter).map(function (selectedSurvey) {
          let surveyForm = surveys.find(function (survey) {
            return survey.acronym === selectedSurvey.acronym;
          });
          return ActivityFactory.createOfflineActivity(SurveyFormFactory.fromJsonObject(surveyForm), user).toObjectJson();
        });

      }).catch(function (err) {
        return Promise.reject(err);
      });
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
      }

      var work = _setupWorkProgress();
      return ActivityCollectionService.update(toUpdate)
        .then(work.finish)
        .catch(error => { return Promise.reject(error); });
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
      }
      return [_restoreEntity(dbObjects)];
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
