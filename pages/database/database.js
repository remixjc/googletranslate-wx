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
    info_list: null
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
          username: app.globalData.userInfo.nickName,
          topic: this.data.topic,
          avatarUrl: app.globalData.userInfo.avatarUrl,
          createDate: util.formatTime(new Date())
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
      db.collection("counters").orderBy('createDate', 'desc').get().then(res => {
        this.setData({
          info_list: res.data
        })
      })
    }
  }
})