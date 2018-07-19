import API from '../../../utils/api.js';
import Modal from '../../../utils/modal.js';
var app = getApp();
Page({

  data: {
    isFocus: false
  },
  onLoad: function (options) {
  },
  inputText: function(e){
    this.setData({
      exchangeCode: e.detail.value
    })
  },
  userExchange: function(event){
    var that = this;
    var exchangeCode = that.data.exchangeCode;
    if (!exchangeCode){
      Modal.showWarmToast('邀请码不能为空');
      this.setData({
        isFocus: true
      })
      return false;
    }
    wx.showLoading({
      title: '加载中',
    });
    API.userExchange({ code: exchangeCode}, function (res) {
      wx.hideLoading();
      if (res.head.code == 0) {
        Modal.showToast("提交成功！");
        setTimeout(() => {
          wx.navigateBack({});
        }, 1000);
      } else {
        console.log('请求失败:' + res.head.msg);
        Modal.showModal('提交失败', res.head.msg);
      }
    });
  }
})