// pages/addFood/addFood.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    foodClassifies:[],
    checkIndex:0,
    imgSrc:{},
    name:'',
    classifyId:'',
    description:'',
    price:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getFoodClassifies()
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
   * 选择分类
   */
  changeType(e) {
    this.setData({
      checkIndex: e.detail.value
    })
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
  chooseImg(){
    let that =this
    wx.chooseImage({
      count: 1,
      sizeType: [ 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        // const tempFilePaths = res.tempFilePaths
        that.setData({
          imgSrc: res
        })
      }
    })
  },
  formSubmit(e){
    let that =this
    let value = e.detail.value
    console.log(value)
    if (value.name.length < 1 || value.name.length>20){
      app.showError('名称长度必须为1-20个字符')
      return
    }
    if (value.description.length > 30) {
      app.showError('描述长度必须小于30个字符')
      return
    }
    if (value.price < 0 || value.price>10000) {
      app.showError('价格必须大于0，小于10000')
      return
    }
    if (!that.data.imgSrc.tempFilePaths) {
      app.showError('请选择图片！')
      return
    }
    wx.showLoading({
      title: '上传中',
    })
    wx.uploadFile({
      url: app.appConfig.apiroot +'/order/food/add',
      filePath: that.data.imgSrc.tempFilePaths[0],
      name: 'foodPicture',
      header: { 'token': wx.getStorageSync('token') },
      formData: {
        "name": value.name,
        "classifyId": that.data.foodClassifies[value.index].id,
        "description": value.description,
        "price": value.price
      },
      success(res) {
        res.data = JSON.parse(res.data)
        if (res.statusCode !== 200 || typeof res.data !== 'object') {
          app.showError('系统维护中，请稍后重试！');
        } else if (res.data.status == -2) {
          app.showError(res.data.error_mesage);
        } else if (res.data.status == 0) {
          wx.showModal({
            title: '您好',
            content: '上传成功，是否返回？',
            success(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta:1
                })
              } else if (res.cancel) {
                that.formReset()
              }
            }
          })
        } else if (res.data.status == -3) {
          app.showError("亲，请先绑定手机号呦！", function () {
            wx.navigateTo({
              url: '/pages/phone/phone',
            })
          })
        } else if (res.data.status == -4) {
          app.showError("亲，审批通过才能继续操作呦！", function () {
            wx.switchTab({
              url: '/pages/setting/setting',
            })
          })
        }
      },
      fail(){
        app.showError('网络忙，请稍后重试')
      },
      complete(){
        wx.hideLoading()
      }
    })
  },
  formReset(){
    this.setData({
      "name": '',
      "classifyId": '',
      "checkIndex":0,
      "description": '',
      "price": '',
      "imgSrc":{}
    })
  }
})