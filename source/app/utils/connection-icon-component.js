(function () {
  'use strict';

  angular.module('otusjs.player.standalone')
    .component('connectionIcon', {
      template: `<md-icon ng-if="$ctrl.online">wifi</md-icon>
        <md-icon ng-if="!$ctrl.online">wifi_off</md-icon>
        <md-tooltip ng-if="$ctrl.online">Online</md-tooltip>
        <md-tooltip ng-if="!$ctrl.online">Offline</md-tooltip>`,
      controller: Controller
    });

  Controller.$inject = [
    '$window',
    '$rootScope',
    '$scope'
  ];

  function Controller($window, $rootScope, $scope) {
    var self = this;


    $scope.$on("offline", function () {
      self.online = false;
    });

    $scope.$on("online", function () {
      self.online = true;
    });

    $scope.$watch('$root.online', function (status) {
      self.online = status;
    });
  }
})();
