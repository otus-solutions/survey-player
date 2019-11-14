(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('surveyItemView', {
      template:'<div layout=row flex><div layout=column flex=5></div><div layout=column layout-align="start start" layout-margin=5 layout-fill><span flex=5></span><div layout=row layout-fill><span class=md-subhead ng-show=$ctrl.filters.customID><u>{{$ctrl.item.customID}}</u></span> <span flex=5></span> <span ng-show="$ctrl.filters.displayState && $ctrl.filters.customID">|</span> <span flex=5></span> <span ng-show=$ctrl.filters.displayState class=md-caption>{{$ctrl.item.navigationStateLabel}}</span></div><span flex=5></span><div layout=row layout-fill><span ng-bind-html=$ctrl.item.label.ptBR.formattedText></span></div><div id=fillingBox bind-html-compile=$ctrl.template layout-fill></div><span flex=5></span></div></div>',
      controller: Controller,
      bindings: {
        item: '=',
        filters: '='
      }
    });

  Controller.$inject = [
    'otusjs.player.core.renderer.HtmlBuilderService'
  ];

  function Controller(HtmlBuilderService) {
    var self = this;
    self.$onInit = onInit;

    function onInit() {
      let _templateName = HtmlBuilderService.generateTagName(self.item.templateName);
      self.template = '<' + _templateName + ' item="$ctrl.item" filters="$ctrl.filters"/>';
    }

  }
}());