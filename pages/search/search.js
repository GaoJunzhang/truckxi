var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inpuVal: "", //input框内值
    listarr: [], //创建数组home
    keydown_number: 0, //检测input框内是否有内容
    input_value: "", //value值
    hostarr: [], //热门搜索接收请求存储数组  
    name_focus: true //获取焦点
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    var lastLanuage = app.globalData.lanuage
    // this.getContent(lastLanuage)
    app.getContent(that, lastLanuage)
    //读取缓存历史搜索记录
    getProducts(that)
    wx.getStorage({
      key: 'list_arr',
      success: function(res) {
        that.setData({
          listarr: res.data
        })
      }
    })
  },

  //取值input判断输入框内容修改按钮
  inputvalue: function(e) {
    this.setData({
      inputVal: e.detail.value
    })
    if (e.detail.cursor != 0) {
      this.setData({
        // SearchText: "搜索",
        keydown_number: 1
      })
    } else {
      this.setData({
        // SearchText: "取消",
        keydown_number: 0
      })
    }
  },
  //点击赋值到input框
  this_value: function(e) {
    let that = this
    that.setData({
      name_focus: true
    })
    let value = e.currentTarget.dataset.text;
    that.setData({
      input_value: value,
      // SearchText: "搜索",
      keydown_number: 1
    })
    let param = {
      search: value
    }
    getProducts(that, param)
  },

  search: function() {
    let that = this;
    let param = {
      search: that.data.inputVal
    }
    getProducts(that, param)
    if (that.data.keydown_number == 1) {
      //把获取的input值插入数组里面
      let arr = that.data.listarr;
      console.log(that.data.inputVal)
      console.log(that.data.input_value)
      //判断取值是手动输入还是点击赋值
      if (that.data.input_value == "") {
        // console.log('进来第er个')
        // 判断数组中是否已存在
        let arrnum = arr.indexOf(that.data.inputVal);
        console.log(arr.indexOf(that.data.inputVal));
        if (arrnum != -1) {
          // 删除已存在后重新插入至数组
          arr.splice(arrnum, 1)
          arr.unshift(that.data.inputVal);

        } else {
          arr.unshift(that.data.inputVal);
        }

      } else {
        let arr_num = arr.indexOf(that.data.input_value);
        console.log(arr.indexOf(that.data.input_value));
        if (arr_num != -1) {
          arr.splice(arr_num, 1)
          arr.unshift(that.data.input_value);
        } else {
          arr.unshift(that.data.input_value);
        }

      }
      //存储搜索记录
      wx.setStorage({
        key: "list_arr",
        data: arr
      })
      //取出搜索记录
      wx.getStorage({
        key: 'list_arr',
        success: function(res) {
          that.setData({
            listarr: res.data
          })
        }
      })
      
      that.setData({
        input_value: '',
      })
    } else {
      console.log("取消")
    }
  }
})

var getProducts = function(that, param) {
  wx.showLoading({
    title: that.data.content.loading,
    mask:true
  })
  wx.request({
    url: app.globalData.API_URL + 'e/product/',
    data: param,
    success: function(res) {
      wx.hideLoading()
      console.log(res.data.products)
      that.setData({
        productArry: res.data.products
      })
    }
  })
}