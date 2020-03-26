(function () {
  'use strict';

  angular.module('survey.player.storage')
    .service('CollectIndexedDbService', Service);

  Service.$inject = [
    '$q'
  ];

  function Service($q) {
    var self = this;

    const OBJECT_TYPE = 'OfflineActivityCollection';
    const DB_TABLE_COLLECTIONS = 'OfflineActivityCollection';
    const INIT_QUERY = "CREATE INDEXEDDB DATABASE IF NOT EXISTS activityCollections; ATTACH INDEXEDDB DATABASE activityCollections; USE activityCollections;";
    const TABLE_COLLECTION = "CREATE TABLE IF NOT EXISTS ".concat(DB_TABLE_COLLECTIONS).concat("; ");

    self.updateAllCollections = updateAllCollections;
    self.insertCollection = insertCollection;
    self.getAllCollections = getAllCollections;
    self.getCollection = getCollection;
    self.updateCollection = updateCollection;
    self.removeCollection = removeCollection;
    self.dropDb = dropDb;

    function dropDb() {
      alasql('DROP INDEXEDDB DATABASE activityCollections');
    }

    function _persist(table_name, data) {
      alasql(INIT_QUERY, [], function () {
        alasql(TABLE_COLLECTION, [], function (res) {
          var query = "SELECT * INTO ".concat(table_name).concat(' FROM ?');
          alasql('DELETE FROM '.concat(table_name));
          alasql(query, [data]);

        });
      });
    }

    function updateAllCollections(collections) {
      if (Array.isArray(collections)) {
        if (collections.length) {
          if (_isValid(collections)) {
            // dropDb();
            _persist(DB_TABLE_COLLECTIONS, collections);
          }
        } else {
          dropDb();
        }

      }
    }

    function insertCollection(newCollection) {
      if (_isValid(newCollection)) {
        alasql(INIT_QUERY, [], function () {
          alasql(TABLE_COLLECTION, [], function (res) {
            var query = "INSERT INTO ".concat(DB_TABLE_COLLECTIONS).concat(' SELECT * FROM ?');
            alasql.promise(query, [Array.prototype.concat.apply(newCollection)]);
          });
        });
      }
    }

    function updateCollection(collection) {
      if (_isValid(collection)) {
        alasql(INIT_QUERY, [], function () {
          alasql(TABLE_COLLECTION, [], function (res) {
            var params = [];
            var _properties = Object.getOwnPropertyNames(collection);
            var SET_VALUES = "";
            _properties.forEach(function (propName) {
              SET_VALUES = SET_VALUES.concat(propName).concat(' = ?,');
              params.push(collection[propName]);
            });
            SET_VALUES = SET_VALUES.substring(0, (SET_VALUES.length - 1));
            var query = "UPDATE "+ DB_TABLE_COLLECTIONS +" SET ".concat(SET_VALUES).concat(' WHERE code = "'+collection.code+'"');
            alasql.promise(query, params);
          });
        });
      }
    }

    function removeCollection(code) {
      alasql(INIT_QUERY, [], function () {
        alasql(TABLE_COLLECTION, [], function (res) {
          alasql('DELETE FROM '.concat(DB_TABLE_COLLECTIONS).concat(' WHERE code = ?'), [code]);
        });
      });
    }

    function getAllCollections(email) {
      var defer = $q.defer();
      alasql(INIT_QUERY, [], function () {
        alasql.promise('SELECT * FROM '.concat(DB_TABLE_COLLECTIONS).concat(' WHERE userEmail = "'+email+'"')).then(function (response) {
          defer.resolve(response);
        }).catch(function (err) {
          defer.reject(err);
        });

      });

      return defer.promise;
    }

    function getCollection(code) {
      var defer = $q.defer();
      alasql(INIT_QUERY, [], function () {
        alasql.promise('SELECT * FROM '.concat(DB_TABLE_COLLECTIONS).concat(' WHERE code = "'+code+'"')).then(function (response) {
          defer.resolve(response);
        }).catch(function (err) {
          defer.reject(err);
        });

      });

      return defer.promise;
    }

    function _isValid(data) {
      var _collections = Array.prototype.concat.apply(data)
        .filter(function (activity) {
          return activity.objectType == OBJECT_TYPE;
        });
      return !!_collections.length;
    }

  }
})();