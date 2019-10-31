(function () {
  'use strict';

  angular
    .module('otusjs.player.config')
    .config(stateConfiguration);

  stateConfiguration.$inject = ['$stateProvider', '$urlRouterProvider','$mdThemingProvider',
    '$mdIconProvider'];

  function stateConfiguration($stateProvider, $urlRouterProvider, $mdThemingProvider, $mdIconProvider) {


    var newLightBlueMap = $mdThemingProvider.extendPalette('light-blue', {
      '500': '#ffffff',
      'contrastDarkColors': ['500','A100','A400']
    });
    $mdThemingProvider.definePalette('new-light-blue', newLightBlueMap);

    $mdThemingProvider.theme('default')
      .primaryPalette('teal', {
        'default': '700',
        'hue-1': '500',
        'hue-2': '600',
        'hue-3': '800'
      })
      .accentPalette('new-light-blue', {
        'default': 'A700',
        'hue-1': '500',
        'hue-2': 'A100',
        'hue-3': 'A400'
      })
      .warnPalette('red', {
        'default': 'A200',
        'hue-2': 'A100',
        'hue-3': 'A400'
      })
      .backgroundPalette('grey');

    /*Configuration icons*/
    /* 24 is the size default of icons */
    // $mdIconProvider.defaultIconSet('app/static-resource/image/icons/mdi.svg', 24);

    $stateProvider
      .state('sheet', {
        url: '/sheet',
        templateUrl: 'app/otusjs-player-viewer/sheet-view-template.html',
        // resolve: {
        //   resolvedSurveyTemplate: function prepareWorkEnvironment(FakeDataService, $q) {
        //     var deferred = $q.defer();
        //     FakeDataService.getSurveyTemplate().then(function (data) {
        //       deferred.resolve(data);
        //     });
        //     return deferred.promise;
        //   }
        // },
        controller: 'SheetViewController as sheetViewCtrl'
      });

    $stateProvider.state('/', {
      url: '/',
      template: '<activity-viewer layout-fill="" flex></activity-viewer>',
      // resolve: {
      //   survey: function (FakeDataService, $q) {
      //     var deferred = $q.defer();
      //     return FakeDataService.getSurveyTemplate().then(function (data) {
      //       deferred.resolve(data);
      //     });
      //     // return deferred.promise;
      //   }
      // }
    });

    $urlRouterProvider.otherwise('/');
    // $locationProvider.html5Mode(true);
  }

}());
