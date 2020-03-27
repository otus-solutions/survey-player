(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusViewerFilters', {
      template:'<md-bottom-sheet class="md-list md-has-header"><div layout="row" layout-align="start center" ng-cloak><md-subheader ng-cloak>Filtros</md-subheader></div><div ng-cloak layout="row" layout-fill><md-content layout-align="start space-around"><md-checkbox class="md-grid-item-content" ng-model="filters.participantData">Dados do participante</md-checkbox><md-checkbox class="md-grid-item-content" ng-model="filters.customID">Id de questão</md-checkbox><md-checkbox class="md-grid-item-content" ng-model="filters.state.SKIPPED">Questões puladas</md-checkbox><md-checkbox class="md-grid-item-content" ng-model="filters.state.NOT_VISITED">Questões não visitadas</md-checkbox><md-checkbox class="md-grid-item-content" ng-model="filters.displayState">Estado da questão</md-checkbox></md-content></div><div ng-cloak layout-padding layout="row" layout-align="center center"><p class="caption-sheet">Modo de visualização de atividade.</p></div></md-bottom-sheet>',
      controller: 'otusViewFiltersController as $ctrl',
      bindings: {
        filters: '='
      }
    })
    .controller('otusViewFiltersController', Controller);

  function Controller() {
    var self = this;
    self.$onInit = onInit;

    function onInit() {
      _setInitialFilters();
    }

    function _setInitialFilters() {
      self.filters = {
        participantData: true,
        displayState: false,
        customID: true,
        state: {
          SKIPPED: false,
          NOT_VISITED: false,
          ANSWERED: true,
          IGNORED: true,
          VISITED: true
        },
        fillingBox: true,
        comments: true
      };
    }
  }
}());
