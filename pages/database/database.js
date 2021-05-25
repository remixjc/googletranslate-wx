// pages/database/database.js
var util = require('../../utils/util.js');
//获取应用实例
const app = getApp()
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
    topic: '',
    info_list: null,
    lastTapTime: 0,
    showAll: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 插入方法
     */
    insert: function () {
      if (!this.data.topic) {
        wx.showToast({
          title: 'X 请输入留言内容！',
          icon: 'none'
        })
        return;
      }
      const db = wx.cloud.database();
      db.collection('counters').add({
        data: {
          username: app.globalData.userInfo.nickName,
          topic: this.data.topic,
          avatarUrl: app.globalData.userInfo.avatarUrl,
          createDate: util.formatTime(new Date())
        },
        success: res => {
          this.setData({
            topic: null
          })
          wx.showToast({
            title: '留言成功',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
          this.loadData();
        },
        fail: res => {
          console.log(err)
        }
      })
    },

    textareaInput(e) {
      this.setData({
        topic: e.detail.value
      })
    },
    onLoad: function () {
      wx.showToast({
        title: '欢迎来留言',
        icon: 'succes',
        duration: 1000,
        mask: true
      });
      this.loadData();
    },
    /**
     * 加载留言
     */
    loadData: function () {
      const db = wx.cloud.database();
      db.collection("counters").orderBy('createDate', 'desc').where({

      }).get().then(res => {
        this.setData({
          info_list: res.data
        })
      })
    },
    delete: function (e) {
      const db = wx.cloud.database();
      try {
        db.collection('counters').where({
          _id: e.target.id
        }).remove().then(res => {
          if (res.stats.removed > 0) {
            wx.showToast({
              title: '删除成功!',
              icon: 'none',
              mask: true
            })
            this.loadData()
          } else {
            wx.showToast({
              title: '无权限删除他人留言!',
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
            db.collection("counters").orderBy('createDate', 'desc').get().then(res => {
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