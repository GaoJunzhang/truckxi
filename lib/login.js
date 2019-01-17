var utils = require('./utils');
var constants = require('./constants');
var Session = require('./session');
const app = getApp();

/***
 * @class
 * 表示登录过程中发生的异常
 */
var LoginError = (function() {
  function LoginError(type, message) {
    Error.call(this, message);
    this.type = type;
    this.message = message;
  }

  LoginError.prototype = new Error();
  LoginError.prototype.constructor = LoginError;

  return LoginError;
})();

/**
 * 微信登录，获取 code 和 encryptData
 */
var getWxLoginResult = function getLoginCode(callback) {
  wx.login({
    success: function(loginResult) {
      callback(null, {
        code: loginResult.code,
      });
    },

    fail: function(loginError) {
      var error = new LoginError(constants.ERR_WX_LOGIN_FAILED, '微信登录失败，请检查网络状态');
      error.detail = loginError;
      callback(error, null);
    }
  });
};

var noop = function noop() {};
var defaultOptions = {
  method: 'GET',
  success: noop,
  fail: noop,
  loginUrl: null,
  dataUrl: null,
};

/**
 * @method
 * 进行服务器登录，以获得登录会话
 *
 * @param {Object} options 登录配置
 * @param {string} options.loginUrl 登录使用的 URL，服务器应该在这个 URL 上处理登录请求
 * @param {string} [options.method] 请求使用的 HTTP 方法，默认为 "GET"
 * @param {Function} options.success(userInfo) 登录成功后的回调函数，参数 userInfo 微信用户信息
 * @param {Function} options.fail(error) 登录失败后的回调函数，参数 error 错误信息
 */
var login = function login(options) {
  console.log(options)
  options = utils.extend({}, defaultOptions, options);

  if (!defaultOptions.loginUrl) {
    options.fail(new LoginError(constants.ERR_INVALID_PARAMS, '登录错误：缺少登录地址，请通过 setLoginUrl() 方法设置登录地址'));
    return;
  }

  var doLogin = () => getWxLoginResult(function(wxLoginError, wxLoginResult) {

    if (wxLoginError) {
      options.fail(wxLoginError);
      return;
    }


    // 构造请求头，包含 code、encryptedData 和 iv
    var code = wxLoginResult.code;
    var data = [];

    data[constants.WX_HEADER_CODE] = code;

    // 请求服务器登录地址，获得会话信息
    console.log("=======请求之前=========")
    console.log(options.loginUrl)
    console.log(data)
    wx.request({
      url: options.loginUrl,
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: data,
      success: function(result) {
        console.log("=====result======")
        console.log(result)
        var data = result.data;
        // 成功地响应会话信息
        if (result.statusCode == 200 || result.statusCode == 201) {

          if (typeof data == 'string') {
            data = data.trim();
            data = JSON.parse(data);
          }
          console.log("登录获取token=============")
          console.log(data)
          if (data) {
            if (data.token) {
              let session = {
                token: "jwt " + data.token,
              }
              Session.set(session);
              options.success();
            } else {
              // var errorMessage = '登录失败(' + result.statusCode + ')：' + (data.message || '请下拉刷新重试');
              // var noSessionError = new LoginError(constants.ERR_LOGIN_SESSION_NOT_RECEIVED, errorMessage);
              // options.fail(noSessionError);
              wx.showModal({
                title: '提示',
                content: '请先登录',
                cancelText: '取消',
                confirmText: '登录',
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '/pages/register/register',
                    })
                  } else if (res.cancel) {
                    wx.navigateBack({
                      detail:2
                    })
                  }
                }
              })
              
            }
            // 没有正确响应会话信息
          } else {
            var errorMessage = '登录请求没有包含会话响应，请确保服务器处理 `' + options.loginUrl + '` 的时候正确使用了 SDK 输出登录结果';
            var noSessionError = new LoginError(constants.ERR_LOGIN_SESSION_NOT_RECEIVED, errorMessage);
            options.fail(noSessionError);
          }
        } else {
          var errorMessage = 'request exception';
          var noSessionError = new LoginError(constants.ERR_LOGIN_SESSION_NOT_RECEIVED, errorMessage);
          options.fail(noSessionError);
        }
      },
      // 响应错误
      fail: function(loginResponseError) {
        var error = new LoginError(constants.ERR_LOGIN_FAILED, '登录失败，可能是网络错误或者服务器发生异常');
        options.fail(error);
      },
    });
  });

  var session = Session.get();
  console.log(session)
  if (session) {
    wx.checkSession({
      success: function() {
        options.success();
      },
      fail: function() {
        Session.clear();
        doLogin();
      },
    });
  } else {
    doLogin();
  }
};

