(function () {
  'use strict';

  angular
    .module('otusjs.player.standalone')
    .service('ActivityCollectionRestService', Service);

  Service.$inject = [
    '$q',
    '$http',
    'SurveyApiService'
  ];

  function Service($q, $http, SurveyApiService) {
    var self = this;

    /* Public methods */

    self.fetchOfflineCollections = fetchOfflineCollections;
    self.saveOffline = saveOffline;

    function _getCollectAddress() {
      return SurveyApiService.getCollectUrl();
    }

    function fetchOfflineCollections() {
      var defer = $q.defer();
      $http.get(_getCollectAddress()).success(function (response) {
        defer.resolve(response.data);
      }).error(function (error) {
        console.error('Cannot GET collections.');
        defer.reject(error);
      });
      return defer.promise;
    }

    function saveOffline(collection) {
      var defer = $q.defer();
      $http.put(_getCollectAddress(), collection).success(function (response) {
        defer.resolve(response.data);
      }).error(function (error) {
        console.error('Cannot GET a survey template.');
        defer.reject(error);
      });
      return defer.promise;
    }


  }
}());
