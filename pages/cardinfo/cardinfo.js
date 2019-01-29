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
    var lastLanuage = app.globalData.lanuage
    // this.getContent(lastLanuage)
    app.getContent(this, lastLanuage)
  },
  checkout: function(e) {
    let that = this
    var cardObj=e.detail.value
    cardObj.exp_month = parseInt(cardObj.exp_month)
    cardObj.exp_year = parseInt(cardObj.exp_year)
    app.fetchApis(that, 'e/order/card-token', cardObj, 'POST', function(res) {
      console.log(res)
      if (res.statusCode == 200 || res.statusCode == 201) {
        var obj = wx.getStorageSync("tips")
        console.log(obj)
        app.fetchApis(that, 'e/order/', e.detail.value, 'POST', function(res) {
          if (res.statusCode == 200 || res.statusCode == 201) {
            wx.navigateTo({
              url: '../checkout/checkout',
            })
          }
        })
      }
    })
  }

})