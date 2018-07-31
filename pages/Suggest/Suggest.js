// pages/Suggest/Suggest.js
// 建议页面
var Bmob = require('../../utils/bmob.js');  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    suggest:'',
    phold:'对小程序有什么建议和反馈都可以写下来啊...'
  
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

  //获取输入的建议
  onGetContent: function (e) {
    this.setData({ suggest: e.detail.value });
  },

  onSubmit: function(){
    var currentUser = Bmob.User.current();
    var that = this;
    //判断所有输入框不为空
    if (that.data.suggest != '') {
      var Suggest = Bmob.Object.extend("suggest");
      var suggest = new Suggest();
      suggest.set("content", that.data.suggest);
      suggest.set("name", currentUser.get('realname'));
      //添加数据，第一个入口参数是null
      suggest.save(null, {
        success: function (result) {
          wx.showToast({
            title: '提交成功',
            duration: 2000
          })
        },
        error: function (result, error) {
          wx.showModal({
            title: '提示',
            content: '建议提交失败'
          })
        }
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '请把内容填写完整'
      })
    }

  }
})