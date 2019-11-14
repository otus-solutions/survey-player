(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusGridTextQuestionView', {
      template:'<div ng-repeat="line in ::$ctrl.itemData.getLinesList()" ng-init="outerIndex=$index" layout=row flex><div ng-repeat="gridText in ::line.getGridTextList()" ng-init="innerIndex=$index" layout-padding layout=row flex><md-input-container flex><label ng-bind-html=::gridText.label.ptBR.formattedText></label><div><textarea ng-model=$ctrl.answerArray[outerIndex][innerIndex].value ng-blur="$ctrl.update(outerIndex, innerIndex)" ng-disabled=$ctrl.view></textarea></div><div style="color: gray;" ng-bind-html=::gridText.unit.ptBR.plainText></div></md-input-container></div></div>',
      controller: "otusGridTextQuestionViewCtrl as $ctrl",
      bindings: {
        itemData: '<'
      }
    }).controller("otusGridTextQuestionViewCtrl", Controller);

  Controller.$inject = [];

  function Controller() {
    var self = this;

    /* Public Interface */
    self.$onInit = onInit;

    function onInit() {
      self.answerArray = self.itemData.data.answer.value;
      self.view = true;
    }
   }
}());
