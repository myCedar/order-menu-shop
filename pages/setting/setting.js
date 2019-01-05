// pages/setting/setting.js
//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    store: '',
    approval: {
      "status": "",
      "reason":''
    },
    business:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.getSettingStatus()
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
  goTo: function(e){
    //console.log(e);
    let url = e.currentTarget.dataset.gturl
    wx.navigateTo({
      url: url
    })
  },
  getSettingStatus: function () {
    var that = this
    let url = '/order/producer/getSettingStatus'
    let data = {}
    function success(res) {
      // console.log(res)
      that.setData(res.message)
    }
    app._get(url, data, success)
  },
  approvalShop(){
    var that = this
    if (this.data.approval.status == 0){
      wx.showModal({
        title: '您好',
        content: '是否要发起审批?',
        success(res) {
          if (res.confirm) {
            let url = '/order/producer/initiateApproval'
            let data = {}
            function success(res) {
              // console.log(res)
              app.showSuccess("审批中，请耐心等候！")
              that.setData({
                approval: {
                  "status": 1,
                }
              })
            }
            app._post(url, data, success)
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
    } else if (this.data.approval.status == 1){
      app.showSuccess("审批中，请耐心等候！")
    } else if (this.data.approval.status == 3){
      wx.showModal({
        title: '您好',
        content: '未通过原因：' + that.data.approval.reason+" 是否重新发起审批？",
        success(res) {
          if (res.confirm) {
            let url = '/order/producer/initiateApproval'
            let data = {}
            function success(res) {
              // console.log(res)
              app.showSuccess("审批中，请耐心等候！")
              that.setData({
                approval: {
                  "status": 1,
                }
              })
            }
            app._post(url, data, success)
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
    }
  },
  switchChange(e){
    let that = this,value = e.detail.value
    wx.showModal({
      title: '您好',
      content: '是否要更改营业状态?',
      success(res) {
        if (res.confirm) {
          let url = '/order/producer/configBusiness'
          let data = { business: value?1:0 }
          function success(res) {
            // console.log(res)
            app.showSuccess("修改成功！")
          }
          function complete(res) {
            that.getSettingStatus()
          }
          app._post(url, data, success, null, complete)
        } else if (res.cancel) {
          that.setData({ business: !value})
        }
      }
    })
  }
})