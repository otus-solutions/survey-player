(function () {
  'use strict';

  angular.module('survey.player.storage')
    .service('CollectIndexedDbService', Service);

  Service.$inject = [
    '$q',
    'SurveyItemRestService',
    'SurveyApiService'
  ];

  function Service($q, SurveyItemRestService, SurveyApiService) {
    var self = this;
    //
    // const DB_TABLE_ACTIVITIES = 'SurveyPlayerActivities';
    const DB_TABLE_COLLECTIONS = 'Collection';
    const OBJECT_TYPE = 'OfflineActivityCollection';
    const INIT_QUERY = "CREATE DATABASE IF NOT EXISTS activityCollections; ATTACH INDEXEDDB DATABASE activityCollections; USE activityCollections;";
    const TABLE_COLLECTION = "CREATE TABLE IF NOT EXISTS ".concat(DB_TABLE_COLLECTIONS).concat("; ");
    // const TABLE_DATASOURCE = "CREATE TABLE IF NOT EXISTS ".concat(DB_TABLE_DATASOURCES).concat("; ");
    // const CREATE_TABLES = TABLE_ACTIVITY.concat(TABLE_DATASOURCE);
    self.updateAll = updateAll;
    self.insert = insert;
    self.getAllCollections = getAllCollections;
    self.dropDb = dropDb;

    function dropDb() {
      alasql('DROP INDEXEDDB DATABASE '.concat(DB_TABLE_COLLECTIONS));
    }

    function _persist(collections) {
      alasql(INIT_QUERY, [], function () {
        alasql(TABLE_COLLECTION, [], function (res) {
          if (res === 1) {
            var query = "SELECT * INTO ".concat(DB_TABLE_COLLECTIONS).concat(' FROM ?');
            alasql(query, [collections]);
          }
        });
      });
    }

    function updateAll(collections) {
      if (Array.isArray(collections) && _isValid(collections)) {
        dropDb();
        _persist(collections);
      }
    }

    function insert(newCollection) {
      if (_isValid(newCollection)) {
        var _activities = getAllCollections(newCollection.userId);
        _activities = Array.prototype.concat.apply(_activities, newCollection);
        updateAll(_activities);
      }
    }

    function getAllCollections(email) {
      var defer = $q.defer();
      alasql(INIT_QUERY, [], function () {
        alasql.promise('SELECT * FROM '.concat(DB_TABLE_COLLECTIONS).concat(' WHERE userId = ').concat(email)).then(function (response) {
          defer.resolve(response);
        }).catch(function (err) {
          defer.reject(err);
        });

      });

      return defer.promise;
    }

    // function updateCollection(collection) {
    //   alasql(INIT_QUERY, [], function () {
    //     alasql(TABLE_COLLECTION, [], function (res) {
    //       if (res === 1) {
    //         var query = "SELECT * INTO ".concat(DB_TABLE_COLLECTIONS).concat(' FROM ? WHERE _id = ').concat(collection._id);
    //         alasql(query, [collection]);
    //       }
    //     });
    //   });
    // }

    function _isValid(data) {
      var _collections = Array.prototype.concat.apply(data)
        .filter(function (activity) {
          return activity.objectType == OBJECT_TYPE;
        });
      return !!_collections.length;
    }

  }
})();