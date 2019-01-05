// pages/table/table.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tableList:[],
    myType:'',
    inputType:'',
    changeInput:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTable()
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
  getTable(){
    var that = this
    let url = '/order/food/getFoodTables'
    let data = {}
    function success(res) {
      // console.log(res)
      that.setData({
        tableList: res.message,
      })
    }
    app._get(url, data, success)
  },
  /**
   * 修改
   */
  modify(e) {
    let type = e.currentTarget.dataset.type
    this.data.inputType = type
    let myType = 'text'
    let content=''
    this.data.tableList.forEach((item)=>{
      if (item.id == type){
        content = item.t_name
      }
    })
    this.showInputWrapper(content, myType)
  },
  changeName(t_name) {
    if (t_name.length < 1 || t_name.length > 10) {
      app.showError('名称长度必须为1-10个字符')
    }
    var that = this
    let url = '/order/food/updateTableName'
    let data = {
      id: that.data.inputType,
      name: t_name
    }
    function success(res) {
      // console.log(res)
      that.closeInput()
      that.data.tableList.forEach((item) => {
        if (item.id == that.data.inputType) {
          item.t_name = t_name
        }
      })
      that.setData({
        tableList: that.data.tableList
      })
    }
    app._post(url, data, success)
  },
  /*
 * 弹窗输入框
 */
  changeInput(e) {
    this.data.changeInput = e.detail.value.trim()
  },
  confirmInput() {
    this.setData({
      height: 0
    })
    this.changeName(this.data.changeInput)
  },
  showInputWrapper(value, myType) {
    this.setData({
      inputWrapper: true,
      focus: true,
      changeInput: value || '',
      myType: myType
    })
  },
  closeInput() {
    this.setData({
      inputWrapper: false,
      focus: false,
      changeInput: ''
    })
  },
  bindblur() {
    this.setData({
      height: 0,
    })
  },
  bindfocus: function (e) {
    let that = this;
    let height = 0;
    let height_02 = 0;
    wx.getSystemInfo({
      success: function (res) {
        height_02 = res.windowHeight;
      }
    })
    height = e.detail.height - (app.globalData.height - height_02);
    that.setData({
      height: height
    })
  },
})