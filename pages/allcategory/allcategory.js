var app = getApp()
var selectId = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dimg: "https://s3-us-west-1.amazonaws.com/scmteambucket/media/wechat/icon_g_arrowd.png",
    uimg: "https://s3-us-west-1.amazonaws.com/scmteambucket/media/wechat/icon_g_arrowu.png",
    isDown: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  toHome: function () {
    wx.reLaunch({
      url: '../home/home',
    })
  },
  onLoad: function(options) {
    let that = this
    var lastLanuage = app.globalData.lanuage
    // this.getContent(lastLanuage)
    app.getContent(that, lastLanuage)
    // getCategory(that)
    getGroup(that)
  },
  changeMenu: function(e) {
    let that = this
    var isdown = !that.data.isDown
    var cid = e.currentTarget.dataset.id
    if (cid != selectId) {
      selectId = cid
      isdown = true
    }
    that.setData({
      selectId: selectId,
      isDown: isdown
    })
  }
})

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
            obj.Image = v.Image
            obj.Description = v.Description
            obj.Name = v.Name
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
var getGroup = function(that){
  wx.request({
    url: app.globalData.API_URL + 'e/app/group',
    success:function(res){
      console.log(res)
      that.setData({
        groups:res.data.groups
      })
    }
  })
}