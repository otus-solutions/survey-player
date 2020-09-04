describe('otusSurveyCover component', function () {
  let Mock = {};
  let Injections = [];
  let controller = {};

  const PLAY_STATE_NAME = '/play';

  beforeEach(function () {
    angular.mock.module('otusjs.player.standalone');

    angular.mock.inject(function ($controller, $injector, $rootScope, $q) {
      _mockInitialize($rootScope, $q);
      Injections.$scope = Mock.$scope;
      Injections.$element = Mock.$element;
      Injections.$state = $injector.get('$state');
      Injections.STATE = $injector.get('STATE');
      Injections.PlayerService = $injector.get('otusjs.player.core.player.PlayerService');

      controller = $controller('otusSurveyCoverCtrl', Injections);
    });

  });

  it('check controller', function () {
    expect(controller).toBeDefined();
  });

  it('methods should defined', function () {
    expect(controller.$onInit).toBeDefined();
    expect(controller.play).toBeDefined();
    expect(controller.stop).toBeDefined();
  });

  it('play method should call $state.go', function () {
    spyOn(Injections.$state, 'go');
    controller.play();
    expect(Injections.$state.go).toHaveBeenCalledWith(PLAY_STATE_NAME);
  });

  it('stop method should call PlayService stop method', function () {
    spyOn(Injections.PlayerService, 'stop');
    controller.stop();
    expect(Injections.PlayerService.stop).toHaveBeenCalledTimes(1);
  });

  it('stop method should call PlayService setReasonToFinishActivity method in case has no callback address', function () {
    spyOn(Injections.PlayerService, 'hasCallbackAddress').and.returnValue(false);
    spyOn(Injections.PlayerService, 'setReasonToFinishActivity');
    spyOn(Injections.$state, 'go');
    controller.stop();
    const expectedReason = Injections.PlayerService.getConstants().REASONS_TO_LIVE_PLAYER.GET_OUT_WITHOUT_SAVE;
    expect(Injections.PlayerService.setReasonToFinishActivity).toHaveBeenCalledTimes(1);
    expect(Injections.PlayerService.setReasonToFinishActivity).toHaveBeenCalledWith(expectedReason);
    expect(Injections.$state.go).toHaveBeenCalledWith(Injections.STATE.PARTICIPANT_FINISH);
  });

  describe('$onInit method Suite Test', function () {

    function _callOnInit(hardBlocker, softBlocker){
      spyOn(Injections.PlayerService, 'getHardBlocker').and.returnValue(hardBlocker);
      spyOn(Injections.PlayerService, 'getSoftBlocker').and.returnValue(softBlocker);

      spyOn(Injections.PlayerService, 'getCurrentSurvey').and.returnValue(
        Mock.getCurrentSurvey);

      controller.$onInit();
      Mock.$scope.$digest();

      expect(controller.hardError).toBe(hardBlocker === Mock.reject);
      expect(controller.softError).toBe(softBlocker === Mock.reject);
    }

    it('$onInit method with both blockers defined and resolve', function () {
      _callOnInit(Mock.resolve, Mock.resolve);
    });

    it('$onInit method with hardBlocker resolve and softBlocker reject', function () {
      _callOnInit(Mock.resolve, Mock.reject);
    });

    it('$onInit method with hardBlocker resolve and softBlocker undefined', function () {
      _callOnInit(Mock.resolve, null);
    });

    it('$onInit method with both blockers defined and reject', function () {
      _callOnInit(Mock.reject, Mock.reject);
    });

    it('$onInit method with hardBlocker reject and softBlocker resolve', function () {
      _callOnInit(Mock.reject, Mock.resolve);
    });

    it('$onInit method with hardBlocker reject and softBlocker undefined', function () {
      _callOnInit(Mock.reject, null);
    });

    it('$onInit method with both blockers undefined', function () {
      _callOnInit(null, null);
    });

    it('$onInit method with hardBlocker null and softBlocker resolve', function () {
      _callOnInit(null, Mock.resolve);
    });

    it('$onInit method with hardBlocker reject and softBlocker undefined', function () {
      _callOnInit(null, Mock.reject);
    });

  });


  function _mockInitialize($rootScope, $q) {
    Mock.$scope = $rootScope.$new();
    Mock.$scope.$parent.$ctrl = {};

    const deferredResolve = $q.defer();
    deferredResolve.resolve();
    Mock.resolve = deferredResolve.promise;

    const deferredReject = $q.defer();
    deferredReject.reject();
    Mock.reject = deferredReject.promise;

    Mock.getCurrentSurvey = {
      getName: function () { return ''; }
    }
  }
});
