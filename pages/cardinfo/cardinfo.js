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
    let that = this
    // this.getContent(lastLanuage)
    app.getContent(that, lastLanuage)
    that.setData({
      addid: options.addid
    })

  },
  checkout: function(e) {
    let that = this
    var cardObj = e.detail.value
    cardObj.exp_month = parseInt(cardObj.exp_month)
    cardObj.exp_year = parseInt(cardObj.exp_year)
    app.fetchApis(that, 'e/order/card-token', cardObj, 'POST', function(res) {
      console.log(res)
      if (res.statusCode == 200 || res.statusCode == 201) {
        var obj = wx.getStorageSync("tips")
        console.log(obj)
        let param = {
          id: obj.id,
          total_price: obj.total_price,
          applied_credit_amount: obj.promo_code,
          card_reference: res.data.id,
          billing_address_id: that.data.addid,
          shipping_address_id: that.data.addid,
          note: ''
        }
        app.fetchApis(that, 'e/order/', param, 'POST', function(res) {
            wx.showModal({
              content: res.data.message,
            })
            wx.removeStorageSync("tips")
            wx.navigateTo({
              url: '../checkout/checkout',
            })
        })
      }
    })
  }

})