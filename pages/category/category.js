import API from '../../utils/api.js';
import Config from '../../data/config.js';
var app = getApp();
Page({

  data: {
  
  },
  onLoad: function (options) {
    this.getCategoryList();
    this.topicList();
    var userInfo = app.globalData.userInfo;
    App.zhuge.track('用户进入商城页', {
      'user_id': userInfo.id,
      '昵称': userInfo.nickName,
      '手机号': userInfo.mobile
    });
  },
  topicList: function () {
    this.setData({
      topicList: Config.list
    });
    // var that = this;
    // wx.showLoading({
    //   title: '加载中',
    // });
    // wx.request({
    //   url: 'https://portapi.zaiyicaifu.com/api/config.json',
    //   method: 'GET',
    //   data: {},
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded"
    //   },
    //   success: function (res) {
    //     that.setData({
    //       topicList: res.data.list
    //     });
    //     //console.log(JSON.stringify(res));
    //     wx.hideLoading();
    //   },
    //   fail: function (error) {
    //     console.log(error);
    //     wx.hideLoading();
    //   }
    // })
  },
  getCategoryList: function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    API.productShop({}, function (res) {
      if (res.head.code == 0) {
        that.setData({
          categoryList: res.body.list
        })
      } else {
        console.log('请求失败:' + res.head.msg);
      }
      that.setData({
        loading: false
      })
       wx.hideLoading();
    });
  },
  goodsDetail: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../goods/goods-detail/goods-detail?id=' + id
    })
  },
  topicDetail: function (event){
    var index = event.currentTarget.dataset.index;
    if(index == 0){
      wx.navigateTo({
        url: 'topic/topic-red/topic-red'
     })
    } else if(index == 1) {
      wx.navigateTo({
        url: 'topic/topic-white/topic-white'
      })
    } else{
      wx.navigateTo({
        url: 'topic/topic-stripe/topic-stripe'
      })
    }
  },
  coopSearch: function (event) {
    var keyword = event.currentTarget.dataset.key;
    wx.navigateTo({
      url: 'search/search?keyword=' + keyword
    })
  },
  navigatorTap: function (event) {
    var url = event.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    })
  }
})