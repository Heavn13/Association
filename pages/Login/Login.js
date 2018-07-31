// pages/index/Login.js
// 登录页面
var Bmob = require('../../utils/bmob.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account:'',
    accountPhold:'学号',
    password: '',
    passwordPhold: '密码' 
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
    //一次登录后保持当前用户
    var currentUser = Bmob.User.current();
    if (currentUser) {
      wx.switchTab({
        url: '../Main/Main'
      })
    } else {

    }  
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

//获取输入的账号
  onGetAccount: function(e){
    this.setData({account: e.detail.value });
  },

//获取输入的密码
  onGetPassword: function (e){
    this.setData({password: e.detail.value });
  },

//登录按钮
  onLogin: function(){
    //输入框不为空
    var that = this;
    if(that.data.account == '' || that.data.password == ''){
      wx.showModal({
        title: '提示',
        content: '请把信息填写完整'
      }) 
    }else{
      Bmob.User.logIn(that.data.account, that.data.password, {
        success: function (user) {
          wx.showToast({
            title: '登录成功',
            duration: 2000
          })
          setTimeout(function () {
            wx.switchTab({
              url: '../Main/Main'
            })
          }, 2000);
        },
        error: function (user, error) {
          wx.showModal({
            title: '提示',
            content: '账号或密码错误'
          })
        }
      });
       
    }
  },
  
//注册按钮
  onRegister: function(e){
    wx.navigateTo({
      url: '../Register/Register'
    })
  }
})