var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pcount: 1,
    addFlag: false
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
    that.setData({
      pk: options.pk
    })
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
    let that = this
    app.fetchApis(that, 'e/order/cart', {
      product_id: that.data.pk,
      quantity: that.data.pcount
    }, 'POST', function(res) {
      console.log(res)
      if (res.statusCode == 200) {
        wx.showToast({
          title: that.data.content.add_cart_success,
        })
        that.setData({
          addFlag: true
        })
      }
    })
  },
  toCheckout: function(e) {
    let that = this
    if (that.data.addFlag) {
      wx.navigateTo({
        url: '../mycart2/mycart2',
      })
    } else {
      app.fetchApis(that, 'e/order/cart', {
        product_id: that.data.pk,
        quantity: that.data.pcount
      }, 'POST', function(res) {
        console.log(res)
        if (res.statusCode == 200) {
          wx.navigateTo({
            url: '../mycart2/mycart2',
          })
        }
      })
    }
  }
})