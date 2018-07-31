// pages/ChangeTask/ChangeTask.js
// 修改任务页面
var util = require('../../utils/util.js');
var Bmob = require('../../utils/bmob.js'); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    objectId: '',//当前活动的id
    color: '',
    totalScore: 0,
    name: '',
    begin_time: '',
    end_time: '',
    days: 0,
    signNumber: [],
    currentNumber: 0,
    totalnumber: 0,
    complete: false,
    index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取当前任务的objectId和报名情况    
    this.setData({ objectId: options.objectId }); 
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
    this.getTaskDetails(); 
  
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

  //获取当前任务的详细信息
  getTaskDetails: function () {
    var that = this;
    var currentUser = Bmob.User.current();
    var Task = Bmob.Object.extend("task");
    var q = new Bmob.Query(Task);
    q.get(that.data.objectId, {
      success: function (result) {
        var index = that.calDate(result.get("begintime"));
        var currenttime = util.formatTime2(new Date());
        //当前时间大于任务时间，则任务结束
        if (currenttime > result.get("endtime")) {
          that.setData({ complete: true });
          result.set("complete", true);
          result.save();
        }
        that.setData({
          totalScore: result.get("totalScore"),
          name: result.get("name"),
          begin_time: result.get("begintime"),
          end_time: result.get("endtime"),
          days: result.get("days"),
          signNumber: result.get("signNumber"),
          currentNumber: result.get("currentNumber"),
          totalnumber: result.get("number"),
          color: result.get("color"),
          index:index
        });

      },
      error: function (object, error) {
        // 查询失败
      }
    });
  },

  //删除任务
  onDelete: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否删除该任务',
      success: function (res) {
        //点击确定删除
        if (res.confirm) {
          //删除该活动的报名信息
          var Task_User = Bmob.Object.extend("task_user");
          var query = new Bmob.Query(Task_User);
          query.equalTo("activityid", that.data.objectId);
          query.destroyAll({
            success: function () {
              //删除成功
            },
            error: function (err) {
              // 删除失败
            }
          });
          //删除该活动
          var Task = Bmob.Object.extend("task");
          var query = new Bmob.Query(Task);
          query.get(that.data.objectId, {
            success: function (object) {
              object.destroy({
                success: function (deleteObject) {
                  wx.showToast({
                    title: '删除成功',
                    duration: 2000
                  })
                },
                error: function (object, error) {
                  wx.showModal({
                    title: '提示',
                    content: '任务删除失败'
                  })
                }
              });
            },
            error: function (object, error) {
              console.log("query object fail");
            }
          });
        }
      }
    })
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
})