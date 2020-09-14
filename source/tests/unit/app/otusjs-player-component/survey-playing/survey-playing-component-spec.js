describe('otusSurveyPlayingCover component', function () {
  let Mock = {};
  let Injections = [];
  let controller = {};

  beforeEach(function () {
    angular.mock.module('otusjs.player.standalone');

    angular.mock.inject(function ($controller, $injector) {
      Injections.$state = $injector.get('$state');
      Injections.STATE = $injector.get('STATE');
      Injections.PlayerService = $injector.get('otusjs.player.core.player.PlayerService');

      controller = $controller('otusSurveyPlayingCtrl', Injections);

      _mockInitialize(Injections.STATE);
    });

  });

  it('check controller', function () {
    expect(controller).toBeDefined();
  });

  it('methods should defined', function () {
    expect(controller.catchMouseWheel).toBeDefined();
    expect(controller.$onInit).toBeDefined();
    expect(controller.eject).toBeDefined();
    expect(controller.finalize).toBeDefined();
    expect(controller.pause).toBeDefined();
    expect(controller.stop).toBeDefined();
    expect(controller.goToFinish).toBeDefined();
    expect(controller.goAhead).toBeDefined();
    expect(controller.goBack).toBeDefined();
    expect(controller.onProcessingPlayer).toBeDefined();
    expect(controller.goIsLockOpenClose).toBeDefined();
  });

  it('$onInit method should call PlayerService methods and set blockers', function () {
    const HARD_BLOCKER = {};
    const SOFT_BLOCKER = {};

    spyOn(Injections.PlayerService, 'play');
    spyOn(Injections.PlayerService, 'bindComponent');
    spyOn(Injections.PlayerService, 'getHardBlocker').and.returnValue(HARD_BLOCKER);
    spyOn(Injections.PlayerService, 'getSoftBlocker').and.returnValue(SOFT_BLOCKER);

    controller.$onInit();

    expect(Injections.PlayerService.play).toHaveBeenCalledTimes(1);
    expect(Injections.PlayerService.bindComponent).toHaveBeenCalledWith(controller);
    expect(controller.hardBlocker).toBe(HARD_BLOCKER);
    expect(controller.softBlocker).toBe(SOFT_BLOCKER);
  });

  describe('finalize method Suite Test', function () {

    function _callFinalize(hasCallbackAddress){
      spyOn(Injections.PlayerService, 'save');
      spyOn(Injections.PlayerService, 'eject');
      spyOn(Injections.PlayerService, 'getConstants').and.returnValue(Mock.PLAYER_SERVICE_CONSTANTS);
      spyOn(Injections.PlayerService, 'hasCallbackAddress').and.returnValue(hasCallbackAddress);
      spyOn(Injections.PlayerService, 'setReasonToFinishActivity').and.callThrough();

      controller.finalize();

      expect(Injections.PlayerService.save).toHaveBeenCalledTimes(1);
      expect(Injections.PlayerService.eject).toHaveBeenCalledTimes(1);
    }

    it('finalize method should call only PlayerService eject method in case has callback address', function () {
      _callFinalize(true);
      expect(Injections.PlayerService.setReasonToFinishActivity).not.toHaveBeenCalled();
    });

    it('finalize method should call PlayerService eject and setReasonToFinishActivity method in case has no callback address', function () {
      _callFinalize(false);
      expect(Injections.PlayerService.setReasonToFinishActivity).toHaveBeenCalledTimes(1);
      expect(Injections.PlayerService.setReasonToFinishActivity).toHaveBeenCalledWith(Mock.PLAYER_SERVICE_CONSTANTS.REASONS_TO_LIVE_PLAYER.FINALIZE);

    });

  });

  describe('pause method Suite Test', function () {

    function _callPause(hasCallbackAddress){
      spyOn(Injections.PlayerService, 'save');
      spyOn(Injections.PlayerService, 'getConstants').and.returnValue(Mock.PLAYER_SERVICE_CONSTANTS);
      spyOn(Injections.PlayerService, 'hasCallbackAddress').and.returnValue(hasCallbackAddress);
      spyOn(Injections.PlayerService, 'setReasonToFinishActivity').and.callThrough();

      controller.pause();

      expect(Injections.PlayerService.save).toHaveBeenCalledTimes(1);
    }

    it('pause method should call only PlayerService eject method in case has callback address', function () {
      _callPause(true);
      expect(Injections.PlayerService.setReasonToFinishActivity).not.toHaveBeenCalled();
    });

    it('pause method should call PlayerService eject and setReasonToFinishActivity method in case has no callback address', function () {
      _callPause(false);
      expect(Injections.PlayerService.setReasonToFinishActivity).toHaveBeenCalledTimes(1);
      expect(Injections.PlayerService.setReasonToFinishActivity).toHaveBeenCalledWith(Mock.PLAYER_SERVICE_CONSTANTS.REASONS_TO_LIVE_PLAYER.SAVE);
    });

  });

  describe('stop method Suite Test', function () {

    function _callStop(hasCallbackAddress){
      spyOn(Injections.PlayerService, 'stop');
      spyOn(Injections.PlayerService, 'getConstants').and.returnValue(Mock.PLAYER_SERVICE_CONSTANTS);
      spyOn(Injections.PlayerService, 'hasCallbackAddress').and.returnValue(hasCallbackAddress);
      spyOn(Injections.PlayerService, 'setReasonToFinishActivity').and.callThrough();

      controller.stop();

      expect(Injections.PlayerService.stop).toHaveBeenCalledTimes(1);
    }

    it('stop method should call only PlayerService stop method in case has callback address', function () {
      _callStop(true);
      expect(Injections.PlayerService.setReasonToFinishActivity).not.toHaveBeenCalled();
    });

    it('stop method should call PlayerService stop and setReasonToFinishActivity methods in case has no callback address', function () {
      _callStop(false);
      expect(Injections.PlayerService.setReasonToFinishActivity).toHaveBeenCalledTimes(1);
      expect(Injections.PlayerService.setReasonToFinishActivity).toHaveBeenCalledWith(Mock.PLAYER_SERVICE_CONSTANTS.REASONS_TO_LIVE_PLAYER.GET_OUT_WITHOUT_SAVE);
    });

  });

  it('goToFinish method should call $state go method', function () {
    spyOn(Injections.$state, 'go');
    controller.goToFinish();
    expect(Injections.$state.go).toHaveBeenCalledWith(Mock.STATE.FINISH);
  });

  describe('goAhead and gooBack Suite Test', function () {

    function _callGoAhead(itemData) {
      controller.playerDisplay = Mock.playerDisplay;
      spyOn(Injections.PlayerService, 'goAhead');
      spyOn(Injections.PlayerService, "getItemData").and.returnValue(itemData);
      spyOn(controller.playerDisplay, "loadItem");
      controller.goAhead();
      expect(Injections.PlayerService.goAhead).toHaveBeenCalledTimes(1);
    }

    it('goAhead method should call playerDisplay loadItem method', function () {
      const itemData = {};
      _callGoAhead(itemData);
      expect(controller.playerDisplay.loadItem).toHaveBeenCalledTimes(1);
      expect(controller.playerDisplay.loadItem).toHaveBeenCalledWith(itemData);
    });

    it('goAhead method should not call playerDisplay loadItem method', function () {
      _callGoAhead(null);
      expect(controller.playerDisplay.loadItem).not.toHaveBeenCalled();
    });

  });

  describe('goBack and gooBack Suite Test', function () {

    function _callGoBack(itemData) {
      controller.playerDisplay = Mock.playerDisplay;
      spyOn(Injections.PlayerService, 'goBack');
      spyOn(Injections.PlayerService, "getItemData").and.returnValue(itemData);
      spyOn(controller.playerDisplay, "loadItem");
      controller.goBack();
      expect(Injections.PlayerService.goBack).toHaveBeenCalledTimes(1);
    }

    it('goBack method should call playerDisplay loadItem method', function () {
      const itemData = {};
      _callGoBack(itemData);
      expect(controller.playerDisplay.loadItem).toHaveBeenCalledTimes(1);
      expect(controller.playerDisplay.loadItem).toHaveBeenCalledWith(itemData);
    });

    it('goBack method should not call playerDisplay loadItem method', function () {
      _callGoBack(null);
      expect(controller.playerDisplay.loadItem).not.toHaveBeenCalled();
    });

  });


  function _mockInitialize(STATE) {
    Mock.playerDisplay = {
      loadItem: function(itemData) {}
    };

    Mock.STATE = STATE;
    Mock.PLAYER_SERVICE_CONSTANTS = Test.utils.data.PLAYER_SERVICE_CONSTANTS;
  }
});
