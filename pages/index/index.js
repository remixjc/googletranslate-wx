Page({
  data: {
    PageCur: 'about'
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  onShareAppMessage() {
    return {
      title: '转运草 TransitGrass',
      imageUrl: '/images/logo.png',
      path: '/pages/index/index'
    }
  },
})