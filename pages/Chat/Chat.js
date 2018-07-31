// pages/Chat/Chat.js
var app = getApp();
var chatListData = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    askWord: '',
    chatList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //问候语
    var that = this;
    this.addChat('你好啊!我是可爱的糖糖，有什么可以为你服务的么？', 'l');
    setTimeout(function () {
      
    }, 1000);

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  sendChat: function (e) {
    var that = this;
    var word = e.detail.value.ask_word ? e.detail.value.ask_word : e.detail.value;//支持两种提交方式
    that.addChat(word, 'r');
    //请求api获取回答
    app.req('post', 'openapi/api', {
      'data': { 'info': word, 'loc': '广州', 'userid': '123' },
      'success': function (resp) {
        that.addChat(resp.text, 'l');
        if (resp.url) {
          that.addChat(resp.url, 'l');
        }
      },
    });

    //清空输入框
    that.setData({
      askWord: ''
    });
  },

  //新增聊天列表
  addChat: function (word, orientation) {
    var that = this;
    var ch = { 'text': word, 'time': new Date().getTime(), 'orientation': orientation }
    chatListData.push(ch);
    that.setData({
      chatList: chatListData
    });
  }
})