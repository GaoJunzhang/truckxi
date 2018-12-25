const Util = require('./utils/util.js');
var qcloud = require('./index.js');
var constants = require('./lib/constants');
var utils = require('./lib/utils');
var Session = require('./lib/session');
let session = Session.get();
var loginLib = require('./lib/login');
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
      console.log("==================")
      console.log(res.hasUpdate)
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
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.navigateTo({
            url: '/pages/authon/authon',
          })
        } else {
          wx.getUserInfo({
            success: function(res) {
              that.globalData.userInfo = res.rawData
            }
          })
        }
      }
    })
    wx.getSystemInfo({
      success: function(res) {
        wx.setStorageSync('systemInfo', res)
        var ww = res.windowWidth;
        var hh = res.windowHeight;
        that.globalData.ww = ww;
        that.globalData.hh = hh;
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
    qcloud.setLoginUrl(this.globalData.API_URL + '/wxLogin');
    if (url == "getCode") {
      loginFlag = false;
    }
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
  bezier: function(pots, amount) {
    var pot;
    var lines;
    var ret = [];
    var points;
    for (var i = 0; i <= amount; i++) {
      points = pots.slice(0);
      lines = [];
      while (pot = points.shift()) {
        if (points.length) {
          lines.push(pointLine([pot, points[0]], i / amount));
        } else if (lines.length > 1) {
          points = lines;
          lines = [];
        } else {
          break;
        }
      }
      ret.push(lines[0]);
    }

    function pointLine(points, rate) {
      var pointA, pointB, pointDistance, xDistance, yDistance, tan, radian, tmpPointDistance;
      var ret = [];
      pointA = points[0]; //点击
      pointB = points[1]; //中间
      xDistance = pointB.x - pointA.x;
      yDistance = pointB.y - pointA.y;
      pointDistance = Math.pow(Math.pow(xDistance, 2) + Math.pow(yDistance, 2), 1 / 2);
      tan = yDistance / xDistance;
      radian = Math.atan(tan);
      tmpPointDistance = pointDistance * rate;
      ret = {
        x: pointA.x + tmpPointDistance * Math.cos(radian),
        y: pointA.y + tmpPointDistance * Math.sin(radian)
      };
      return ret;
    }
    return {
      'bezier_points': ret
    };
  },
  globalData: {
    userInfo: null,
    API_URL: 'https://wxapp.seeyoo-tech.cn/',
    IMG_URL: 'https://wxapp.seeyoo-tech.cn',
    carts: [],
    coupons: [],
    maps: [],
    isConnected: true
  }
})