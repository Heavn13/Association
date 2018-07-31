// pages/index/Activities.js
//创建活动页面
var util = require('../../utils/util.js');
var Bmob = require('../../utils/bmob.js');  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_name:'',
    activity_time:'',
    activity_place:'',
    activity_summary:'',
    activity_number:''  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取系统当前时间年月日
    var time = util.formatTime2(new Date()); 
    this.setData({activity_time: time});  
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

//日期选择监听器
  listenerDatePickerSelected: function (e) {
    //调用setData()重新绘制
    this.setData({
      activity_time: e.detail.value,
    });
  },

//获取输入的活动名称
  onGetName: function (e) {
    this.setData({ activity_name: e.detail.value });
  },

//获取输入的活动地点
  onGetPlace: function (e) {
    this.setData({ activity_place: e.detail.value });
  },

//获取输入的活动简介
  onGetSummary: function (e) {
    this.setData({ activity_summary: e.detail.value });
  },

//获取输入的活动人数
  onGetNumber: function (e) {
    this.setData({ activity_number: e.detail.value });
  },

//创建活动
  onCreate: function(e){
    var that = this;
    var currentUser = Bmob.User.current();
    //判断所有输入框不为空
    if (that.data.activity_name != '' && that.data.activity_time != '' && that.data.activity_place != '' && that.data.activity_summary != '' && that.data.activity_number != ''){      
      var Activity = Bmob.Object.extend("activity");
      var activity = new Activity();
      activity.set("name", that.data.activity_name);
      activity.set("time", that.data.activity_time);
      activity.set("place", that.data.activity_place);
      activity.set("summary", that.data.activity_summary);
      activity.set("number", that.data.activity_number);
      activity.set("createdby", currentUser.get('realname'));
      activity.set("currentNumber", '0');
      //添加数据，第一个入口参数是null
      activity.save(null, {
        success: function (result) {
          wx.showToast({
            title: '创建成功',
            duration: 2000
          })
        },
        error: function (result, error) {
          wx.showModal({
            title: '提示',
            content: '活动创建失败'
          })
        }
      });
    }else{
      wx.showModal({
        title: '提示',
        content: '请把内容填写完整'
      })
    }
    
  }

})