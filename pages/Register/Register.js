// pages/index/Register.js
// 注册页面
var Bmob = require('../../utils/bmob.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    namePhold:'姓名',
    id:'',
    idPhold:'学号',
    password:'',
    passwordPhold:'密码',
    passwordAgain: '',
    passwordAgainPhold: '再次输入密码',
    campuses: ['中心校区','洪家楼校区','软件园校区','趵突泉校区','兴隆山校区','千佛山校区','青岛校区'],
    campus:'中心校区',
    campusIndex:0,
    college:'',
    collegePhold:'学院',
    departments: ['活动实践部', '网络宣传部', '新闻中心', '秘书处', '财务部', '社长',  '团支书', '副社'],
    department:'非唐社成员',
    departmentIndex: 0,
    departmentPhold:'部门',
    phone:'',
    phonePhold:'手机号',
    depart:true,
    items:[
      {name:'是',checked:false},
      {name:'否', checked: false }
    ]  
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

  //获取输入的姓名
  onGetName:function(e){
    this.setData({ name: e.detail.value });
  },

//获取输入的学号
  onGetId: function (e){
    this.setData({ id: e.detail.value });
  },

//获取输入的校区
  onCampusChange: function (e) {
    this.setData({campusIndex: e.detail.value })
    var s = this.data.campuses[this.data.campusIndex]
    this.setData({ campus: s })
  },

//获取输入的学院
  onGetCollege: function (e){
    this.setData({ college: e.detail.value });
  },

//获取输入的部门
  onGetDepartment: function (e){
    this.setData({ departmentIndex: e.detail.value })
    var s = this.data.departments[this.data.departmentIndex]
    this.setData({ department: s });
  },

//获取输入的手机号
  onGetPhone: function (e){
    this.setData({ phone: e.detail.value });
  },

  //获取输入的密码
  onGetPassword: function (e) {
    this.setData({ password: e.detail.value });
  },

  //获取第二次输入的密码
  onGetPasswordAgain: function (e) {
    this.setData({ passwordAgain: e.detail.value });
  },

  //判断是否是唐社成员
  onRadioChange: function(e){
    if(e.detail.value == "是"){
      this.setData({depart:false});
      //让picker有个默认值
      this.setData({department:'活动实践部'});
    }else{
      this.setData({depart: true });
    }
  },

//注册
  onRegister:function(e){
    var user  = new Bmob.User();
    //所有输入不为空
    if(this.data.name != '' && this.data.id != '' && this.data.campus != '' && this.data.college != '' && this.data.phone != ''){
      if (this.data.id.length == 12){
        if (this.data.phone.length == 11) {
          //两次输入的密码相等
          if (this.data.password == this.data.passwordAgain) {
            user.set('username', this.data.id);
            user.set('password', this.data.password);
            user.set('realname', this.data.name);
            user.set('campus', this.data.campus);
            user.set('college', this.data.college);
            user.set('createActivity', false);
            user.set('grant', false);
            user.set('sign', false);
            user.set('department', this.data.department);
            user.set('phone', this.data.phone);
            user.signUp(null, {
              success: function (res) {
                wx.showToast({
                  title: '注册成功',
                  duration: 2000
                })
                setTimeout(function () {
                  wx.redirectTo({
                    url: '../Login/Login'
                  })
                }, 2000);
              },
              error: function (userData, error) {
                wx.showModal({
                  title: '提示',
                  content: '账号已存在'
                })
              }
            });
          }
          else {
            wx.showModal({
              title: '提示',
              content: '两次输入密码不一致'
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            content: '手机号格式不正确'
          })
        }
      }else{
        wx.showModal({
          title: '提示',
          content: '学号格式不正确'
        })
      }        
    }else{
      wx.showModal({
        title: '提示',
        content: '请把资料填写完成'
      })  
    }    
  }
})