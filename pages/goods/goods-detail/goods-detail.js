import API from '../../../utils/api.js';
import Modal from '../../../utils/modal.js';
var app = getApp();
Page({

  data: {
    productInfo:{},
    buyTemplateShow: false
  },
  onLoad: function (options) {
    var id = options.id;
    this.getProductInfo(id);
    var systemInfo = wx.getSystemInfoSync();
    var scrollHeight = systemInfo.windowHeight;
    this.setData({
      scrollHeight: scrollHeight
    })
  },
  onShow: function(){
    var selectAddress = app.globalData.selectAddress;
    if (selectAddress){
      var productInfo = this.data.productInfo;
      productInfo.address = selectAddress;
      this.setData({
        productInfo: productInfo
      })
    }
    var pages = getCurrentPages();
    for (var i=0; i < pages.length; i++){
      console.log('route:' + pages[i].route);
    }  
  },
  getProductInfo: function(id){
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    API.productInfo({ id: id}, function (res) {
      if (res.head.code == 0) {
        var indicatorDots = false;
        if (res.body.extra.picUrlList.length > 1) {
          indicatorDots = true;
        }
        var productInfo = {
          productId: id,
          pic: res.body.extra.picUrlList[0],
          list: res.body.list,
          stock: res.body.list[0].list[0].stock,
          price: res.body.list[0].list[0].price,
          sizeList: res.body.list[0].list,
          size: res.body.list[0].list[0].size,
          color: res.body.list[0].color, 
          colorIndex: 0,
          count: 1,
          couponsValue: res.body.list[0].list[0].couponsValue,
          couponsDesc: res.body.list[0].list[0].couponsDesc
        }
        that.setData({
          extra: res.body.extra,
          indicatorDots: indicatorDots,
          productInfo: productInfo
        })
        that.getAddressList();
        App.zhuge.track('用户进入商品详情', {
          '产品id': id,
          '产品名称': res.body.extra.name
        });
      } else {
        console.log('请求失败:' + res.head.msg);
      }
      wx.hideLoading();
    });
  },
  getAddressList: function(){
    var that = this;
    API.addressList({}, function (res) {
      if (res.head.code == 0) {
        var productInfo = that.data.productInfo;
        productInfo.address = res.body.list[0];
        that.setData({
          productInfo: productInfo
        })
        app.globalData.selectAddress = res.body.list[0];
      } else {
        console.log('请求失败:' + res.head.msg);
      }
    });  
  },
  sizeSelectTap: function (event){
    var productInfo = this.data.productInfo;
    productInfo.size = event.target.dataset.item.size;
    productInfo.stock = event.target.dataset.item.stock;
    productInfo.price = event.target.dataset.item.price;
    productInfo.couponsValue = event.target.dataset.item.couponsValue;
    productInfo.couponsDesc = event.target.dataset.item.couponsDesc;
     this.setData({
       productInfo: productInfo
     })
     //console.log(JSON.stringify(productInfo)); 
  },
  colorSelectTap: function (event){
    var item = event.currentTarget.dataset.item;
    var idx = event.currentTarget.dataset.idx;
    var productInfo = this.data.productInfo;
    productInfo.sizeList = item.list;
    productInfo.size = item.list[0].size;
    productInfo.stock = item.list[0].stock;
    productInfo.price = item.list[0].price;
    productInfo.couponsValue = item.list[0].couponsValue;
    productInfo.couponsDesc = item.list[0].couponsDesc;
    productInfo.color = item.color;
    productInfo.colorIndex = idx;
    this.setData({
      productInfo: productInfo
    })
    console.log(JSON.stringify(productInfo));
  },
  minusCount: function (event){
    var count = this.data.productInfo.count;
    if(count <= 1){
      return false;
    }
    count--;
    var productInfo = this.data.productInfo;
    productInfo.count = count;
    this.setData({
      productInfo: productInfo
    })
  },
  addCount: function (event){
    var count = this.data.productInfo.count;
    if (count >= this.data.productInfo.stock){
      Modal.showWarmToast('货源不足');
      return false;
    }
    count++;
    var productInfo = this.data.productInfo;
    productInfo.count = count;
    this.setData({
      productInfo: productInfo
    })
  },
  addressSelect: function (event){
    wx.navigateTo({
      url: "/pages/my/address/address-select/address-select"
    })
  },
  onSwiperTap: function(event){
    var src = event.target.dataset.src;
    wx.previewImage({
      current: src, 
      urls: this.data.extra.picUrlList
    }) 
  },
  buyTap: function(){
    this.setData({
      buyTemplateShow: true
    })
  },
  closeBuyTap: function(){
    this.setData({
      buyTemplateShow: false
    })
  },
  prePay: function (event){
    var token = app.globalData.userInfo.token;
    if (token){//已注册
      var productInfo = this.data.productInfo;
      if (productInfo.stock <= 0) {
        Modal.showWarmToast('没有货了，请选择别的颜色或者尺码');
        return false;
      }
      var address = productInfo.address;
      if(!address){
        Modal.showConfirmModal('您还没有收货地址，是否前往添加？', function (res) {
          wx.navigateTo({
            url: "/pages/my/address/address-select/address-select"
          })
        });
        return false;
      }
      var paras = {
        productId: productInfo.productId,
        color: productInfo.color,
        size: productInfo.size,
        count: productInfo.count,
        userName: address.name,
        mobile: address.mobile,
        address: address.province + '' + address.city + '' + address.district + '' + address.detail,
        remark: ''
      };
      // console.log(JSON.stringify(paras));
      var that = this;
      wx.showLoading({
        title: '加载中',
      });
      API.orderPrePay(paras, function (res) {
        if (res.head.code == 0) {
          var id = res.body.id;
          that.pay(id);
        } else {
          console.log('请求失败:' + res.head.msg);
          if (res.head.code == -20049) {
            Modal.showConfirmModal('您的余额不足，是否前往充值？', function (res) {
              wx.navigateTo({
                url: "/pages/my/integral/pay/pay"
              })
            });
          } else {
            Modal.showModal('提交失败', res.head.msg);
          }

        }
        wx.hideLoading();
      });
    } else{//未注册
      this.getUserInfo(); 
    }
    
   
  },
  pay: function(id){
    var that = this;
    Modal.showConfirmModal('确定要购买该商品吗？', function () {
      wx.showLoading({
        title: '提交中',
      });
      API.orderPay({ id: id }, function (res) {
        wx.hideLoading();
        if (res.head.code == 0) {
          Modal.showToast('购买成功');
          setTimeout(() => {
            wx.navigateTo({
              url: "/pages/order/order-detail/order-detail?id=" + id
            })
          }, 1500);
          var productInfo = that.data.productInfo;
          productInfo.stock = productInfo.stock - 1;
          that.setData({
            buyTemplateShow: false,
            productInfo
          });
          var userInfo = app.globalData.userInfo;
          App.zhuge.track('用户购买商品', {
            'user_id': userInfo.id,
            '昵称': userInfo.nickName,
            '手机号': userInfo.mobile,
            '商品编号': that.data.productInfo.productId
          });
        } else {
          Modal.showModal('购买失败', res.head.msg + '\n如有疑问，请联系客服\n （4006-111-500）');
          console.log('请求失败:' + res.head.msg);
        }
      });
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
      }, fail: function (error) {
        // console.log('微信授权失败：'+ JSON.stringify(error));
        Modal.showModal('优尼康Fashion','您未微信授权登录，无法提交订单！');
      }
    })
  },
  userRegister: function (userInfo) {
    var that = this;
    API.userRegister(userInfo, function (res) {
      if (res.head.code == 0) {
        app.globalData.userInfo.id = res.body.id;
        app.globalData.userInfo.token = res.body.token;
        wx.setStorageSync('userInfo', app.globalData.userInfo);
        that.setData({
          userInfo: app.globalData.userInfo
        });
        that.prePay();
      } else {
        console.log('请求失败:' + res.head.msg);
      }
    });
  },
  onShareAppMessage: function (event) {
    return {
      title: this.data.extra.name,
      desc: '随时随地，享奢侈品尊贵购物体验',
      imageUrl: this.data.extra.picUrlList[0].pic,
      path: '/pages/goods/goods-detail/goods-detail?id=' + this.data.productInfo.productId
    }
  }
})