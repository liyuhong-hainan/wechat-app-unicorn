import API from '../../../utils/api.js';
import Modal from '../../../utils/modal.js';
var app = getApp();
Page({

  data: {
    dataLoaded: false
  },
  onLoad: function (options) {
    this.couponInfo();
  },
  onShow: function () {
    this.getUserInfo();
  },
  getUserInfo: function () {
    var that = this;
    API.userInfo({}, function (res) {
      wx.hideLoading();
      if (res.head.code == 0) {
        var userInfo = res.body;
        that.setData({
          userInfo: userInfo
        })
        app.globalData.userInfo.rightStatus = userInfo.rightStatus;
        app.globalData.userInfo.rightStatusDesc = userInfo.rightStatusDesc;
      } else {
        console.log('请求失败:' + res.head.msg);
      }
    });
  },
  couponInfo: function(){
    var that = this;
    API.couponInfo({}, function (res) {
      that.getCouponList();
      if (res.head.code == 0) {
      } else {
        console.log('请求失败:' + res.head.msg);
      }
    });
  },
  getCouponList: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    API.userCouponList({}, function (res) {
      if (res.head.code == 0) {
        that.setData({
          couponList: res.body.list,
          dataLoaded: true
        })
      } else {
        console.log('请求失败:' + res.head.msg);
      }
      wx.hideLoading();
    });
  },
  navigatorTap: function (event) {
    var url = event.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    })
  },
  getPhoneNumber: function (e) {
    if (e.detail.encryptedData) {
      var tempType = e.currentTarget.dataset.type;
      this.bindMobile(e.detail.encryptedData, e.detail.iv, tempType);
    } else {
      // var userInfo = this.data.userInfo;
      // userInfo.mobile = '';
      // this.setData({
      //   userInfo: userInfo
      // }); 
    }
  },
  bindMobile: function (encryptedData, iv, tempType) {
    var params = {
      sessionKey: app.globalData.userInfo.sessionKey,
      encryptedData: encryptedData,
      iv: iv
    };
    var that = this;
    wx.showLoading({
      title: '提交中',
    });
    API.bindMobile(params, function (res) {
      if (res.head.code == 0) {
        Modal.showToast('绑定成功');
        var userInfo = app.globalData.userInfo;
        userInfo.mobile = res.body.mobile;
        that.setData({
          userInfo: userInfo
        });
        app.globalData.userInfo = userInfo;
        that.toMiniProgram();
        if (tempType == 0) {
          App.zhuge.track('在意财富优惠券立即使用', {
            'user_id': that.data.userInfo.id,
            '昵称': that.data.userInfo.nickName,
            '手机号': that.data.userInfo.mobile
          });
        } else {
          App.zhuge.track('vip咨询券', {
            'user_id': that.data.userInfo.id,
            '昵称': that.data.userInfo.nickName,
            '手机号': that.data.userInfo.mobile
          });
        }
        // that.getUserInfo();
      } else {
        console.log('请求失败:' + res.head.msg);
        if (res.head.code = -20038) {//已绑定
          // var userInfo = that.data.userInfo;
          // userInfo.mobile = '888888';
          // that.setData({
          //   userInfo: userInfo,
          //   isReg: true
          // });
        }
      }
      wx.hideLoading();
    });
  },
  zaiyiApplet: function () {
      this.toMiniProgram();
      App.zhuge.track('在意财富优惠券立即使用', {
        'user_id': this.data.userInfo.id,
        '昵称': this.data.userInfo.nickName,
        '手机号': this.data.userInfo.mobile
      });
  },
  zaiyiAppletVip: function () {
      this.toMiniProgram();
      App.zhuge.track('vip咨询券', {
        'user_id': this.data.userInfo.id,
        '昵称': this.data.userInfo.nickName,
        '手机号': this.data.userInfo.mobile
      });
  },
  toMiniProgram: function (type) {
    var that = this;
    wx.navigateToMiniProgram({
      appId: 'appId',
      path: 'pages/index/index',
      extraData: {
        openId: that.data.userInfo.openId,
        source: 1001,
        mobile: that.data.userInfo.mobile
      },
      //envVersion: 'trial',
      success(res) {
        console.log("打开成功：" + JSON.stringify(res));
      }
    })
  }
})