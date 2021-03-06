const Util = require('./utils/util.js');
var qcloud = require('./index.js');
var constants = require('./lib/constants');
var utils = require('./lib/utils');
var Session = require('./lib/session');
let session = Session.get();
var loginLib = require('./lib/login');
var chinese = require('/utils/Chinese.js')
var english = require('/utils/English.js')
var loginFlag = true;
App({
  globalData: {
    hasLogin: false,
    tag: 1,
    name: '',
    isTime: 0,
    startDate: '',
    endDate: '',
    isLimit: 0,
  },
  onLaunch: function() {
    let that = this;
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
    })
    updateManager.onUpdateReady(function() {
      wx.showModal({
        title: 'Update hints',
        content: 'New version is ready. Do you want to restart the application?？',
        confirmText: that.data.content.yes,
        cancelText: that.data.content.cancel,
        success: function(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function() {
      // 新的版本下载失败
      wx.showModal({
        title: 'Update hints',
        content: 'New version download failed',
        showCancel: false,
        confirmText: that.data.content.yes
      })
    })
    wx.onNetworkStatusChange(function(res) {
      that.globalData.isConnected = res.isConnected
      if (!res.isConnected) {
        wx.showModal({
          content: 'Please check your network status',
          showCancel: false,
          confirmText: that.data.content.yes
        })
      }
    })
    wx.getSystemInfo({
      success: function(res) {
        wx.setStorageSync('systemInfo', res)
        that.globalData.lanuage = res.language;
        that.globalData.navHeight = res.statusBarHeight + 46;//全局导航高度
      }
    })
  },
  fetchApis(pageSelf = '', url, params, POST, success = (res) => {}, actionError = (res) => {}, fail = (res) => {}) {
    wx.showLoading({
      title: 'Loading···',
      mask:true
    })
    let self = this;
    if (!self.globalData.isConnected) {
      wx.showModal({
        content: 'Please check your network status',
        showCancel: false,
        confirmText: that.data.content.yes,
      })
      wx.stopPullDownRefresh();
      return
    }
    wx.showNavigationBarLoading()
    qcloud.setLoginUrl(self.globalData.API_URL + 'e/app/session');
    // if (url == "getCode") {
    //   loginFlag = false;
    // }
    loginFlag = false;
    qcloud.request({
      login: loginFlag,
      url: `${self.globalData.API_URL}${url}`,
      method: POST,

      data: params,
      success: function(res) {
        console.log("==============app.success============")
        console.log(res.data);
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        wx.hideLoading();
        success(res);
      },
      fail: function(err) {
        console.log("app.fail")
        // wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        wx.hideLoading()
        console.log(err.message)
        Util.showSelfModal(pageSelf, err.message);
        fail(err);
      }
    });
  },
  getContent: function (that,lastLanuage) {
    if (lastLanuage == "zh_CN" || lastLanuage == "zh") {
      that.setData({
        content: chinese.content
      })
    } else {
      that.setData({
        content: english.content
      })
    }
  },
  globalData: {
    userInfo: null,
    API_URL: 'https://stage-scm.truckxi.com/api/',
    IMG_URL: 'https://s3-us-west-1.amazonaws.com/scmteambucket/media/wechat/',
    carts: [],
    coupons: [],
    maps: [],
    isConnected: true,
    lanuage:'en',
    navHeight: 0
  }
})