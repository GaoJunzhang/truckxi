var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addresses: [],
    is_default: false,
    showmore: false,
    isAdd: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    var lastLanuage = app.globalData.lanuage
    app.getContent(that, lastLanuage)
    var addObj = JSON.parse(options.addObj)
    that.setData({
      addObj: addObj
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  showAddAddress: function () {
    let that = this
    that.setData({
      showmore: false,
      isAdd: true
    })
  },
  formSubmit: function (e) {
    let that = this
    var addressObj = e.detail.value
    console.log(addressObj)
    if (addressObj.City == '') {
      wx.showModal({
        content: that.data.content.city_err,
      })
      return
    }
    if (addressObj.State == '') {
      wx.showModal({
        content: that.data.content.state_err,
      })
      return
    }
    if (addressObj.Street == '') {
      wx.showModal({
        content: that.data.content.street_err,
      })
      return
    }
    if (addressObj.Zip == '') {
      wx.showModal({
        content: that.data.content.zipcode_err,
      })
      return
    }
    addressObj.is_default = that.data.is_default
    putAddress(that, addressObj)
  },
  switch1Change: function (e) {
    let that = this
    that.setData({
      is_default: e.detail.value
    })
  },
  getmore: function (e) {
    let that = this
    that.setData({
      showmore: !that.data.showmore,
      targetId: e.currentTarget.dataset.id
    })
  }
})
var getAddress = function (that) {
  app.fetchApis(that, 'e/account/address', {}, 'GET', function (res) {
    console.log(res)
    that.setData({
      addresses: res.data.addresses
    })
  })
}
var putAddress = function (that, param) {
  app.fetchApis(that, 'e/account/address/'+that.data.addObj.id, param, 'PUT', function (res) {
    wx.navigateBack({
      detail:2
    })
  })
}