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
    getCart(that)
  },
  addGood: function(e) {
    let that = this
    var carts = that.data.cart
    var pkId = e.currentTarget.dataset.id
    carts.forEach(function(v, k) {
      console.log(v.id)
      if (v.id == pkId) {
        app.fetchApis(that, 'e/order/cart', {
          Product_id: pkId,
          quantity: v.quantity + 1
        }, 'PUT', function(res) {
          if (res.statusCode == 200) {
            v.quantity = v.quantity + 1
          }
          that.setData({
            cart: carts
          })
        })
      }
    })

  },
  reduceGood: function(e) {
    let that = this
    var carts = that.data.cart
    var pkId = e.currentTarget.dataset.id
    carts.forEach(function(v, k) {
      if (v.id == pkId) {
        if (v.quantity >= 1) {
          app.fetchApis(that, 'e/order/cart', {
            Product_id: pkId,
            quantity: v.quantity - 1
          }, 'PUT', function(res) {
            if (res.statusCode == 200) {
              v.quantity = v.quantity - 1
              if (v.quantity == 0) {
                carts.splice(k, 1)
              }
              that.setData({
                cart: carts
              })
            }
          })

        }
      }
    })

  }
})
var getCart = function(that) {
  app.fetchApis(that, 'e/order/cart', null, 'GET', function(res) {
    console.log('购物车信息===============')
    console.log(res)
    if (res.statusCode == 200) {
      that.setData({
        cart: res.data.cart,
        final_price: res.data.final_price,
        count: res.data.count,
        crv: res.data.crv,
        id: res.data.id,
        tax: res.data.tax,
        total_price: res.data.total_price
      })
    }
  })
}