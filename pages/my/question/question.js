Page({

  data: {
  
  },
  onLoad: function (options) {
  
  },
  questionDetailTap: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'question-detail/question-detail?id='+id
    })
  }
})