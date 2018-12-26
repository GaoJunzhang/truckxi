var app = getApp()
var chinese = require('../../utils/Chinese.js')
var english = require('../../utils/English.js')
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
    var lastLanuage = app.globalData.lanuage
    // this.getContent(lastLanuage)
    app.getContent(this,lastLanuage)
  },

  changeLanuage: function() {
    var version = app.globalData.lanuage;
    if (version == "zh_CN") {
      app.globalData.lanuage = "en"
      this.setData({
        lanuage: "en"
      })
    } else {
      app.globalData.lanuage = "zh_CN"
      this.setData({
        lanuage: "zh_CN"
      })
    }
    var lastLanuage = this.data.lanuage;
    this.getLanuage(lastLanuage)
  },
  getLanuage: function(lastLanuage) {
    if (lastLanuage == "zh_CN") {
      this.setData({
        content: chinese.content
      })
    } else {
      this.setData({
        content: english.content
      })
    }
  },
  formSubmit:function(e){
    let that = this
    var obj = e.detail.value
    if (obj.username == "" || obj.username == null || obj.password == "" || obj.password==null){
      wx.showModal({
        content: that.data.content.loginError,
      })
      return
    }
    wx.request({
      url: app.globalData.API_URL +'e/app/token/',
      data:obj,
      method:"POST",
      success:function(res){
        console.log("成功")
        console.log(res)
        if(res.data.token){
          //成功
          wx.setStorageSync("token", res.data.token)
        }else{
          wx.showModal({
            content: that.data.content.loginError,
          })
        }
      },
      fail:function(e){
        console.log("失败")
        console.log(e)
      }
    })
  }
})