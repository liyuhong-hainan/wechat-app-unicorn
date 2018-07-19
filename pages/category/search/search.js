import API from '../../../utils/api.js';
import Modal from '../../../utils/modal.js';
var app = getApp();
Page({
  data: {
    categoryId: -1,
    keyword: '',
    isFocus: false,
    loading: false,
  },
  onLoad: function (options) {
   var keyword = options.keyword;
   if (keyword) {
     this.setData({
       keyword: keyword
     })
     this.productSearch();
   } else {
     this.setData({
       isFocus: true
     })
   }
   this.getHotWords();
    var userInfo = app.globalData.userInfo;
    App.zhuge.track('用户进入搜索页', {
      'user_id': userInfo.id,
      '昵称': userInfo.nickName,
      '手机号': userInfo.mobile
    });
  },
  getHotWords: function () {
    var that = this;
    that.setData({
      loading: true
    })
    API.hotWords({}, function (res) {
      that.setData({
        loading: false
      })
      if (res.head.code == 0) {
        that.setData({
          hotWords: res.body.list
        })
      } else {
        console.log('请求失败:' + res.head.msg);
      }
      wx.hideLoading();
    });
  },
  hotWordSearch: function (e) {
    this.setData({
      keyword: e.currentTarget.dataset.word
    })
    this.productSearch();
  },
  inputText: function (e) {
    this.setData({
      keyword: e.detail.value
    })
    if (this.data.keyword.length==0) {
      this.setData({
        categoryId: -1
      })
      return false;
    }
    this.productSearch();
  },
  searchCancel: function (e) {
    this.setData({
      keyword: '',
      categoryId: -1,
      loading: false
    })
  },
  categorySelect: function(e) {
    this.setData({
      categoryId: e.currentTarget.dataset.id
    })
    this.productSearch();
  },
  productSearch: function () {
    var that = this;
    that.setData({
      loading: true,
      productlist: []
    })
    var params = { keyword: this.data.keyword };
    if (this.data.categoryId > 0) {
      params.categoryId = this.data.categoryId;
    }
    API.productSearch(params, function (res) {
      that.setData({
        loading: false
      })
      if (res.head.code == 0) {
        that.setData({
          productlist: res.body.list,
          categories: res.body.extra.categories
        })
      } else {
        console.log('请求失败:' + res.head.msg);
      }
      wx.hideLoading();
    });
  },
  goodsDetail: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/goods-detail/goods-detail?id=' + id
    })
  }
})