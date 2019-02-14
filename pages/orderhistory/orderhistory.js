var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    var lastLanuage = app.globalData.lanuage
    // this.getContent(lastLanuage)
    app.getContent(that, lastLanuage)
    getOrder(that)
  },
  orderDetail: function(e) {
    let that = this
    app.fetchApis(that, 'e/order/' + e.currentTarget.dataset.id, null, 'GET', function(res) {
      console.log(res)
     
    })
  }
})

var getOrder = function(that) {
  app.fetchApis(that, 'e/order/history', null, 'GET', function(res) {
    console.log(res)
    that.setData({
      orders: res.data
    })
  })
}