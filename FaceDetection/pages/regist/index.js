// pages/regist/index.js
var app = getApp();
const API = require('../../public/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: "",
    info: '',
    toast: false,
    hideToast: false,
  },
  openToast: function () {
    this.setData({
      toast: true
    });
    setTimeout(() => {
      this.setData({
        hideToast: true
      });
      setTimeout(() => {
        this.setData({
          toast: false,
          hideToast: false,
        });
      }, 300);
    }, 3000);
  },
  /**
   * 点击拍照
   * 在此获取用户授权，获得用户信息
   */
  takePhoto: function () {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'low',
      success: (res) => {
        this.setData({
          imgUrl: res.tempImagePath
        })
      }
    })
  },
  /**
   * 上传
   * 请求接口百度AI接口
   */
  requestapi: function () {

    wx.getFileSystemManager().readFile({
      filePath: this.data.imgUrl,
      encoding: "base64",
      success: (res) => {
        console.log('API.add',API.add)
        let access_token = wx.getStorageSync("access_token")
        API.add = 'https://aip.baidubce.com/rest/2.0/face/v3/faceset/user/add?access_token=' + access_token,
        console.log('API.add',API.add)
        wx.request({
          url: API.add,
          header: {
            "content-type": "application/json"
          },
          timeout: 3000,
          method: "POST",
          data: {
            image: res.data,
            image_type: "BASE64",
            group_id: 1,
            user_id: new Date().getTime(),
            user_info: JSON.stringify(app.globalData.userInfo)
          },
          success: (res) => {
            console.log('增加人脸数据后返回值',res)
            if (res.data.error_code === 0 && res.data.result) {
              // 上传成功以后
              wx.redirectTo({
                url: '/pages/msg/index?type=regist'
              })
            }

          },
          fail(err) {
            console.log('接口调用失败:', err)
            alert('人脸数据增加失败')
          },
          complete() {
            console.log('请求完成')
          }
        })

      },
      err: (errMsg) => {
        console.log(errMsg)
      },
    })
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
    return {
      title: '考勤打卡信息注册',
      path: '/page/form/index'
    }
  }
})