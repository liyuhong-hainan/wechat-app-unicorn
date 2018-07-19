import API from '../../../utils/api.js';
var app = getApp();
Page({

  data: {
  
  },
  onLoad: function (options) {
    
  },
  onBuyTap: function(event){
    wx.redirectTo({
      url: "/pages/category/category"
    });
  },
  onShow: function(){
    this.userAmountList();
  },
  userAmountList: function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    API.userAmountList({}, function (res) {
      if (res.head.code == 0) {
        that.setData({
          amountlist: res.body.list,
          extra: res.body.extra
        })
      } else {
        console.log('请求失败:' + res.head.msg);
      }
      wx.hideLoading();
    });
  }

})