
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
var init

Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: 0, //录音时长
    duration: 60000, //录音最大值ms 60000/10分钟
    tempFilePath: "", //音频路径
    status: 0, //录音状态 0:未开始录音 1:正在录音 2:暂停录音 3:已完成录音
    playStatus: 0, //录音播放状态 0:未播放 1:正在播放
  },

  clickMe: function () {
    var i, j, res = '';
    for (j = 0; j < 10; j++) {
      i = (Math.random()).toFixed(0)
      i = (Math.random() * 10).toFixed(0)
      res += i;
    }
    this.setData({ msg: res })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  /**开始录音 */
  start: function () {
    clearInterval(init) //清除定时器
    // 监听音频开始事件
    recorderManager.onStart((res) => {
      console.log('recorder start')
      this.setData({
        status: 1
      })
    })

    //监听录音自动结束事件(如果不加，录音时间到最大值自动结束后，没获取到录音路径将无法正常进行播放)
    recorderManager.onStop((res) => {
      console.log('recorder stop', res)
      this.setData({
        tempFilePath: res.tempFilePath,
        status: 3
      })
      this.recordingTimer(this.data.time)
    })

    const options = {
      duration: this.data.duration, //指定录音的时长，单位 ms
      sampleRate: 16000, //采样率
      numberOfChannels: 1, //录音通道数
      encodeBitRate: 96000, //编码码率
      format: 'wav', //音频格式，有效值 aac/mp3
      frameSize: 50, //指定帧大小，单位 KB
    }
    this.recordingTimer()
    recorderManager.start(options)
  },

  /**
   * 暂停录音
   */
  pause: function () {
    recorderManager.onPause(() => {
      console.log('recorder pause')
      this.setData({
        status: 2
      })
    })
    this.recordingTimer(this.data.time)
    recorderManager.pause()
  },

  /**
   * 继续录音
   */
  continue: function () {
    this.setData({
      status: 1
    })
    this.recordingTimer()
    recorderManager.resume()
  },

  /**
   * 停止录音
   */
  stop: function () {
    recorderManager.onStop((res) => {
      console.log('recorder stop', res)
      this.setData({
        tempFilePath: res.tempFilePath,
        status: 3
      })
      
    })
    this.recordingTimer(this.data.time)
    recorderManager.stop()

  },
  //上传录音
  upload:function(){
    if(this.data.status==3)
    {
      this.setData({
        status:3
      })
    }
    var that = this
    wx.showModal({
      title: "上传录音",
      content: "是否上传录音",
      success(res) {
        wx.uploadFile({
          url: 'http://127.0.0.1/test.php',
          filePath: tempFilePath,
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data"
          },
          //参数绑定
          formData: {
            recordingtime: that.data.recordingTimeqwe,
            topicid: that.data.topicid,
            userid: 1,
            praisepoints: 0
          },
          success: function (ress) {
            console.log(res);
            wx.showToast({
              title: '录音已上传',
              icon: 'success',
              duration: 2000
            })
            innerAudioContext.stop()
          },
          fail: function (ress) {
            console.log("录音保存失败");
          }

        })
      }
    })
  },

  /**
   * 播放录音
   */
  play: function () {
    //音频地址
    innerAudioContext.src = this.data.tempFilePath
    //在ios下静音时播放没有声音，默认为true，改为false就好了。
    innerAudioContext.obeyMuteSwitch = false

    //点击播放
    if (this.data.playStatus == 0) {
      this.setData({
        playStatus: 1
      })
      innerAudioContext.play()
    }
    // //播放结束
    innerAudioContext.onEnded(() => {
      innerAudioContext.stop()
      this.setData({
        playStatus: 0
      })
    })
  },

  //录音计时器
  recordingTimer: function (time) {
    var that = this
    if (time == undefined) {
      //将计时器赋值给init
      init = setInterval(function () {
        var time = that.data.time + 1;
        that.setData({
          time: time
        })
      }, 1000);
    } else {
      clearInterval(init)
      console.log("暂停计时")
    }
  },

  /**
   * 重新录制
   */
  reset: function () {
    var that = this
    wx.showModal({
      title: "重新录音",
      content: "是否重新录制",
      success(res) {
        if (res.confirm) {
          that.setData({
            time: 0, //录音时长
            tempFilePath: "", //音频路径
            status: 0,
            playStatus: 0
          })
          innerAudioContext.stop()
        }
      }
    })
  }
})