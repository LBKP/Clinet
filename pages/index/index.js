//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLogin_ClientNeedLogin_LC:function(message){
    Console.log('need login')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    wx.connectSocket({
      url: 'wss://www.laobiaokuaipao.xyz:8000',
    })
    wx.onSocketOpen(function () {
      console.log('Connected the gateway');
    })
    var protoc = require("./../../message/protocBuffer.js")
    protoc.setCallBack("Login.ClientNeedLogin_LC", function (message){
      console.log("received a message")
        wx.login({
            success(res) {
                if (res.code) {
                    console.log(res.code)
                    var payloda = { Code: res.code, SessionId: "" }
                    var message = protoc.createMessage("Login.ClientLogin_CL")
                    var buf = message.encode(payloda).finish()
                    console.log(buf)
                    protoc.sendMessage(1, "Login.ClientLogin_CL", buf)
                } else {
                    console.log("error")
                }
            }

        })
    })
    wx.onSocketMessage(function (res) {
      
      protoc.receiveMessage(res.data)
      
      //fixme
      //var newname = nameArrer.replace("." ,"_")
     // console.log(nameArrer+'  '+newname)
      //eval('on' + newname+'('+deMessage+')')
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
