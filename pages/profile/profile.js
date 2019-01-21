var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:"truckxi"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    getAccount(that)
    var lastLanuage = app.globalData.lanuage
    // this.getContent(lastLanuage)
    app.getContent(that, lastLanuage)
  },

})
var getAccount = function (that) {
  app.fetchApis(that, 'e/account/', {}, 'GET', function (res) {
    that.setData({
      username: res.data.first_name + " " + res.data.last_name
    })
  })
}