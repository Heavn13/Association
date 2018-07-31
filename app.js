//app.js
var Bmob = require('utils/bmob.js');
Bmob.initialize("ddfac8f81437ec07a4c4dfdde798d8c3", "d301adcb62e67bfe5cd5fd6bc97e7a91");
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

  },
  globalData: {
    userInfo: null
  },
  req: function (method, url, arg) {
    let domian = 'http://www.tuling123.com', data = { 'key': 'dc0c5c7ff7624a97a844b6dc84448459' }, dataType = 'json';
    let header = { 'content-type': 'application/x-www-form-urlencoded' };
    if (arg.data) {
      data = Object.assign(data, arg.data);
    }
    if (arg.header) {
      header = Object.assign(header, arg.header);
    }
    if (arg.dataType) {
      dataType = arg.dataType;
    }
    let request = {
      method: method.toUpperCase(),
      url: domian + url,
      data: data,
      dataType: dataType,
      header: header,
      success: function (resp) {
        console.log('response content:', resp.data);
        let data = resp.data;
        typeof arg.success == "function" && arg.success(data);
      },
      fail: function () {
        wx.showToast({
          title: '请求失败,请稍后再试',
          icon: 'success',
          duration: 2000
        });
        typeof arg.fail == "function" && arg.fail();
      },
      complete: function () {
        typeof arg.complete == "function" && arg.complete();
      }
    };
    wx.request(request);
  }
})