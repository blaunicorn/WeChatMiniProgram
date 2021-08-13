// pages/form/index.js
var app = getApp();
const API = require('../../public/api')
// 调用封装好的时间和经纬度方法
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    phoneNumber: '',
    errTip: false
  },
  // 获得用户名
  getUserName(e) {
    this.setData({
      userName: e.detail.value 
    })
  },
    // 获得手机号
    getPhoneNumber(e) {
      this.setData({
        phoneNumber: e.detail.value
      })
    },
      // 姓名和手机号验证，不为空则跳转下一页
  nextStep() {
    let userName = this.data.userName;
    let phoneNumber = this.data.phoneNumber;
    if (!userName || !phoneNumber) {
      this.setData({
        errTip: true
      })
    } else {
      app.globalData.userInfo.userName = this.data.userName;
      app.globalData.userInfo.phoneNumber = this.data.phoneNumber;
      wx.redirectTo({
        url: '/pages/regist/index'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('form options:', options)
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
    return {
      title: '考勤打卡信息注册',
      path: '/page/form/index'
    }
  }
})