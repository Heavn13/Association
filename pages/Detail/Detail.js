// pages/index/Detail.js
// 个人详情页面
var Bmob = require('../../utils/bmob.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'Name',
    id:'Id',
    campus:'Campus',
    colleg:'College',
    phone:'Phone'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取当前用户的数据
    var currentUser = Bmob.User.current(); 
    this.setData({ name: currentUser.get("realname") });
    this.setData({ id: currentUser.get("username") });
    this.setData({ campus: currentUser.get("campus") });
    this.setData({ college: currentUser.get("college") });
    if (currentUser.get("department") == '') {
      this.setData({ department: '非唐社成员' });
    }else{
      this.setData({ department: currentUser.get("department") });
    }    
    this.setData({ phone: currentUser.get("phone") });      
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

  //注销当前账号
  onLogOut: function(){
    Bmob.User.logOut();
    wx.redirectTo({
      url: '../Login/Login',
    })
  },

  //管理活动按钮
  onManageActivities: function () {
    var currentUser = Bmob.User.current();
    if (currentUser.get('createActivity') == true) {
      wx.navigateTo({
        url: '../ManageActivity/ManageActivity'
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '您没有管理活动的权限'
      })
    }
  },

  //管理任务按钮
  onManageTask: function () {
    wx.navigateTo({
      url: '../ManageTask/ManageTask'
    })
  },

  //意见反馈
  onSuggest: function(){
    wx.navigateTo({
      url: '../Suggest/Suggest'
    })    
  },

  //活动授权
  onGrant: function () {
    wx.navigateTo({
      url: '../Grant/Grant'
    })
  }

})