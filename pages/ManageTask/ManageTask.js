// pages/ManageTask/ManageTask.js
// 管理任务页面
var util = require('../../utils/util.js');
var Bmob = require('../../utils/bmob.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allitems: [],
  
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
    var that = this;
    that.onGetAllTasks();
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
      that.onGetAllTasks();
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

  //获取当前所有的任务信息
  onGetAllTasks: function () {
    var that = this;
    var Task = Bmob.Object.extend("task");
    var query = new Bmob.Query(Task);
    query.limit(that.data.count += 5);
    var currentUser = Bmob.User.current(); 
    query.equalTo("createdby",currentUser.get("realname"));
    query.descending("totalScore");
    // 查询所有数据并将数据添加到数据对象当中去
    query.find({
      success: function (results) {
        for (var i = 0; i < results.length; i++) {
          var obj = results[i];
          var currenttime = util.formatTime2(new Date());
          if (currenttime > obj.get("endtime")) {
            query.get(obj.id, {
              success: function (result) {
                var currenttime = util.formatTime2(new Date());
                //当前时间大于任务时间则任务结束
                if (currenttime > result.get("endtime")) {
                  result.set("complete", true);
                  result.save();
                  console.log("save");
                }
              },
              error: function (object, error) {
                // 查询失败
              }
            });
          }
          //设置当前时间与起始时间之间的时间间隔
          obj.set("index", that.calDate(obj.get("begintime")));
        }
        that.setData({ allitems: results });
      },
      error: function (error) {
        console.log("查询失败: " + error.coDe + " " + error.message);
      }
    });
  },

  //计算当前日期与设定起始日期之间的间隔
  calDate: function (begintime) {
    var that = this;
    //获取系统当前时间年月日
    var date = new Date();
    var currenttime = util.formatTime2(date);
    var begin = new Date(begintime.replace(/-/g, "/"));
    var end = new Date(currenttime.replace(/-/g, "/"));
    var days = end.getTime() - begin.getTime();
    var day = parseInt(days / (1000 * 60 * 60 * 24));
    return day;
  },

  //创建任务按钮
  onCreateTask: function () {
    wx.navigateTo({
      url: '../CreateTask/CreateTask'
    })
  },

  //点击任务跳转到任务详情页面
  onTaskDetail: function (e) {
    var id = e.currentTarget.dataset.id; //打印可以看到，此处已获取到了对应的id
    wx.navigateTo({
      url: '../ChangeTask/ChangeTask?objectId=' + id
    })
  }
})