(function () {

  'use strict';

  angular.module('otusjs.player.standalone')
    .service('LoginService', Service);

  Service.$inject = [
    '$http',
    'SurveyApiService',
    '$mdDialog'
  ];

  function Service($http, SurveyApiService, $mdDialog) {
    var self = this;
    self.isAuthenticated = isAuthenticated;
    self.authenticate = authenticate;

    const TITLE_LOGOUT = 'USUÁRIO CONECTADO';
    const CONTENT_LOGOUT = 'Deseja realmente sair?';
    const ARIA_LABEL_LOGOUT = 'Logout';
    const YES = 'Sim';
    const NO = 'Não';
    const AUTHENTICATED_USER = 'Usuário autenticado.';
    const ERROR_LOGIN = 'Email/Senha incorretos.';
    const USER_DESCONNECT = 'Usuário desconectado.';

    function isAuthenticated() {
      var _token = SurveyApiService.getAuthToken();
      return _token && navigator.onLine ? true : false;
    }

    function authenticate(ev) {
      if (!self.isAuthenticated()) {
        return _login(ev);
      } else {
        return _logout(ev);
      }
    }

    function _login(ev) {
      return $mdDialog.show({
        controller: DialogController,
        template:'<md-dialog aria-label="Autenticação de Usuário"><form><md-toolbar><div class="md-toolbar-tools"><h2>Autenticação de Usuário</h2><span flex></span><md-button class="md-icon-button" ng-click="cancel()"><md-icon>close</md-icon></md-button></div></md-toolbar><md-dialog-content><div class="md-dialog-content" layout="column"><h2>Informe seu email e senha.</h2><md-input-container><label>Email</label> <input type="email" id="email" ng-model="emailUser" required ng-keyup="onEnter($event)"></md-input-container><md-input-container ng-init="show = false"><label>Senha</label> <input type="{{show ? \'text\' : \'password\'}}" id="password" ng-model="passUser" required ng-keyup="onEnter($event)"><md-icon ng-click="show = !show" style="cursor: pointer">{{ show ? \'visibility\' : \'visibility_off\'}}</md-icon></md-input-container></div></md-dialog-content><md-dialog-actions layout="row"><span flex></span><md-button ng-click="cancel()">Cancelar</md-button><md-button class="md-accent md-raised" ng-click="login()" ng-disabled="!isValid()">Entrar</md-button></md-dialog-actions></form></md-dialog>',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      }).then(function (response) {
        return response;
      }).catch(function (err) {
        return err;
      });
    }

    function _logout(ev) {
      var confirm = $mdDialog.confirm()
        .title(TITLE_LOGOUT)
        .textContent(CONTENT_LOGOUT)
        .ariaLabel(ARIA_LABEL_LOGOUT)
        .targetEvent(ev)
        .ok(YES)
        .cancel(NO);

      return $mdDialog.show(confirm).then(function() {
        SurveyApiService.clearSession();
        return USER_DESCONNECT;
      });
    }

    function DialogController($scope, $mdDialog, $http, SurveyApiService) {
      $scope.hide = function () {
        $mdDialog.hide();
      };

      $scope.cancel = function () {
        $mdDialog.cancel();
      };

      function Auth(email, password) {
        return {email, password};
      }

      $scope.login = function () {
        var _auth = Auth($scope.emailUser, $scope.passUser);
        return $http.post(SurveyApiService.getLoginUrl(), _auth).then(function (response) {
          var user = response['data']['data'];
          SurveyApiService.setLoggedUser(user).then(function () {
            $mdDialog.hide(AUTHENTICATED_USER);
          });
        }).catch(function (err) {
          $mdDialog.hide(ERROR_LOGIN);
        });
      };

      $scope.isValid = function () {
        return $scope.emailUser && $scope.passUser;
      };

      $scope.onEnter = function(event) {
        if (event.which === 13 && !SurveyApiService.getAuthToken()){
          $scope.login()
        }
      };
    }
  }
})();
