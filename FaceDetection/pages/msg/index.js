// pages/msg/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: "注册"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('msg options:', options)
    if (options.type === 'login') {
      this.setData({
        msg: "打卡"
      })
    }
    // 打卡成功以后 添加声音
    const innerAudioContext = wx.createInnerAudioContext()
    // innerAudioContext.autoplay = true
    innerAudioContext.src = '/public/audio/login_success.mp3'

    innerAudioContext.play()
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
  nextStep() { 
      wx.redirectTo({
        url: '/pages/login/index'
      })
   
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

  }
})