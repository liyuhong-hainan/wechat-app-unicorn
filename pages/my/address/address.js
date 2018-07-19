import API from '../../../utils/api.js';
import Modal from '../../../utils/modal.js';
Page({
  data: {
  },
  onLoad: function (options) {
  },
  onShow: function(){
    this.addressList();
  },
  addressList: function(){
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
  addAddress: function(address){
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
  updateAddress: function (event){
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: "address-edit/address-edit?id=" + id
    })
  },
  postUpdate: function(address){
    var that = this;
    wx.showLoading({
      title: '提交中',
    });
    API.updateAddress(address, function (res) {
      if (res.head.code == 0) {
        Modal.showToast('提交成功');
        setTimeout(() => {
          that.addressList();
        }, 1000);
      } else {
        console.log('请求失败:' + res.head.msg);
        wx.hideLoading();
      }

    });
  },
  deleteAddress: function (event){
    var id = event.currentTarget.dataset.id;
    var that = this;
    Modal.showConfirmModal('确定要删除该地址吗？',function(){
      wx.showLoading({
        title: '提交中',
      });
      API.deleteAddress({ id: id }, function (res) {
        wx.hideLoading();
        if (res.head.code == 0) {
          Modal.showToast('删除成功');
          that.addressList();
        } else {
          console.log('请求失败:' + res.head.msg);
        }
      });
    });
  },
  weichatAddAddress: function(event){
    var that = this;
    wx.chooseAddress({
      success: function (res) {
        console.log(JSON.stringify(res));
        var defaultFlag = 0;
        if (that.data.addressList.length == 0){
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
    for (var i = 0; i < this.data.addressList.length; i++){
      var tempObject = this.data.addressList[i];
      if (tempObject.id == id){
        address = tempObject;
      }  
    }
    address.defaultFlag = 1;
    console.log('address：', JSON.stringify(address));
    this.postUpdate(address);
  }
})