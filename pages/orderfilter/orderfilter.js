var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [{
        name: '1',
        value: '2'
      },
      {
        name: '2',
        value: '3',
        checked: 'true'
      },
      {
        name: '3',
        value: '6'
      },
    ]
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  bindDateChangeStart(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      startDate: e.detail.value
    })
  },
  bindDateChangeEnd(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endDate: e.detail.value
    })
  },
})