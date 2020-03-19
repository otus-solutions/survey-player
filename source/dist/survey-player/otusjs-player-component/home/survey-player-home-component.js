(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('surveyPlayerHome', {
      template:'<div id="home-dashboard" flex layout="column"><md-toolbar class="md-hue-2"><div class="md-toolbar-tools"><md-button class="md-icon-button" ng-click="$ctrl.toggleMenu()"><md-icon>menu</md-icon></md-button><h2 flex md-truncate>Survey Player</h2><span flex></span><md-button class="md-icon-button cursor-auto" aria-label="Connection"><connection-icon></connection-icon></md-button><span layout-margin>{{ $ctrl.user.name }}</span><md-button class="md-icon-button md-raised md-accent" aria-label="Login" ng-click="$ctrl.authenticate($event)"><md-icon ng-if="!$ctrl.auth()">person</md-icon><md-icon ng-if="$ctrl.auth()">how_to_reg</md-icon><md-tooltip ng-if="!$ctrl.auth()">Entrar</md-tooltip><md-tooltip ng-if="$ctrl.auth()">Autenticado</md-tooltip></md-button></div></md-toolbar><md-content id="home" flex layout="column" layout-fill></md-content></div><md-sidenav class="md-sidenav-left" md-component-id="userMenu" md-whiteframe="4" md-disable-close-events><md-toolbar class="md-theme-indigo"><div class="md-toolbar-tools"><h1 flex md-truncate>Informações</h1><md-button class="md-icon-button" ng-click="$ctrl.toggleMenu()"><md-icon>close</md-icon></md-button></div></md-toolbar><md-content layout-margin layout="column"><span class="md-subheader" layout-align="start center" layout="row" flex><div><md-icon>account_circle</md-icon>Dados da Conta</div></span><p class="md-body-1" flex ng-if="!$ctrl.user">Usuário não identificado</p><div ng-if="$ctrl.user.name" layout="column"><span class="md-body-2">{{ $ctrl.user.name + \' \' + $ctrl.user.surname}}</span> <span class="md-body-1">{{ $ctrl.user.email}}</span></div><span flex="20"></span><md-button ng-click="$ctrl.authenticate($event)" class="md-accent"><span ng-if="!$ctrl.auth()">ENTRAR</span> <span ng-if="$ctrl.auth()">SAIR</span></md-button></md-content></md-sidenav>',
      controller: Controller
    });

  Controller.$inject = [
    '$scope',
    'LoginService',
    'SurveyApiService',
    '$mdSidenav',
    '$mdToast'
  ];

  function Controller($scope, LoginService, SurveyApiService, $mdSidenav, $mdToast) {
    var self = this;

    self.auth = auth;
    self.authenticate = authenticate;
    self.toggleMenu = toggleMenu;

    function auth() {
      self.user = SurveyApiService.getLoggedUser() ?  SurveyApiService.getLoggedUser() : '';
      return LoginService.isAuthenticated();
    }

    function authenticate(ev) {
      $mdSidenav('userMenu').close();
      LoginService.authenticate(ev).then(function (response) {
        _showMessage(response)
      }, function (err) {
        _showMessage(err)
      })
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
          .hideDelay(3000))
    }
  }
}());
