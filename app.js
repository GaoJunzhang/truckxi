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
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
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
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    })
    wx.onNetworkStatusChange(function(res) {
      that.globalData.isConnected = res.isConnected
      if (!res.isConnected) {
        wx.showModal({
          content: '请检查您的网络状态',
          showCancel: false
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
    // wx.showLoading({
    //   title: '加载中',
    //   mask:true
    // })
    let self = this;
    if (!self.globalData.isConnected) {
      wx.showModal({
        content: '请检查您的网络状态',
        showCancel: false
      })
      wx.stopPullDownRefresh();
      return
    }
    wx.showNavigationBarLoading()
    // qcloud.setLoginUrl(this.globalData.API_URL + '/wxLogin');
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
    if (lastLanuage == "zh_CNd" || lastLanuage == "zhd") {
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
    API_URL: 'https://stage-scm.truckxi.com:443/api/',
    IMG_URL: 'http://bluablua.com/',
    carts: [],
    coupons: [],
    maps: [],
    isConnected: true,
    lanuage:'en',
    navHeight: 0
  }
})