var setLoginUrl = function(loginUrl) {
  defaultOptions.loginUrl = loginUrl;
};

var setDataUrl = function(dataUrl) {
  defaultOptions.dataUrl = dataUrl;
};

var buttonLogin = function(e, options) {
  console.log(options)
  var session = Session.get();
  console.log(session)
  if (session) {
    wx.checkSession({
      success: function() {
        //options.success(session.userInfo);
      },
      fail: function() {
        Session.clear();
        getWxButtonLoginResult(e, function(result) {

        });
      },
    });
  } else {
    getWxButtonLoginResult(e, function(result) {
      loginSession(result)
    });
  }

};

var getWxButtonLoginResult = function getLoginCode(e, callback) {
  wx.login({
    success: function(loginResult) {
      console.log(loginResult)
      callback({
        code: loginResult.code,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        // userInfo: e.detail.userInfo
      });
    },

    fail: function(loginError) {
      var error = new LoginError(constants.ERR_WX_LOGIN_FAILED, '微信登录失败，请检查网络状态');
      error.detail = loginError;
      callback(error, null);
    }
  });
};

var loginSession = function getLoginSession(wxLoginResult) {
  // var userInfo = wxLoginResult.userInfo;

  // 构造请求头，包含 code、encryptedData 和 iv
  var code = wxLoginResult.code;
  var encryptedData = wxLoginResult.encryptedData;
  var iv = wxLoginResult.iv;
  var data = [];

  data[constants.WX_HEADER_CODE] = code;
  var options = utils.extend({}, defaultOptions, '');
  // 请求服务器登录地址，获得会话信息
  wx.request({
    url: options.dataUrl,
    method: 'POST',
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    data: data,
    success: function(result) {
      var data = result.data;
      // 成功地响应会话信息
      if (typeof data == 'string') {
        data = data.trim();
        data = JSON.parse(data);
      }
      if (data) {
        if (data.errcode == 0 && data.token) {
          let session = {
            token: data.token,
            // userInfo: userInfo
          }
          Session.set(session);

          // 请求服务器登录地址，获得会话信息

          let dataData = [];

          dataData[constants.WX_HEADER_TOKEN] = data.token;
          dataData[constants.WX_HEADER_ENCRYPTED_DATA] = encryptedData;
          dataData[constants.WX_HEADER_IV] = iv;
          console.log(dataData)
          wx.request({
            url: options.dataUrl,
            method: 'POST',
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            data: dataData,
            success: function(result) {
              var data = result.data;
              // 成功地响应会话信息
              if (typeof data == 'string') {
                data = data.trim();
                data = JSON.parse(data);
              }
              if (data) {
                if (data.errcode == 0) {
                  //options.success(userInfo);
                } else {
                  var errorMessage = '登录失败(' + data.errcode + ')：' + (data.msg || '未知错误');
                  var noSessionError = new LoginError(constants.ERR_LOGIN_SESSION_NOT_RECEIVED, errorMessage);
                  //options.fail(noSessionError);
                }
                // 没有正确响应会话信息
              } else {
                var errorMessage = '登录请求没有包含会话响应，请确保服务器处理 `' + options.loginUrl + '` 的时候正确使用了 SDK 输出登录结果';
                var noSessionError = new LoginError(constants.ERR_LOGIN_SESSION_NOT_RECEIVED, errorMessage);
                //options.fail(noSessionError);
              }
            },
            // 响应错误
            fail: function(loginResponseError) {
              var error = new LoginError(constants.ERR_LOGIN_FAILED, '登录失败，可能是网络错误或者服务器发生异常');
              //options.fail(error);
            },
          });
        } else {
          var errorMessage = '登录失败(' + data.errcode + ')：' + (data.msg || '未知错误');
          var noSessionError = new LoginError(constants.ERR_LOGIN_SESSION_NOT_RECEIVED, errorMessage);
          //options.fail(noSessionError);
        }
        // 没有正确响应会话信息
      } else {
        var errorMessage = '登录请求没有包含会话响应，请确保服务器处理 `' + options.loginUrl + '` 的时候正确使用了 SDK 输出登录结果';
        var noSessionError = new LoginError(constants.ERR_LOGIN_SESSION_NOT_RECEIVED, errorMessage);
        //options.fail(noSessionError);
      }
    },
    // 响应错误
    fail: function(loginResponseError) {
      var error = new LoginError(constants.ERR_LOGIN_FAILED, '登录失败，可能是网络错误或者服务器发生异常');
      //options.fail(error);
    },
  });
}

module.exports = {
  LoginError: LoginError,
  login: login,
  setLoginUrl: setLoginUrl,
  setDataUrl: setDataUrl,
  buttonLogin: buttonLogin
};