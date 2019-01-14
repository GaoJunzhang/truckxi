var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prodeces:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    getProduce(that,options.pk)
    var lastLanuage = app.globalData.lanuage
    // this.getContent(lastLanuage)
    app.getContent(that, lastLanuage)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
var getProduce = function(that,pk){
  wx.request({
    url: app.globalData.API_URL + 'e/category/custom/' + pk + '/product',
    success: function (res) {
      if (res.statusCode == 200) {
        console.log(res.data)
        that.setData({
          prodeces:res.data
        })
      } else {
        wx.showModal({
          content: '服务器异常，请稍后再试',
          showCancel: false
        })
      }
    }
  })
}