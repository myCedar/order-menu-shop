//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    animationData1: '',
    animationData2: '',
    animationData3: '',
    animationData4:''
  },
  //事件处理函数
  onLoad: function () {
    //创建动画
    var animation1 = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease",
      delay: 0,
      transformOrigin: "50% 50%",
    })
    animation1.translateY(0).step().translateY(-20).step().translateY(0).step()

    var animation2= wx.createAnimation({
      duration: 1000,
      timingFunction: "ease",
      delay: 0,
      transformOrigin: "50% 50%",
    })
    animation2.translateY(0).step({ delay: 2000 }).translateY(-20).step().translateY(0).step()

    var animation3 = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease",
      delay: 0,
      transformOrigin: "50% 50%",
    })
    animation3.translateY(0).step({ delay: 3000 }).translateY(-20).step().translateY(0).step()
    //

    var animation4 = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease",
      delay: 0,
      transformOrigin: "50% 50%",
    })
    animation4.scale(2).opacity(0).step({ delay: 4000 }).scale(1).opacity(1).step()
    //
    this.setData({
      animationData1: animation1.export(),
      animationData2: animation2.export(),
      animationData3: animation3.export(),
      animationData4: animation4.export()
    })
  },
  go(){
    wx.switchTab({
      url: '/pages/setting/setting',
    })
  }
})
