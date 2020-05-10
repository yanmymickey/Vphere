Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    wx.request({
      url: '',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data)

        that.setData({
          list: res.data.data
        })
      },
    })
  },


})