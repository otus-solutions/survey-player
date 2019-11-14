(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusViewer', {
      template:'<md-content id=activity-viewer><md-progress-circular ng-if=!$ctrl.ready class=md-primary md-diameter=70></md-progress-circular><div layout=row ng-if=$ctrl.ready flex><span flex class=no-print></span><div layout=column id=sheet class=md-whiteframe-1dp flex><div layout=row layout-align="center center"><span class=md-title>{{$ctrl.activityData.acronym}} - {{$ctrl.activityData.name}}</span></div><div layout=column ng-show=$ctrl.filters.participantData><div layout=row><span style="margin-right: 5px;">{{$ctrl.activityData.participantData.recruitmentNumber}} -</span> <span>{{$ctrl.activityData.participantData.name}}</span></div></div><md-list><md-list-item class="page-break page-item" layout=row layout-align="start start" ng-repeat="item in $ctrl.activityData.itemContainer" ng-show=$ctrl.filters.state[item.navigationState]><div layout-padding layout=row class=md-whiteframe-1dp layout-align="center center"><span>{{$index + 1}}</span></div><survey-item-view item=item filters=$ctrl.filters flex></survey-item-view></md-list-item></md-list></div><div id=header-viewer layout-padding layout=column layout-align="start end" class=no-print flex><div layout=column class=viewer-commands><md-button class="md-fab md-mini" ng-click=$ctrl.print()><md-icon class=no-print>print</md-icon><md-tooltip md-direction=left>Imprimir</md-tooltip></md-button><md-button class="md-fab md-mini" ng-click=$ctrl.showFilters()><md-icon>filter_list</md-icon><md-tooltip md-direction=left>Filtros</md-tooltip></md-button><md-button class="md-fab md-mini" ng-click=$ctrl.exit()><md-icon>arrow_back</md-icon><md-tooltip md-direction=left>Sair</md-tooltip></md-button></div></div></div></md-content>',
      controller: 'otusViewerCtrl as $ctrl'
    }).controller('otusViewerCtrl', Controller);

  Controller.$inject = [
    '$compile',
    '$scope',
    '$mdBottomSheet',
    'otusjs.player.data.viewer.SurveyViewFactory'
  ];

  function Controller(
    $compile, $scope, $mdBottomSheet,
    SurveyViewerFactory) {
    var self = this;

    self.$onInit = onInit;
    self.ready = false;
    $scope.filters = {};
    self.filters = $scope.filters;
    self.showFilters = showFilters;
    self.print = print;

    /* Public methods */
    self.exit = exit;
    $scope.exit = exit;


    function onInit() {
      self.activityData = SurveyViewerFactory.create();
      self.ready = true;
      compileFilters();
    }


    function compileFilters() {
      let template = '<otus-viewer-filters filters=$ctrl.filters></otus-viewer-filters>';
      self.filterComponent = $compile(template)($scope.$new());
    }

    function print() {
      window.print();
    }

    function showFilters() {
      $mdBottomSheet.show({
        template:'<md-bottom-sheet class="md-list md-has-header"><div layout=row layout-align="start center" ng-cloak><md-subheader ng-cloak>Filtros</md-subheader></div><div ng-cloak layout=row layout-fill><md-content layout-align="start space-around"><md-checkbox class=md-grid-item-content ng-model=filters.participantData>Dados do participante</md-checkbox><md-checkbox class=md-grid-item-content ng-model=filters.customID>Id de questão</md-checkbox><md-checkbox class=md-grid-item-content ng-model=filters.state.SKIPPED>Questões puladas</md-checkbox><md-checkbox class=md-grid-item-content ng-model=filters.state.NOT_VISITED>Questões não visitadas</md-checkbox><md-checkbox class=md-grid-item-content ng-model=filters.displayState>Estado da questão</md-checkbox></md-content></div><div ng-cloak layout-padding layout=row layout-align="center center"><p class=caption-sheet>Modo de visualização de atividade.</p></div></md-bottom-sheet>',
        locals: {
          filters: self.filters
        },
        parent: angular.element(document.body),
        controller: BottomSheetController
      }).then(function (clickedItem) {
      }).catch(function (error) {
      });
    }


    function exit() {
      window.history.back();
    }


    function BottomSheetController($scope, filters) {
      $scope.filters = filters;
    }


  }
}());
