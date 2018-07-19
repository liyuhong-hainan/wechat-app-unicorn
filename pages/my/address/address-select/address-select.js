import API from '../../../../utils/api.js';
import Modal from '../../../../utils/modal.js';
var app = getApp();
Page({
  data: {
  },
  onLoad: function (options) {
    var selectAddress = app.globalData.selectAddress;
    if (selectAddress) {
      this.setData({
        selectAddress: selectAddress
      })
    }
  },
  onShow: function () {
    this.addressList();
  },
  addressList: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    API.addressList({}, function (res) {
      if (res.head.code == 0) {
        that.setData({
          addressList: res.body.list
        })
      } else {
        console.log('请求失败:' + res.head.msg);
      }
      wx.hideLoading();
    });
  },
  // addressTap: function(event){
  //   wx.reLaunch({
  //     url: "/pages/my/address/address"
  //   })
  // },
  addAddress: function (address) {
    var that = this;
    wx.showLoading({
      title: '提交中',
    });
    API.addAddress(address, function (res) {
      wx.hideLoading();
      if (res.head.code == 0) {
        Modal.showToast('新增成功');
        that.addressList();
      } else {
        console.log('请求失败:' + res.head.msg);
      }

    });
  },
  weichatAddAddress: function (event) {
    var that = this;
    wx.chooseAddress({
      success: function (res) {
        console.log(JSON.stringify(res));
        var defaultFlag = 0;
        if (that.data.addressList.length == 0) {
          defaultFlag = 1;
        }
        var address = {
          name: res.userName,
          mobile: res.telNumber,
          province: res.provinceName,
          city: res.cityName,
          district: res.countyName,
          detail: res.detailInfo,
          defaultFlag: defaultFlag
        };
        that.addAddress(address);
      }
    })
  },
  radioChange: function (e) {
    //console.log('radio发生change事件，携带value值为：', e.detail.value);
    var id = e.detail.value;
    var address = {};
    for (var i = 0; i < this.data.addressList.length; i++) {
      var tempObject = this.data.addressList[i];
      if (tempObject.id == id) {
        address = tempObject;
      }
    }
    app.globalData.selectAddress = address;
    wx.showLoading({
      title: '加载中',
    });
    setTimeout(() => {
      wx.hideLoading()
      wx.navigateBack({});
    }, 1000);
  }
})