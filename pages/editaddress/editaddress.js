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
  onLoad: function (options) {
    let that = this
    var lastLanuage = app.globalData.lanuage
    app.getContent(that, lastLanuage)
    var addObj = JSON.parse(options.addObj)
    const stateArry = that.data.array
    let index = that.data.array
    if(addObj.state){
      for(var i=0;i<stateArry.length;i++){
        if (addObj.state == stateArry[i]){
          index = i;
          break
        }
      }
    }
    that.setData({
      addObj: addObj,
      index:index
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  showAddAddress: function () {
    let that = this
    that.setData({
      showmore: false,
      isAdd: true
    })
  },
  formSubmit: function (e) {
    let that = this
    var addressObj = e.detail.value
    addressObj.state = that.data.array[that.data.index]
    console.log(addressObj)
    if (addressObj.city == '') {
      wx.showModal({
        content: that.data.content.city_err,
        confirmText: that.data.content.yes,
        cancelText: that.data.content.cancel
      })
      return
    }
    if (addressObj.state == '') {
      wx.showModal({
        content: that.data.content.state_err,
        confirmText: that.data.content.yes,
        cancelText: that.data.content.cancel
      })
      return
    }
    if (addressObj.street == '') {
      wx.showModal({
        content: that.data.content.street_err,
        confirmText: that.data.content.yes,
        cancelText: that.data.content.cancel
      })
      return
    }
    if (addressObj.zipcode == '') {
      wx.showModal({
        content: that.data.content.zipcode_err,
        confirmText: that.data.content.yes,
        cancelText: that.data.content.cancel
      })
      return
    }
    addressObj.is_default = that.data.is_default
    putAddress(that, addressObj)
  },
  switch1Change: function (e) {
    let that = this
    that.setData({
      is_default: e.detail.value
    })
  },
  getmore: function (e) {
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
var getAddress = function (that) {
  app.fetchApis(that, 'e/account/address', {}, 'GET', function (res) {
    console.log(res)
    that.setData({
      addresses: res.data.addresses
    })
  })
}
var putAddress = function (that, param) {
  app.fetchApis(that, 'e/account/address/'+that.data.addObj.id, param, 'PUT', function (res) {
    wx.navigateBack({
      detail:2
    })
  })
}