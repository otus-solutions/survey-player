(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusCalendarQuestionView', {
      template:'<md-content layout-padding><div layout="row" style="margin-top: 15px"><md-datepicker ng-model="$ctrl.answer.date" ng-blur="$ctrl.update()" md-placeholder="Insira a data" ng-disabled="$ctrl.view"></md-datepicker></div></md-content>',
      controller: "otusCalendarQuestionViewCtrl as $ctrl",
      bindings: {
        itemData: '<'
      }
    }).controller("otusCalendarQuestionViewCtrl", Controller);

  Controller.$inject = [];

  function Controller() {
    var self = this;

    self.view = true;

    self.$onInit = function () {
      self.answer = self.itemData.data.answer.value;
    };
  }
}());
