(function () {
  'use strict';

  angular
    .module('otusjs.player.standalone', [
      /* External dependencies */
      'ngMaterial',
      'ngMessages',
      'ngAnimate',
      'ui.router',
      'ui.mask',
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
    'StorageLoaderService',
    'ServiceWorker'
  ];

  function Runner($injector, StorageLoaderService, ServiceWorker) {
    ServiceWorker.register();
  }

}());
