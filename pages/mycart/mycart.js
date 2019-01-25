var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressName: "address",
    city: "city",
    state: "state",
    accountName: 'Aakash',
    accountPhone: "987-223-1224"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    var lastLanuage = app.globalData.lanuage
    app.getContent(that, lastLanuage)
    that.setData({
      tips: wx.getStorageSync("tips").tip_percentage
    })
    if (options.addid) {
      that.setData({
        addid: options.addid
      })
    }
    getCart(that)
    getAddress(that)
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

  },
  checkout: function(e) {
    let that = this
    let param = {

    }
    app.fetchApis(that, 'e/order', param, 'POST', function (res) {
        if(res.statusCode==200||res.statusCode==201){
          wx.navigateTo({
            url: '../checkout/checkout',
          })
        }
    })
  }
})
var getCart = function(that) {
  app.fetchApis(that, 'e/order/cart', null, 'GET', function(res) {
    console.log(res)
    if (res.statusCode == 200) {
      that.setData({
        cart: res.data.cart,
        final_price: res.data.final_price,
        count: res.data.count,
        crv: res.data.crv,
        id: res.data.id,
        tax: res.data.tax,
        total_price: parseFloat(res.data.total_price * (1 + parseFloat(that.data.tips) / 100)).toFixed(2)
      })
    }
  })
}
var getAddress = function(that) {
  app.fetchApis(that, 'e/account/address', null, 'GET', function(res) {
    if (res.statusCode == 200) {
      if (res.data.addresses) {
        let addresses = res.data.addresses
        if (addresses.length > 0) {

          var addid = addresses[0].id
          var addCity = addresses[0].city
          var addState = addresses[0].state
          var addressName = addresses[0].name
          for (var i = 0; i < addresses.length; i++) {
            if (that.data.addid != null && that.data.addid != '') {
              if (addresses[i].id == that.data.addid) {
                addid = addresses[i].id
                addCity = addresses[i].city
                addState = addresses[i].state
                addressName = addresses[i].name
              }
            } else {
              if (addresses[i].is_default) {
                addid = addresses[i].id
                addCity = addresses[i].city
                addState = addresses[i].state
                addressName = addresses[i].name
              }
            }
          }
          that.setData({
            addressName: addressName,
            city: addCity,
            state: addState,
            addid: addid
          })
        }
      }
    }
  })
}