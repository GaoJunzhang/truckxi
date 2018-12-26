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
  onLoad: function (options) {
    var lastLanuage = app.globalData.lanuage
    // this.getContent(lastLanuage)
    app.getContent(this, lastLanuage)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  backlogin: function () {
    wx.navigateBack({
      detail: 1
    })
  }


})