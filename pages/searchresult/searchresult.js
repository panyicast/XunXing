//searchresult.js
const util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    info: [],
    msg: app.msg,
    name: '',
    id: '',
    nid: '',
    para: '',
    icon: '../../img/black_favorites.png',
    flag: false,
    diablo: false,
    six: false,
    lonlist: [],
    latlist: [],
    longnow: [],
    latnow: [],
    satnum: 0,
    color: ['Red', 'Brown', 'DeepPink', 'DarkViolet', 'Gold', 'Green', 'Purple', 'Coral'],
    linecolor: ['SpringGreen', 'Purple', 'Coral', 'Red', 'Brown', 'DeepPink', 'DarkViolet', 'Gold']
  },
  onLoad: function(e) {
    var tag = e.flag
    this.setData({
      msg: app.msg
    })
    if (tag == 'diablo') {
      this.setData({
        diablo: true
      })
      return
    }
    if (tag == 'six') {
      this.setData({
        six: true
      })
      return
    }
    if (e.flag) {
      var id = e.flag
      wx.showToast({
        title: id,
      })
      var f1 = id.indexOf(')')
      id = id.substring(1, f1)
      wx.showLoading({
        title: 'Loading...',
      })
      that = this
      wx.request({
        url: 'https://applecast.applinzi.com/searchlistnow/:' + id,
        success: function(res) {
          var msg = res.data
          var logs = msg.split('\n')
          app.msg = msg
          app.searchresult = msg
          wx.hideLoading()
          that.setData({
            nid: id
          })
          wx.reLaunch({
            url: '../searchresult/searchresult',
          })
        }
      })
    }
    var that = this
    var msg = app.searchresult
    if (!msg) {
      return
    }
    var info = msg.split('\n')
    var ss = info[0].split('=')
    var name = ss[0].substring(5, ss[0].length)
    var id = ss[1]
    //undefined is not an object (evaluating '(s=o[1]).indexOf');at pages/searchresult/searchresult page lifeCycleMethod onLoad function
    var f1 = id.indexOf(')')
    var nid = id.substring(1, f1)
    var index = msg.indexOf('\n')
    var name = msg.split('\n')[0].slice(5)
    var logs = wx.getStorageSync('favoritelist') || []
    if (!logs.includes(name)) {
      this.setData({
        flag: false,
        icon: '../../img/black_favorites.png'
      })
    } else {
      this.setData({
        flag: true,
        icon: '../../img/orange_favorites.png'
      })
    }
    name = ss[0].substring(5, ss[0].length)
    this.setData({
      msg: app.msg,
      info: info,
      name: name,
      id: id,
      nid: nid,
      para: msg.substring(index, msg.length)
    })
    this.getorbit(nid)
    
  },
  getorbit: function(nid) {
    var that = this
    var lonlist = []
    var latlist = []
    var nlonlist = this.data.lonlist
    var nlatlist = this.data.latlist
    var nlongnow = this.data.longnow
    var nlatnow = this.data.latnow
    var num = this.data.satnum
    wx.request({
      url: 'https://applecast.applinzi.com/position/' + nid,
      success: function(res) {
        var msg = res.data.split('==')
        var now = msg[0]
        var lon = msg[1]
        var lat = msg[2]
        var longnow = now.replace('[', '').replace(']', '').split(',')[0]
        var latnow = now.replace('[', '').replace(']', '').split(',')[1]
        lonlist = lon.replace('[', '').replace(']', '').split(',')
        latlist = lat.replace('[', '').replace(']', '').split(',')
        nlonlist[num] = lonlist
        nlatlist[num] = latlist
        nlongnow[num] = longnow
        nlatnow[num] = latnow
        num += 1
        that.setData({
          lonlist: nlonlist,
          latlist: nlatlist,
          longnow: nlongnow,
          latnow: nlatnow,
          satnum: num
        })
        that.drawconvas()
      }
    })
  },

  addFavorite: function(e) {
    var msg = this.data.msg
    var i1 = msg.indexOf('=')
    if (i1 < 0) {
      return
    }
    var name = msg.split('\n')[0].slice(5)
    var logs = wx.getStorageSync('favoritelist') || []
    if (!logs.includes(name)) {
      logs.unshift(name)
      wx.setStorageSync('favoritelist', logs)
      this.setData({
        flag: true,
        icon: '../../img/orange_favorites.png'
      })
      wx.showToast({
        title: '已加入收藏！',
      })
    } else {
      var index = logs.indexOf(name)
      logs.splice(index, 1);
      wx.setStorageSync('favoritelist', logs)
      this.setData({
        flag: false,
        icon: '../../img/black_favorites.png'
      })
      wx.showToast({
        title: '已取消收藏！',
      })
    }

  },
  onShareAppMessage: function() {
    var that = this
    return {
      title: '航天器轨道数据分享',
      desc: that.data.name,
      path: '/pages/searchresult/searchresult?flag=' + this.data.id
    }
  },
  onReady: function() {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function() {
    // 生命周期函数--监听页面显示

  },
  drawconvas: function() {
    var width = 0
    var heigth = 0

    wx.getSystemInfo({
      success: function(res) {
        width = res.windowWidth
        heigth = res.windowHeight
      }
    })
    console.log('width', width)
    var num = this.data.satnum
    const ctx = wx.createCanvasContext('myCanvas')
    ctx.drawImage('../../img/WhiteOnBlue.png', 0, 0, width, width / 2)
    for (var n = 0; n < num; n++) {
      var lonlist = this.data.lonlist[n]
      var latlist = this.data.latlist[n]
      var k1 = width / 360.0
      var k2 = width / 2.0 /180
      for (var i = 0; i < lonlist.length; i++) {
        lonlist[i] = lonlist[i] * k1 + width / 2
        latlist[i] = -latlist[i] * k2 + width / 4
      }
      var length = lonlist.length
      var longnow = this.data.longnow[n] * k1 + width / 2
      var latnow = -this.data.latnow[n] * k2 + width / 4
      ctx.arc(longnow, latnow, 5, 0, 2 * Math.PI)
      ctx.setFillStyle(this.data.color[n])
      ctx.fill()
      var d = 5.0
      ctx.moveTo(lonlist[0], latlist[0])
      for (var i = 1; i < lonlist.length; i++) {
        if (lonlist[i - 1] < width / d && lonlist[i] > width / d * (d-1) ){
          ctx.moveTo(lonlist[i], latlist[i])
        } else if (lonlist[i - 1] > width / d * (d - 1) && lonlist[i] < width / d) {
          ctx.moveTo(lonlist[i], latlist[i])
        } else {
          ctx.lineTo(lonlist[i], latlist[i])
        }
        // ctx.arc(lonlist[i], latlist[i], 5, 0, 2 * Math.PI)
      }
      ctx.setStrokeStyle(this.data.linecolor[n])
      ctx.stroke()
    }
    ctx.draw()
  },
  refreshtap: function(e) {
    console.log('refreshtap')
    var that = this
    var lonlist = []
    var latlist = []
    wx.showLoading({
      title: 'Loading...',
    })
    wx.request({
      url: 'https://applecast.applinzi.com/position/' + this.data.nid,
      success: function(res) {
        var msg = res.data.split('==')
        var now = msg[0]
        var lon = msg[1]
        var lat = msg[2]
        var longnow = now.replace('[', '').replace(']', '').split(',')[0]
        var latnow = now.replace('[', '').replace(']', '').split(',')[1]
        lonlist = lon.replace('[', '').replace(']', '').split(',')
        latlist = lat.replace('[', '').replace(']', '').split(',')
        that.setData({
          lonlist: lonlist,
          latlist: latlist,
          longnow: longnow,
          latnow: latnow
        })
        that.drawconvas()
        wx.hideLoading()
      }
    })
  },
  tapinfo: function(e) {
    app.name = this.data.name
    wx.navigateTo({
      url: "/pages/moreinfo/moreinfo?id=" + this.data.nid
    })
  },
  bindaddmore:function(e){
    var logs = wx.getStorageSync('favoritelist') || []
    console.log(logs)
    var that = this
    var list = util.log2list(logs)
    if(logs){
      wx.showActionSheet({
        itemList: logs,
        success: function (res) {
          console.log(res.tapIndex)
          var nid = list[res.tapIndex].nid
          that.getorbit(nid)
        },
      })
    }
  }
})