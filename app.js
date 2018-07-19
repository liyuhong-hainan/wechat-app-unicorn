require('zhuge/zhuge-wx.min.js');
App.zhuge.load('zhuge key');
import API from 'utils/api.js';
import Modal from 'utils/modal.js';
App({
  onLaunch: function() {
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo){
      this.globalData.userInfo = userInfo;
      if (!userInfo.token){
         this.getUserInfo();
       } else {
         this.userInfo();
        // if (!userInfo.id){
        //   //获取用户信息
        //   this.userInfo();
        //   }
       }
    } else {
      this.wxLogin();
    } 
  },
  wxLogin: function(){
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log("code:" + res.code);
          var params = {code: res.code };
          API.wxLogin(params, function (res) {
            if (res.head.code == 0) {
              var token = res.body.token;
              var userInfo = {
                openId: res.body.openId,
                token: res.body.token,
                sessionKey: res.body.sessionKey
              }
              that.globalData.userInfo = userInfo;
              wx.setStorageSync('userInfo', userInfo);
              if (!token){//未注册
                that.getUserInfo();
              }else{
                //获取用户信息
                that.userInfo();
              }
            } else {
              console.log('请求失败:' + res.head.msg);
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  getUserInfo: function() {
    var that = this
      //调用登录接口
      wx.getUserInfo({
        withCredentials: true,
        lang: 'zh_CN',
        success: function(res) {
          var wxUser = res.userInfo;
          var userInfo = {
            nickName: wxUser.nickName,
            avatarUrl: wxUser.avatarUrl,
            sex: wxUser.gender,
            province: wxUser.province,
            city: wxUser.city,
            country: wxUser.country,
            openId: that.globalData.userInfo.openId,
            sessionKey: that.globalData.userInfo.sessionKey,
            inviterId: 0
          };
          that.globalData.userInfo = userInfo;
          that.userRegister(userInfo);
        }
      })
  },
  userRegister: function (userInfo){
    var that = this;
    API.userRegister(userInfo, function (res) {
      if (res.head.code == 0) {
        that.globalData.userInfo.id = res.body.id;
        that.globalData.userInfo.token = res.body.token;
        wx.setStorageSync('userInfo', that.globalData.userInfo);
        that.couponInfo();
        App.zhuge.identify(res.body.id, {
          '昵称': res.body.nickName
        });
      } else {
        console.log('请求失败:'+ res.head.msg);
      }
    });
  },
  userInfo: function(){
    var that = this;
    API.userInfo({}, function (res) {
      if (res.head.code == 0) {
        var userInfo = res.body;
        userInfo.openId = that.globalData.userInfo.openId;
        userInfo.sessionKey = that.globalData.userInfo.sessionKey;
        userInfo.token = that.globalData.userInfo.token;
        that.globalData.userInfo = userInfo;
        wx.setStorageSync('userInfo', userInfo);
        that.couponInfo();
        App.zhuge.identify(res.body.id, {
          '昵称': res.body.nickName,
          '手机号': res.body.mobile
        });
      } else {
        console.log('请求失败:' + res.head.msg);
        if (res.head.code == -10015) {
          that.wxLogin();
        }
      }
    });
  },
  couponInfo: function () {
    var that = this;
    API.couponInfo({}, function (res) {
        // Modal.showModal('领券接口', JSON.stringify(res));
      if (res.head.code == 0) {
          // that.globalData.couponReceived = res.body.received;
      } else {
        console.log('请求失败:' + res.head.msg);
      }
    });
  },
  globalData: {
    userInfo: null
  }
})
