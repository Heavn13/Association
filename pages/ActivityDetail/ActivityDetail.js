// pages/index/ActivitieDetail.js
//活动详情页面
var QR = require("../../utils/QR.js");
var Bmob = require('../../utils/bmob.js');
var util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activity_name: '',
    activity_time: '',
    currentTime: '',
    activity_place: '',
    activity_summary: '',
    activity_number: '',
    activity_currentNumber: '',
    objectId: '',//当前活动的id
    currentId: '',//当前用户活动的报名信息
    enroll: false,//报名
    signUp: false,//签到
    canvasHidden: true,
  },
  canvasId: "qrcCanvas",//画布的id

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取当前活动的objectId    
    this.setData({ objectId: options.objectId });
    this.setData({ enroll: Boolean(options.enroll) });
    var time = util.formatTime2(new Date());
    this.setData({ currentTime: time });
    this.onInit();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.size = this.setCanvasSize();//动态设置画布大小  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //初始化数据
    this.onInit();
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

  //设置画板大小
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 686;//不同屏幕下canvas的适配比例；设计稿是750宽  
      var width = res.windowWidth / scale;
      var height = width;//canvas画布为正方形  
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error  
      console.log("获取设备信息失败" + e);
    }
    return size;
  },

  //生成二维码函数
  createQrCode: function (str, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片    
    QR.api.draw(str, canvasId, cavW, cavH);
  },

  //生成二维码按钮
  onGenQrc: function () {
    var currentUser = Bmob.User.current();
    //拥有生成二维码的权限
    if (currentUser.get('sign') == true) {
      this.createQrCode(this.data.activity_name, this.canvasId, this.size.w, this.size.h);
      this.setData({ canvasHidden: false });
    } else {
      wx.showModal({
        title: '提示',
        content: '你没有生成签到二维码的权限'
      })
    }
  },

  //报名函数
  onEnroll: function () {
    var that = this;
    //判断报名时间小等于活动时间
    if (that.data.currentTime <= that.data.activity_time) {
      //判断当前用户是否已报名
      var currentUser = Bmob.User.current();
      var Activity_User = Bmob.Object.extend("activity_user");
      var query = new Bmob.Query(Activity_User);
      query.equalTo('realname', currentUser.get("realname"));
      query.equalTo('activityid', that.data.objectId);
      // 查询所有数据
      query.find({
        success: function (results) {
          for (var i = 0; i < results.length; i++) {
            var object = results[i];
            that.setData({ enroll: true });
            wx.showModal({
              title: '提示',
              content: '你已报名，无需重复报名'
            })
          }
          //当前用户未报名
          if (that.data.enroll == false) {
            //报名人数小于当前活动人数可以报名  
            if (parseInt(that.data.activity_currentNumber) < parseInt(that.data.activity_number)) {
              var Activity_User = Bmob.Object.extend("activity_user");
              var au = new Activity_User();
              au.set("activityname", that.data.activity_name);
              au.set("activitytime", that.data.activity_time);
              au.set("realname", currentUser.get("realname"));
              au.set("campus", currentUser.get("campus"));
              au.set("department", currentUser.get("department"));
              var grade = String(currentUser.get("username")).substr(0, 4) + "级"
              au.set("grade",grade);
              au.set("signUp", false);
              au.set("enroll", true);
              au.set("activityid", that.data.objectId);
              au.save(null, {
                success: function (result) {
                  that.setData({ enroll: true });
                  that.setData({ currentId: result.id });
                  wx.showToast({
                    title: '报名成功',
                    duration: 2000
                  })
                },
                error: function (result, error) {
                  console.log(error);
                  wx.showModal({
                    title: '提示',
                    content: '报名失败'
                  })
                }
              });
              // 增加活动报名人数
              that.onAddNumbers();

            } else {
              wx.showModal({
                title: '提示',
                content: '人数已满，报名失败'
              })
            }
          }
        },
        error: function (error) {

        }
      });
    }
    else {
      wx.showModal({
        title: '提示',
        content: '该活动报名时间已过期'
      })
    }

  },

  //取消报名
  onUnEnroll: function () {
    var that = this;
    //判断报名时间小等于活动时间
    if (that.data.currentTime <= that.data.activity_time) {
      wx.showModal({
        title: '提示',
        content: '是否取消报名',
        success: function (res) {
          //点击确定删除
          if (res.confirm) {
            var Activity_User = Bmob.Object.extend("activity_user");
            var query = new Bmob.Query(Activity_User);
            query.get(that.data.currentId, {
              success: function (object) {
                that.setData({ enroll: false });
                object.destroy({
                  success: function (deleteObject) {
                    wx.showToast({
                      title: '取消成功',
                      duration: 2000
                    });
                    that.onSubNumbers();

                  },
                  error: function (object, error) {
                    wx.showModal({
                      title: '提示',
                      content: '报名取消失败'
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
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '该活动已过期，无法取消报名'
      })
    }


  },

  //签到函数
  onSign: function () {
    var that = this;
    //未报名
    if (!that.data.enroll) {
      wx.showModal({
        title: '提示',
        content: '你尚未报名，请报名后再签到'
      })
    } else {
      //判断活动时间才可以签到
      if (that.data.currentTime == that.data.activity_time) {
        //扫码签到
        wx.scanCode({
          success: (res) => {
            if (res.result == that.data.activity_name) {
              //更新签到状态
              var Activity_User = Bmob.Object.extend("activity_user");
              var query = new Bmob.Query(Activity_User);
              query.get(that.data.currentId, {
                success: function (result) {
                  that.setData({ signUp: true });
                  result.set('signUp', true);
                  result.save();
                  wx.showToast({
                    title: '签到成功',
                    duration: 2000
                  })
                },
                error: function (object, error) {
                  wx.showModal({
                    title: '提示',
                    content: '签到失败'
                  })
                }
              });
            } else {
              that.setData({ signUp: false })
              wx.showModal({
                title: '提示',
                content: '签到失败'
              })
            }
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '未到活动时间，无法签到'
        })
      }
    }
  },

  //初始化数据
  onInit: function () {
    var that = this;
    var currentUser = Bmob.User.current();
    //获取当前活动相关数据
    var Activity = Bmob.Object.extend("activity");
    var query = new Bmob.Query(Activity);
    query.get(that.data.objectId, {
      success: function (result) {
        // 查询成功，调用get方法获取对应属性的值
        that.setData({ activity_name: result.get("name") });
        that.setData({ activity_time: result.get("time") });
        that.setData({ activity_place: result.get("place") });
        that.setData({ activity_summary: result.get("summary") });
        that.setData({ activity_number: result.get("number") });
        that.setData({ activity_currentNumber: result.get("currentNumber") });
      },
      error: function (object, error) {
        // 查询失败
      }
    });
    //获取当前用户的报名签到状态
    var Activity_User = Bmob.Object.extend("activity_user");
    var q = new Bmob.Query(Activity_User);
    q.equalTo("activityid", that.data.objectId);
    q.equalTo("realname", currentUser.get("realname"));
    // 查询所有数据
    q.find({
      success: function (results) {
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          //当前用户报名签到状态
          that.setData({ currentId: object.id });
          that.setData({ signUp: object.get("signUp") });
          that.setData({ enroll: object.get("enroll") });

        }
      },
      error: function (object, error) {
        // 查询失败
      }
    });
  },

  //增加当前报名人数
  onAddNumbers: function () {
    var that = this;
    var Activity = Bmob.Object.extend("activity");
    var query = new Bmob.Query(Activity);
    query.get(that.data.objectId, {
      success: function (result) {
        var cNumber = parseInt(that.data.activity_currentNumber);
        cNumber++;
        that.setData({ activity_currentNumber: cNumber });
        result.set('currentNumber', String(cNumber));
        //使用原子操作无效的问题
        // result.increment("currentNumber");
        result.save();
      },
      error: function (object, error) {
      }
    });
  },

  //减少当前报名人数
  onSubNumbers: function () {
    var that = this;
    var Activity = Bmob.Object.extend("activity");
    var query = new Bmob.Query(Activity);
    query.get(that.data.objectId, {
      success: function (result) {
        var cNumber = parseInt(that.data.activity_currentNumber);
        cNumber--;
        that.setData({ activity_currentNumber: cNumber });
        result.set('currentNumber', String(cNumber));
        //使用原子操作无效的问题
        //result.increment("currentNumber",-1);
        result.save();
      },
      error: function (object, error) {
      }
    });

  }
})