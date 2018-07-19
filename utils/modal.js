function showModal(title, content) {
  wx.showModal({
    title: title,
    content: content,
    showCancel: "false",
    confirmText: "确认",
    confirmColor: "#EB5219",
    success: function (res) {
      if (res.confirm) {
      }
    }
  })
}
function showConfirmModal(content, souceFun){
  wx.showModal({
    content: content,
    cancelText: "取消",
    cancelColor: "#333",
    confirmText: "确认",
    confirmColor: "#EB5219",
    success: function (res) {
      if (res.confirm) {
        souceFun();
      }
    }
  })
}
function showToast(title, duration){
  wx.showToast({
    title: title,
    icon: 'success',
    duration: duration > 0 ? duration: 1000
  }) 
}
function showWarmToast(title, duration) {
  wx.showToast({
    title: title,
    image: '/images/warm_icon.png',
    duration: duration > 0 ? duration : 1000
  })
}
module.exports = {
  showModal: showModal,
  showConfirmModal: showConfirmModal,
  showToast: showToast,
  showWarmToast: showWarmToast
}
