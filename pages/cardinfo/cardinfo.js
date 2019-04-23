var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER','VISA DEBIT','ELECTRON','DEBIT MASTERCARD','DINERS'],
    index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var lastLanuage = app.globalData.lanuage
    let that = this
    // this.getContent(lastLanuage)
    var date = new Date()
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" + month : month); 
    app.getContent(that, lastLanuage)
    that.setData({
      addid: options.addid,
      sales_order_id: options.sales_order_id,
      date: month + "/" + year
    })

  },
  bindDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var value = e.detail.value
    var year = value.substr(0,4)
    var month = value.substr(5,2)
    this.setData({
      date: month + "/" + year
    })
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  checkout: function(e) {
    let that = this
    var cardObj = e.detail.value
    var index = that.data.index
    var card_expiry = that.data.date
    var yearStr = card_expiry.substr(5,2)
    var monghtStr = card_expiry.substr(0, 2)
    cardObj.card_expiry = monghtStr.toString() + yearStr.toString()
    cardObj.card_type = that.data.array[index]
    cardObj.sales_order_id = that.data.sales_order_id
    // cardObj.exp_month = parseInt(cardObj.exp_month)
    // cardObj.exp_year = parseInt(cardObj.exp_year)
    // app.fetchApis(that, 'e/order/card-token', cardObj, 'POST', function(res) {
    app.fetchApis(that, 'e/order/store-card', cardObj, 'POST', function(res) {
      // console.log(res)
      console.log(res)
      if (res.statusCode == 200 || res.statusCode == 201) {
        var obj = wx.getStorageSync("tips")
        console.log(obj)
        let param = {
          id: obj.id,
          total_price: obj.total_price,
          applied_credit_amount: obj.promo_code,
          card_reference: res.data.card_reference,
          billing_address_id: that.data.addid,
          shipping_address_id: that.data.addid,
          note: ''
        }
        app.fetchApis(that, 'e/order/', param, 'POST', function(res) {
          wx.showModal({
            content: res.data.message,
            confirmText: that.data.content.yes,
            cancelText: that.data.content.cancel
          })
          wx.removeStorageSync("tips")
          wx.navigateTo({
            url: '../checkout/checkout',
          })
        })
      }else{
        wx.showModal({
          title: 'Tips',
          content: res.data.message,
          confirmText: that.data.content.yes,
          cancelText: that.data.content.cancel,
        })
      }
    })
  }

})