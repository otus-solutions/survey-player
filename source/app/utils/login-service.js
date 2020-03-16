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

    function isAuthenticated() {
      var _token = SurveyApiService.getAuthToken();
      return _token ? true : false;
    }

    function authenticate(ev) {
      if (!self.isAuthenticated()){
        _login(ev);
      } else {
        _logout(ev);
      }
    }

    function _login(ev) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'app/utils/login-template.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      });
    }

    function _logout(ev) {
      var confirm = $mdDialog.confirm()
        .title('USUÁRIO CONECTADO')
        .textContent('Deseja realmente sair?')
        .ariaLabel('Logout')
        .targetEvent(ev)
        .ok('Sim')
        .cancel('Não');

      $mdDialog.show(confirm).then(function() {
        SurveyApiService.clearSession();
      });
    }

    function DialogController($scope, $mdDialog, $mdToast, $http, SurveyApiService) {
      $scope.hide = function () {
        $mdDialog.hide();
      };

      $scope.cancel = function () {
        $mdDialog.cancel();
      };

      function Auth(email, password) {
        return {email, password}
      }

      $scope.login = function () {
        var _auth = Auth($scope.emailUser, $scope.passUser);
        $scope.emailUser = '';
        $scope.passUser = '';
        $http.post(SurveyApiService.getLoginUrl(), _auth).then(function (response) {
          var user = response['data']['data'];
          SurveyApiService.setLoggedUser(user);
          SurveyApiService.setAuthToken(user.token);
          _showMessage('Usuário autenticado.');

          $mdDialog.hide();
        }).catch(function (err) {
          _showMessage('Usuário não cadastrado.');
          $mdDialog.hide();
        });
      };

      $scope.isValid = function () {
        return $scope.emailUser && $scope.passUser;
      };

      $scope.onEnter = function(event) {
        if (event.which === 13 && $scope.isValid()){
          $scope.login()
        }
      };

      function _showMessage(txt) {
        $mdToast.show(
          $mdToast.simple()
            .textContent(txt)
            .position('button right')
            .hideDelay(3000))
      }
    }
  }
})();