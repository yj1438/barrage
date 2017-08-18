var barrage = require('../../src/index');

describe('barrage', function() {
  describe('toast', function() {
    afterEach(function() {
      AlipayJSBridge.call.restore();
    });

    it('success', function() {
      var call = sinon.stub(AlipayJSBridge, 'call');
      var toast = call.withArgs('toast');

      barrage.toast();

      expect(toast).to.be.called;
    });

    it('fail', function() {
      var call = sinon.stub(AlipayJSBridge, 'call');
      var toast = call.withArgs('toast');
      expect(toast).not.to.be.called;
    });
  });
});
