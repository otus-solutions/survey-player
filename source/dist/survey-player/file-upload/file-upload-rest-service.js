(function() {
  'use strict';

  angular
    .module('survey.player.file.upload')
    .service('FileUploadRestService', Service);

  Service.$inject = [
    '$q',
    'UploadResourceFactory'
  ];

  function Service($q, UploadResourceFactory) {
    var self = this;
    var _rest = null;

    /* Public methods */
    self.initialize = initialize;
    self.post = post;
    self.getByOID = getByOID;
    self.deleteByOID = deleteByOID;
    self.setContentType = setContentType;

    function initialize() {
      _rest = UploadResourceFactory.create();
    }

    function post(data, canceler) {
      _restTest();

      return _rest.post(data, canceler);
    }

    function getByOID(oid) {
      _restTest();

      return _rest.getByOID(oid);
    }

    function deleteByOID(oid) {
      _restTest();
      return _rest.deleteByOID(oid);
    }

    function setContentType(type) {
      _restTest();
      _rest.setContentType(type);
    }

    function _restTest(){
      if (!_rest) {
        initialize();
      }
    }

  }
}());
