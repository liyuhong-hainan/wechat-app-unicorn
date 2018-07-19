import API from '../../../utils/api.js';
import Modal from '../../../utils/modal.js';
var app = getApp();
Page({
  data: {
    user:{
      code: 'https://',
      avatarUrl: 'https://'
    }
  },
  onLoad: function (options) {
    this.userWxcode();
  },
  userWxcode: function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    API.userWxcode({}, function (res) {
      if (res.head.code == 0) {
        var user = res.body;
        that.setData({
          user: user
        })
      } else {
        console.log('请求失败:' + res.head.msg);
      }
      wx.hideLoading();
    });
  },
  previewImage: function (event){
      var urls = [];
      var imgUrl = this.data.user.code;
      urls.push(imgUrl);
      wx.previewImage({
        urls: urls
      })
  },
  saveImage: function(event){
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.model)
        var model = res.model;
        if (model.indexOf('iPhone') > -1){
          Modal.showConfirmModal('长按二维码可保存到手机', function () {
            that.previewImage();
          });
        }else{
          var imgUrl = that.data.user.code;
          wx.downloadFile({
            url: imgUrl,
            success(res) {
              console.log("下载成功:" + JSON.stringify(res));
              var tempFilePath = res.tempFilePath;
              wx.saveImageToPhotosAlbum({
                filePath: tempFilePath,
                success(res) {
                  console.log("保存成功:" + JSON.stringify(res));
                }, fail(err) {
                  console.log("保存失败:" + err);
                }
              })
            }, fail(err) {
              console.log("下载失败:" + err);
            }
          })
        }
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