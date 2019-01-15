var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pcount: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    var lastLanuage = app.globalData.lanuage
    // this.getContent(lastLanuage)
    app.getContent(that, lastLanuage)
    console.log("options")
    console.log(options)
    wx.request({
      url: app.globalData.API_URL + 'e/product/' + options.pk,
      success: function(res) {
        if (res.statusCode == 200) {
          console.log(res.data.product)
          that.setData({
            product: res.data.product
          })
        } else {
          wx.showModal({
            content: '服务器异常，请稍后再试',
            showCancel: false
          })
        }
      }
    })
  },
  add: function(e) {
    let that = this
    var pcount = that.data.pcount
    if (that.data.product.stock_quantity > pcount) {
      pcount++
      that.setData({
        pcount: pcount
      })
    } else {
      wx.showToast({
        title: '没有库存了',
      })
    }
  },
  reduce: function(e) {
    let that = this
    var pcount = that.data.pcount
    if (pcount > 1) {
      pcount--
      that.setData({
        pcount: pcount
      })
    }
  },
  addCar: function(e) {
    wx.request({
      url: app.globalData.API_URL + 'e/order/cart',
      method:'POST',
      success: function(res) {
        if (res.statusCode == 200) {
         //调整到购物车
        } else {
          wx.showModal({
            content: '服务器异常，请稍后再试',
            showCancel: false
          })
        }
      }
    })
  }
})