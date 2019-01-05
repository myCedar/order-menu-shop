// pages/addFood/editFood.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputWrapper: false,
    focus: '',
    changeInput: '',
    inputType:'',
    myType:'text',
    height: '',
    foodClassifies:[],
    checkIndex:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    this.getFoodClassifies()
    let sendItem = JSON.parse(options.sendItem)
    sendItem['picture_url'] = "https://www.cwscwh.xyz/" + sendItem['picture_url']
    this.setData(sendItem)
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
  /**
   * 修改
   */
  modify(e) {
    let type = e.currentTarget.dataset.type
    this.data.inputType = type
    let myType = 'text'
    switch (type) {
      case 'f_name': myType = 'text'; break;
      case 'description': myType = 'text'; break;
      case 'price': myType = 'digit'; break;
    }
    if (type == 'f_name'){
      app.showError('名称不能修改！')
    }else{
      this.showInputWrapper(this.data[type], myType)
    }
  },
  changeName(f_name) {
    if (f_name.length < 1 || f_name.length > 20) {
      app.showError('名称长度必须为1-20个字符')
    }
    var that = this
    let url = '/order/food/updateName'
    let data = {
      id: that.data.id,
      name: f_name
    }
    function success(res) {
      // console.log(res)
      that.setData({
        f_name: f_name,
        inputWrapper: false,
        focus: false,
        changeInput: ''
      })
    }
    app._post(url, data, success)
  },
  modifyPic() {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: 'compressed',
      success(res) {
        const tempFilePaths = res.tempFilePaths
        if (res.tempFiles[0].size > 1048576) {
          app.showError("图片大小不能超过1M!")
          return
        }
        let url = '/order/food/updatePicture'
        let filePath = tempFilePaths
        let name = "foodPicture"
        function success() {
          app.showSuccess("上传成功！")
          that.setData({
            picture_url: tempFilePaths
          })
        }
        app.uploadPic(url, filePath, name, success, null, {id:that.data.id})
      }
    })
  },
  changeDesc(desc) {
    if (desc.length > 30) {
      app.showError('描述长度必须小于30个字符')
      return
    }
    var that = this
    let url = '/order/food/updateDescription'
    let data = {
      id: that.data.id,
      description: desc
    }
    function success(res) {
      // console.log(res)
      that.setData({
        description: desc,
        inputWrapper: false,
        focus: false,
        changeInput: ''
      })
    }
    app._post(url, data, success)
  },
  nocatch(){},
  changePrice(price) {
    if (price < 0 || price > 10000) {
      app.showError('价格必须大于0，小于10000')
      return
    }
    var that = this
    let url = '/order/food/updatePrice'
    let data = {
      id: that.data.id,
      price: price
    }
    function success(res) {
      // console.log(res)
      that.setData({
        price: price,
        inputWrapper: false,
        focus: false,
        changeInput: ''
      })
    }
    app._post(url, data, success)
  },
  changeType(e){
    let index = e.detail.value;
    var that = this
    let url = '/order/food/updateClassify'
    let data = {
      id:that.data.id,
      classifyId: that.data.foodClassifies[index].id
    }
    function success(res) {
      // console.log(res)
      that.setData({
        checkIndex: index,
        classify_name: that.data.foodClassifies[index].classify_name
      })
    }
    app._post(url, data, success)
  },
  getFoodClassifies() {
    var that = this
    let url = '/order/food/getFoodClassifies'
    let data = {}
    function success(res) {
      // console.log(res)
      that.setData({
        foodClassifies: res.message,
      })
    }
    app._get(url, data, success)
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
    switch (this.data.inputType) {
      case 'f_name': this.changeName(this.data.changeInput); break;
      case 'description': this.changeDesc(this.data.changeInput); break;
      case 'price': this.changePrice(this.data.changeInput); break;
    }
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
  bindblur(){
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