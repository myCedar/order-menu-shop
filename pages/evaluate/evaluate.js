// pages/evaluate/evaluate.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList(options.order)
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
  //获取列表
  getList(id){
    let that = this
    let url = '/order/order/getEvaluate'
    let data = {
      id: id
    }
    function success(res) {
      if (res.message.pictures){
        for (var i = 0; i < res.message.pictures.length;i++){
          res.message.pictures[i] = app.appConfig.apiroot + '/' + res.message.pictures[i]
        }
      }
      //console.log(res)
      that.setData(res.message)
    }
    app._get(url, data, success)
  },
})