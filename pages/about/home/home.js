//获取应用实例
const app = getApp()
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    starCount: 0,
    forksCount: 0,
    visitTotal: 0,
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: true,
    openId: {}
  },
  attached() {
    let that = this;
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })
    let i = 0;
    numDH();

    function numDH() {
      if (i < 20) {
        setTimeout(function () {
          that.setData({
            starCount: i,
            forksCount: i,
            visitTotal: i
          })
          i++
          numDH();
        }, 20)
      } else {
        that.setData({
          starCount: that.coutNum(16785),
          forksCount: that.coutNum(6325),
          visitTotal: that.coutNum(96570)
        })
      }
    }
    let info = wx.getStorageSync('userInfo')
    let openid = wx.getStorageSync('openId')
    if (info.length != 0 && openid.length != 0) {
      this.setData({
        userInfo: info,
        openId: wx.getStorageSync('userId'),
        hasUserInfo: true
      })
      app.globalData.userInfo = info
      app.globalData.openId = openid
    }else{
    }
    wx.hideLoading()
  },
  methods: {
    coutNum(e) {
      if (e > 1000 && e < 10000) {
        e = (e / 1000).toFixed(1) + 'k'
      }
      if (e > 10000) {
        e = (e / 10000).toFixed(1) + 'W'
      }
      return e
    },
    CopyLink(e) {
      wx.setClipboardData({
        data: e.currentTarget.dataset.link,
        success: res => {
          wx.showToast({
            title: '已复制',
            duration: 1000,
          })
        }
      })
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
    showQrcode() {
      wx.previewImage({
        urls: ['https://7472-transitgrass-5g928kmqdfe8e7a5-1258975863.tcb.qcloud.la/images/zanshang.png'],
        current: 'https://7472-transitgrass-5g928kmqdfe8e7a5-1258975863.tcb.qcloud.la/images/zanshang.png' // 当前显示图片的http链接      
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
            wx.setStorage({
              data: res.userInfo,
              key: 'userInfo',
            })
            wx.cloud.callFunction({
              name: 'openid',
              success: res => {
                app.globalData.openId = res.result.userInfo.openId
                wx.setStorage({
                  data: res.result.userInfo.openId,
                  key: 'openId',
                })
                wx.navigateTo({
                  url: '../kaoqin/kaoqin'
                })
              },
              fail: res => {
                console.log(res)
              },
              complete: () => {}
            })
          }
        })
      }
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
            wx.setStorage({
              data: res.userInfo,
              key: 'userInfo',
            })
            wx.cloud.callFunction({
              name: 'openid',
              success: res => {
                app.globalData.openId = res.result.userInfo.openId
                wx.setStorage({
                  data: res.result.userInfo.openId,
                  key: 'openId',
                })
                wx.navigateTo({
                  url: '../database/database'
                })
              },
              fail: res => {
                console.log(res)
              },
              complete: () => {}
            })
          }
        })
      }
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
  },
})