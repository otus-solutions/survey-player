(function () {
  'use strict';

  angular.module('survey.player.storage')
    .service('ActivityIndexedDbService', Service);

  Service.$inject = [
    '$q',
    'SurveyItemRestService'
  ];

  function Service($q, SurveyItemRestService) {
    var self = this;

    const DB_TABLE_ACTIVITIES = 'SurveyPlayerActivities';
    const DB_TABLE_DATASOURCES = 'Datasources';
    const OBJECT_TYPE = 'SurveyForm';
    const INIT_QUERY = "CREATE INDEXEDDB DATABASE IF NOT EXISTS surveyPlayer; ATTACH INDEXEDDB DATABASE surveyPlayer; USE surveyPlayer;";
    const TABLE_ACTIVITY = "CREATE TABLE IF NOT EXISTS ".concat(DB_TABLE_ACTIVITIES).concat("; ");
    const TABLE_DATASOURCE = "CREATE TABLE IF NOT EXISTS ".concat(DB_TABLE_DATASOURCES).concat("; ");
    const CREATE_TABLES = TABLE_ACTIVITY.concat(TABLE_DATASOURCE);
    self.update = update;
    self.insert = insert;
    self.getAllActivities = getAllActivities;
    self.getActivity = getActivity;
    self.getDatasource = getDatasource;
    self.updateDatasource = updateDatasource;
    self.getSurveyList = getSurveyList;

    function _persist(activities, datasources) {
      alasql(INIT_QUERY, [], function () {
        alasql(CREATE_TABLES, [], function (res) {
          if (res[0] === 1) {
            var query = "SELECT * INTO ".concat(DB_TABLE_ACTIVITIES).concat(' FROM ?');
            alasql(query, [activities]);
            query = "SELECT * INTO ".concat(DB_TABLE_DATASOURCES).concat(' FROM ?');
            alasql(query, [datasources]);
          }
        });
      });
    }

    function update(activities) {
      if (Array.isArray(activities) && _isValid(activities)) {
        alasql('DROP INDEXEDDB DATABASE surveyPlayer;');
        activities.forEach(function (activity) {
          activity.acronym = activity.surveyTemplate.identity.acronym;
        });
        _getDatasources().then(function (datasources) {
          _persist(activities, datasources);

        }).catch(function (datasources) {
          _persist(activities, datasources);
        });
      }
    }

    function insert(newActivities) {
      if (_isValid(newActivities)) {
        var _activities = getAllActivities();
        _activities = Array.prototype.concat.apply(_activities, newActivities);
        update(_activities);
      }
    }

    function getAllActivities() {
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
            return survey
          });
          defer.resolve(list);
        }).catch(function (err) {
          defer.reject(err);
        });

      });

      return defer.promise;
    }

    function getActivity(acronym) {
      var defer = $q.defer();
      alasql(INIT_QUERY, [], function () {
        alasql.promise('SELECT * FROM '.concat(DB_TABLE_ACTIVITIES).concat(' WHERE acronym = "'.concat(acronym).concat('"; '))).then(function (response) {
          defer.resolve(response);
        });

      });

      return defer.promise;
    }

    function getDatasource(id) {
      var defer = $q.defer();
      alasql(INIT_QUERY, [], function () {
        alasql.promise('SELECT * FROM '.concat(DB_TABLE_DATASOURCES).concat(' WHERE id = "'.concat(id).concat('";'))).then(function (response) {
          if (response.length) {
            defer.resolve({data: response[0]});
          } else {
            defer.reject();
          }
        });

      });

      return defer.promise;
    }

    function updateDatasource(id, data) {
      var defer = $q.defer();
      alasql(INIT_QUERY, [], function () {
        alasql.promise('UPDATE '.concat(DB_TABLE_DATASOURCES).concat(' SET data = ? WHERE id = "'.concat(id).concat('";')), [data])
          .then(function (response) {
            if (response.length) {
              defer.resolve({data: response[0]});
            } else {
              defer.reject();
            }
          })
          .catch(function(e){
            defer.reject();
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

    function _getDatasources() {
      SurveyItemRestService.initialize();
      return SurveyItemRestService.list().then(function (response) {
        return response.data.data;
      }).catch(function () {
        return [];
      });
    }

  }
})();