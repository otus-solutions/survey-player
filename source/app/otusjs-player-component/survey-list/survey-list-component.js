(function () {
  'use strict';

  angular.module('otusjs.player.component')
    .component('surveyList', {
      templateUrl: 'app/otusjs-player-component/survey-list/survey-list-template.html',
      controller: Controller,
      bindings: {
        user: '=',
        auth: '='
      }
    });

  Controller.$inject = [
    'SurveyClientService',
    '$scope'
  ];

  function Controller(SurveyClientService, $scope) {
    var self = this;

    self.$onInit = onInit;
    self.isUpdate = isUpdate;
    self.update = update;

    self.allUpdated = true;

    function onInit() {
      update();
    }

    function update() {
      self.preActivities = [];
      if ($scope.$root.online) {
        SurveyClientService.getSurveys().then(function (response) {
          self.preActivities = angular.copy(response);
          self.list = SurveyClientService.getListSurveys();
        });
      } else {
        SurveyClientService.getOfflineSurveys().then(function (response) {
          self.preActivities = angular.copy(response);
          self.list = SurveyClientService.getListSurveys();
        });
      }
    }

    function isUpdate(activity) {
      let _data = {
        acronym: activity.surveyForm.acronym,
        version: activity.surveyForm.version
      };
      if ((!!self.list.find(item => {
        return item.acronym === _data.acronym && item.version == _data.version;
      }))) {
        return true;
      }
      self.allUpdated = false;
      return false;
    }


  }
})();