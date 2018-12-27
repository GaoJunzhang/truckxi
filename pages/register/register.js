var app = getApp()
var util = require('../../utils/util.js')
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
    app.getContent(this, lastLanuage)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  backlogin: function() {
    wx.navigateBack({
      detail: 1
    })
  },
  formSubmit: function(e) {
    util.checkEmail('1228671674@m')
    let that = this
    var userObj = e.detail.value
    if (userObj.first_name == "" || userObj.first_name == null) {
      wx.showModal({
        content: that.data.content.firstname_err,
        showCancel: false
      })
      return
    }
    if (userObj.last_name == "" || userObj.last_name == null) {
      wx.showModal({
        content: that.data.content.lastname_err,
        showCancel: false
      })
      return
    }
    if (userObj.username == "" || userObj.username == null) {
      wx.showModal({
        content: that.data.content.username_err,
        showCancel: false
      })
      return
    }
    if (userObj.email == "" || userObj.email == null || !util.checkEmail(userObj.email)) {
      wx.showModal({
        content: that.data.content.email_err,
        showCancel: false
      })
      return
    }
    if (userObj.password == "" || userObj.password == null) {
      wx.showModal({
        title: that.data.content.password_err,
        showCancel: false
      })
      return
    }

    wx.request({
      url: app.globalData.API_URL + 'e/account/username-availability/',
      method: 'POST',
      data: {
        username: userObj.username
      },
      success: function(res) {
        console.log(res.data)
        if (res.data.available) {

        } else {
          wx.showModal({
            content: that.data.content.username_err,
            showCancel: false
          })
          return
        }
      }
    })
    wx.request({
      url: app.globalData.API_URL + 'e/account/email-availability/',
      method: 'POST',
      data: {
        email: userObj.email
      },
      success: function(res) {
        console.log(res.data)
        if (res.data.available) {

        } else {
          wx.showModal({
            content: that.data.content.email_err,
            showCancel: false
          })
          return
        }
      }
    })
    wx.request({
      url: app.globalData.API_URL + 'e/account/register/',
      method: 'POST',
      data: userObj,
      success: function(res) {
        console.log(res)
        if (res.statusCode == 200) {
          //get token and back to parent page
          wx.request({
            url: app.globalData.API_URL + 'e/app/token/',
            data: {
              username: userObj.username,
              password: userObj.password
            },
            method: "POST",
            success: function(result) {
              if (result.data.token) {
                wx.setStorageSync("token", result.data.token)
                //back to parent page
                wx.navigateBack({
                  detail: 1
                })
              } else {
                wx.showModal({
                  content: that.data.content.loginError,
                })
              }
            },
            fail: function(e) {
              console.log("失败")
            }
          })
        } else {
          wx.showModal({
            content: that.data.content.username_ck,
          })
        }
      }
    })
  }


})