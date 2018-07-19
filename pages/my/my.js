import API from '../../utils/api.js';
import Modal from '../../utils/modal.js';
var app = getApp();
Page({
  data: {
    userInfo: { mobile:'888888',availablePoints:0},
    redDot: true
  },
  onLoad: function (options) { 
  },
  onShow: function(){
    var token = app.globalData.userInfo.token;
    var isReg = false;
    if (token) {
      this.setData({
        isReg: true
      })
      this.userInfo();
    } else {
      this.setData({
        isReg: false
      })
      this.getUserInfo();
    } 
    var isReadCoupon = wx.getStorageSync('isReadCoupon');
    if (isReadCoupon) {
      this.setData({
        redDot: false
      })
    }
  },
  
  userInfo: function () {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    });
    API.userInfo({}, function (res) {
      wx.hideLoading();
      if (res.head.code == 0) {
        var userInfo = res.body;
        that.setData({
          userInfo: userInfo
        })
        app.globalData.userInfo.cardNo = userInfo.cardNo;
        app.globalData.userInfo.availablePoints = userInfo.availablePoints;
        app.globalData.userInfo.rightStatus = userInfo.rightStatus;
        app.globalData.userInfo.rightStatusDesc = userInfo.rightStatusDesc;
      } else {
        console.log('请求失败:' + res.head.msg); 
      }
    });
  },
  getPhoneNumber: function (e) {
    if (e.detail.encryptedData){
      this.bindMobile(e.detail.encryptedData, e.detail.iv);
    }else{
      // var userInfo = this.data.userInfo;
      // userInfo.mobile = '';
      // this.setData({
      //   userInfo: userInfo
      // }); 
    }
  },
  bindMobile: function (encryptedData, iv){
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
        that.checkHasRight();
      } else {
        console.log('请求失败:' + res.head.msg);
        if (res.head.code = -20038){//已绑定
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
  getUserInfo: function () {
    var that = this
    //调用登录接口
    wx.getUserInfo({
      withCredentials: true,
      lang: 'zh_CN',
      success: function (res) {
        var wxUser = res.userInfo;
        var userInfo = {
          nickName: wxUser.nickName,
          avatarUrl: wxUser.avatarUrl,
          sex: wxUser.gender,
          province: wxUser.province,
          city: wxUser.city,
          country: wxUser.country,
          openId: app.globalData.userInfo.openId,
          sessionKey: app.globalData.userInfo.sessionKey,
          inviterId: 0
        };
        app.globalData.userInfo = userInfo;
        that.userRegister(userInfo);
      }, fail: function(error){
        wx.showModal({
          content: '您拒绝微信授权，获取信息失败！',
          showCancel: "true",
          cancelText: "取消",
          cancelColor: "#333",
          confirmText: "确认",
          confirmColor: "#EB5219",
          success: function (res) {
            wx.switchTab({
              url: "../index/index"
            });
          }
        })
      }
    })
  },
  userRegister: function (userInfo) {
    var that = this;
    API.userRegister(userInfo, function (res) {
      if (res.head.code == 0) {
        app.globalData.userInfo.id = res.body.id;
        app.globalData.userInfo.token = res.body.token;
        app.globalData.userInfo.rightStatus = 1;
        wx.setStorageSync('userInfo', app.globalData.userInfo);
        that.setData({
          userInfo: app.globalData.userInfo,
          isReg: true
        }); 
      } else {
        console.log('请求失败:' + res.head.msg);
      }
    });
  },
  checkHasRight: function(){
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
        app.globalData.userInfo.mobile = userInfo.mobile;
        if (userInfo.rightStatus >= 2){
          that.toMiniProgram();
        } 
        // else if (userInfo.rightStatus == 2){
        //   Modal.showModal('优尼康Fashion', userInfo.rightStatusDesc + '');
        // }
      } else {
        console.log('请求失败:' + res.head.msg);
      }
    });
  },
  unRight: function(e) {
    Modal.showToast('请点击领取权益');
  },
  toMiniProgram: function(){
    App.zhuge.track('个人中心点击使用权益', {
      'user_id': this.data.userInfo.id,
      '昵称': this.data.userInfo.nickName
    });
    var that = this;
    wx.navigateToMiniProgram({
      appId: 'appid',
      path: 'pages/index/index',
      extraData: {
        openId: that.data.userInfo.openId,
        source: 1001
      },
      //envVersion: 'trial',
      success(res) {
        console.log("打开成功："+JSON.stringify(res));
      }
    })
  },
  headcarTap: function (event){
    if (this.data.userInfo.rightStatus == 3){
      this.toMiniProgram();
    }
  },
  couponTap: function() {
    this.setData({
      redDot: false
    })
    wx.setStorageSync('isReadCoupon', 1);
    wx.navigateTo({
      url: 'coupon/coupon'
    })
  },
  onMyTap: function (event) {
    var url = event.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    })
  }
})