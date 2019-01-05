// pages/orderDetail/orderDetail.js
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
    this.data.id = options.order
    this.getOrderDetail()
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
  getOrderDetail() {
    //food/getOrderDetail
    let that = this
    let url = '/order/order/getDetail'
    let data = {
      id: this.data.id
    }
    function success(res) {
      // console.log(res)
      let count = 0, total = 0
      res.message.foodSales.forEach((item) => {
        count += item.food_count
        total += item.food_count * item.food_price
      })
      res.message["count"] = count
      res.message["total"] = Math.round(total * 100) / 100
      that.setData(res.message)
    }
    app._get(url, data, success)
  },
  evaluate() {
    wx.navigateTo({
      url: '/pages/evaluate/evaluate?order=' + this.data.id
    })
  }
})