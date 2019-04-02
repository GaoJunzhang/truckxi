var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prodeces: [],
    isCustom: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  toHome: function() {
    wx.reLaunch({
      url: '../home/home',
    })
  },
  onLoad: function(options) {
    let that = this
    var lastLanuage = app.globalData.lanuage
    app.getContent(that, lastLanuage)
    getProduce(that, options.pk)
    getCategory(that)
  },
  categoryInfo: function(e) {
    let pk = e.currentTarget.dataset.pk
    let that = this
    getCustomProduce(that, pk)
  }
})
var getProduce = function(that, pk) {
  wx.showLoading({
    title: that.data.content.loading,
  })
  wx.request({
    url: app.globalData.API_URL + 'e/product?category=' + pk,
    success: function(res) {
      if (res.statusCode == 200) {
        console.log(res.data)
        that.setData({
          prodeces: res.data.products,
          selectId: pk
        })
      } else {
        wx.showModal({
          content: 'Server exception, please try again later',
          showCancel: false,
          confirmText: that.data.content.yes,
        })
      }
    }
  })
  wx.hideLoading();
}
var getCategory = function(that) {
  wx.request({
    url: app.globalData.API_URL + 'e/category/custom',
    // data:param,
    success: function(res) {
      if (res.statusCode == 200) {
        console.log(res.data)
        that.setData({
          categorys: res.data
        })
      }
    }
  })
}
var getCustomProduce = function(that, pk) {
  wx.showLoading({
    title: that.data.content.loading,
  })
  wx.request({
    url: app.globalData.API_URL + 'e/category/custom/' + pk + '/product',
    success: function(res) {
      if (res.statusCode == 200) {
        console.log(res.data)
        that.setData({
          prodeces: res.data,
          selectId: pk,
          isCustom:false
        })
      } else {
        wx.showModal({
          content: 'Server exception, please try again later',
          showCancel: false,
          confirmText: that.data.content.yes,
        })
      }
    }
  })
  wx.hideLoading();
}