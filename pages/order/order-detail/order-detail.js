import API from '../../../utils/api.js';
import Modal from '../../../utils/modal.js';
Page({
  data: {
    orderInfo: {picUrls: 'https://'}
  },
  onLoad: function (options) {
    var id = options.id;
    this.orderInfo(id);
  },
  orderInfo: function(id){
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    API.orderInfo({id: id }, function (res) {
      if (res.head.code == 0) {
        that.setData({
          orderInfo: res.body
        })
      } else {
        console.log('请求失败:' + res.head.msg);
      }
      wx.hideLoading();
    });
  }
})