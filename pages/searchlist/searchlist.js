//logs.js
const util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    logs: [],
    namelist: [],
    idlist: [],
    list: [],
    msg: app.msg
  },

  onLoad: function() {},
  onShow: function(e) {
    var that = this
    this.setData({
      msg: app.msg
    })
    var msg = app.searchlist
    if (msg.substr(0, 6) == "return") {
      return
    }
    var logs = msg.split('*')
    this.setData({
      logs: logs
    })
    var namelist = new Array();
    var idlist = new Array();
    var plist = new Array();
    for (var x = 0; x < logs.length; x++) {
      var i1 = logs[x].indexOf(':')
      if (i1 > 0) {
        var list = logs[x].split(':')
        var name = list[0]
        var id = list[1]
        namelist.push(name)
        idlist.push(id)
        var p = new Object();
        p.name = name;
        p.id = id;
        plist.push(p);
      }
      this.setData({
        list: plist
      })
    }


  },


  bindtap: function(e) {
    var that = this
    var msg = e.currentTarget.dataset.id
    var i1 = msg.id.indexOf(')')
    var id = msg.id.substring(1, i1)
    wx.showLoading({
      title: 'Loading...',
    })
    wx.request({
      url: 'https://applecast.applinzi.com/searchlistnow/:' + id,
      success: function(res) {
        var msg = res.data
        var logs = msg.split('\n')
        app.msg = msg
        app.searchresult = msg
        wx.hideLoading()
        wx.reLaunch({
          url: '../searchresult/searchresult',
        })
      }
    })
  }
})