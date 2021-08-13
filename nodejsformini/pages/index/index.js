//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    imgUrls: [
      '/assets/1.jpg',
      '/assets/2.jpg',
      '/assets/3.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    proLists:null
  },
  onLoad: function () {
    this.getProList();
  },
  toDetail:function(e){
    console.log(e);
    var index=e.currentTarget.dataset.index;
    console.log(index);
    var proLists = this.data.proLists;
    var title = proLists[index].title;
    wx.navigateTo({
      url:'/pages/detail/detail?title='+title,
    })
  },
  getProList: function(){
    var self=this;
    wx.request({
      url: 'http://127.0.0.1:8080/data.json',
      method:'GET',
      success:function(res){
        // console.log(res);
        self.setData({
          proLists:res.data,
        })
      }
    })
  }
})