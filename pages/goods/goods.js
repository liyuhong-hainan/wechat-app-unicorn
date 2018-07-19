import API from '../../utils/api.js';
Page({
  data: {
    productlist: [],
    start: 0,
    loading: false,
    hasNextL: false,
    isNodata: false
  },
  onLoad: function (options) {
    var id = options.id;
    this.setData({
      categoryId: id
    })
    this.getProductList();
  },
  loadMore: function(){
    if (!this.data.hasNext){
      return false;
    } 
    if (this.data.loading) {
      return false;
    }
    this.setData({
      start: this.data.start += 8
    })
    this.getProductList();
  },
  getProductList: function(){
    var that = this;
    // wx.showLoading({
    //   title: '加载中',
    // });
    // console.log('start:' + that.data.start);
    that.setData({
      loading: true
    })
    API.productList({ categoryId: this.data.categoryId, start: that.data.start, offset: 8}, function (res) {
      if (res.head.code == 0) {
        var productlist = that.data.productlist;
        var list = res.body.list;
        productlist.push.apply(productlist, list);
        var isNodata = false;
        if (productlist.length == 0){
          isNodata = true;
        }
        that.setData({
          productlist: productlist,
          hasNext: res.body.hasNext,
          extra: res.body.extra,
          isNodata: isNodata
        })
      } else {
        console.log('请求失败:' + res.head.msg);
      }
      that.setData({
        loading: false
      })
     // wx.hideLoading();
    });
  },
  goodsDetail: function(event){
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'goods-detail/goods-detail?id='+id
    })
  }
})