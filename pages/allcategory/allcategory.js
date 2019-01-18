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
  onLoad: function (options) {
    let that = this
    var lastLanuage = app.globalData.lanuage
    // this.getContent(lastLanuage)
    app.getContent(that, lastLanuage)
    getCategory(that)
  },

})
var getCategory = function (that) {
  wx.request({
    url: app.globalData.API_URL + 'e/category/custom',
    // data:param,
    success: function (res) {
      if (res.statusCode == 200) {
        console.log(res.data)
        that.setData({
          categorys: res.data
        })
      }
    }
  })
}