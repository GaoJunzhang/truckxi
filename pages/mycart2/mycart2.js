var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tip_percentage: 0,
    delivery_method: 0,
    total_price: 0,
    deliveryname:'DELIVERY',
    tipspname:'5',
    delivers: [{
        name: 'DELIVERY'
      },
      {
        name: 'WILL CALL'
      }
    ],
    tipsp: [{
        percent: 0.05,
        name: '5',
      },
      {
        percent: 0.1,
        name: '10',
      },
      {
        percent: 0.15,
        name: '15',
      },
      {
        percent: 0,
        name: 'no tips',
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    var lastLanuage = app.globalData.lanuage
    app.getContent(that, lastLanuage)
    getCart(that)
  },
  addGood: function(e) {
    let that = this
    var carts = that.data.cart
    var pkId = e.currentTarget.dataset.id
    carts.forEach(function(v, k) {
      if (v.id == pkId) {
        app.fetchApis(that, 'e/order/cart', {
          Product_id: pkId,
          quantity: v.quantity + 1
        }, 'PUT', function(res) {
          if (res.statusCode == 200) {
            getCart(that)
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
              getCart(that)
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

  },
  selectDeliver: function(e) {
    let that = this
    that.setData({
      delivery_method: e.currentTarget.dataset.key,
      deliveryname: e.currentTarget.dataset.name,
    })
  },
  selectTips: function(e) {
    let that = this
    var tip_percentage = e.currentTarget.dataset.key
    var check_price = that.data.check_price
    var tipsp = that.data.tipsp
    check_price = (parseFloat(tipsp[tip_percentage].value) + that.data.total_price).toFixed(2)
    var tipsname = e.currentTarget.dataset.tipspname
    if (tip_percentage==3){
      tipsname = 0
    }
    that.setData({
      tip_percentage: tip_percentage,
      check_price: check_price,
      tipspname: tipsname
    })
  },
  inputCoupon: function(e) {
    let that = this
    that.setData({
      coupon: e.detail.value
    })
  },
  toCheckOut: function(e) {
    let that = this
    let param = {
      promo_code: that.data.coupon,
      delivery_method: that.data.deliveryname,
      tip_percentage: that.data.tipspname,
      id: that.data.id,
      total_price: that.data.check_price
    }
    app.fetchApis(that, 'e/order/adjust-cart', param, 'POST', function(res) {
      console.log(res)
      wx.setStorageSync("tips", param)
      wx.navigateTo({
        url: '../mycart/mycart'
      })
    })
  }
})
var getCart = function(that) {
  var lastLanuage = app.globalData.lanuage
  var tipsp = that.data.tipsp
  app.fetchApis(that, 'e/order/cart', null, 'GET', function(res) {
    if (res.statusCode == 200) {
      tipsp.forEach(function(v, k) {
        if (lastLanuage != 'en' && v.percent == 0) {
          v.name = '无'
          v.value = 0
        } else {

          v.value = parseFloat(v.percent * res.data.total_price).toFixed(2)
        }
      })
      var check_price = parseFloat(res.data.total_price * (1 + parseFloat(that.data.tipspname)/100)).toFixed(2)
      that.setData({
        tipsp: tipsp,
        cart: res.data.cart,
        final_price: res.data.final_price,
        count: res.data.count,
        crv: res.data.crv,
        id: res.data.id,
        tax: res.data.tax,
        total_price: res.data.total_price,
        check_price: check_price,
      })
    }
  })
}