(function () {
  'use strict';

  angular
    .module('otusjs.player.standalone')
    .service('ActivityRepositoryService', Service);

  Service.$inject = [
    '$q',
    'otusjs.model.activity.ActivityFactory',
    'ActivityCollectionService'
  ];

  function Service($q, ActivityFactory, ActivityCollectionService) {
    var self = this;
    var _existsWorkingInProgress = null;

    /* Public methods */

    self.save = save;
    self.discard = discard;
    self.getById = getById;


    function getById(activityInfo) {
      return ActivityCollectionService.getById(activityInfo).then(_toEntity);
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
