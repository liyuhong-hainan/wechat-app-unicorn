var app = getApp();
Page({

  data: {
  
  },
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    });
  }
})