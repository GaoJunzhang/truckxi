var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['美国', '中国', '巴西', '日本'],
    viewAdd: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    var lastLanuage = app.globalData.lanuage
    // this.getContent(lastLanuage)
    app.getContent(that, lastLanuage)
    if (options.viewAdd && options.viewAdd == 1) {
      that.setData({
        viewAdd: true
      })
    }
  },
  onShow: function() {
    let that = this
    getAddress(that)
  },
  // url='../editaddress/editaddress?address={{item}}'
  editAddress: function(e) {
    let str = JSON.stringify(e.currentTarget.dataset.addobj);
    wx.navigateTo({
      url: '../editaddress/editaddress?addObj=' + str,
    })
  },
  selectAdd: function(e) {
    let that = this
    that.setData({
      selectId: e.currentTarget.dataset.addid,
      addstate: e.currentTarget.dataset.addstate
    })
  },
  deleteAdd: function(e) {
    let that = this
    let selectId = that.data.selectId
    if (selectId && selectId != '') {

      app.fetchApis(that, 'e/account/address/' + selectId, null, 'DELETE', function(res) {
        console.log(res)
        if (res.statusCode == 200) {
          wx.showToast({
            title: that.data.content.success,
          })
          getAddress(that)
        }
      })
    }else{
      wx.showModal({
        content: that.data.content.choose_location,
        cancelText: that.data.content.cancel,
        confirmText: that.data.content.yes,
      })
    }
  },
  toPayment: function() {
    let that = this
    var abState = that.data.addstate
    if (abState && abState.length > 2) {
      abState = abState.substring(1, 3)
      var adjusetObj = wx.getStorageSync("tips")
      adjusetObj.location = abState
      app.fetchApis(that, 'e/order/adjust-cart', adjusetObj, 'POST', function(res) {
        console.log(res)
        if (res.statusCode == 200) {
          wx.navigateTo({
            url: '../mycart/mycart?addid=' + that.data.selectId + '&grand_total=' + res.data.grand_total,
          })
        }
      })

    } else {
      wx.showModal({
        content: 'Please choose the address.',
        showCancel: false,
        confirmText: that.data.content.yes,
      })
    }
  }
})
var getAddress = function(that) {
  app.fetchApis(that, 'e/account/address', null, 'GET', function(res) {
    console.log(res)
    if (res.statusCode == 200) {
      that.setData({
        addresses: res.data.addresses
      })
    }
  })
}