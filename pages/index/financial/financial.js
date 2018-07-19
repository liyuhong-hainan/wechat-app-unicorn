Page({
  data: {
  
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    setTimeout(() => {
      wx.hideLoading();
    }, 1000);
  },
  navigatorTap: function(e){
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    })
  }
  
})