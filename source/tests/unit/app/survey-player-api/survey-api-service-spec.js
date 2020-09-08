describe('SurveyApiService Suite Test', function () {
  let Mock = {};
  let Injections = [];
  let service = {};

  beforeEach(function () {
    angular.mock.module('otusjs.player.standalone');

    angular.mock.inject(function ($injector) {
      _mockInitialize();

      Injections.$cookies = $injector.get('$cookies');
      Injections.$q = $injector.get('$q');
      Injections.$rootScope = $injector.get('$rootScope');

      service = $injector.get('SurveyApiService', Injections);
    });

    spyOn(sessionStorage, 'setItem').and.callThrough();
    spyOn(sessionStorage, 'removeItem').and.callThrough();
    spyOn(window, 'alasql');
  });

  it('check service', function () {
    expect(service).toBeDefined();
  });

  it('methods should defined', function () {
    expect(service.getFileUploadUrl).toBeDefined();
    expect(service.getActivityUrl).toBeDefined();
    expect(service.getSurveyUrl).toBeDefined();
    expect(service.getCollectUrl).toBeDefined();
    expect(service.getDatasourceUrl).toBeDefined();
    expect(service.getLoginUrl).toBeDefined();
    expect(service.getStatiVariableUrl).toBeDefined();
    expect(service.getAuthToken).toBeDefined();
    expect(service.setAuthToken).toBeDefined();
    expect(service.setLoggedUser).toBeDefined();
    expect(service.getLoggedUser).toBeDefined();
    expect(service.setCallbackAddress).toBeDefined();
    expect(service.getCallbackAddress).toBeDefined();
    expect(service.hasCallbackAddress).toBeDefined();
    expect(service.setCurrentActivity).toBeDefined();
    expect(service.getCurrentActivity).toBeDefined();
    expect(service.clearSession).toBeDefined();
    expect(service.setModeOffline).toBeDefined();
    expect(service.getModeOffline).toBeDefined();
    expect(service.exitModeOffline).toBeDefined();
    expect(service.setSelectedCollection).toBeDefined();
    expect(service.getSelectedCollection).toBeDefined();
    expect(service.initDB).toBeDefined();
  });

  xit('setSelectedCollection method should call sessionStorage setItem method', function () {
    const collection = { code: 'x' };
    service.setSelectedCollection(collection);
    expect(Mock.sessionStorage.setItem).toHaveBeenCalledTimes(1);
  });

  xit('setSelectedCollection method should call sessionStorage removeItem method', function () {
    const collection = null;
    service.setSelectedCollection(collection);
    expect(Mock.sessionStorage.removeItem).toHaveBeenCalledTimes(1);
  });

  xit('getSelectedCollection method should call sessionStorage getItem method', function () {
    spyOn(Mock.sessionStorage, 'getItem').and.callThrough();
    service.getSelectedCollection();
    expect(Mock.sessionStorage.getItem).toHaveBeenCalledTimes(1);
  });


  xit('setModeOffline method should call sessionStorage setItem method', function () {
    service.setModeOffline();
    expect(Mock.sessionStorage.setItem).toHaveBeenCalledTimes(1);
  });

  xit('exitModeOffline method should call sessionStorage setItem method', function () {
    service.exitModeOffline();
    expect(Mock.sessionStorage.setItem).toHaveBeenCalledTimes(1);
  });

  xit('getModeOffline method should call sessionStorage getItem method', function () {
    spyOn(Mock.sessionStorage, 'getItem').and.returnValue('{}');
    service.getModeOffline();
    expect(Mock.sessionStorage.getItem).toHaveBeenCalledTimes(1);
  });


  xit('setAuthToken method should call sessionStorage setItem method', function () {
    service.setAuthToken();
    expect(Mock.sessionStorage.setItem).toHaveBeenCalledTimes(1);
  });


  xit('setLoggedUser method should call sessionStorage setItem method', function () {
    service.setLoggedUser(Mock.user);
    //expect(Mock.sessionStorage.setItem).toHaveBeenCalledTimes(1); // todo
  });

  xit('setLoggedUser method should not call sessionStorage setItem method', function () {
    service.setLoggedUser();
    expect(Mock.sessionStorage.setItem).not.toHaveBeenCalled();
  });


  xit('setCallbackAddress method should call sessionStorage setItem method twice', function () {
    service.setCallbackAddress('http');
    expect(Mock.sessionStorage.setItem).toHaveBeenCalledTimes(2);
  });

  xit('getCallbackAddress method should call sessionStorage setItem method twice', function () {
    spyOn(Mock.sessionStorage, 'getItem').and.returnValue('{}');
    service.getCallbackAddress();
    expect(Mock.sessionStorage.getItem).toHaveBeenCalledTimes(2);
  });

  xit('getCallbackAddress method should call sessionStorage setItem method one time', function () {
    spyOn(Mock.sessionStorage, 'getItem').and.returnValue(null);
    service.getCallbackAddress();
    expect(Mock.sessionStorage.getItem).toHaveBeenCalledTimes(1);
  });

  xit('hasCallbackAddress method should call sessionStorage setItem method', function () {
    spyOn(Mock.sessionStorage, 'getItem').and.returnValue('{}');
    service.hasCallbackAddress();
    expect(Mock.sessionStorage.getItem).toHaveBeenCalledTimes(1);
  });

  xit('setCurrentActivity method should call sessionStorage setItem method', function () {
    service.setCurrentActivity('x');
    expect(Mock.sessionStorage.setItem).toHaveBeenCalledTimes(1);
  });

  xit('getCurrentActivity method should call sessionStorage setItem method', function () {
    const expectedValue = '{}';
    spyOn(Mock.sessionStorage, 'getItem').and.returnValue(expectedValue);
    const result = service.getCurrentActivity();
    expect(Mock.sessionStorage.getItem).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedValue);
  });

  xit('clearSession method should call sessionStorage removeItem method 6 times', function () {
    service.clearSession();
    expect(Mock.sessionStorage.removeItem).toHaveBeenCalledTimes(6);
  });


  function _mockInitialize() {
    Mock.sessionStorage = {
      getItem: (key) => {},
      setItem: (key, value) =>{},
      removeItem: (key) => {}
    };
    Mock.cookiesReturnValue = {};
    Mock.user = { token: 'abc' };
  }

});
