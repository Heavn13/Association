// pages/CreateTask/CreateTask.js
// 创建任务页面
var util = require('../../utils/util.js');
var Bmob = require('../../utils/bmob.js'); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    task_name:'',
    begin_time:'',
    end_time:'',
    task_number:'',
    days:0,
    index:0,
    color:'#fbad07',
    signUp:[],//用户签到数组
    signNumber:[],//任务签到人数数组
    //任务标签颜色数组
    items:[
      { color: '#FF8C00', checked: false },
      { color: '#1E90FF', checked: false },
      { color: '#FFFF00', checked: false },
      { color: '#83C75D', checked: false }      
    ]
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取系统当前时间年月日
    var date = new Date();
    var begintime = util.formatTime2(date);
    //获取一年后的时间
    var endtime = util.formatTime3(date);        
    this.setData({
      begin_time: begintime,
      end_time: endtime,
    });
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
  //起始日期选择监听器
  beginDatePickerSelected: function (e) {
    //调用setData()重新绘制
    this.setData({
      begin_time: e.detail.value,
    });
  },

  //结束日期选择监听器
  endDatePickerSelected: function (e) {
    //调用setData()重新绘制
    this.setData({
      end_time: e.detail.value,
    });
  },

  //获取输入的任务内容
  onGetName: function (e) {
    this.setData({ task_name: e.detail.value });
  },

  //获取输入的任务人数
  onGetNumber: function (e) {
    this.setData({ task_number: e.detail.value });
  },

  //判断选择的标签颜色
  onRadioChange: function (e) {
    this.setData({ color: e.detail.value });
  },

  //创建任务按钮
  onCreate: function(e){
    var that = this;
    var currentUser = Bmob.User.current();
    if (that.data.task_name != "" && that.data.task_number != "" && that.data.begin_time < that.data.end_time){
      //计算signNumber和signUp数组
      that.calDate();
      var Task = Bmob.Object.extend("task");
      var task = new Task();
      task.set("name", that.data.task_name);
      task.set("begintime", that.data.begin_time);
      task.set("endtime", that.data.end_time);
      task.set("color", that.data.color);
      task.set("days", that.data.days);
      task.set("number", Number(that.data.task_number));
      task.set("createdby", currentUser.get('realname'));
      task.set("currentNumber", 1);
      task.set("signNumber", that.data.signNumber);
      task.set("totalScore", 0);
      task.set("complete", false);
      //添加数据，第一个入口参数是null
      task.save(null, {
        success: function (result) {
          var Task_User = Bmob.Object.extend("task_user");
          var tu = new Task_User();
          tu.set("taskname", that.data.task_name);
          tu.set("begintime", that.data.begin_time);
          tu.set("endtime", that.data.end_time);
          tu.set("realname", currentUser.get("realname"));
          tu.set("campus", currentUser.get("campus"));
          tu.set("department", currentUser.get("department"));
          tu.set("signUp", that.data.signUp);
          tu.set("complete", false);
          tu.set("enroll", true);
          tu.set("score", 0);
          tu.set("activityid", result.id);
          //添加数据，第一个入口参数是null
          tu.save(null, {
            success: function (result) {
              wx.showToast({
                title: '创建成功',
                duration: 2000
              })
            },
            error: function (result, error) {
              console.log(error);
              wx.showModal({
                title: '提示',
                content: '任务创建失败'
              })
            }
          });          
        },
        error: function (result, error) {
          wx.showModal({
            title: '提示',
            content: '任务创建失败'
          })
        }
      });
    }else{
      wx.showModal({
        title: '提示',
        content: '请把内容填写正确完整'
      })
    }
  },

//计算两个日期之间的间隔时长
  calDate: function (e) {
    var that = this;
    var begin = new Date(that.data.begin_time.replace(/-/g, "/"));
    var end = new Date(that.data.end_time.replace(/-/g, "/"));
    var current = new Date(util.formatTime2(new Date).replace(/-/g, "/"));
    var days = end.getTime() - begin.getTime();
    var day = parseInt(days / (1000 * 60 * 60 * 24));
    var index = current.getTime() - begin.getTime();
    index = parseInt(index/ (1000 * 60 * 60 * 24));
    if (day > 0) {
      that.setData({
        days: day+1,
        index:index
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '日期设定错误'
      })
    }
    var limit = that.data.days - that.data.index;
    //设置签到和当前签到人数数组
    for (var i = -1 * that.data.index; i < limit; i++) {
      var obj = {
        date: util.addDay(i),
        isSign:"今日未打卡"       
      };
      that.data.signUp.push(obj);
      var obj2 = {
        date: util.addDay(i),
        count: 0
      }
      that.data.signNumber.push(obj2);
    }
  },  
})