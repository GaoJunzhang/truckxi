var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addresses: [],
    is_default: false,
    showmore: false,
    isAdd: false,
    array: [
      '(AL)Alabama', '(AK)Alaska', '(AZ)Arizona', '(AR)Arkansas', '(CA)California',
      '(CO)Colorado', '(CT)Connecticut', '(DE)Delaware', '(FL)Florida', '(GA)Georgia',
      '(HI)Hawaii', '(ID)Idaho', '(IL)Illinois', '(IN)Indiana', '(IA)Iowa',
      '(KS)Kansas', '(KY)Kentucky', '(LA)Louisiana', '(ME)Maine', '(MD)Maryland',
      '(MA)Massachusetts', '(MI)Michigan', '(MN)Minnesota', '(MS)Mississippi', '(MO)Missouri',
      '(MT)Montana', '(NE)Nebraska', '(NV)Nevada', '(NH)New Hampshire', '(NJ)New Jersey',
      '(NM)New Mexico', '(NY)New York', '(NC)North Carolina', '(ND)North Dakota', '(OH)Ohio',
      '(OK)Oklahoma', '(OR)Oregon', '(PA)Pennsylvania', '(RI)Rhode Island', '(SC)South Carolina',
      '(SD)South Dakota', '(TN)Tennessee', '(TX)Texas', '(UT)Utah', '(VT)Vermont',
      '(VA)Virginia', '(WA)Washington', '(WV)West Virginia', '(WI)Wisconsin', '(WY)Wyoming'
    ],
    index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    var lastLanuage = app.globalData.lanuage
    // this.getContent(lastLanuage)
    app.getContent(that, lastLanuage)
    getAddress(that)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  showAddAddress: function() {
    let that = this
    that.setData({
      showmore: false,
      isAdd: true
    })
  },
  formSubmit: function(e) {
    let that = this
    var addressObj = e.detail.value
    var State = that.data.array[that.data.index]
    addressObj.state = State
    if (addressObj.City == '') {
      wx.showModal({
        content: that.data.content.city_err,
      })
      return
    }
    if (addressObj.Street == '') {
      wx.showModal({
        content: that.data.content.street_err,
      })
      return
    }
    if (addressObj.Zip == '') {
      wx.showModal({
        content: that.data.content.zipcode_err,
      })
      return
    }
    addressObj.is_default = that.data.is_default
    that.setData({
      isAdd: false
    })
    postAddress(that, addressObj)
  },
  switch1Change: function(e) {
    let that = this
    that.setData({
      is_default: e.detail.value
    })
  },
  getmore: function(e) {
    let that = this
    that.setData({
      showmore: !that.data.showmore,
      targetId: e.currentTarget.dataset.id
    })
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
})
var getAddress = function(that) {
  app.fetchApis(that, 'e/account/address', {}, 'GET', function(res) {
    console.log(res)
    that.setData({
      addresses: res.data.addresses
    })
  })
}
var postAddress = function(that, param) {
  app.fetchApis(that, 'e/account/address', param, 'POST', function(res) {
    console.log(res)
    getAddress(that)
  })
}