// pages/kaoqin/kaoqin.js//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    ygh: '',
    pwd: '',
    device: '',
    info_list: null,
    lastTapTime: 0,
    showAll: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    daka: async function () {
      if (!this.ygh) {
        wx.showToast({
          title: 'X 请输入员工号',
          icon: 'none'
        })
        return false;
      }
      wx.showLoading({
        title: '打卡中...',
      })
      var that = this;
      let jsonData = await this.GetJsonData()
      if (jsonData == null) {
        wx.showToast({
          title: '没有找到您的信息！',
          icon: "none"
        })
        return false
      }
      await wx.request({
        url: 'https://kaoqin.wanji.net.cn/api/system/login',
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify(jsonData),
        success(res) {
          wx.hideLoading()
          if (res.data.msgCode === 200) {
            var punchSite = that.GetPunchSite();
            var da = {
              "data": {
                "longitude": that.GetLongitude(),
                "latitude": that.GetLatidude(),
                "punchSite": punchSite,
                "punchWay": 2,
                "employeeId": res.data.content.body.employeeId.valueId,
                "extUserDevice": res.data.content.body.openId
              }
            }
            wx.request({
              url: 'https://kaoqin.wanji.net.cn/api/workforce/mobileAttendance',
              method: 'POST',
              dataType: 'json',
              data: JSON.stringify(da),
              header: {
                "X-Token": res.data.content.body.token
              },
              success(res) {
                if (res.data.content.body.msgText === "success") {
                  wx.showToast({
                    title: '打卡成功!',
                    icon: 'success',
                    duration: 2000
                  })
                  const db = wx.cloud.database();
                  db.collection('check').add({
                    data: {
                      username: app.globalData.userInfo.nickName,
                      topic: '打卡成功！员工号：' + that.ygh + ',地址：' + punchSite,
                      avatarUrl: app.globalData.userInfo.avatarUrl,
                      createDate: util.formatTime(new Date())
                    },
                    success: res => {
                      that.loadData()
                    },
                    fail: res => {
                      console.log(err)
                    }
                  })
                }
              }
            })
          } else {
            wx.showToast({
              title: '登录异常！',
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail() {
          wx.hideLoading({
            success: (res) => {
              wx.showToast({
                title: '打卡失败！！！',
                duration: 3000,
                icon: 'none'
              })
            },
          })
        }
      })
    },
    async GetJsonData() {
      var json = {
        data: {
          "company": "wanji",
          "username": this.ygh,
          "password": this.pwd,
          "source": 5,
          "openId": this.device
        }
      };
      json = await this.getInfo(this.ygh)
      if (json) {
        return json;
      } else {
        return null
      }
    },
    async getInfo(code) {
      const db = wx.cloud.database();
      let res = await db.collection("info").where({
        username: code
      }).get()
      if (res.data.length != 0) {
        let json = {
          data: {
            "company": res.data[0].company,
            "username": res.data[0].username,
            "password": res.data[0].password,
            "source": res.data[0].source,
            "openId": res.data[0].openId
          }
        }
        return json
      } else {
        return null
      }
    },
    yghInput(e) {
      this.ygh = e.detail.value
    },
    GetLongitude() {
      return String(116.295660 + Math.random() * 0.0001).substring(0, 10)
    },
    GetLatidude() {
      return String(40.049682 + Math.random() * 0.0001).substring(0, 10)
    },
    GetPunchSite() {
      var sites = ["北京市海淀区上地街道首创空间中关村软件园(软件园三号路)",
        "北京市海淀区上地街道软件园二号路中关村软件园(软件园三号路)",
        "北京市海淀区上地街道百家云双师课堂中关村软件园(软件园三号路)",
        "北京市海淀区上地街道软件园四号路中关村软件园(软件园三号路)",
        "北京市海淀区上地街道首创空间中关村软件园(软件园三号路)",
        "北京市海淀区上地街道软件园二号路中关村软件园(软件园三号路)",
        "北京市海淀区上地街道百家云双师课堂中关村软件园(软件园三号路)",
        "北京市海淀区上地街道软件园四号路中关村软件园(软件园三号路)",
        "北京市海淀区上地街道软件园四号路中关村软件园(软件园三号路)",
        "北京市海淀区上地街道首创空间中关村软件园(软件园三号路)"
      ];
      return sites[Math.floor(Math.random() * 10)];
    },
    onLoad: function () {
      wx.showToast({
        title: '欢迎使用签到打卡！',
        icon: 'none',
        duration: 1500,
        mask: true
      });
      this.loadData();
    },
    loadData: function () {
      const db = wx.cloud.database();
      db.collection("check").orderBy('createDate', 'desc').where({
        _openid: app.globalData.openId
      }).get().then(res => {
        this.setData({
          info_list: res.data
        })
      })
    },
    delete: function (e) {
      const db = wx.cloud.database();
      try {
        db.collection('check').where({
          _id: e.target.id
        }).remove().then(res => {
          if (res.stats.removed > 0) {
            wx.showToast({
              title: '删除成功!',
              icon: 'none',
              mask: true,
              duration: 1500
            })
            this.loadData()
          } else {
            wx.showToast({
              title: '无权限删除他人信息!',
              icon: 'none',
              mask: true
            })
          }
        })
      } catch (e) {
        wx.showToast({
          title: '删除异常!',
          icon: 'none'
        })
      }
    },
    // ListTouch触摸开始
    ListTouchStart(e) {
      this.setData({
        ListTouchStart: e.touches[0].pageX
      })
    },

    // ListTouch计算方向
    ListTouchMove(e) {
      this.setData({
        ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
      })
    },

    // ListTouch计算滚动
    ListTouchEnd(e) {
      if (this.data.ListTouchDirection == 'left') {
        this.setData({
          modalName: e.currentTarget.dataset.target
        })
      } else {
        this.setData({
          modalName: null
        })
      }
      this.setData({
        ListTouchDirection: null
      })
    },
    doubleClick(e) {
      var curTime = e.timeStamp
      var lastTime = e.currentTarget.dataset.time // 通过e.currentTarget.dataset.time 访问到绑定到该组件的自定义数据
      if (curTime - lastTime > 0) {
        if (curTime - lastTime < 300) { //是双击事件
          if (this.showAll != false) {
            const db = wx.cloud.database();
            db.collection("check").orderBy('createDate', 'desc').get().then(res => {
              this.setData({
                info_list: res.data
              })
            })
            this.showAll = false
          } else {
            this.loadData()
            this.showAll = true
          }
        }
      }
      this.setData({
        lastTapTime: curTime
      })
    }
  }
})