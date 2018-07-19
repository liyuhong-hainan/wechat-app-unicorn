import API from '../../../../utils/api.js';
import Modal from '../../../../utils/modal.js';
import area from '../../../../data/area.js';
var p = 0, c = 0, d = 0
Page({
  data: {
    provinceName: [],
    provinceCode: [],
    provinceSelIndex: '',
    cityName: [],
    cityCode: [],
    citySelIndex: '',
    districtName: [],
    districtCode: [],
    districtSelIndex: '',
    showMessage: false,
    messageContent: '',
    showDistpicker: false
  },
  onLoad: function (options) {
    var addressId = options.id;
    this.setData({
      addressId: addressId
    })
    this.getAddressById(addressId);
  },
  getAddressById: function(id){
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    API.addressInfo({id: id}, function (res) {
      if (res.head.code == 0) {
        that.setData({
          addressInfo: res.body
        })
        that.setAreaData();
      } else {
        console.log('请求失败:' + res.head.msg);
      }
      wx.hideLoading();
    });
  },
  setAreaData: function (p, c, d) {
    var p = p || 0 // provinceSelIndex
    var c = c || 0 // citySelIndex
    var d = d || 0 // districtSelIndex
    // 设置省的数据
    var province = area['100000']
    var provinceName = [];
    var provinceCode = [];
    for (var item in province) {
      provinceName.push(province[item])
      provinceCode.push(item)
    }
    this.setData({
      provinceName: provinceName,
      provinceCode: provinceCode
    })
    // 设置市的数据
    var city = area[provinceCode[p]]
    var cityName = [];
    var cityCode = [];
    for (var item in city) {
      cityName.push(city[item])
      cityCode.push(item)
    }
    this.setData({
      cityName: cityName,
      cityCode: cityCode
    })
    // 设置区的数据
    var district = area[cityCode[c]]
    var districtName = [];
    var districtCode = [];
    for (var item in district) {
      districtName.push(district[item])
      districtCode.push(item)
    }
    this.setData({
      districtName: districtName,
      districtCode: districtCode
    })
  },
  changeArea: function (e) {
    p = e.detail.value[0]
    c = e.detail.value[1]
    d = e.detail.value[2]
    this.setAreaData(p, c, d)
  },
  showDistpicker: function () {
    this.setData({
      showDistpicker: true
    })
  },
  distpickerCancel: function () {
    this.setData({
      showDistpicker: false
    })
  },
  distpickerSure: function () {
    this.setData({
      provinceSelIndex: p,
      citySelIndex: c,
      districtSelIndex: d
    })
    this.distpickerCancel()
  },
  saveAddAddress: function(e){
    var data = e.detail.value;
    var mobileRule = /^1[3|4|5|7|8]\d{9}$/, nameRule = /^[\u2E80-\u9FFF]+$/;
    if (data.name == '') {
      Modal.showWarmToast('请输入姓名');
      return false;
    } 
    if (!nameRule.test(data.name)) {
      Modal.showWarmToast('请输入中文名');
      return false;
    } 
    if (data.mobile == '') {
      Modal.showWarmToast('请输入手机号码');
      return false;
    } 
    if (!mobileRule.test(data.mobile)) {
      Modal.showWarmToast('手机号码格式不正确');
      return false;
    } 
     if (data.province == '') {
      if (this.data.addressInfo.province){
        data.province = this.data.addressInfo.province;
      }else {
        Modal.showWarmToast('请选择所在地区');
        return false;
      }   
    } 
     if (data.city == '') {
      if (this.data.addressInfo.city) {
        data.city = this.data.addressInfo.city;
      } else {
        Modal.showWarmToast('请选择所在地区');
        return false;
      }
    }
    if (data.district == '') {
      if (this.data.addressInfo.district) {
        data.district = this.data.addressInfo.district;
      } else {
        Modal.showWarmToast('请选择所在地区');
        return false;
      }
    } 
    if (data.detail == '') {
      Modal.showWarmToast('请输入详细地址');
      return false;
    }
    if (data.defaultFlag){
      data.defaultFlag = 1;
    }else{
      data.defaultFlag = 0;
    }
    data.id = this.data.addressInfo.id;
    console.log(data);
    wx.showLoading({
      title: '提交中',
    });
    API.updateAddress(data, function (res) {
      wx.hideLoading();
      if (res.head.code == 0) {
        Modal.showToast('修改成功');
        setTimeout(() => {
         wx.navigateBack({}); 
        }, 1000);
      } else {
        console.log('请求失败:' + res.head.msg);
      }

    });
  }
})