import API from '../../../../utils/api.js';
import Modal from '../../../../utils/modal.js';
var app = getApp();
Page({
  data: {
    isFocus: false
  },
  onLoad: function (options) {
    this.userPoints();
    var userInfo = app.globalData.userInfo;
    App.zhuge.track('用户进入充值页', {
      'user_id': userInfo.id,
      '昵称': userInfo.nickName,
      '手机号': userInfo.mobile
    });
  },
  userPoints: function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    API.userPoints({}, function (res) {
      if (res.head.code == 0) {
        that.setData({
          userPoints: res.body
        })
      } else {
        console.log('请求失败:' + res.head.msg);
      }
      wx.hideLoading();
    });
  },
  inputText: function (e) {
    this.setData({
      money: e.detail.value
    })
  },
  preRecharge: function(){
    var that = this;
    var money = that.data.money;
    if (!money) {
      Modal.showWarmToast('请输入充值金额');
      // this.setData({
      //   isFocus: true
      // })
      return false;
    }
    if (money >= 10000000) {
      Modal.showWarmToast('充值金额在1千万以内');
      return false;
    }
    wx.showLoading({
      title: '加载中',
    });
    API.preRecharge({ money: money}, function (res) {
      wx.hideLoading();
      if (res.head.code == 0) {
        that.wxPay(res.body); 
      } else {
        Modal.showModal('提交失败', res.head.msg);
        console.log('请求失败:' + res.head.msg);
        var userInfo = app.globalData.userInfo;
        App.zhuge.track('用户充值积分失败', {
          'user_id': userInfo.id,
          '昵称': userInfo.nickName,
          '手机号': userInfo.mobile,
          '充值金额': that.data.money,
          '失败原因': res.head.msg
        });
      }
    });
  },
  wxPay: function(param){
    var that = this;
    wx.requestPayment({
      "timeStamp": param.timeStamp,
      "nonceStr": param.nonceStr,
      "signType": "MD5",
      "paySign": param.paySign,
      "package": param.package,
      'success': function (res) {
        console.log('调起成功：'+ JSON.stringify(res));
        Modal.showWarmToast('充值成功！');
        setTimeout(() => {
          wx.navigateBack({});
        }, 1000);
        var userInfo = app.globalData.userInfo;
        App.zhuge.track('用户充值积分成功', {
          'user_id': userInfo.id,
          '昵称': userInfo.nickName,
          '手机号': userInfo.mobile,
          '充值金额': that.data.money
        });
      },
      'fail': function (res) {
        console.log('调起失败：' + JSON.stringify(res));
        var userInfo = app.globalData.userInfo;
        App.zhuge.track('用户充值积分失败', {
          'user_id': userInfo.id,
          '昵称': userInfo.nickName,
          '手机号': userInfo.mobile,
          '充值金额': that.data.money,
          '失败原因': JSON.stringify(res)
        });
      }
    })
  }
})