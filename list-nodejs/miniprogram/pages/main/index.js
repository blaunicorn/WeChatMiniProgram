// pages/main/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */

  data: {
    name:'',
    age:'',
    recordId: '',
    nameResult: '',
    ageResult: '',
    db: undefined,
    test: undefined,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    this.onGetOpenid()

  },

  onGetOpenid: function() {
     const that = this
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.cloud.init({env: 'demo-kaikeba-5g2z3zi41899c20d'})
        that.setData({
          db:wx.cloud.database(),
          test:wx.cloud.database().collection('test')
        })
        // that.db = wx.cloud.database()
        // that.test = db.collection('test')
        wx.navigateTo({
          url: '../main/main',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },
   // 单击“插入数据”按钮调用该函数
   insertData: function() {
     let that = this
     try {
        //  将年龄转换为整数类型值
        let age = parseInt(that.data.age)
         //  如果输入的年龄不是数字，会显示错误对话框，并退出该函数
         if (isNaN(age)) {
            //  显示错误对话框
            wx.showModal({
              title: '错误',
              content: '请输入正确的年龄',
              showCancel: false
            })
            return
         }
         //  向test数据集添加记录
         this.data.test.add({
           // data 字段表示需新增的 JSON 数据
           data: {
             name: that.data.name,
             age: age
           },
           //  数据插入成功，调用该函数
           success: function(res) {
             console.log(res)
             wx.showModal({
               title: '成功',
               content: '成功插入记录',
               cancelColor: 'false',
             })
             that.setData({
               name: '',
               age: ''
             })
           }
         })
     } catch(e) {
       wx.showModal({
         title:'错误',
         content: e.message,
         showCancel: false
       })
     }
   },
   queryData:function() {
 let that = this
 //  根据记录ID搜索数据集  
 this.data.db.collection('test').doc(this.data.recordId).get({
   // 找到记录集调用
   success: function(res) {
     //  将查询结果显示在页面上  
     that.setData({
       nameResult: res.data.name,
       ageResult: res.data.age
     })
   },
   //  未查到数据时调用
   fail: function(res) {
     wx.showModal({
       cancelColor: 'false',

    title:'错误',
    content: '没有找到记录'
     })
   }
 })
   },
   //  下面的函数用于当更新input组件中的值时同时更新对应变量的值
   bindKeyInputName: function(e) {
     console.log(e)
     this.setData({
       name: e.detail.value
     })
   },
   bindKeyInputAge: function(e) {
     this.setData({
       age: e.detail.value
     })
   },
   bindKeyInputId: function(e) {
     this.setData({
       recordId: e.detail.value
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