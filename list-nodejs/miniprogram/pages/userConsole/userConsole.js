// pages/userConsole/userConsole.js
Page({

  data: {
    openid: ''
  },

  onLoad: function (options) {
    this.setData({
      openid: getApp().globalData.openid
    })
  },
  add:function() {
    wx.cloud.init({env: 'demo-kaikeba-5g2z3zi41899c20d'})
    const db = wx.cloud.database()
    const test = db.collection('test')
    test.add({
       // data 字段表示需新增的 JSON 数据
       data: {

        name: "Bill1",
        age:30       
      },success: function (res) {       
        //  输出成功插入后的id以及其他信息
        console.log(res)
      }
    })
  }
})
