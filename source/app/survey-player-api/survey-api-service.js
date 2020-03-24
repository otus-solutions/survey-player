(function () {
  'use strict';

  angular.module('survey.player.api')
    .service('SurveyApiService', Service);

  Service.$inject = [
    '$cookies',
    '$q',
    '$rootScope'
  ];

  function Service($cookies, $q, $rootScope) {
    var self = this;

    const INIT_QUERY = "CREATE INDEXEDDB DATABASE IF NOT EXISTS userDB; ATTACH INDEXEDDB DATABASE userDB; USE userDB;";
    const DB_TABLE_USER = 'User';
    const TABLE_USER = "CREATE TABLE IF NOT EXISTS ".concat(DB_TABLE_USER).concat("; ");

    self.getFileUploadUrl = getFileUploadUrl;
    self.getActivityUrl = getActivityUrl;
    self.getSurveyUrl = getSurveyUrl;
    self.getDatasourceUrl = getDatasourceUrl;
    self.getLoginUrl = getLoginUrl;
    self.getStatiVariableUrl = getStatiVariableUrl;
    self.getAuthToken = getAuthToken;
    self.setAuthToken = setAuthToken;
    self.setLoggedUser = setLoggedUser;
    self.getLoggedUser = getLoggedUser;
    self.setCallbackAddress = setCallbackAddress;
    self.getCallbackAddress = getCallbackAddress;
    self.setCurrentActivity = setCurrentActivity;
    self.getCurrentActivity = getCurrentActivity;
    self.clearSession = clearSession;

    const CURRENT_ACTIVITY = 'Current_Activity';
    const AUTH_TOKEN = 'Auth_Token';
    const CALLBACK_ADDRESS = 'Callback-Address';
    const LOGGED_USER = '_userDB';
    const HASHTAH = "HASHTAG";
    const TOKEN = true;
    init();

    var _loginUrl;
    var _datasourceUrl;
    var _surveyUrl;
    var _activityUrl;
    var _staticVariableUrl;
    var _fileUploadUrl;

    var _token = null;
    var _user = null;

    function init() {
      _loginUrl = $cookies.get('Login-Address');
      _datasourceUrl = $cookies.get('Datasource-Address');
      _activityUrl = $cookies.get('Activity-Address');
      _surveyUrl = $cookies.get('Survey-Address');
      _staticVariableUrl = $cookies.get('StaticVariable-Address');
      _fileUploadUrl = $cookies.get('FileUpload-Address');
      _initDB();
    }

    function _initDB() {
      alasql(INIT_QUERY, [], function () {
        alasql(TABLE_USER, [], function () {
          alasql.promise('SELECT * FROM User').then(function (response) {
            if ($rootScope.online && getLoggedUser() == null) {
              _dropDb();
              $rootScope.$broadcast("login", {any: {}});
            } else {
              _user = angular.copy(response[0]);
              _token = angular.copy(response[0].token);
              delete _user.token;
              $rootScope.$broadcast("logged", {any: {}});
            }

          });
        });
      });
    }

    function getLoginUrl() {
      return _loginUrl;
    }

    function getDatasourceUrl() {
      return _datasourceUrl;
    }

    function getStatiVariableUrl() {
      return _staticVariableUrl;
    }

    function getActivityUrl() {
      return _activityUrl;
    }

    function getSurveyUrl() {
      return _surveyUrl;
    }

    function getFileUploadUrl() {
      return _fileUploadUrl;
    }

    function getAuthToken() {
      return _token ? _token : getLoggedUser() ? getLoggedUser(TOKEN).token : null;
    }

    function setAuthToken(token) {
      _token = angular.copy(token);
      sessionStorage.setItem(LOGGED_USER, JSON.stringify({token: token}));
    }

    function _dropDb() {
      alasql("DROP INDEXEDDB DATABASE userDB");
    }

    function setLoggedUser(user) {
      var deferred = $q.defer();
      _dropDb();
      alasql(INIT_QUERY, [], function () {
        alasql(TABLE_USER, [], function (res) {
          if (res === 1) {
            var query = "SELECT * INTO User ".concat(' FROM ?');
            _user = angular.copy(user);
            sessionStorage.setItem(LOGGED_USER, JSON.stringify(user));
            delete _user.token;
            _token = angular.copy(user.token);
            alasql(query, [Array.prototype.concat.apply(user)]);
            deferred.resolve();
          }
        });
      });


      return deferred.promise;

    }

    function getLoggedUser(propName) {
      var loggedUser = _user ? _user : JSON.parse(sessionStorage.getItem(LOGGED_USER));
      if (loggedUser.hasOwnProperty('token') && !propName) {
        var _loggedUser = angular.copy(loggedUser);
        delete _loggedUser.token;
        return _loggedUser;
      }
      return loggedUser;
    }

    function setCallbackAddress(url) {
      sessionStorage.setItem(CALLBACK_ADDRESS, angular.copy(url.replace(HASHTAH, "#")));
    }

    function getCallbackAddress() {
      return sessionStorage.getItem(CALLBACK_ADDRESS) ? sessionStorage.getItem(CALLBACK_ADDRESS) : location.href;
    }

    function setCurrentActivity(id) {
      sessionStorage.setItem(CURRENT_ACTIVITY, angular.copy(id));
    }

    function getCurrentActivity() {
      return sessionStorage.getItem(CURRENT_ACTIVITY);
    }

    function clearSession() {
      _user = null;
      _token = null;
      _dropDb();
      sessionStorage.removeItem(CURRENT_ACTIVITY);
      sessionStorage.removeItem(AUTH_TOKEN);
      sessionStorage.removeItem(CALLBACK_ADDRESS);
      sessionStorage.removeItem(LOGGED_USER);
    }
  }
})();