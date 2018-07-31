// pages/Sign/Sign.js
// 诚信状页面
var util = require('../../utils/util.js');
var Bmob = require('../../utils/bmob.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tab切换
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    //我的任务和所有任务
    myitems: [],
    allitems:[],
    count: 0,//页面显示任务的数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    /**
     * 获取系统信息
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
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
    var that = this;
    that.onGetMyTasks();
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
      that.onGetMyTasks();
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
  /**
   * 滑动切换tab页面
   */
  onPageChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  /**
   * 点击tab切换页面
   */
  onSwichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  //创建任务按钮
  onCreateTask: function () {
    wx.navigateTo({
      url: '../CreateTask/CreateTask'
    })
  },

  //获取当前用户已报名的任务信息
  onGetMyTasks: function () {
    var that = this;
    var currentUser = Bmob.User.current();
    var Task_User = Bmob.Object.extend("task_user");
    var query = new Bmob.Query(Task_User);
    query.equalTo("realname", currentUser.get("realname"));
    query.descending("score");
    query.limit(that.data.count += 5);
    // 查询所有数据并将数据添加到数据对象当中去
    query.find({
      success: function (results) {
        that.setData({ myitems: results });
        //只能用这个循环才可以，否则会出问题
        for (var i = 0; i < results.length; i++) {
          that.onUnion(i);
        }
      },
      error: function (error) {
        console.log("查询失败: " + error.coDe + " " + error.message);
      }
    });
  },

  //将task表和task_user表自然连接
  onUnion: function (n) {
    var that = this;
    var obj = that.data.myitems[n];
    var Task = Bmob.Object.extend("task");
    var q = new Bmob.Query(Task);
    q.get(obj.get("activityid"), {
      success: function (result) {
        // 查询成功，调用get方法获取task表中对应属性的值
        obj.set("currentNumber", result.get("currentNumber"));
        obj.set("signNumber", result.get("signNumber"));
        obj.set("color", result.get("color"));
        obj.set("complete", result.get("complete"));
        //设置当前时间与起始时间之间的时间间隔
        obj.set("index", that.calDate(result.get("begintime")));
        obj.set("days", result.get("days"));
        that.setData({ myitems: that.data.myitems });
      },
      error: function (object, error) {
        // 查询失败
      }
    });
  },

//单个任务的签到按钮
  onSignUp:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    //获取当前日期signUp数组的下标
    var k = that.data.myitems[index].get("index");
    //更改页面是否打卡数据 
    that.data.myitems[index].get("signUp")[k].isSign = "今日已打卡";
    that.setData({ myitems: that.data.myitems });
    //更改页面当前任务签到人数
    that.data.myitems[index].get("signNumber")[k].count += 1;
    that.setData({ myitems: that.data.myitems });
    //必须包装在函数中在调用才可以更新数据成功
    that.onSetScore(index);   
    //修改task表
    var Task = Bmob.Object.extend("task");
    var query = new Bmob.Query(Task);
    query.get(that.data.myitems[index].get("activityid"), {
      success: function (result) {
        //修改当前任务的总积分
        // var totalScore = result.get('totalScore') + 1;
        // result.set("totalScore", totalScore); 
        result.increment("totalScore"); 
        //更改后台signNumber数组数据        
        result.set("signNumber", that.data.myitems[index].get("signNumber"));
        result.save();
        //修改task_user表
        var Task_User = Bmob.Object.extend("task_user");
        var q = new Bmob.Query(Task_User);
        q.get(that.data.myitems[index].id, {
          success: function (result) {
            //修改当前任务的积分
            // var score = result.get('score') + 1;
            // result.set("score", score);
            result.increment("score"); 
            //更改后台signUp数组数据
            result.set("signUp", that.data.myitems[index].get("signUp"));
            result.save();
            wx.showToast({
              title: '打卡成功',
              duration: 2000
            });
            if (that.data.myitems[index].get("days") - 1 == that.data.myitems[index].get("index")) {
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
      error: function (object, error) {
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

//更新任务个人积分
    onSetScore:function(index){
      var that = this;
      var sc = that.data.myitems[index].get("score") + 1;
      var n = "myitems[" + index + "].score";
      that.setData({ [n]: sc });
    },

    //获取当前所有的任务信息
    onGetAllTasks: function () {
      var that = this;
      var Task = Bmob.Object.extend("task");
      var query = new Bmob.Query(Task);
      query.limit(that.data.count += 10);
      query.descending("totalScore");
      // 查询所有数据并将数据添加到数据对象当中去
      query.find({
        success: function (results) {
          for(var i=0;i<results.length;i++){
            var obj = results[i];
            var currenttime = util.formatTime2(new Date());
            if(currenttime > obj.get("endtime")){
              query.get(obj.id, {
                success: function (result) {
                  var currenttime = util.formatTime2(new Date());
                  if (currenttime > result.get("endtime")) {    
                    result.set("complete", true);
                    result.save();
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

    //点击我的任务进入任务详情页面
    onMyTaskDetail:function(e){
      var that = this;
      var id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../TaskDetail/TaskDetail?objectId='+id+"&enroll=true"
      })
    },

    //点击热门任务进入任务详情页面
    onTaskDetail: function (e) {
      var that = this;
      var id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../TaskDetail/TaskDetail?objectId='+id
      })
    },

    //点击热门任务进入任务详情页面
    onAllRange: function () {
      wx.navigateTo({
        url: '../Range/Range'
      })
    },

})