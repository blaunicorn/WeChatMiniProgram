// pages/login/index.js
var app = getApp()
const API = require('../../public/api')
// 调用封装好的时间和经纬度方法
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: JSON.stringify(app.globalData),
    remain_time: 0, //距离上班还有多久
    distance: 0, //打卡距离
    longitude2: 120.007563, //经度
    latitude2: 30.286455, //纬度 120.007563,30.286455
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('login options:', options)
    // 开启定时器，每隔一秒钟，扫码人脸，验证
    // 计算打卡时间
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.timer = setInterval(() => {
      this.takePhoto()
      this.getPosition()
      this.calculatRemainTime()
    }, 1000)

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
    // 页面离开时要清空定时器，不要再扫码人脸了
    clearInterval(this.timer)
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
      title: '考勤打卡',
      path: '/page/login/index'
    }
  },
  // 获取经纬度
  getPosition() {
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        // console.log('经度:', longitude)
        // console.log('纬度:', latitude)

        // 计算两点之间距离，当距离小于2km时可以打卡
        let dis = util.getDistance(latitude, longitude, that.data.latitude2, that.data.longitude2)
        that.setData({
          distance: dis
        })
        console.log('距离:', dis)
        if (dis < 2) {
          that.takePhoto()
        }
      }
    })
  },
    /**
   * 用户打卡 
   * 在此获取用户授权，获得用户照片 发送接口进行比对结果
   */
  takePhoto() {
     const ctx = wx.createCameraContext()
     ctx.takePhoto({
      quality: 'low',
      success: (res) => {
        this.setData({
          imgUrl: res.tempImagePath
        })
        // 把图片转成base64
        let base64 = wx.getFileSystemManager().readFileSync(res.tempImagePath, 'base64')
        this.requestapi(base64);
      }
    })
  },
 /**
   * 请求接口百度AI接口 比对接口
   */
  requestapi: function (base64) {
    let that = this;
    let access_token = wx.getStorageSync("access_token")
    API.search = 'https://aip.baidubce.com/rest/2.0/face/v3/search?access_token=' + access_token,
    console.log('API.search',API.search)
    wx.request({
      url: API.search,
      header: {
        "content-type": "application/json"
      },
      timeout: 3000,
      method: "POST",
      data: {
        image: base64,
        image_type: "BASE64",
        group_id_list: 1
      },
      success: function (res) {
        console.log('比对返回值',res)
        if (res.data.error_code === 0 && res.data.result) {
          if (res.data.result.user_list[0].score > 90) {
            console.log('接口调用成功')
            clearInterval(that.timer)
            // 成功跳到成功
            wx.redirectTo({
              url: '/pages/msg/index?type=login'
            })
          }
        }

      },
      fail(err) {
        console.log('接口调用失败:', err)
        alert('人脸比对失败'+JSON.stringify(err))
      },
      complete() {
        console.log('请求完成')
      }
    })
  },
  failTip() {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = '../../public/audio/login_fail.mp3'
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
    // 计算距离上班还有多长时间
    calculatRemainTime() {
      let remain_time = util.calculatRemainTime()
      this.setData({
        remain_time: remain_time
      })
    },
    // 转跳到注册页面
    toRegist(){
      wx.redirectTo({
        url: '/pages/form/index',
      })
    },
})
