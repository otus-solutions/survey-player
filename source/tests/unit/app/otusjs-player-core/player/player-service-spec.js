describe('PlayerService', function () {

  const UNIT_NAME = 'otusjs.player.core.player.PlayerService';
  let Mock = {};
  let Injections = {};
  let service = {};

  beforeEach(function () {
    module('otusjs.player.core');
    angular.mock.module('otusjs.player.standalone');
    spyOn(window, 'alasql');

    inject(function ($injector) {
      /* Injectable mocks */
      Injections.ActivityFacadeService = $injector.get('otusjs.player.data.activity.ActivityFacadeService');
      Injections.PlayerStartActionService = $injector.get('otusjs.player.core.phase.PlayerStartActionService');
      Injections.PlayActionService = $injector.get('otusjs.player.core.phase.PlayActionService');
      Injections.AheadActionService = $injector.get('otusjs.player.core.phase.AheadActionService');
      Injections.BackActionService = $injector.get('otusjs.player.core.phase.BackActionService');
      Injections.EjectActionService = $injector.get('otusjs.player.core.phase.EjectActionService');
      Injections.StopActionService = $injector.get('otusjs.player.core.phase.StopActionService');
      Injections.SaveActionService = $injector.get('otusjs.player.core.phase.SaveActionService');
      Injections.SurveyApiService = $injector.get('SurveyApiService');
      Injections.PLAYER_SERVICE_CORE_CONSTANTS = $injector.get('PLAYER_SERVICE_CORE_CONSTANTS');

      service = $injector.get(UNIT_NAME, Injections);
    });

    _mockInitialize();
    spyOn(Injections.ActivityFacadeService, 'getCurrentItem').and.returnValue(Mock.itemService);
  });


  it('service method defined', function () {
    expect(service).toBeDefined();
  });

  it('service methods checking', function () {
    expect(service.bindComponent).toBeDefined();
    expect(service.getItemData).toBeDefined();
    expect(service.goAhead).toBeDefined();
    expect(service.goBack).toBeDefined();
    expect(service.setGoBackTo).toBeDefined();
    expect(service.getGoBackTo).toBeDefined();
    expect(service.isGoingBack).toBeDefined();
    expect(service.play).toBeDefined();
    expect(service.setup).toBeDefined();
    expect(service.end).toBeDefined();
    expect(service.eject).toBeDefined();
    expect(service.stop).toBeDefined();
    expect(service.save).toBeDefined();
    expect(service.getCurrentSurvey).toBeDefined();
    expect(service.hasCallbackAddress).toBeDefined();
    expect(service.getConstants).toBeDefined();
    expect(service.setReasonToFinishActivity).toBeDefined();
    expect(service.getReasonToFinishActivity).toBeDefined();

    expect(service.registerHardBlocker).toBeDefined();
    expect(service.registerSoftBlocker).toBeDefined();
    expect(service.getHardBlocker).toBeDefined();
    expect(service.getSoftBlocker).toBeDefined();
    expect(service.clearHardBlocker).toBeDefined();
  });

  describe('Blockers Suite Test', function () {

    it('getHardBlocker method should return promise', function () {
      service.registerHardBlocker(Mock.resolve);
      expect(service.getHardBlocker()).toEqual(Mock.resolve);
    });

    it('getSoftBlocker method should return promise', function () {
      service.registerSoftBlocker(Mock.resolve);
      expect(service.getSoftBlocker()).toEqual(Mock.resolve);
    });

    it('clearHardBlocker method should set hasBlocker as null', function () {
      service.clearHardBlocker(null);
      expect(service.getHardBlocker()).toBeNull();
    });
  });


  it('bindComponent method should set private component', function () {
    spyOn(service, 'bindComponent').and.callThrough();
    service.bindComponent(Mock.component);
    expect(service.bindComponent).toHaveBeenCalledTimes(1);
  });

  it('getItemData method should retrieve the current item from activity', function () {
    const itemData = service.getItemData();
    expect(itemData).toEqual(Mock.itemData);
  });

  it('goAhead method should execute the AheadActionService', function () {
    spyOn(Injections.AheadActionService, 'execute');
    service.goAhead();
    expect(Injections.AheadActionService.execute).toHaveBeenCalledTimes(1);
  });

  it('goBack method should execute the BackActionService', function () {
    spyOn(Injections.BackActionService, 'execute');
    service.goBack();
    expect(Injections.BackActionService.execute).toHaveBeenCalledTimes(1);
  });

  it('setGoBackTo method should private variables', function () {
    spyOn(service, 'setGoBackTo');
    service.setGoBackTo();
    expect(service.setGoBackTo).toHaveBeenCalledTimes(1);
  });

  it('getGoBackTo method should return private goBackTo variable', function () {
    service.setGoBackTo(Mock.goBackTo);
    expect(service.getGoBackTo()).toBe(Mock.goBackTo);
  });

  it('play method should execute the PlayActionService', function () {
    spyOn(Injections.PlayActionService, 'execute');
    service.play();
    expect(Injections.PlayActionService.execute).toHaveBeenCalledWith();
  });

  it('setup method should execute the PlayerStartActionService', function () {
    spyOn(Injections.PlayerStartActionService, 'execute');
    service.setup();
    expect(Injections.PlayerStartActionService.execute).toHaveBeenCalledWith();
  });

  it('end method should call private component goToFinish method', function () {
    spyOn(service, 'end');
    service.end();
    expect(service.end).toHaveBeenCalledTimes(1);
  });

  it('eject method should execute the EjectActionService', function () {
    spyOn(Injections.EjectActionService, 'execute');
    service.eject();
    expect(Injections.EjectActionService.execute).toHaveBeenCalledTimes(1);
  });

  it('stop method should execute the StopActionService', function () {
    spyOn(Injections.StopActionService, 'execute');
    service.stop();
    expect(Injections.StopActionService.execute).toHaveBeenCalledTimes(1);
  });

  it('save method should execute the SaveActionService', function () {
    spyOn(Injections.SaveActionService, 'execute');
    service.save();
    expect(Injections.SaveActionService.execute).toHaveBeenCalledTimes(1);
  });

  it('getCurrentSurvey method should call ActivityFacadeService getCurrentSurvey method', function () {
    const survey = {};
    Mock.currentSurvey = {
      getSurvey: function () { return survey; }
    };
    spyOn(Injections.ActivityFacadeService, 'getCurrentSurvey').and.returnValue(Mock.currentSurvey);

    const result = service.getCurrentSurvey();

    expect(Injections.ActivityFacadeService.getCurrentSurvey).toHaveBeenCalledTimes(1);
    expect(result).toBe(survey);
  });

  it('getReasonToFinishActivity should return private _reasonToFinishActivity variable', function () {
    const REASON_TO_FINISH = {};
    service.setReasonToFinishActivity(REASON_TO_FINISH);
    expect(service.getReasonToFinishActivity()).toBe(REASON_TO_FINISH);
  });

  function _mockInitialize() {
    Mock.itemData = {customID: 'VAL1'};
    Mock.itemService = {};
    Mock.itemService.getItems = jasmine.createSpy('getItems').and.returnValue(Mock.itemData);

    Mock.resolve = Promise.resolve('passou');
    Mock.component = {};
    Mock.goBackTo = 'goBack';
  }

});
