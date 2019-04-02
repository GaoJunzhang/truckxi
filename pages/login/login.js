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
    var lastLanuage = app.globalData.lanuage
    // this.getContent(lastLanuage)
    app.getContent(this,lastLanuage)
  },

  formSubmit:function(e){
    let that = this
    var obj = e.detail.value
    if (obj.username == "" || obj.username == null || obj.password == "" || obj.password==null){
      wx.showModal({
        content: that.data.content.loginError,
        confirmText: that.data.content.yes,
        cancelText: that.data.content.cancel
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
            confirmText: that.data.content.yes,
            cancelText: that.data.content.cancel
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