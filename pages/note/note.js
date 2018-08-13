//searchresult.js
const util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    info: [],
    msg: ""
  },
bgimg:function(e){
  wx.previewImage({
    current: '', // 当前显示图片的http链接
    urls: ['http://1.applecast.applinzi.com/static/qrcode.jpg'] // 需要预览的图片http链接列表
  })
}
})