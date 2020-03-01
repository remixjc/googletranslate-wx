// pages/database/database.js
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
    topic: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 插入方法
     */
    insert: function () {
      const db = wx.cloud.database();
      db.collection('counters').add({
        data: {
          topic: this.data.topic,
          username: app.globalData.userInfo.nickName
        },
        success: res => {
          console.log(res);
          this.setData({
            topic: null
          })
          wx.showToast({
            title: '留言成功',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
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
      })
    }
  }
})