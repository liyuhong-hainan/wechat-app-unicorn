import API from '../../utils/api.js';
import Modal from '../../utils/modal.js';
Page({

  data: {
    status: 0
  },
  onLoad: function (options) {
    this.getOrderList();
  },
  getOrderList: function(){
    var that = this;
    var status = this.data.status;
    wx.showLoading({
      title: '加载中',
    });
    API.orderList({ status: status}, function (res) {
      if (res.head.code == 0) {
        that.setData({
          orderList: res.body.list
        })
      } else {
        console.log('请求失败:' + res.head.msg);
      }
      wx.hideLoading();
    });
  },
  changeTab: function (event){
    var status = event.currentTarget.dataset.status;
    this.setData({
      status: status,
      orderList: []
    })
    this.getOrderList();
  },
  logisticsTap: function (event){
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: "logistics/logistics?id=" + id
    })
  },
  orderInfoTap: function (event){
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: "order-detail/order-detail?id=" + id
    })
  },
  orderCompleteTap: function(event){
    var id = event.currentTarget.dataset.id;
    var that = this;
    Modal.showConfirmModal('是否确认收货？', function () {
      wx.showLoading({
        title: '提交中',
      });
      API.orderComplete({ id: id }, function (res) {
        wx.hideLoading();
        if (res.head.code == 0) {
          Modal.showToast('提交成功');
          setTimeout(() => {
            that.getOrderList();
          }, 1000);
        } else {
          Modal.showModal('提交失败', res.head.msg);
          console.log('请求失败:' + res.head.msg); 
        }
      });
    });
  }
})