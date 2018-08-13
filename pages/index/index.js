//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    sayhi: '你好，guest',
    tab: 0,
    loading: false,
    userInfo: {},
    inputValue: '',
    testtext: '',
    url: '',
    rundata: 'rundata',
    id1: '',
    id2: '',
    name: '',
    date: '',
    orbittype: '0',
    news_pic: '',
    news_text: '',
    news_width: 0,
    orbititems: [{
        name: '全部',
        value: '0',
        checked: 'true'
      },
      {
        name: '同步轨道',
        value: '1'
      },
      {
        name: '非同步轨道',
        value: '2'
      },
    ],
    msg: 'msg....',
    gdata: app.globalData.msg
  },
  tab_slide: function(e) { //滑动切换tab 
    var that = this;
    that.setData({
      tab: e.detail.current
    });
  },
  tab_click: function(e) { //点击tab切换
    var that = this;
    if (that.data.tab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        tab: e.target.dataset.current
      })
    }
  },

  bindID1: function(e) {
    this.setData({
      id1: e.detail.value
    })
  },
  bindName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },

  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  radioChange: function(e) {
    this.setData({
      orbittype: e.detail.value
    })
  },

  lookup: function(e) {
    var that = this
    if (this.data.tab == 0) {
      this.setData({
        msg: ':' + this.data.id1
      })
      app.msg = this.data.msg
      if(this.data.id1=='666'){
        wx.reLaunch({
          url: '../searchresult/searchresult?flag=six',
        })
        return
      }
      this.setData({
        loading: true
      })
      wx.request({
        url: 'https://applecast.applinzi.com/searchlist/' + app.msg,
        success: function(res) {
          var msg = res.data
          var logs = msg.split('\n')
          app.msg = msg
          app.searchresult = msg
          that.setData({
            loading: false
          })
          if (msg.substr(0, 6) == 'return') {
            wx.showToast({
              title: '未找到对应的航天器......',
            })
          } else {
            wx.reLaunch({
              url: '../searchresult/searchresult',
            })
          }
        }
      })
    } else {
      var name = this.data.name
      if(name=='gps'){
        name = 'navstar'
      }
      this.setData({
        msg: '=' + name + '=' + this.data.date + '=' + this.data.orbittype + '='
      })
      if(this.data.name=='diablo'){
        wx.reLaunch({
          url: '../searchresult/searchresult?flag=diablo',
        })
        return
      }
      app.msg = this.data.msg
      this.setData({
        loading: true
      })
      wx.request({
        url: 'https://applecast.applinzi.com/searchlist/' + app.msg,
        success: function(res) {
          var msg = res.data
          var logs = msg.split('\n')
          app.msg = msg
          app.searchlist = msg
          that.setData({
            loading: false
          })
          wx.switchTab({
            url: '../searchlist/searchlist',
          })

        }
      })
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.switchTab({
      url: '/logs'
    })
  },
  onLoad: function() {
    var that = this
    var width = 0
    var heigth = 0
wx.setTopBarText({
  text: 'top text',
})
    wx.getSystemInfo({
      success: function (res) {
        width = res.windowWidth
        heigth = res.windowHeight
      }
    })
    this.setData({
      news_width: width - 176
    })
    wx.request({
      url: 'https://applecast.applinzi.com/shownews',
      success:function(res){
        var msg = res.data
        var logs = msg.split('==')
        that.setData({
          news_pic: logs[0],
          news_text: logs[1]
        })
      }
    })
  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindDateCancel: function(e) {
    this.setData({
      date: ''
    })
  },
  bindnote: function(e) {
    wx.navigateTo({
      url: '../../pages/note/note',
    })
  },
  onReady: function() {
    // Do something when pull down.

    this.setData({
      sayhi: 'Set some data for updating view.'
    })

  },
  tappics:function(res){
    var pic = this.data.news_pic
    wx.previewImage({
      urls: [pic],
    })
  },
  onShareAppMessage: function() {
    return {
      title: '询星',
      desc: '实时查询在轨航天器轨道数据',
      path: '/page/index/index'
    }
  }
})