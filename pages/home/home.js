var app = getApp()
var chinese = require('../../utils/Chinese.js')
var english = require('../../utils/English.js')
var Session = require('../../lib/session.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    islocation: true,
    show: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['中文', 'English'], //下拉列表的数据
    index: 0, //选择的下拉列表下标,
    showLeft: true,

    autoplay: true,
    circular: false,
    interval: 5000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,

    // billbords: [{
    //     image: 'http://bluablua.com/banner_01.jpg',
    //   },
    //   {
    //     image: 'http://bluablua.com/banner_01.jpg',
    //   },
    // ],
    grateGoods: [{}],
    categorys: [],
    navFixed: false,  //导航是否固定
    scrollTop: '',    //滑动的距离
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var sysInfo = wx.getStorageSync("systemInfo")
    var lastLanuage = app.globalData.lanuage
    let that = this
    that.setData({
      pixelRatio: sysInfo.pixelRatio,
      windowHeight: sysInfo.windowHeight,
      windowWidth: sysInfo.windowWidth
    })
    app.getContent(that, lastLanuage)
    getProduct(that, null)
    getCategory(that, null)
    billbord(that)
    // wx.login({
    //   success(res){
    //     console.log("res.code==========")
    //     console.log(res.code)
    //     if(res.code){
    //       wx.request({
    //         url: app.globalData.API_URL + 'e/app/session',
    //         method:'POST',
    //         header:{
    //           "content-type":"application/x-www-form-urlencoded"
    //         },
    //         data:{
    //           js_code:res.code,
    //           username:'zgj',
    //           password:"zgj1234"
    //         },
    //         success: function (res) {
    //             console.log("res.data=========")
    //             console.log(res)
    //           if (res.statusCode == 200) {
    //           } else {
    //             wx.showModal({
    //               content: res.data.message,
    //               showCancel: false
    //             })
    //           }
    //         }
    //       })
    //     }else{
    //       console.log("微信登录")
    //     }
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  // 点击下拉列表
  optionTap(e) {
    const lanFlag = e.currentTarget.dataset.index
    var lanuage = app.globalData.lanuage
    if (lanFlag == 1) {
      lanuage = "en"
    } else {
      lanuage = "zh_CN"
    }
    this.getLanuage(lanuage)
    app.globalData.lanuage = lanuage
    let Index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    this.setData({
      index: Index,
      show: !this.data.show
    });
  },
  selectTap() {
    this.setData({
      show: !this.data.show
    });
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
  hideleft: function(e) {
    this.setData({
      showLeft: true
    })
  },
  showleft: function(e) {
    let that = this
    const session = Session.get()
    if (session && session.token) {
      getAccount(that)
    } else {
      that.setData({
        showLeft: false,
        username: "TRUCKXI"
      })
    }
  },
  hideChoose: function() {
    this.setData({
      islocation: true
    })
  },
  categoryInfo: function(e) {
    var cId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../produce/produce?pk=' + cId,
    })
  },
  //监听滑动
  layoutScroll: function(e) {
    let that = this
    that.data.scrollTop = that.data.scrollTop * 1 + e.detail.deltaY * 1;
    console.log(that.data.scrollTop)
    console.log(that.data.navFixed)
    // const query = wx.createSelectorQuery();
    // query.select('.nav').boundingClientRect();
    // query.selectViewport().scrollOffset();
    // query.exec(function (res) {


    // });

    /** 我这里写了固定值 如果使用rpx 可用query可以动态获取其他的高度 然后修改这里值 */
    /** 获取方法参考文档 */

    /** scrollTop 在模拟器上检测不是太灵敏 可在真机上测试 基本上不会出现延迟问题 */
    var navtopHeight = 192;

    if (that.data.scrollTop <= -navtopHeight) {
      that.setData({
        navFixed: true
      })
    } else {
      that.setData({
        navFixed: false
      })
    }
  },
})
var getProduct = function(that, param) {
  wx.request({
    url: app.globalData.API_URL + 'e/product/',
    data: param,
    success: function(res) {
      if (res.statusCode == 200) {
        var data = res.data.products
      } else {
        wx.showModal({
          content: '服务器异常，请稍后再试',
          showCancel: false
        })
      }
    }
  })
}
var getCategory = function(that, param) {
  wx.request({
    url: app.globalData.API_URL + 'e/category/custom',
    // data:param,
    success: function(res) {
      if (res.statusCode == 200) {
        var categorys = res.data
        var isListCateGorys = []
        categorys.forEach(function(v, k) {
          if (v.IsListView) {
            var obj = {}
            obj.id = v.ProductCategory2_id
            if (app.globalData.lanuage == "zh_CN" || app.globalData.lastLanuage == "zh") {
              obj.categoryName = v.Description
            } else {
              obj.categoryName = v.Name
            }
            // console.log(getCustomProductByPk(that, v.ProductCategory2_id))
            wx.request({
              url: app.globalData.API_URL + 'e/category/custom/' + v.ProductCategory2_id + '/product',
              success: function(res) {
                if (res.statusCode == 200) {
                  obj.products = res.data;
                  isListCateGorys.push(obj)
                  that.setData({
                    isListCateGorys: isListCateGorys,
                    categorys: categorys
                  })
                } else {
                  wx.showModal({
                    content: '服务器异常，请稍后再试',
                    showCancel: false
                  })
                }
              }
            })
          }
        })

      } else {
        wx.showModal({
          content: '服务器异常，请稍后再试',
          showCancel: false
        })
      }
    }
  })
}

function getCustomProductByPk(that, pk) {
  var products = []
  wx.request({
    url: app.globalData.API_URL + 'e/category/custom/' + pk + '/product',
    success: function(res) {
      if (res.statusCode == 200) {
        products = res.data
      } else {
        wx.showModal({
          content: '服务器异常，请稍后再试',
          showCancel: false
        })
      }
    }
  })
  return products
}
var billbord = function(that) {
  wx.request({
    url: app.globalData.API_URL + 'e/app/billboard',
    success: function(res) {
      console.log("广告牌")
      console.log(res)
      if (res.statusCode == 200) {
        that.setData({
          billbords: res.data.billboards
        })
      } else {
        wx.showModal({
          content: '服务器异常，请稍后再试',
          showCancel: false
        })
      }
    }
  })
}
var getAccount = function(that) {
  app.fetchApis(that, 'e/account/', {}, 'GET', function(res) {
    that.setData({
      showLeft: false,
      username: res.data.first_name + " " + res.data.last_name
    })
  })
}