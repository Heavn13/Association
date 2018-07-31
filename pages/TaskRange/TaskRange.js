// pages/TaskRange/TaskRange.js
//本任务的排名
var Bmob = require('../../utils/bmob.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    objectId:'' 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取当前任务的objectId和报名情况    
    this.setData({ objectId: options.objectId });  
    this.onGetRange();
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

  //获取所有排名信息
  onGetRange: function () {
    var that = this;
    var Task_User = Bmob.Object.extend("task_user");
    var query = new Bmob.Query(Task_User);
    query.equalTo("activityid", that.data.objectId);
    query.descending("score");
    query.limit(10);
    // 查询所有数据并将数据添加到数据对象当中去
    query.find({
      success: function (results) {
        that.setData({ items: results });
      },
      error: function (error) {
        console.log("查询失败: " + error.coDe + " " + error.message);
      }
    });
  },
  
})