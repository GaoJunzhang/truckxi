var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['美国', '中国', '巴西', '日本'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    var lastLanuage = app.globalData.lanuage
    // this.getContent(lastLanuage)
    app.getContent(that, lastLanuage)
  },
  onShow:function(){
    let that = this
    getAddress(that)
  },
  // url='../editaddress/editaddress?address={{item}}'
  editAddress:function(e){
    let str = JSON.stringify(e.currentTarget.dataset.addobj);
    wx.navigateTo({
      url: '../editaddress/editaddress?addObj='+str,
    })
  },
  selectAdd:function(e){
    let that = this
    that.setData({
      selectId:e.currentTarget.dataset.addid
    })
  },
})
var getAddress = function(that){
  app.fetchApis(that, 'e/account/address', null, 'GET', function (res) {
    console.log(res)
    if (res.statusCode == 200) {
      that.setData({
        addresses: res.data.addresses
      })
    }
  })
}