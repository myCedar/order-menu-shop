// pages/shopPic/shopPic.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pics: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getPic()
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
  changeCheck(e) {
    let index = parseInt(e.currentTarget.dataset.index);
    this.data.pics[index].checked = !this.data.pics[index].checked
    this.setData({
      pics: this.data.pics
    })
  },
  addPic() {
    let count = 6 - this.data.pics.length,
      that = this;
    if (count > 0) {
      wx.showModal({
        title: '您好',
        content: '您还可以上传' + count + "张图片",
        success(res) {
          if (res.confirm) {
            wx.chooseImage({
              count: count,
              sizeType: 'compressed',
              success(res) {
                const tempFilePaths = res.tempFilePaths
                // console.log(res);
                for (let i = 0; i < res.tempFiles.length; i++) {
                  if (res.tempFiles[i].size > 1048576) {
                    app.showError("图片大小不能超过1M!")
                    return
                  }
                }
                let url = '/order/producer/configStorePicture'
                let filePath = tempFilePaths
                let name = "storePicture"

                function success() {
                  app.showSuccess("上传成功！")
                  that.getPic()
                }
                app.uploadPic(url, filePath, name, success)
              }
            })
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
    } else {
      app.showError("最多只能上传6张图片！")
    }
  },
  deletePic() {
    let that = this,
      storePictureUrls = ''
    for (let i = 0; i < this.data.pics.length; i++) {
      if (this.data.pics[i].checked) {
        storePictureUrls += this.data.pics[i].pic.substring(23) + ","
      }
    }
    let url = '/order/producer/deleteStorePictures'
    let data = {
      storePictureUrls: storePictureUrls.substring(0, storePictureUrls.length-1)
    }
    if (!storePictureUrls.substring(0, storePictureUrls.length - 1)){
      app.showError("请至少选择一张图片！")
      return
    }
    wx.showModal({
      title: '您好',
      content: '是否确认删除？',
      success(res) {
        if (res.confirm) {
          function success(res) {
            // console.log(res)
            app.showSuccess("删除成功！")
            that.getPic()
          }
          app._post(url, data, success)
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  getPic() {
    var that = this
    let url = '/order/producer/getStorePictureUrls'
    let data = {}

    function success(res) {
      // console.log(res)
      let pics = [];
      for (let i = 0; i < res.message.length; i++) {
        pics[i] = {}
        pics[i]['pic'] = app.appConfig.apiroot + '/' + res.message[i]
        pics[i]['checked'] = false
      }
      that.setData({
        pics: pics
      })
    }
    app._get(url, data, success)
  },
  previewPic(e){
    let index = parseInt(e.currentTarget.dataset.index);
    let preLIst = [], current = this.data.pics[index].pic
    for (let i = 0; i < this.data.pics.length; i++) {
      preLIst.push(this.data.pics[i].pic)
    }
    wx.previewImage({
      current: current, 
      urls: preLIst // 需要预览的图片http链接列表
    })
  }
})