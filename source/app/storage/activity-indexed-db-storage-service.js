(function () {
  'use strict';

  angular.module('survey.player.storage')
    .service('ActivityIndexedDbService', Service);

  Service.$inject = [
    '$q'
  ];

  function Service($q) {
    var self = this;

    const DB_TABLE_ACTIVITIES = 'SurveyPlayerActivities';
    const DB_TABLE_DATASOURCES = 'Datasources';
    const OBJECT_TYPE = 'SurveyForm';
    const INIT_QUERY = "CREATE DATABASE IF NOT EXISTS surveyPlayer; ATTACH INDEXEDDB DATABASE surveyPlayer; USE surveyPlayer;";
    const CREATE_TABLES = "CREATE TABLE IF NOT EXISTS ".concat(DB_TABLE_ACTIVITIES).concat('; CREATE TABLE IF NOT EXISTS '.concat(DB_TABLE_DATASOURCES));
    self.update = update;
    self.insert = insert;
    self.getAllActivities = getAllActivities;
    self.getActivity = getActivity;
    self.getList = getList;

    self.list = [];

    function getList() {
      return self.list
    }

    function _dropDb(name) {
      alasql('DROP INDEXEDDB DATABASE '.concat(name))
    }

    function update(activities) {
      if (Array.isArray(activities) && _isValid(activities)){
        _updateList(activities);
        _dropDb('surveyPlayer');
        alasql(INIT_QUERY, [], function() {
          alasql(CREATE_TABLES, [], function (res) {
            if (res[0] === 1){
              var query = "SELECT * INTO ".concat(DB_TABLE_ACTIVITIES).concat(' FROM ?');
              alasql(query, [activities]);

            }
          });
        });
      }
    }

    function insert(newActivities) {
      if (_isValid(newActivities)){
        var _activities = getAllActivities();
        _activities = Array.prototype.concat.apply(_activities, newActivities);
        update(_activities);
      }
    }

    function getAllActivities() {
      var defer = $q.defer();
      alasql(INIT_QUERY, [], function() {
        alasql.promise('SELECT * FROM '.concat(DB_TABLE_ACTIVITIES)).then(function (response) {
          defer.resolve(response)
        })

      });

      return defer.promise;
    }

    function getActivity(acronym) {
      var defer = $q.defer();
      alasql(INIT_QUERY, [], function() {
        alasql.promise('SELECT * FROM '.concat(DB_TABLE_ACTIVITIES).concat(' WHERE surveyForm->acronym = '.concat(acronym))).then(function (response) {
          defer.resolve(response)
        })

      });

      return defer.promise;
    }

    function _isValid(data) {
      var _activities = Array.prototype.concat.apply(data)
        .filter(function (activity) {
          return activity.objectType == OBJECT_TYPE;
      });
      return !!_activities.length;
    }

    function _updateList(surveys) {
      var _acronyms = [];
      Array.prototype.concat.apply(surveys).forEach(function (survey) {
        _acronyms.push({acronym: survey.surveyTemplate.identity.acronym, version: survey.version});
      });
      var _preList = angular.copy([...new Set(_acronyms)]);
      self.list = _preList.map(function (value) {
        var _list = _acronyms.filter(function (obj) {
          return obj.acronym === value.acronym;
        });
        return {acronym: value.acronym, version: Math.max(..._list.map(obj => { return obj.version }))}
      });
    }

    function _validateSurvey() {

    }

  }
})();