// pages/favorite.js
const util = require('../../utils/util.js')

var app = getApp()
Page({
  data: {
    logs: [],
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var logs = wx.getStorageSync('favoritelist') || []
    this.setData({
      logs: logs
    })
     if(logs.length<=0){
      return
    }
    var list = util.log2list(logs)
    this.setData({
      list: list
    })
  },
  onShow: function () {
    var logs = wx.getStorageSync('favoritelist') || []
    this.setData({
      logs: logs
    })
    if (logs.length <= 0) {
      return
    }
    var list = util.log2list(logs)
    this.setData({
      list: list
    })
  },
  bindtap: function(e) {
    var that = this
    var id = e.currentTarget.dataset.msg.id
    var f1 = id.indexOf(')')
    id = id.substring(1, f1)
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
      },
      fail:function(res){
        wx.hideLoading()
        wx.showToast({
          title: '网络连接异常！',
        })
      }
    })
  },
  bindcancel: function(e) {
    var that = this
    var index = e.currentTarget.dataset.msg
    var logs = this.data.logs
    logs.splice(index, 1)
    var list = util.log2list(logs)
    this.setData({
      logs: logs,
      list: list
    })
    wx.setStorageSync('favoritelist', logs)
  },

})