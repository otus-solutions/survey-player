(function () {
  'use strict';

  angular
    .module('survey.player.datasource')
    .factory('DatasourceResourceFactory', DatasourceResourceFactory);

  DatasourceResourceFactory.$inject = [
    '$http',
    'SurveyApiService'
  ];

  function DatasourceResourceFactory($http, SurveyApiService) {
    var self = this;

    /* Public methods */
    self.create = create;

    function create() {
      return new HttpFileUpload($http, SurveyApiService);
    }
    return self;
  }

  function HttpFileUpload($http, SurveyApiService) {
    var self = this;
    var _restPrefix;

    self.create = create;
    self.update = update;
    self.list = list;
    self.getByID = getByID;

    _init();

    function _init() {
      _restPrefix = SurveyApiService.getDatasourceUrl();
    }

    function create(formData) {
      return $http({
        method: 'POST',
        url: _restPrefix,
        data: formData,
        transformRequest: angular.identity
      });
    };

    function update(formData) {
      return $http({
        method: 'PUT',
        url: _restPrefix,
        data: formData,
        transformRequest: angular.identity
      });
    };

    function list() {
      return $http({
        method: 'GET',
        url: _restPrefix
      });
    };

    function getByID(id) {
      return $http({
        method: 'GET',
        url: _restPrefix + '/' + id
      });
    };
    return self;
  }
}());