var app = getApp()
var chinese = require('../../utils/Chinese.js')
var english = require('../../utils/English.js')
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

    imgs: [{
        img: 'http://bluablua.com/banner_01.jpg',
      },
      {
        img: 'http://bluablua.com/banner_01.jpg',
      },
    ],
    grateGoods: [{}],
    categorys: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var lastLanuage = app.globalData.lanuage
    let that = this
    app.getContent(that, lastLanuage)
    getProduct(that, null)
    getCategory(that, null)
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
  hideChoose: function() {
    this.setData({
      islocation: true
    })
  },
  categoryInfo: function(e) {
    var cId = e.currentTarget.dataset.id
    console.log(cId)
  },
  productInfo: function(e) {
    console.log(e.currentTarget.dataset.pid)
  }
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
        console.log("res.data=========")
        console.log(res.data)
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