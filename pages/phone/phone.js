// pages/phone/phone.js
const app = getApp();
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    submitphone:'',
    oldphone:'',
    code:'',
    canSend:true,
    time:60,
    interval:null,
    firstPhone:'',
    submitDate:new Date()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPhone()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getPhone: function (){
    var that = this
    let url = '/order/producer/getBindPhone'
    let data = {}
    function success(res) {
      // console.log(res)
      that.setData({ oldphone: res.message })
    }
    app._get(url, data, success)   
  },
  bindPhoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindCodeInput: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  focusPhone:function(){
    this.data.firstPhone = this.data.phone
  },
  blurPhone: function () {
    if (this.data.firstPhone != this.data.phone){
      if(this.data.interval){
        clearInterval(this.data.interval)
        this.setData({ canSend: true})
      }
    }
  },
  getCode:function(){
    //console.log(this.data);
    //console.log(utils)
    //return;
    if (!this.data.canSend){
      return;
    }
    let that = this
    if (this.data.phone && utils.myReg('phone', this.data.phone)){
      if (that.data.oldphone == that.data.phone) {
        app.showError("手机不能和变更前一致！")
        return
      }
      if (this.data.phone == this.data.submitphone && (new Date() - this.data.submitDate) < 60000){
        app.showError("手机号码刚获取过验证码，请一分钟后再试！")
      } else if ((new Date() - this.data.submitDate) < 10000){
        app.showError("获取验证码过于频繁，请10S后再试！")
      }else{
        that.data.submitphone = that.data.phone
        that.data.submitDate = new Date()
        that.setData({time: 60 })
        let url = '/order/producer/sendPhoneKey'
        let data = { phone: that.data.phone}
        function success(res) {
          that.setData({ canSend: false })
          let myTime = 60;
          that.data.interval = setInterval(function () {
            if (myTime < 1) {
              that.setData({ canSend: true})
              clearInterval(that.data.interval)
              return
            }
            that.setData({ time: --myTime })
          }, 1000)
          //console.log(res)
          //app.showSuccess("发送成功")
        }
        app._post(url, data, success)
      }
    }else{
      app.showError("请输入正确的手机号！")
    }
  },
  submitPhone(){
    if (this.data.phone && utils.myReg('phone', this.data.phone)) {
      if (this.data.code.trim().length == 6){
        var that = this
        let url = '/order/producer/bindPhone'
        let data = { phone: that.data.phone, code: this.data.code }
        function success(res) {
          //console.log(res)
          app.showError("绑定成功!",()=>{
            wx.navigateBack()
          })
        }
        app._post(url, data, success)
      }else{
        app.showError("验证码输入长度不对")
      }
    } else {
      app.showError("手机格式不正确！")
    }
  }
})