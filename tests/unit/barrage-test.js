var Barrage = require('../../dist/index');

describe('barrage', function () {
  // 模拟用户
  var users = ['小红', '小明', '小李', '小王'];
  /**
   * 生成随机长度的弹幕文案
   */
  function makeTestData (count, char) {
    var i = count;
    var data = [];
    while (i > 0) {
      // 随机长度
      var randomSize = Math.ceil(Math.random() * 30);
      var str = char;
      while (randomSize > 0) {
        str += char;
        randomSize -= 1;
      }
      data.push({
        text: str,
        type: Math.ceil(Math.random() * 4),
        user: users[Math.floor(Math.random() * 4)]
      });
      i -= 1;
    }
    return data;
  }
  var barrage;
  it('barrage 初始化', function () {
    barrage = new Barrage('#barrage', {
      data: makeTestData(20, '😂'),
      isLoop: true,
      rowCount: 5,
      intervalTime: 1,
      speed: 200,       // 建议不要超过200
      positionFix: -12,
      itemClass: 'my-barrage',
      maxDom: 0,
      itemMaker: function (itemData) {
        var html = '<div class="my-barrage-item ' + (itemData.type === 0 ? 'self' : '') + '" >'
          + '<span class="item-user">' + itemData.user + '</span>'
          + '<span class="item-type-' + itemData.type + '">' + itemData.text + '</span>'
          + '</div>';
        return html;
      },
      onClickItem: function (evt) {
        this.remove();
      },
    });
  });

  it('barrage.start', function () {
    barrage.start();
  });
  it('barrage.append', function () {
    barrage.append(makeTestData(10, '😱'));
  });
  it('barrage.publish', function () {
    barrage.publish({
      text: '自己测试内容',
      type: 0,
      user: '自己',
    });
  });
  it('barrage.stop', function () {
    barrage.stop();
  });
});
