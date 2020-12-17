(function () {
  'use strict';

  angular.module('survey.player.storage')
    .service('PendentActivitiesDbStorageService', Service);

  Service.$inject = [
    '$q',
    '$cookies'
  ];

  function Service($q, $cookies) {
    var self = this;

    var DB_TABLE_ACTIVITIES = 'PendentActivities';
    var OBJECT_TYPE = 'Activity';
    var INIT_QUERY = "CREATE INDEXEDDB DATABASE IF NOT EXISTS PendentActivities; ATTACH INDEXEDDB DATABASE PendentActivities; USE PendentActivities;";
    var TABLE_ACTIVITY = "CREATE TABLE IF NOT EXISTS ".concat(DB_TABLE_ACTIVITIES).concat("; ");
    var CREATE_TABLES = TABLE_ACTIVITY;
    self.update = update;
    self.insert = insert;
    self.getAll = getAll;
    self.getActivity = getActivity;
    self.getSurveyList = getSurveyList;
    self.removeActivity = removeActivity;

    function _persist(activities) {
      alasql(INIT_QUERY, [], function () {
        alasql(CREATE_TABLES, [], function (res) {
          if (res === 1) {
            var query = "SELECT * INTO ".concat(DB_TABLE_ACTIVITIES).concat(' FROM ?');
            alasql(query, [activities]);
          }
        });
      });
    }

    function update(activities) {
      if (Array.isArray(activities)) {
        alasql('DROP INDEXEDDB DATABASE PendentActivities;');
        _persist(activities);
      }
    }

    function insert(activities) {
      if (_isValid(activities)) {
        getAll().then(function (res) {

          let _filteredActivities = res.filter(function (oldActivity) {
            return oldActivity._id === activities[0]._id;
          })
          let _activities = []
          if(_filteredActivities.length > 0) {
            _activities = Array.prototype.concat.apply(res)
          }else{
            _activities = Array.prototype.concat.apply(res, activities)
          }
          _insertCookie(_activities)
          update(_activities);
        }).catch(function (err) {
          update(Array.prototype.concat.apply(activities));
        })
       }
    }

    function _insertCookie(activities) {
      let parsedActivities = []
      for(let activity of activities) {
        parsedActivities.push({
          _id: activity._id,
          rn: activity.participantData.recruitmentNumber,
          acronym: activity.surveyForm.acronym
        })
      }
      $cookies.put('pendent-activities', JSON.stringify(parsedActivities), [{expires: new Date().getFullYear() + 1}])
    }

    function removeActivity(id){
      var defer = $q.defer();
      alasql(INIT_QUERY, [], function () {
        alasql.promise('DELETE FROM '.concat(DB_TABLE_ACTIVITIES)
            .concat(' WHERE ')
            .concat('_id = "')
            .concat(id)
            .concat('";'))
            .then( function (res) {
              defer.resolve(res);
            }).catch(function (err) {
            defer.reject(err)
          });
      })
      return defer.promise;
    }

    function getAll() {
      var defer = $q.defer();
      alasql(INIT_QUERY, [], function () {
        alasql.promise('SELECT * FROM '.concat(DB_TABLE_ACTIVITIES)).then(function (response) {
          defer.resolve(response);
        }).catch(function (err) {
          defer.reject(err);
        });
      });
      return defer.promise;
    }

    function getSurveyList() {
      var defer = $q.defer();
      alasql(INIT_QUERY, [], function () {
        alasql.promise('SELECT acronym, version, surveyTemplate FROM '.concat(DB_TABLE_ACTIVITIES)).then(function (response) {
          var list = response.map(function (survey) {
            survey.name = survey.surveyTemplate.identity.name;
            delete survey.surveyTemplate;
            return survey;
          });
          defer.resolve(list);
        }).catch(function (err) {
          defer.reject(err);
        });

      });

      return defer.promise;
    }

    function getActivity(id) {
      var defer = $q.defer();
      alasql(INIT_QUERY, [], function () {
        alasql.promise('SELECT * FROM '.concat(DB_TABLE_ACTIVITIES).concat(' WHERE _id = "'.concat(id).concat('"; '))).then(function (response) {
          defer.resolve(response);
        });
      });
      return defer.promise;
    }

    function _isValid(data) {
      var _activities = Array.prototype.concat.apply(data)
        .filter(function (activity) {
          return activity.objectType === OBJECT_TYPE;
        });
      return !!_activities.length;
    }

  }
})();