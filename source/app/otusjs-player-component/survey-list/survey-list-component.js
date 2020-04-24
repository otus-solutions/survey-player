(function () {
  'use strict';

  angular.module('otusjs.player.component')
    .component('surveyList', {
      templateUrl: 'app/otusjs-player-component/survey-list/survey-list-template.html',
      controller: Controller,
      bindings: {
        user: '=',
        preActivities: '=',
        isUpdate: '='
      }
    });

  Controller.$inject = [];

  function Controller() {
    var self = this;
  }
})();