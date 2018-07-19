Page({
  data: {

  },
  onLoad: function (options) {
    this.topicList();
  },
  topicList: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: 'https://portapi.zaiyicaifu.com/api/config.json',
      method: 'GET',
      data: {},
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        that.setData({
          topicList: res.data.list
        });
        //console.log(JSON.stringify(res));
        setTimeout(() => {
          wx.hideLoading();
        }, 1000);
      },
      fail: function (error) {
        console.log(error);
        wx.hideLoading();
      }
    })
  },
  goodsDetail: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../../goods/goods-detail/goods-detail?id=' + id
    })
  }
})