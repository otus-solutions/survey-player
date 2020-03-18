(function () {
  'use strict';

  angular
    .module('otusjs.player.standalone', [
      /* External dependencies */
      'ngMaterial',
      'ngMessages',
      'ngAnimate',
      'ui.router',

      'angular-bind-html-compile',
      /* Exportable dependencies */
      'otusjs.player.core',
      'otusjs.player.component',
      /* Standalone dependencies */
      'survey.player.client',
      'survey.player.api',
      'survey.player.datasource',
      'survey.player.staticVariable',
      'survey.player.storage',
      'otusjs.player.config',
      'otusjs.player.data',
      'otusjs.player.viewer',
      'survey.player.file.upload',
      'ngCookies',
      'ngResource',
      'otusjs'
    ]).value('OtusLocalStorage', [
    'ActivityLocalStorageService'
  ])
    .run(Runner);

  Runner.$inject = [
    '$injector',
    'StorageLoaderService'
  ];

  function Runner($injector, StorageLoaderService) {
    _loadOtusDb(StorageLoaderService)
      .then(function () {
      });
  }

  function _loadOtusDb(StorageLoaderService) {
    var OTUS_DB = 'otus';

    // StorageLoaderService.initializeSessionStorage();

    return StorageLoaderService.dbExists(OTUS_DB).then(function (dbExists) {
      if (dbExists) {
        return StorageLoaderService.loadIndexedStorage(OTUS_DB);
      } else {
        return StorageLoaderService.createIndexedStorage(OTUS_DB);
      }
    });
  }

}());
