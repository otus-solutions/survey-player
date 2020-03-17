(function() {
  'use strict';

  angular.module('survey.player.api')
    .service('SurveyApiService', Service);

  Service.$inject = [
    '$cookies'
  ];

  function Service($cookies) {
    var self = this;

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
    const LOGGED_USER = '_loggedUser';
    const HASHTAH = "HASHTAG";
    init();

    var _loginUrl;
    var _datasourceUrl;
    var _surveyUrl;
    var _activityUrl;
    var _staticVariableUrl;
    var _fileUploadUrl;

    function init(){
      _loginUrl = $cookies.get('Login-Address');
      _datasourceUrl = $cookies.get('Datasource-Address');
      _activityUrl = $cookies.get('Activity-Address');
      _surveyUrl = $cookies.get('Survey-Address');
      _staticVariableUrl = $cookies.get('StaticVariable-Address');
      _fileUploadUrl = $cookies.get('FileUpload-Address');
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
      return sessionStorage.getItem(AUTH_TOKEN);
    }

    function setAuthToken(token) {
      sessionStorage.setItem(AUTH_TOKEN, angular.copy(token));
    }

    function setLoggedUser(user) {
      sessionStorage.setItem(LOGGED_USER, JSON.stringify(user));
    }

    function getLoggedUser() {
      return JSON.parse(sessionStorage.getItem(LOGGED_USER));
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
      sessionStorage.removeItem(CURRENT_ACTIVITY);
      sessionStorage.removeItem(AUTH_TOKEN);
      sessionStorage.removeItem(CALLBACK_ADDRESS);
      sessionStorage.removeItem(LOGGED_USER);
    }
  }
})();