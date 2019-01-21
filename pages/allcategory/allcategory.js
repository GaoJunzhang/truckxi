var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dUimg: "http://bluablua.com/icon_g_arrowd.png",
    isDown:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    var lastLanuage = app.globalData.lanuage
    // this.getContent(lastLanuage)
    app.getContent(that, lastLanuage)
    getCategory(that)
  },
  changeMenu: function(e) {
    let that = this
    var isdown = !that.data.isDown
    console.log(isdown)
    that.setData({
      selectId: e.currentTarget.dataset.id,
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
                  console.log(isListCateGorys)
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