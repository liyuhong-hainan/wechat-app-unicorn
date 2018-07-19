import API from '../../../utils/api.js';
import Modal from '../../../utils/modal.js';
Page({

  data: {
  
  },
  onLoad: function (options) {
    var id = options.id;
    this.logisticsInfo(id);
  },
  logisticsInfo: function (id){
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    API.orderExpress({ id: id }, function (res) {
      if (res.head.code == 0) {
        that.setData({
          logisticsInfo: res.body.extra,
          progressList: res.body.list
        })
      } else {
        console.log('请求失败:' + res.head.msg);
      }
      wx.hideLoading();
    });
  }

})