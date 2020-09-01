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
    const self = this;

    const INIT_QUERY = "CREATE INDEXEDDB DATABASE IF NOT EXISTS userDB; ATTACH INDEXEDDB DATABASE userDB; USE userDB;";
    const DB_TABLE_USER = 'User';
    const TABLE_USER = "CREATE TABLE IF NOT EXISTS ".concat(DB_TABLE_USER).concat("; ");

    const CURRENT_ACTIVITY = 'Current_Activity';
    const AUTH_TOKEN = 'Auth_Token';
    const CALLBACK_ADDRESS = 'Callback-Address';
    const LOGIN_ADDRESS = 'Login-Address';
    const DATASOURCE_ADDRESS = 'Datasource-Address';
    const ACTIVITY_ADDRESS = 'Activity-Address';
    const SURVEY_ADDRESS = 'Survey-Address';
    const STATIC_VARIABLE_ADDRESS = 'StaticVariable-Address';
    const FILE_UPLOAD_ADDRESS = 'FileUpload-Address';
    const COLLECT_ADDRESS = 'Collect-Address';
    const LOGGED_USER = '_userDB';
    const HASHTAG = "HASHTAG";
    const COLLECTION = 'COLLECTION';
    const TOKEN = true;
    const MODE = 'MODE';

    self.callbackIsExternal = false;

    self.getFileUploadUrl = getFileUploadUrl;
    self.getActivityUrl = getActivityUrl;
    self.getSurveyUrl = getSurveyUrl;
    self.getCollectUrl = getCollectUrl;
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
    self.setModeOffline = setModeOffline;
    self.getModeOffline = getModeOffline;
    self.exitModeOffline = exitModeOffline;
    self.setSelectedCollection = setSelectedCollection;
    self.getSelectedCollection = getSelectedCollection;
    self.initDB = initDB;
    self.hasExternalCallback = hasExternalCallback;

    init();

    setTimeout(function () {
      initDB();
    }, 5000);

    var _loginUrl;
    var _datasourceUrl;
    var _surveyUrl;
    var _activityUrl;
    var _staticVariableUrl;
    var _fileUploadUrl;
    var _collectUrl;

    var _token = null;
    var _user = null;

    function init() {
      _loginUrl = $cookies.get(LOGIN_ADDRESS);
      _datasourceUrl = $cookies.get(DATASOURCE_ADDRESS);
      _activityUrl = $cookies.get(ACTIVITY_ADDRESS);
      _surveyUrl = $cookies.get(SURVEY_ADDRESS);
      _staticVariableUrl = $cookies.get(STATIC_VARIABLE_ADDRESS);
      _fileUploadUrl = $cookies.get(FILE_UPLOAD_ADDRESS);
      _collectUrl = $cookies.get(COLLECT_ADDRESS);
    }

    function initDB() {
      if (!_user){
        alasql(INIT_QUERY, [], function () {
          alasql(TABLE_USER, [], function () {
            alasql.promise('SELECT * FROM User').then(function (response) {
              if (response.length === 1) {
                _user = angular.copy(response[0]);
                _token = angular.copy(response[0].token);
                $rootScope.$broadcast("logged", {any: {}});
                delete _user.token;
              } else if (response.length > 1) {
                alasql('DELETE FROM User;')
              }

              $rootScope.$broadcast("listSurveys", {any: {}});
            });
          });
        });
      }

    }

    function setSelectedCollection(collection) {
      if (collection) {
        sessionStorage.setItem(COLLECTION, collection.code);
      } else {
        sessionStorage.removeItem(COLLECTION);
      }
    }

    function getSelectedCollection() {
      return sessionStorage.getItem(COLLECTION);
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

    function setModeOffline() {
      sessionStorage.setItem(MODE, String(true));
    }

    function exitModeOffline() {
      sessionStorage.setItem(MODE, String(false));
    }

    function getModeOffline() {
      var _mode = angular.copy(JSON.parse(sessionStorage.getItem(MODE)));
      return !!_mode;
    }


    function getSurveyUrl() {
      return _surveyUrl;
    }

    function getCollectUrl() {
      return _collectUrl;
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

    function _dropDatabase() {
      alasql('DROP INDEXEDDB DATABASE userDB');
    }

    function setLoggedUser(user) {
      var deferred = $q.defer();
      if (user) {
        alasql(INIT_QUERY, [], function () {
          alasql(TABLE_USER, [], function (res) {
            var query = "SELECT * INTO User ".concat(' FROM ?');
            _user = angular.copy(user);
            sessionStorage.setItem(LOGGED_USER, JSON.stringify(user));
            delete _user.token;
            _token = angular.copy(user.token);
            alasql(query, [Array.prototype.concat.apply(user)]);
            $rootScope.online = true;
            deferred.resolve();
          });
        });
      }
      else {
        _dropDatabase();
      }

      return deferred.promise;
    }

    function getLoggedUser(propName) {
      var loggedUser = _user ? _user : JSON.parse(sessionStorage.getItem(LOGGED_USER));
      if (loggedUser && loggedUser.hasOwnProperty('token') && !propName) {
        var _loggedUser = angular.copy(loggedUser);
        delete _loggedUser.token;
        return _loggedUser;
      }
      return loggedUser;
    }

    function setCallbackAddress(url) {
      sessionStorage.setItem(CALLBACK_ADDRESS, angular.copy(url.replace(HASHTAG, "#")));
      self.callbackIsExternal = true;
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
      sessionStorage.removeItem(CURRENT_ACTIVITY);
      sessionStorage.removeItem(AUTH_TOKEN);
      sessionStorage.removeItem(CALLBACK_ADDRESS);
      sessionStorage.removeItem(LOGGED_USER);
      sessionStorage.removeItem(MODE);
    }

    function hasExternalCallback(){
      return self.callbackIsExternal;
    }
  }
})();
