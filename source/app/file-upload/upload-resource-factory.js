(function() {
  'use strict';

  angular
    .module('survey.player.file.upload')
    .factory('UploadResourceFactory', UploadResourceFactory);

  UploadResourceFactory.$inject = [
    '$http',
    'SurveyApiService'
  ];

  function UploadResourceFactory($http, SurveyApiService) {

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

    self.post = post;
    self.getByOID = getByOID;
    self.deleteByOID = deleteByOID;

    _init();

    function _init() {
      _restPrefix = SurveyApiService.getFileUploadUrl();
    }

    function post(formData, canceler) {
      return $http({
        method: 'POST',
        url: _restPrefix,
        data: formData,
        timeout: canceler.promise,
        transformRequest: angular.identity
      });
    }

    function getByOID(oid) {
      return $http({
        method: 'POST',
        url: _restPrefix,
        data: oid,
        responseType: "arraybuffer"
      });
    }

    function deleteByOID(oid) {
      return $http({
        method: 'DELETE',
        url: _restPrefix + '/' + oid
      });

    }

    return self;
  }

}());