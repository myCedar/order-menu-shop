// pages/order/order.js
const app = getApp()
Page({
  /**
  * 页面的初始数据
  */
  data: {
    currentTab: 0,//当前页签
    haspayPage: 0,//未付款页码
    hasCancel: 0,//已付款页码
    hasCancelData: false,//已付款还有数据
    haspayData: false,//未付款还有数据
    haspayList: [],//未付款列表
    hasCancelList: [],//已付款列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getPayList(0,this.data.haspayPage);
    // this.getPayList(1,this.data.hasCancel);
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
    this.data.haspayPage = 0,//未付款页码
    this.data.hasCancel = 0,//已付款页码
    this.data.haspayList = [],//未付款列表
    this.data.hasCancelList = [],//已付款列表
    this.getPayList(1, this.data.haspayPage);
    this.getPayList(2, this.data.hasCancel);
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
  noDo() { },
  /**
  * 滑动切换tab
  */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  /**
   * 点击tab切换
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  // 触底加载
  hasPayToBottom() {
    this.data.haspayPage++
    this.getPayList(1, this.data.haspayPage)
  },
  // 触底加载
  hasCancelToBottom() {
    this.data.hasCancel++
    this.getPayList(2, this.data.hasCancel)
  },
  //获取订单
  getPayList(status, page) {
    let that = this
    let url = '/order/order/getByStatus'
    let data = {
      status: status,
      page: page,
      count: 20
    }
    function success(res) {
      // console.log(res)
      if (status == 1) {
        if (!res.message.length) {
          that.setData({
            haspayData: true,
            haspayList: that.data.haspayList
          })
          return
        } else {
          that.setData({
            haspayData: false
          })
        }
        if (that.data.haspayList.length) {
          that.setData({
            haspayList: that.data.haspayList.concat(res.message),//未付款列表
          })
        } else {
          that.setData({
            haspayList: res.message,//未付款列表
          })
        }
      }
      if (status == 2) {
        if (!res.message.length) {
          that.setData({
            hasCancelData: true,
            hasCancelList: that.data.hasCancelList
          })
          return
        } else {
          that.setData({
            hasCancelData: false
          })
        }
        if (that.data.hasCancelList.length) {
          that.setData({
            hasCancelList: that.data.hasCancelList.concat(res.message),//未付款列表
          })
        } else {
          that.setData({
            hasCancelList: res.message,//未付款列表
          })
        }
      }
    }
    app._get(url, data, success)
  },
  //跳转订单详情
  goToDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?order=' + id
    })
  },
  // 搜索订单
  searchOrder(e){
    let that = this
    let id = e.detail.value
    if (id){
      let url = '/order/order/getDetail'
      let data = {
        id: id
      }
      function success(res) {
        // console.log(res)
        if (res.message){
          wx.navigateTo({
            url: '/pages/orderDetail/orderDetail?order=' + id
          })
        }
      }
      app._get(url, data, success)
    }
  }
})