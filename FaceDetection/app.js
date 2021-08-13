//app.js
const api_key = 'BmwcEjGK5QDDIhhB0LC73594'
const secret_key = 'e0QjExGXd8elrdIvLX86sAagLnltbn67'
const baidu_url = 'https://aip.baidubce.com/oauth/2.0/token'

App({
  data: {
    name: 'www'
  },
  onLaunch: function () {
    this.requestToken()
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  // 初始化，鉴权获取token储存起来
  requestToken: function () {
    let that = this;
    wx.request({
      url: baidu_url,
      data: {
        grant_type: 'client_credentials',
        client_id: api_key,
        client_secret: secret_key
      },
      success: function (res) {
        if (res.statusCode === 200) {
          console.log('获取baidu人脸识别token',res)
          wx.setStorageSync('access_token', res.data.access_token)
          wx.setStorageSync('expires_in', res.data.expires_in)
          wx.setStorageSync('access_token_date', new Date().getTime())
          that.globalData.access_token = res.data.access_token
        }
      }
    })
  },
  globalData: {
    userInfo: {}
  }
})