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
        templateUrl: 'app/utils/login-template.html',
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
          // SurveyApiService.setAuthToken(user.token);
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
