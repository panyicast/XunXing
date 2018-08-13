// pages/moreinfo/moreinfo.js
var app = getApp()
const util = require('../../utils/util.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    text: [],
    name: '',
    width: 0,
    height: 0,
    fail: false
  },
  onLoad: function(options) {
    var width = 0
    var height = 0
    wx.getSystemInfo({
      success: function(res) {
        width = res.windowWidth
        height = res.windowHeight
      }
    })
    this.setData({
      width: width,
      height: height
    })
    console.log(options)
    var home_url = 'https://applecast.applinzi.com/gunterinfo/' + options.id
    wx.setNavigationBarTitle({
      title: '载入较慢，请稍候...'
    })
    wx.showNavigationBarLoading()
    var that = this
    wx.request({
      url: home_url,
      success: function(res) {
        wx.hideNavigationBarLoading()
        var url = ''
        var text = ''
        if (res.data) {
          var msg = res.data.split('===')
          if (msg[0]) {
            url = msg[0]
            if (url.substr(0, 4) != 'http') {
              wx.setNavigationBarTitle({
                title: '载入失败，请稍后重试'
              })
              return
            }
          }
          if (msg[1]) {
            text = msg[1].split(/<.*?>/)
          }
          wx.setNavigationBarTitle({
            title: '航天器简介'
          })
          that.setData({
            url: url,
            text: text,
            name: app.name
          })
        }
      },
      fail: function(e) {
        wx.hideNavigationBarLoading()
        wx.setNavigationBarTitle({
          title: '载入失败，请稍后重试'
        })
        that.setData({
          fail: true
        })
      }
    })
  },
  parsedata: function(data) {
    var msg = data.split('==')
    var url = ''
    var text = ''
    if (msg[0]) {
      url = msg[0]
      console.log(url)
    }
    if (msg[1]) {
      text = msg[1].replace(/<.*?>/g, '')
      console.log(text)
    }
    return [url, text]
  },
})