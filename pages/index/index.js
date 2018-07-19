import API from '../../utils/api.js';
import Modal from '../../utils/modal.js';
var app = getApp();
Page({

  data: {
    comingsoon: false,
    showMask: false
  },
  onLoad: function (options) {
    if (options.id && app.globalData.userInfo.token){
       this.bindInviterId(options.id);
    } else {
      var scene = decodeURIComponent(options.scene);
       scene = parseInt(scene);
      if (scene > 0 && app.globalData.userInfo.token) {
        this.bindInviterId(scene);
      }  
    };
  },
  onShow: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    var couponMaskShow = wx.getStorageSync('couponMaskShow');
    if (!couponMaskShow) {
      this.setData({
        showMask: true
      });
    }
  },
  bindInviterId: function (id) {
    API.bindInviterId({ inviterId: id }, function (res) {
      if (res.head.code == 0) {
        // Modal.showModal('app', '绑定成功！');
      } else {
        console.log('请求失败:' + res.head.msg);
      }
    });
  },
  onSwiperTap: function (event) {
    wx.navigateTo({
      url: "../category/category"
    })
  },
  categoryList: function(event){
    wx.navigateTo({
      url: "../category/category"
    })
  },
  navigatorTap: function (event){
    var url = event.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    })
  },
  maskClose: function(){
    this.setData({
      showMask: false
    });
    wx.setStorageSync('couponMaskShow', true);
  },
  toCoupon: function (){
    this.setData({
      showMask: false
    });
    wx.setStorageSync('couponMaskShow', true);
    wx.navigateTo({
      url: '/pages/my/coupon/coupon'
    })
  },
  getPhoneNumber: function (e) {
    if (e.detail.encryptedData) {
      this.bindMobile(e.detail.encryptedData, e.detail.iv);
    } else {
      // var userInfo = this.data.userInfo;
      // userInfo.mobile = '';
      // this.setData({
      //   userInfo: userInfo
      // }); 
    }
  },
  bindMobile: function (encryptedData, iv) {
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
    if (this.data.userInfo.rightStatus > 1) {
      this.toMiniProgram();
    }
  },
  toMiniProgram: function () {
    App.zhuge.track('首页点击理财', {
      'user_id': this.data.userInfo.id,
      '昵称': this.data.userInfo.nickName
    });
    var that = this;
    wx.navigateToMiniProgram({
      appId: '小程序 appid',
      path: 'pages/index/index',
      extraData: {
        openId: that.data.userInfo.openId,
        source: 1001
      },
      // envVersion: 'develop',
      success(res) {
        console.log("打开成功：" + JSON.stringify(res));
      }
    })
  },
  onShareAppMessage: function (event) {
    return {
      title: '随时随地，享奢侈品尊贵购物体验',
      desc: '随时随地，享奢侈品尊贵购物体验',
      imageUrl: 'http://ovu8osqcv.bkt.clouddn.com/unicorn_share.jpg',
      path: '/pages/index/index?id=' + app.globalData.userInfo.id
    }
  }
})