// 云函数入口文件
const cloud = require('wx-server-sdk')
//引入request-promise用于做网络请求
var rp = require('request-promise');
cloud.init({
  env: 'transitgrass-5g928kmqdfe8e7a5'
})
Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}
var daka = async function () {
  let sites = ["北京市海淀区上地街道首创空间中关村软件园(软件园三号路)",
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
  let url = 'https://kaoqin.wanji.net.cn/api/system/login';
  let options = {
    method: 'POST',
    uri: url,
    body: {
      data: {
        "company": "wanji",
        "username": 1068,
        "password": "Wc901230",
        "source": 5,
        "openId": "oq6T94vWe8rwVODEvaNupHkGnE9s"
      }
    },
    json: true,
  }
  await rp(options).then(function (res) {
      url = 'https://kaoqin.wanji.net.cn/api/workforce/mobileAttendance'
      options = {
        method: 'POST',
        uri: url,
        body: {
          "data": {
            "longitude": String(116.295660 + Math.random() * 0.0001).substring(0, 10),
            "latitude": String(40.049682 + Math.random() * 0.0001).substring(0, 10),
            "punchSite": sites[Math.floor(Math.random() * 10)],
            "punchWay": 2,
            "employeeId": res.content.body.employeeId.valueId,
            "extUserDevice": res.content.body.openId
          }
        },
        headers: {
          "X-Token": res.content.body.token
        },
        json: true,
      }
      rp(options)
        .then(function (res) {
          const db = cloud.database();
          db.collection('check').add({
            data: {
              username: "定时打卡",
              topic: '打卡成功！员工号：1068,地址：随机地址',
              avatarUrl: "https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83equbicpKuhZxXDY6QmeeQPo8Pxc1ZtdP4RGkFWG2PddRbog7taGH648U3JDjiaKyhUroUcMGBXBNYCg/132",
              createDate: new Date().format("yyyy/MM/dd hh:mm:ss"),
              _openid: 'odRKB4vJLMlacp9Dm2PTRTaVfpuo',
              username: "夏洛特Shylot"
            },
            success: res => {
              console.log(res)
            },
            fail: res => {
              console.log(err)
            }
          })
        })
        .catch(function (err) {
          console.log(res)
        });
      return data
    })
    .catch(function (err) {
      return '失败'
    })
}
// 云函数入口函数
exports.main = async (event, context) => {
  setTimeout(await daka, Math.round(Math.random() * 57000));
  return "成功";
}