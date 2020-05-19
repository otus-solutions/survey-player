(function () {
  'use strict';

  angular
    .module('survey.player.datasource')
    .service('SurveyItemDatasourceService', service);

  service.$inject = [
    '$q',
    'otusjs.utils.DatasourceService',
    'ActivityLocalStorageService',
    'SurveyItemRestService',
    'ActivityIndexedDbService',
    '$rootScope'
  ];

  function service($q, DatasourceService, ActivityLocalStorageService, SurveyItemRestService, ActivityIndexedDbService, $rootScope) {
    var self = this;

    /* Public Interface */
    self.up = up;
    self.setupDatasources = setupDatasources;


    function up() {
      var defer = $q.defer();
      defer.resolve(true);
      return defer.promise;
    }

    function setupDatasources(dsDefsArray) {
      SurveyItemRestService.initialize();
      ActivityLocalStorageService.clear();
      return $q(function (resolve, reject) {
        try {
          _getDatasources(dsDefsArray)
            .then(function (dsMap) {
              dsDefsArray.forEach(function (dsDef) {
                dsMap[dsDef.getID()].bindedItems = dsDef.getBindedItems();
              });
              var getAddress = ActivityLocalStorageService.registerDatasource(dsMap);
              DatasourceService.provideDatasourcesAddress(getAddress);
              resolve(true);
            })
            .catch(function (e) {
              reject(e);
            });
        } catch (e) {
          reject(e);
        }
      });
    }


    function _getDatasources(dsDefsArray) {
      var defer = $q.defer();
      var dsMap = {};
      _getAll(dsDefsArray)
        .then(function (promiseArray) {
          promiseArray.forEach(function (promise) {
            var ds = promise.data;
            dsMap[ds.data.id || ds.id] = ds.data;
          });
          defer.resolve(dsMap);
        });
      return defer.promise;
    }

    function _getAll(dsDefsArray) {
      var dsArr = [];
      dsDefsArray.forEach(function (ds) {
        dsArr.push(_getDatasourcesByID(ds.getID()));
      });
      return $q.all(dsArr);
    }

    function _getDatasourcesByID(id) {
      if (!$rootScope.online) {
        return ActivityIndexedDbService.getDatasource(id);
      }
      return SurveyItemRestService.getByID(id).then(function (response) {
        ActivityIndexedDbService.updateDatasource(id, response.data);
        return response;
      }).catch(function () {
        $rootScope.online = false;
        return ActivityIndexedDbService.getDatasource(id);
      });
    }
  }
}());
