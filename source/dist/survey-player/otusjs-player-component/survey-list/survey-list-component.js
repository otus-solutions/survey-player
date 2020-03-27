(function () {
  'use strict';

  angular.module('otusjs.player.component')
    .component('surveyList', {
      template:'<style>\r\n  md-chips.md-default-theme .md-chips, md-chips .md-chips {\r\n    box-shadow: none !important;\r\n  }\r\n</style><md-content layout="column" layout-padding flex><md-list flex ng-cloak><div layout-align="start center" flex="100" layout="row"><md-subheader flex>Atividades</md-subheader></div><md-list-item class="md-2-line" ng-repeat="preActivity in $ctrl.preActivities" ng-click="null"><md-chips layout-padding><md-chip><strong>{{ preActivity.surveyForm.acronym}}</strong></md-chip></md-chips><div class="md-list-item-text" layout="column"><span class="md-body-1">{{ preActivity.surveyForm.name }}</span><p class="md-caption">Versão: {{ preActivity.surveyForm.version }}</p></div><md-divider></md-divider></md-list-item></md-list></md-content>',
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