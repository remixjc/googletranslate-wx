//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Welcome to Transfer Grass!',
    motto_cn: '欢迎来到转运草！',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  translate: function () {
    wx.navigateTo({
      url: '../googletranslate/googletranslate'
    })
  },
  database: function () {
    if (app.globalData.userInfo) {
      wx.navigateTo({
        url: '../database/database'
      })
    }else{
      wx.showToast({
        title: '请点击登录',
        icon: 'error',
        duration: 1500,
        mask: true
      });
    }
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  github: function () {
    wx.showModal({
      title: 'Github项目地址，是否复制？',
      content: 'https://github.com/remixjc/googletranslate-wx',
      success: function (res) {
        if (res.confirm) {
          wx.setClipboardData({
            data: "https://github.com/remixjc/googletranslate-wx",
            success: function (res) {
              wx.showToast({
                title: '复制成功',
                icon: 'succes',
                duration: 1000,
                mask: true
              })
            }
          })
        } else if (res.cancel) {
          wx.showToast({
            title: '取消复制',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
        }
      }
    })
  }
})