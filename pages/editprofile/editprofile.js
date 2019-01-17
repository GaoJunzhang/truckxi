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
    account(that, null, 'GET')
  },
  formSubmit: function(e) {
    let that = this
    var accountObj = e.detail.value
    if (accountObj.first_name==''){
      wx.showModal({
        content: that.data.content.first_name_tips
      })
      return
    }
    
    if (accountObj.last_name==''){
      wx.showModal({
        content: that.data.content.last_name_tips
      })
      return
    }
    
    app.fetchApis(that, 'e/account', null, 'PUT', function (res) {
      console.log(res)
      account(that, null, 'GET')
    })
  }
})

var account = function(that, param, method) {
  app.fetchApis(that, 'e/account/', param, method, function(res) {
    that.setData({
      first_name: res.data.first_name,
      last_name: res.data.last_name,
      email: res.data.email
    })
  })
}