// pages/ChangeActivity/ChangeActivity.js
// 修改活动详情
var Bmob = require('../../utils/bmob.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_name: '',
    activity_time: '',
    activity_place: '',
    activity_summary: '',
    activity_number: '',
    activity_currentNumber: '',
    objectId: '', 
    items: [],
    people:true,
    look:'点击查看'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取当前活动的objectId    
    this.setData({ objectId: options.objectId });  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //初始化数据
    this.onInit();
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
        //获取当前用户已报名的人员
        var Activity_User = Bmob.Object.extend("activity_user");
        var query = new Bmob.Query(Activity_User);
        console.log(that.data.activity_name);
        query.equalTo("activityname", that.data.activity_name);
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
      error: function (object, error) {
        // 查询失败
      }
    });
  },

  //查看详情
  onLook:function(){
    var that = this;
    if(that.data.look == '点击查看'){
      that.setData({ people: false });
      that.setData({ look:'收回报名列表' });
    }      
    else{
      that.setData({ people: true });
      that.setData({ look: '点击查看' });
    }
  },

  //修改活动
  onSave: function(){
    var that = this;
    var currentUser = Bmob.User.current();
    var Activity = Bmob.Object.extend("activity");
    var query = new Bmob.Query(Activity);
    query.get(that.data.objectId, {
      success: function (result) {
        result.fetchWhenSave(true);
        result.set("name", that.data.activity_name);
        result.set("time", that.data.activity_time);
        result.set("place", that.data.activity_place);
        result.set("summary", that.data.activity_summary);
        result.set("number", that.data.activity_number);
        result.set("createdby", currentUser.get('realname'));
        result.set("currentNumber", that.data.activity_currentNumber);
        result.save();
        wx.showToast({
          title: '修改成功',
          duration: 2000
        })

        // The object was retrieved successfully.
      },
      error: function (object, error) {
        wx.showModal({
          title: '提示',
          content: '活动修改失败'
        })
      }
    });
  },

  //删除活动
  onDelete: function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否删除该活动',
      success: function (res) {
        //点击确定删除
        if (res.confirm) {
          //删除该活动的报名信息
          var Activity_User = Bmob.Object.extend("activity_user");
          var query = new Bmob.Query(Activity_User);
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
          var Activity = Bmob.Object.extend("activity");
          var query = new Bmob.Query(Activity);
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
                    content: '活动删除失败'
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
  }
})