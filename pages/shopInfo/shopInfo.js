// pages/shopInfo/shopInfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: '',
    headPictureUrl: '',
    description: '',
    storeName: '',
    address: '',
    storePictureUrls: '',
    showModal: false,
    changeType: '',
    oldContent:'',
    changeName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getAllInfo()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  modify: function(e) {
    // console.log(e);
    let that =this
    let type = e.currentTarget.dataset.type
    if (type == 'headPictureUrl') {
      wx.chooseImage({
        count: 1,
        sizeType: 'compressed',
        success(res) {
          const tempFilePaths = res.tempFilePaths
          if (res.tempFiles[0].size > 1048576){
            app.showError("图片大小不能超过1M!")
            return
          }
          let url = '/order/producer/configHeadPicture'
          let filePath = tempFilePaths
          let name = "headPicture"
          function success(){
            app.showSuccess("上传成功！")
            that.getAllInfo()
          }
          app.uploadPic(url, filePath, name, success)
        }
      })
    } else if (type == 'storePictureUrls') {
      wx.navigateTo({
        url: '/pages/shopPic/shopPic',
      })
    } else {
      this.data.changeType = type
      let changeName = ''
      let oldContent = ''
      if (type == "storeName" && !this.data.region){
        app.showSuccess("请先设置地区！")
        return
      }
      switch (type) {
        case 'storeName': changeName = '名称'; oldContent = this.data.storeName;break;
        case 'description': changeName = '简介'; oldContent = this.data.description;break;
        case 'address': changeName = '地址'; oldContent = this.data.address;break;
        default: changeName = '';
      }
      this.setData({
        showModal: true,
        changeName: changeName,
        oldContent: oldContent
      })
    }
  },
  getAllInfo: function() {
    var that = this
    let url = '/order/producer/getStore'
    let data = {}
    function success(res) {
      // console.log(res)
      that.setData(res.message)
    }
    app._get(url, data, success)
  },
  bindRegionChange(e) {
    let region = e.detail.value[0] + '-' + e.detail.value[1] + '-' + e.detail.value[2]
    var that = this
    let url = '/order/producer/configRegion'
    let data = {
      region: region
    }
    function success(res) {
      // console.log(res)
      that.setData({
        region: region
      })
      // that.setData(res.message)
    }
    app._post(url, data, success)
  },
  canselText: function() {
    this.setData({
      showModal: false
    })
  },
  inputChange(e){
    // console.log(e.detail.value)
    this.data.oldContent = e.detail.value.trim()
  },
  setName(value){
    let that = this
    let url = '/order/producer/configStoreName'
    let data = {
      storeName: value
    }
    function success(res) {
      // console.log(res)
      app.showSuccess("修改成功")
      that.setData({
        storeName: value,
        showModal: false
      })
    }
    app._post(url, data, success)
  },
  confirmText() {
    let value = this.data.oldContent
    // console.log(value)
    var that = this
    if (this.data.changeType == 'storeName') {
      if (value == this.data.storeName){
        app.showError('修改前后不能名称一致!')
        return
      }
      if (value && value.length <= 20) {
        let url = '/order/producer/checkStoreNameByRegion'
        let data = {
          name: value
        }
        function success(res) {
          if (res.message == 0){
            that.setName(value)
          }else {
            wx.showModal({
              title: '您好',
              content: '您设置的名称在本地区已有重复名称，是否继续？',
              success(res) {
                if (res.confirm) {
                  that.setName(value)
                } else if (res.cancel) {
                  //暂时不做
                }
              }
            })
          }
        }
        app._get(url, data, success)
      }else{
        app.showError('名称不能为空且长度不能超过20个字符!')
      }
    } else if (this.data.changeType == 'description') {
      if (value && value.length <= 100) {
        let url = '/order/producer/configDescription'
        let data = {
          description: value,
        }
        function success(res) {
          // console.log(res)
          app.showSuccess("修改成功")
          that.setData({
            description: value,
            showModal: false
          })
        }
        app._post(url, data, success)
      } else {
        app.showError('简介不能为空且长度不能超过100个字符!')
      }
    } else if (this.data.changeType == 'address') {
      if (value && value.length <= 30) {
        let url = '/order/producer/configAddress'
        let data = {
          address: value
        }
        function success(res) {
          app.showSuccess("修改成功")
          // console.log(res)
          that.setData({
            address: value,
            showModal: false
          })
        }
        app._post(url, data, success)
      } else {
        app.showError('地址不能为空且长度不能超过30个字符!')
      }
    }
  }
})