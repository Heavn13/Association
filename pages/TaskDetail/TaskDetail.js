// pages/TaskDetail/TaskDetail.js
// 任务详情页面
var util = require('../../utils/util.js');
var Bmob = require('../../utils/bmob.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    objectId: '',//当前活动的id
    currentId: '',//当前报名信息的id
    enroll: false,
    color: '',
    totalScore: 0,
    name: '',
    begin_time: '',
    end_time: '',
    days: 0,
    signUp: false,//打卡状态
    signs: [],//签到数组
    signNumber: [],
    currentNumber: 0,
    totalnumber: 0,
    index: 0,
    complete: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取当前任务的objectId和报名情况    
    this.setData({ objectId: options.objectId });
    this.setData({ enroll: Boolean(options.enroll) });
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
    var currenttime = util.formatTime2(new Date());
    var currentUser = Bmob.User.current();
    var Task = Bmob.Object.extend("task");
    var q = new Bmob.Query(Task);
    q.get(that.data.objectId, {
      success: function (result) {
        var index = that.calDate(result.get("begintime"));
        var currenttime = util.formatTime2(new Date());
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
          index: index
        });

      },
      error: function (object, error) {
        // 查询失败
      }
    });

    //获取当前用户的报名打卡状态
    var Task_User = Bmob.Object.extend("task_user");
    var q = new Bmob.Query(Task_User);
    q.equalTo("realname", currentUser.get("realname"));
    q.equalTo("activityid", that.data.objectId);
    // 查询所有数据
    q.find({
      success: function (results) {
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          //当前用户报名打卡状态
          that.setData({
            enroll: object.get("enroll"),
            currentId: object.id
          });
          var index = that.calDate(object.get("begintime"));
          if (!that.data.complete) {
            if (object.get("signUp")[index].isSign == '今日未打卡') {
              that.setData({ signUp: false });
            } else {
              that.setData({ signUp: true });
            }
          }
        }
      },
      error: function (object, error) {
        // 查询失败
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

  //打卡函数
  onSign: function () {
    var that = this;
    //更改页面是否打卡数据 
    that.setData({ signUp: true });
    //更改页面今日任务签到人数
    that.data.signNumber[that.data.index].count += 1;
    that.setData({ signNumber: that.data.signNumber });
    //更改页面任务总积分
    that.data.totalScore += 1;
    that.setData({ totalScore: that.data.totalScore });
    //必须包装在函数中在调用才可以更新数据成功
    //that.onSetScore(index);
    //修改task表
    var Task = Bmob.Object.extend("task");
    var query = new Bmob.Query(Task);
    query.get(that.data.objectId, {
      success: function (result) {
        //修改当前任务的总积分
        result.set("totalScore", that.data.totalScore);
        //更改后台signNumber数组数据        
        result.set("signNumber", that.data.signNumber);
        result.save();
      },
      error: function (object, error) {

      }
    });
    //修改task_user表
    var Task_User = Bmob.Object.extend("task_user");
    var q = new Bmob.Query(Task_User);
    q.get(that.data.currentId, {
      success: function (result) {
        //修改当前任务的个人积分
        var score = result.get('score') + 1;
        result.set("score", score);
        //更改后台signUp数组数据
        var signs = result.get("signUp");
        signs[that.data.index].isSign = "今日已打卡";
        result.set("signUp", signs);
        result.save();
        wx.showToast({
          title: '打卡成功',
          duration: 2000
        })
        if (that.data.days - 1 == that.data.index) {
          result.set("complete", true);
          result.save();
          setTimeout(function () {
            wx.showModal({
              title: '提示',
              content: '恭喜你，该任务已全部完成'
            })
          }, 2000);
        }
      },
      error: function (object, error) {
      }
    });
  },

  //退出任务函数
  onExit: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否退出本任务',
      success: function (res) {
        //点击确定删除
        if (res.confirm) {
          that.onChangeTaskDetails();
          //修改task_user表数据，删除当前数据
          setTimeout(function () {
            var Task_User = Bmob.Object.extend("task_user");
            var query = new Bmob.Query(Task_User);
            query.get(that.data.currentId, {
              success: function (object) {
                //调用删除其他数据方法
                object.destroy({
                  success: function (deleteObject) {
                    that.setData({ enroll: false });
                    wx.showToast({
                      title: '退出成功',
                      duration: 2000
                    });
                  },
                  error: function (object, error) {
                    wx.showModal({
                      title: '提示',
                      content: '退出任务失败'
                    })
                  }
                });
              },
              error: function (object, error) {
              }
            });
            //修改task表
            var Task = Bmob.Object.extend("task");
            var query = new Bmob.Query(Task);
            query.get(that.data.objectId, {
              success: function (result) {
                //修改task表的当前报名人数
                result.set("currentNumber", that.data.currentNumber);
                //修改当前任务的总积分
                result.set("totalScore", that.data.totalScore);
                //更改后台signNumber数组数据        
                result.set("signNumber", that.data.signNumber);
                result.save();
              },
              error: function (object, error) {

              }
            });

          }, 100)

        }
      }
    });
  },

  //修改任务信息,删去修改总积分、今日签到人数、当前报名人数
  onChangeTaskDetails: function () {
    var that = this;
    var count = 0;
    //计算当前用户该活动已签到的天数
    var Task_User = Bmob.Object.extend("task_user");
    var query = new Bmob.Query(Task_User);
    query.get(that.data.currentId, {
      success: function (result) {
        var arr = result.get("signUp");
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].isSign == '今日已打卡') {
            count++;
          }
        }
        console.log(count);
        if (that.data.signUp) {
          //更改页面今日任务签到人数
          that.data.signNumber[that.data.index].count -= 1;
          that.setData({ signNumber: that.data.signNumber });
        }
        //更改页面任务报名人数
        that.data.currentNumber -= 1;
        that.setData({ currentNumber: that.data.currentNumber });
        //更改页面任务总积分
        that.data.totalScore -= count;
        that.setData({ totalScore: that.data.totalScore });
      },
      error: function (object, error) {

      }
    });
  },

  //加入按钮
  onJoin: function () {
    var that = this;
    var count = 0;
    var currentUser = Bmob.User.current();
    that.data.currentNumber += 1;
    that.setData({ currentNumber: that.data.currentNumber });
    that.setData({ signUp: false });
    //修改task表的当前报名人数
    var Task = Bmob.Object.extend("task");
    var query = new Bmob.Query(Task);
    query.get(that.data.objectId, {
      success: function (result) {
        result.set("currentNumber", that.data.currentNumber);
        result.save();
      },
      error: function (object, error) {

      }
    });
    //设置签到数组,截止时间到当前日期的天数
    var limit = that.data.days - that.data.index;
    //删去signUp数组
    that.setData({ signs: [] });
    for (var i = -1 * that.data.index; i < limit; i++) {
      var obj = {
        date: util.addDay(i),
        isSign: "今日未打卡"
      };
      that.data.signs.push(obj);
    }
    //更新报名状态
    that.setData({ enroll: true });
    var Task_User = Bmob.Object.extend("task_user");
    var tu = new Task_User();
    tu.set("taskname", that.data.name);
    tu.set("begintime", that.data.begin_time);
    tu.set("endtime", that.data.end_time);
    tu.set("realname", currentUser.get("realname"));
    tu.set("campus", currentUser.get("campus"));
    tu.set("department", currentUser.get("department"));
    tu.set("signUp", that.data.signs);
    tu.set("enroll", true);
    tu.set("complete", false);
    tu.set("score", 0);
    tu.set("activityid", that.data.objectId);
    //添加数据，第一个入口参数是null
    tu.save(null, {
      success: function (result) {
        that.setData({ currentId: result.id })
        wx.showToast({
          title: '加入成功',
          duration: 2000
        })
      },
      error: function (result, error) {
        console.log(error);
        wx.showModal({
          title: '提示',
          content: '任务加入失败'
        })
      }
    });
  },

  //查看打卡日历
  onCalendar: function () {
    var that = this;
    var id = that.data.currentId;
    wx.navigateTo({
      url: '../Calendar/Calendar?objectId=' + id
    })
  },

  //本任务排名
  onRange: function () {
    var that = this;
    var id = that.data.objectId;
    wx.navigateTo({
      url: '../TaskRange/TaskRange?objectId=' + id
    })
  }
})