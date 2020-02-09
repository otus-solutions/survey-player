(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusCheckboxQuestionView', {
      template:'<md-content layout-padding style="margin-top: 12px"><md-content ng-repeat="option in $ctrl.itemData.options track by $index" flex><md-checkbox ng-model="$ctrl.answerArray[$index].state" ng-change="$ctrl.update($index)" layout="row" style="margin: 7px" ng-disabled="$ctrl.view"><otus-label item-label="option.label.ptBR.formattedText"></otus-label></md-checkbox></md-content></md-content>',
      controller: "otusCheckboxQuestionViewCtrl as $ctrl",
      bindings: {
        itemData: '<'
      }
    }).controller("otusCheckboxQuestionViewCtrl", Controller);

  function Controller() {
    var self = this;

    self.view = true;

    self.$onInit = function () {
      self.answerArray = self.itemData.data.answer.value;
    };
  }
}());
