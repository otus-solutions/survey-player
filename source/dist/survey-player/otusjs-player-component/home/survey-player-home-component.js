(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('surveyPlayerHome', {
      template:'<md-content id="home-dashboard" layout="column" flex layout-fill ng-init="selectedIndex = 0"><md-toolbar class="md-hue-2" md-scroll-shrink><div class="md-toolbar-tools"><md-button class="md-icon-button" ng-click="$ctrl.toggleMenu()"><md-icon>menu</md-icon></md-button><md-truncate flex>Survey Player</md-truncate><span flex></span><md-button class="md-icon-button cursor-auto" aria-label="Connection"><connection-icon></connection-icon></md-button><span layout-margin>{{ $ctrl.user.name }}</span><md-button class="md-icon-button md-raised md-accent" aria-label="Login" id="shortLogin" ng-click="$ctrl.authenticate($event)"><md-icon ng-if="!$ctrl.auth()">person</md-icon><md-icon ng-if="$ctrl.auth()">how_to_reg</md-icon><md-tooltip ng-if="!$ctrl.auth()">Entrar</md-tooltip><md-tooltip ng-if="$ctrl.auth()">Autenticado</md-tooltip></md-button></div></md-toolbar><md-content ng-if="!$ctrl.user" layout="column" flex></md-content><md-content ng-if="$ctrl.user" layout="column" flex><md-tabs md-dynamic-height md-selected="selectedIndex" md-border-bottom md-autoselect><md-tab label="LISTA"><md-content class="md-padding" flex="100" layout="column" ng-if="$ctrl.preActivities.length"><div flex="100" layout="row" layout-align="end center" layout-padding><span class="md-subheader" flex>Verifique sempre se há atividades desatualizadas! Se necessário, conecte-se a internet para atualiza-las.</span></div><survey-list user="$ctrl.user" pre-activities="$ctrl.preActivities" layout-padding flex></survey-list></md-content></md-tab><md-tab label="COLETAS"><md-content layout="column" flex ng-if="$ctrl.preActivities.length"><activity-collection show-commands="selectedIndex == 1" layout="column" commands="$ctrl.commands" flex user="$ctrl.user" activities="$ctrl.preActivities"></activity-collection></md-content></md-tab></md-tabs></md-content><footer><md-toolbar class="md-scroll-shrink"><div layout="row" layout-align="start center" flex layout-padding><small flex class="md-caption">&copy; Plataform Otus</small><md-button class="{{command.theme}}" style="margin-right: 30px" ng-repeat="command in $ctrl.commands" ng-click="command.action()"><md-icon>{{\'\'.concat(command.icon)}}</md-icon></md-button></div></md-toolbar></footer><md-sidenav class="md-sidenav-left" md-component-id="userMenu" md-whiteframe="4" md-disable-close-events><md-toolbar class="md-theme-indigo"><div class="md-toolbar-tools"><h1 flex md-truncate>Informações</h1><md-button class="md-icon-button" ng-click="$ctrl.toggleMenu()"><md-icon>close</md-icon></md-button></div></md-toolbar><md-content layout-margin layout="column"><span class="md-subheader" layout-align="start center" layout="row" flex><div><md-icon>account_circle</md-icon>Dados da Conta</div></span><p class="md-body-1" flex ng-show="!$ctrl.user">Usuário não identificado</p><div ng-show="$ctrl.user" layout="column"><span class="md-body-2">{{ $ctrl.user.name + \' \' + $ctrl.user.surname}}</span> <span class="md-body-1">{{ $ctrl.user.email}}</span></div><span flex="20"></span><md-button ng-show="$ctrl.user" class="md-primary md-raised" ng-click="selectedIndex = 0; $ctrl.toggleMenu()">Lista</md-button><md-button ng-show="$ctrl.user" class="md-primary md-raised" ng-click="selectedIndex = 1; $ctrl.toggleMenu()">Coletas</md-button><md-button ng-click="$ctrl.authenticate($event)" aria-label="Login" class="md-accent" style="top: 50%"><span ng-if="!$ctrl.auth()">ENTRAR</span> <span ng-if="$ctrl.auth()">SAIR</span></md-button></md-content></md-sidenav></md-content>',
      controller: Controller
    });

  Controller.$inject = [
    '$scope',
    'LoginService',
    'SurveyApiService',
    '$mdSidenav',
    '$mdToast',
    'SurveyClientService'

  ];

  function Controller($scope, LoginService, SurveyApiService, $mdSidenav, $mdToast, SurveyClientService) {
    var self = this;

    self.auth = auth;
    self.authenticate = authenticate;
    self.toggleMenu = toggleMenu;
    self.$onInit = onInit;
    self.commands = [];

    function onInit() {
      self.commands = [];
      _setUser();
      update();
    }

    function auth() {
      return LoginService.isAuthenticated();
    }

    function update() {
      self.preActivities = [];
      if (navigator.onLine) {
        SurveyClientService.getSurveys().then(function (response) {
          self.preActivities = angular.copy(Array.prototype.concat.apply(response)).map(function (activity) {
            return activity.toObjectJson()
          });
        }).catch(function () {
          SurveyApiService.clearSession();
          _setUser();
        });
      } else {
        SurveyClientService.getOfflineSurveys().then(function (response) {
          self.preActivities = angular.copy(Array.prototype.concat.apply(response));
        });
      }
    }

    function authenticate(ev) {
      $mdSidenav('userMenu').close();
      LoginService.authenticate(ev).then(function (response) {
        _setUser();
        if (response) {
          _showMessage(response);
          update();
        }
      }, function (err) {
        _setUser();
        err ? _showMessage(err) : null;
      });
    }

    function _setUser() {
      self.user = SurveyApiService.getLoggedUser() ? SurveyApiService.getLoggedUser() : '';
    }

    function toggleMenu() {
      $mdSidenav('userMenu').toggle();
    }

    function _showMessage(txt) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(txt)
          .parent(document.querySelectorAll('survey-player-home'))
          .position('bottom right')
          .hideDelay(3000));
    }

    $scope.$on("logged", function () {
      _setUser();
    });

    $scope.$on("login", function () {
      $("#shortLogin").click();
    });

  }
}());
