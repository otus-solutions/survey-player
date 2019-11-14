(function() {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusTimeQuestionView', {
      template:'<md-content layout-padding><div layout=row><md-button ng-click=$ctrl.currentTime() class="md-fab md-raised md-mini" aria-label="Hora Atual" ng-disabled="$ctrl.itemData.options.data.disabledButton.value || $ctrl.view"><md-icon>access_time</md-icon><md-tooltip md-direction=down>Hora Atual</md-tooltip></md-button><md-input-container class=md-block flex-gt-sm=45><input id=inputtime type=time ng-model=$ctrl.answer.date ng-blur=$ctrl.update($event) ng-disabled=$ctrl.view aria-label=Tempo></md-input-container></div></md-content>',
      controller: "otusTimeQuestionViewCtrl as $ctrl",
      bindings: {
        itemData: '<'
      }
    }).controller("otusTimeQuestionViewCtrl", Controller);

  Controller.$inject = [];

  function Controller() {
    var self = this;

    self.view = true;

    self.$onInit = function() {
      self.answer = self.itemData.data.answer.value;
    };

  }

}());
