describe('StopPlayerStepService Suite Test', function () {
  let Mock = {};
  let Injections = [];
  let service = {};

  beforeEach(function () {
    angular.mock.module('otusjs.player.standalone');

    angular.mock.inject(function ($injector, $rootScope) {
      Injections.ActivityFacadeService = $injector.get('otusjs.player.data.activity.ActivityFacadeService');
      Injections.SurveyApiService = $injector.get('SurveyApiService');
      service = $injector.get('StopPlayerStepService', Injections);

      _mockInitialize($rootScope);
    });

    window.onbeforeunload = jasmine.createSpy();
  });

  it('check service', function () {
    expect(service).toBeDefined();
  });

  it('methods should defined', function () {
    expect(service.beforeEffect).toBeDefined();
    expect(service.effect).toBeDefined();
    expect(service.afterEffect).toBeDefined();
    expect(service.getEffectResult).toBeDefined();
  });


  it('beforeEffect method should return flowData', function () {
    spyOn(service, 'beforeEffect').and.callThrough();
    service.beforeEffect({}, {});
    expect(service.beforeEffect).toHaveBeenCalledTimes(1);
  });

  describe('effect method Suite Test', function () {

    function _callEffectMethod(hasCallbackAddressReturnValue){
      spyOn(Injections.ActivityFacadeService, 'save');
      spyOn(Injections.SurveyApiService, 'getCallbackAddress').and.returnValue(Mock.callbackAddress);
      spyOn(Injections.SurveyApiService, 'hasCallbackAddress').and.returnValue(hasCallbackAddressReturnValue);
      service.effect();
      Mock.$scope.$digest();
    }

    it('effect method should set location.href in case callback address exists', function () {
      _callEffectMethod(true);
      expect(Injections.SurveyApiService.getCallbackAddress).toHaveBeenCalledTimes(1);
    });

    it('effect method should not set location.href in case callback address does not exists', function () {
      _callEffectMethod(false);
      expect(location.href).not.toBe(Mock.callbackAddress);
      expect(Injections.SurveyApiService.getCallbackAddress).not.toHaveBeenCalled();
    });

  });

  it('afterEffect method should return flowData', function () {
    spyOn(service, 'afterEffect').and.callThrough();
    service.afterEffect({}, {});
    expect(service.afterEffect).toHaveBeenCalledTimes(1);
  });

  it('getEffectResult method should return flowData', function () {
    const flowData = {};
    const result = service.getEffectResult({}, flowData);
    expect(result).toBe(flowData);
  });


  function _mockInitialize($rootScope) {
    Mock.$scope = $rootScope.$new();
    Mock.callbackAddress = 'http';
  }

});
