(function () {
  'use strict';

  angular
    .module('survey.player.file.upload')
    .service('FileUploadDatasourceService', service);

  service.$inject = [
    '$q',
    'otusjs.utils.FileUploadFactory',
    'FileUploadRestService'
  ];

  function service($q, FileUploadService, FileUploadRestService) {
    var self = this;

    /* Public Interface */
    self.setupUploader = setupUploader;

    function setupUploader() {
      return $q(function (resolve, reject) {
        try {
          FileUploadRestService.initialize();
          FileUploadService.setUploadInterface(FileUploadRestService)
            .then(function (response) {
              resolve(response);
            })
            .catch(function (e) {
              reject(e);
            });
        } catch (e) {
          reject(e);
        }
      });
    }
  }
}());
