//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Welcome to Transfer Grass!',
    motto_cn: '欢迎来到转运草！',
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: true,
    openId: {}
  },
  //事件处理函数
  bindViewTap: function () {
    wx.showModal({
      title: '转运草',
      content: '欢迎光临转运草，在这里您将获得运气加成哦！',
      success(res) {
        var t = '恭喜您获得了今日运气'
        if (res.confirm) {
          t = '恭喜您获得了今日运气' + Math.floor(Math.random() * (1 - 100) + 100);
        } else {
          t = '您丢失了今日运气' + Math.floor(Math.random() * (1 - 100) + 100);
        }
        wx.showToast({
          title: t,
          icon: 'none'
        })
      },
      fail(res) {
        wx.showToast({
          title: '领取幸运值异常',
          icon: 'none'
        })
      }
    })
  },
  translate: function () {
    wx.navigateTo({
      url: '../googletranslate/googletranslate'
    })
  },
  database: function () {
    if (this.data.userInfo && this.data.userInfo.nickName && this.data.userInfo.nickName != "微信用户" && this.data.userInfo.nickName != "") {
      wx.navigateTo({
        url: '../database/database'
      })
    } else {
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          app.globalData.userInfo = res.userInfo
          wx.cloud.callFunction({
            name: 'openid',
            success: res => {
              app.globalData.openId = res.result.userInfo.openId
              wx.navigateTo({
                url: '../database/database'
              })
            },
            fail: res => {
              console.log(res)
            },
            complete: () => {
            }
          })
        }
      })
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
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        app.globalData.userInfo = res.userInfo
      }
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
  },
  kaoqin: function () {
    if (this.data.userInfo && this.data.userInfo.nickName && this.data.userInfo.nickName != "微信用户" && this.data.userInfo.nickName != "") {
      wx.navigateTo({
        url: '../kaoqin/kaoqin'
      })
    } else {
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          app.globalData.userInfo = res.userInfo
          wx.cloud.callFunction({
            name: 'openid',
            success: res => {
              app.globalData.openId = res.result.userInfo.openId
              wx.navigateTo({
                url: '../kaoqin/kaoqin'
              })
            },
            fail: res => {
              console.log(res)
            },
            complete: () => {
            }
          })
        }
      })
    }
  }
})