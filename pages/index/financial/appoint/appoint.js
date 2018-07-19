import API from '../../../../utils/api.js';
import Modal from '../../../../utils/modal.js';
Page({

  data: {
    contactTime: 1,
    sex: 1
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    setTimeout(() => {
      wx.hideLoading();
    }, 1000);
  },
  makePhone: function(e){
    wx.makePhoneCall({
      phoneNumber: '4006-111-500' 
    })
  },
  inputName: function(e){
    this.setData({
      name: e.detail.value
    })
  },
  inputMobile: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  radioChange: function (e) {
    //console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.setData({
      sex: e.detail.value
    })
  },
  contactTimeTap: function(event){
    var that = this;
    var itemList = [
      "30分钟内",
      "上午",
      "下午"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#EB5219",
      success: function (res) {
        // res.cancel 用户是不是点击了取消按钮
        // res.tapIndex 数组元素的序号，从0开始
        if (res.tapIndex >=0){
          that.setData({
            contactTime: res.tapIndex+1 
          })
        }
      }
    })
  },
  appointSub: function(){
    var mobileRule = /^1[3|4|5|7|8]\d{9}$/;
    if (!this.data.name) {
      Modal.showWarmToast('请输入姓名');
      return false;
    }
    if (!this.data.mobile) {
      Modal.showWarmToast('请输入手机号码');
      return false;
    }
    if (!mobileRule.test(this.data.mobile)) {
      Modal.showWarmToast('手机号码格式不正确');
      return false;
    } 
    var params = {
      name: this.data.name,
      mobile: this.data.mobile,
      sex: this.data.sex,
      contactTime: this.data.contactTime,
      source: 107
    };
    wx.showLoading({
      title: '提交中',
    });
    var head = {"token": "", "platformMode": "miniapp", "imei": "", "channel": "", "accessId": "10002", "versionCode": 200};
    wx.request({
      url: 'your api url',
      method: 'POST',
      data: params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Head": JSON.stringify(head)
      },
      success: function (res) {
        wx.hideLoading();
        Modal.showToast('提交成功');
        setTimeout(() => {
          wx.navigateBack({});
        }, 1000);
      },
      fail: function (error) {
        console.log(error);
        wx.hideLoading();
      }
    })
  }
})