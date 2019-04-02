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
        addid: options.addid,
        total_price: options.grand_total
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
            getCart(that)
          }
          that.setData({
            cart: carts,
            // total_price: parseFloat(res.data.total_price * (1 + parseFloat(that.data.tipspname) / 100)).toFixed
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
              getCart(that)
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
    if (that.data.addid == null || that.data.addid == '') {
      wx.showModal({
        content: that.data.content.select_add,
        showCancel: false,
        confirmText: that.data.content.yes
      })
      return
    }
    wx.showModal({
      title: that.data.content.pay_type,
      content: that.data.content.pay_type_tips,
      cancelText: that.data.content.weichar_pay,
      confirmText: that.data.content.credit_cardp,
      cancelColor: '#37a000',
      confirmColor: 'black',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../cardinfo/cardinfo?addid='+that.data.addid,
          })
        } else if (res.cancel) {
          app.fetchApis(that, 'e/order/micropay', {
            amount: that.data.total_price,
            sales_order_id: that.data.id
          }, 'POST', function(res) {
            var obj = JSON.parse(res.data)
            wx.requestPayment({
              timeStamp: obj.timeStamp,
              nonceStr: obj.nonceStr,
              package: obj.wechatPackage,
              signType: obj.signType,
              paySign: obj.paySign,
              success(result) {
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 2000
                })
                wx.navigateTo({
                  url: '../checkout/checkout',
                })
              },
              fail: function() {
                wx.showToast({
                  title: that.data.content.fail,
                })
              }
            })
          })
        }
      }
    })
    // var obj = wx.getStorageSync("tips")
    // var card_num = that.data.card_num
    // var card_reference = that.data.card_reference
    // if (card_reference == null || card_reference==''){
    //   wx.showModal({
    //     content: that.data.content.card_reference_tips,
    //     showCancel: false,
    //     confirmText: that.data.content.yes
    //   })
    //   return
    // }
    // if (card_num) {

    //   let param = {
    //     total_price: that.data.total_price,
    //     card_num: card_num,
    //     billing_address_id: that.data.addid,
    //     id: obj.id,
    //     grand_total:that.data.total_price,
    //     card_reference: card_reference
    //   }
    //   let tparam = {
    //     number: card_num,
    //     exp_month: that.data.exp_month,
    //     exp_year: that.data.exp_year,
    //     cvc:that.data.cvc
    //   }
    //   app.fetchApis(that, 'e/order/', param, 'POST', function(res) {
    //     if (res.statusCode == 200 || res.statusCode == 201) {
    //       wx.navigateTo({
    //         url: '../checkout/checkout',
    //       })
    //     }
    //   })
    // }else{
    //   wx.showModal({
    //     content: that.data.content.card_tips,
    //     showCancel:false,
    //     confirmText:that.data.content.yes
    //   })
    // }
  },
  // inputCardNum: function(e) {
  //   let that = this
  //   that.setData({
  //     card_num: e.detail.value
  //   })
  // },
  // inputReference: function(e) {
  //   let that = this
  //   that.setData({
  //     card_reference: e.detail.value
  //   })
  // }
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

          var addid = ''
          var addCity = ''
          var addState = ''
          var addressName = ''
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