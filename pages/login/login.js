var app = getApp()
var chinese = require('../../utils/Chinese.js')
var english = require('../../utils/English.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lanuage: "中文"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var lastLanuage = this.data.lanuage
      this.getContent(lastLanuage)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  changeLanuage: function() {
    var version = this.data.lanuage;
    if (version == "中文") {
      this.setData({
        lanuage: "英文"
      })
    } else {
      this.setData({
        lanuage: "中文"
      })
    }
    var lastLanuage = this.data.lanuage;
    this.getLanuage(lastLanuage)
  },
  getLanuage: function(lastLanuage) {
    if (lastLanuage == "中文") {
      this.setData({
        content: chinese.content
      })
    } else {
      this.setData({
        content: english.content
      })
    }
  },
  getContent: function (lastLanuage) {
    if (lastLanuage == "中文") {
      this.setData({
        content: chinese.content
      })
    } else {
      this.setData({
        content: english.content
      })
    }
  }
})