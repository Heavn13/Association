// pages/ManageActivity/ManageActivity.js
// 管理活动页面
var Bmob = require('../../utils/bmob.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    count: 0 
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
    this.onGetActivities(); 
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
    var that = this;
    wx.showNavigationBarLoading(); //在标题栏中显示加载            
    setTimeout(function () {
      // complete 
      that.onGetActivities();
      wx.hideNavigationBarLoading(); //完成停止加载
      wx.stopPullDownRefresh(); //停止下拉刷新      
    }, 1500);  
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
  //创建活动按钮
  onCreateActivities: function () {
    wx.navigateTo({
      url: '../Activities/Activities'
    })
  },
  
  //获取当前我创建的活动信息
  onGetActivities: function () {    
    var that = this;
    var currentUser = Bmob.User.current();
    var Activity = Bmob.Object.extend("activity");
    var query = new Bmob.Query(Activity);
    query.equalTo("createdby", currentUser.get("realname"));
    query.limit(that.data.count += 10);
    query.descending("time");
    // 查询所有数据
    query.find({
      success: function (results) {
        that.setData({ items: results });
      },
      error: function (error) {
        console.log("查询失败: " + error.coDe + " " + error.message);
      }
    });

  },

  //点击活动跳转到活动详情页面
  onDetail: function (e) {
    var id = e.currentTarget.dataset.id; //打印可以看到，此处已获取到了对应的id
    wx.navigateTo({
      url: '../ChangeActivity/ChangeActivity?objectId=' + id
    })
  }


})