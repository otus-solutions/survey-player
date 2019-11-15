(function() {
  'use strict';

  angular.module('survey.player.api')
    .service('SurveyApiService', Service);

  Service.$inject = [
    '$cookies'
  ];

  function Service($cookies) {
    var self = this;

    self.getBaseUrl = getBaseUrl;
    self.getSaveUrl = getSaveUrl;
    self.getActivityUrl = getActivityUrl;
    self.getAuthToken = getAuthToken;
    self.setAuthToken = setAuthToken;
    self.setCallbackAddress = setCallbackAddress;
    self.getCallbackAddress = getCallbackAddress;
    self.setCurrentActivity = setCurrentActivity;
    self.getCurrentActivity = getCurrentActivity;

    const CURRENT_ACTIVITY = 'Current_Activity';
    init();

    var _base;
    var _context;
    var _save;
    var _activity;
    var _callback;

    function init(){
      _base = $cookies.get('Backend-Address');
      _context = $cookies.get('Base-Context') || '';
      _save = $cookies.get('Save-Context') || '';
      _activity = $cookies.get('Activity-Context') || '';
    }

    function getBaseUrl() {
      return _base.concat(_context);
    }

    function getSaveUrl() {
      return _base.concat(_context).concat(_save);
    }

    function getActivityUrl(id) {
      return _base.concat(_context).concat(_activity).concat(id);
    }

    function getAuthToken() {
      return sessionStorage.getItem('Auth_Token');
    }

    function setAuthToken(token) {
      return sessionStorage.setItem('Auth_Token', token);
    }

    function setCallbackAddress(url) {
      sessionStorage.setItem('Callback-Address', angular.copy(url));
    }

    function getCallbackAddress() {
      return sessionStorage.getItem('Callback-Address') ? sessionStorage.getItem('Callback-Address') : location.href;
    }

    function setCurrentActivity(id) {
      sessionStorage.setItem(CURRENT_ACTIVITY, id);
    }

    function getCurrentActivity() {
      return sessionStorage.getItem(CURRENT_ACTIVITY);
    }
  }
})();