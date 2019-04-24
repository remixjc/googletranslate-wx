const app = getApp();
var tool=require('./gettk.js');
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    index: 0,
    indexTo:0,
    frLang:'auto',
    toLang:'zh_CN',
    tkk:'',
    fr:'',
    to:'',
    picker: [{
                "key": "auto",
                "value": "自动识别"
              },{
                "key": "zh_CN",
                "value": "简体中文"
              }, {
                "key": "en_US",
                "value": "English"
              }, {
                "key": "zh_Hant",
                "value": "繁體中文"
              }, {
                "key": "ko_KR",
                "value": "韩语"
              }, {
                "key": "ja_JP",
                "value": "日本語"
              }, {
                "key": "th_TH",
                "value": "ภาษาไทย"
              }, {
                "key": "de_DE",
                "value": "Deutsch"
              }, {
                "key": "fr_FR",
                "value": "Français"
              }, {
                "key": "es_ES",
                "value": "西班牙语"
              }, {
                "key": "it_IT",
                "value": "意大利语"
              }],
    pickerTo: [{
                  "key": "zh_CN",
                  "value": "简体中文"
                }, {
                    "key": "en_US",
                    "value": "English"
                  }, {
                    "key": "zh_Hant",
                    "value": "繁體中文"
                  }, {
                    "key": "ko_KR",
                    "value": "韩语"
                  }, {
                    "key": "ja_JP",
                    "value": "日本語"
                  }, {
                    "key": "th_TH",
                    "value": "ภาษาไทย"
                  }, {
                    "key": "de_DE",
                    "value": "Deutsch"
                  }, {
                    "key": "fr_FR",
                    "value": "Français"
                  }, {
                    "key": "es_ES",
                    "value": "西班牙语"
                  }, {
                    "key": "it_IT",
                    "value": "意大利语"
                  }],
    modalName: null
  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value,
      frLang:this.data.picker[e.detail.value].key
    })
  },
  PickerChangeTo(e) {
    console.log(e);
    this.setData({
      indexTo: e.detail.value,
      toLang: this.data.pickerTo[e.detail.value].key
    })
  },
  TimeChange(e) {
    this.setData({
      time: e.detail.value
    })
  },
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  RegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '召唤师',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  textareaAInput(e) {
    this.setData({
      fr: e.detail.value
    })
  },
  textareaBInput(e) {
    this.setData({
      to: e.detail.value
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
  translate(e){
    var reg = new RegExp("(tkk:')(.*?)(?=')");
    var tkk='';
    wx.request({
      url: 'https://translate.google.cn',
      success:function(res){
        var reg = new RegExp("(tkk:')(.*?)(?=')");
        tkk=res.data.match(reg)[0].substring(5);
        console.log(tkk);
      }
    });
    if(tkk===''){
      var tk = tool.tk(this.data.fr, this.data.tkk);
      console.log(this.data.frLang);
      console.log('tkk:' + this.data.tkk + ',tk:' + tk + ',frLang:' + this.data.frLang + ',toLang:' + this.data.toLang);
      //var googleTransUrl = "https://translate.google.cn/translate_a/single?client=t&sl=" + this.data.pickrer[index].key + "&tl=" + req.body.tolang + "&hl=en&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&ie=UTF-8&oe=UTF-8&otf=1&ssel=0&tsel=0&kc=1&tk=" + tks + "&q=" + encodeURIComponent(req.body.fr);
      this.setData(
        {
          to: 'tkk:' + this.data.tkk + ',tk:' + tk + ',fr:' + this.data.fr
        }
      );
    }
  }
})