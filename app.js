//app.js
App({
  appConfig: require('app.config'),
  globalData:{
    height:0
  },
  onLaunch: function () {
    var that =this;
    const _this = this;
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.height = res.windowHeight;
      }
    })
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        // console.log(res)
        if (!res.hasUpdate) {
          that.doLogin()
          // console.log(that)
        }
      })
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })

      })
      updateManager.onUpdateFailed(function () {
        // 新的版本下载失败
        wx.showModal({
          title: '更新提示',
          content: '新版本下载失败',
          showCancel: false
        })
      })
    } else {
      wx.showModal({
        title: '更新提示',
        content: '当前微信版本过低，无法使用自动更新功能，请升级到最新微信版本后重试。',
        showCancel: false
      })
    }

    // // 判断用户是否过期
    wx.checkSession({
      fail:res=>{
        this.doLogin();
      }
    })
    // 加载配置文件
    // this.loadconfig().then(function (res) {
    //   wx.setStorageSync('config', res);
    // })
  },
  /**
   * 显示成功提示框
   */
  showSuccess: function (msg, callback) {
    wx.showToast({
      title: msg,
      icon: 'success',
      duration:2000,
      success: function () {
        callback && (setTimeout(function () {
          callback();
        }, 1500));
      }
    });
  },

  /**
   * 显示失败提示框
   */
  showError: function (msg, callback) {
    wx.showModal({
      title: '友情提示',
      content: msg,
      showCancel: false,
      success: function (res) {
        // callback && (setTimeout(function() {
        //   callback();
        // }, 1500));
        callback && callback();
      }
    });
  },
  /**
   * get请求
   * url:请求地址
   * data:请求数据
   * 
   */
  _get: function (url, data, success, fail, complete) {
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let App = this;
    // 构造请求参数
    data = data || {};
    // 构造get请求
    let request = function () {
      // data.token = wx.getStorageSync('token');
      wx.request({
        url: App.appConfig.apiroot + url,
        header: {
          'content-type': 'application/json',
          'token': wx.getStorageSync('token') || ''
        },
        data: data,
        success: function (res) {
          if (res.statusCode !== 200 || typeof res.data !== 'object') {
            App.showError('系统维护中，请稍后重试！');
            fail && fail(res.data);
          }else{
            if (res.data.status == -1) {
              // 登录态失效, 重新登录
              App.doLogin(request);
            } else if (res.data.status == -2) {
              App.showError(res.data.error_message);
            } else if (res.data.status == 0) {
              success && success(res.data);
            } else if (res.data.status == -3) {
              App.showError("亲，请先绑定手机号呦！",function(){
                wx.navigateTo({
                  url: '/pages/phone/phone',
                })
              })
            } else if (res.data.status == -4) {
              App.showError("亲，审批通过才能继续操作呦！", function () {
                wx.switchTab({
                  url: '/pages/setting/setting',
                })
              })
            }
          }
        },
        fail: function (res) {
          // console.log(res);
          App.showError('网络异常，稍后重试！', function () {
            fail && fail(res.data);
          });
        },
        complete: function (res) {
          wx.hideLoading()
          wx.hideNavigationBarLoading();
          complete && complete(res.data);
        },
      });
    };
    request();
  },
  /**
   * post提交
   */
  _post: function (url, data, success, fail, complete) {
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    let App = this;
    wx.request({
      url: App.appConfig.apiroot + url,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': wx.getStorageSync('token'),
      },
      method: 'POST',
      data: data,
      success: function (res) {
        if (res.statusCode !== 200 || typeof res.data !== 'object') {
          App.showError('系统维护中，请稍后重试！');
          fail && fail(res.data);
        }else{
          if (res.data.status == -1) {
            // 登录态失效, 重新登录
            App.doLogin(function () {
              App._post(url, data, success, fail);
            });
            return false;
          } else if (res.data.status == -2) {
            App.showError(res.data.error_message, function () {
              fail && fail(res.data);
            });
          } else if (res.data.status == 0) {
            success && success(res.data);
          } else if (res.data.status == -3) {
            App.showError("亲，请先绑定手机号呦！", function () {
              wx.navigateTo({
                url: '/pages/phone/phone',
              })
            })
          } else if (res.data.status == -4) {
            App.showError("亲，审批通过才能继续操作呦！", function () {
              wx.switchTab({
                url: '/pages/setting/setting',
              })
            })
          }
        }
      },
      fail: function (res) {
        // console.log(res);
        App.showError("网络异常，请稍后重试！", function () {
          fail && fail(res.data);
        });
      },
      complete: function (res) {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        complete && complete(res.data);
      }
    });
  },
  /**
   * 执行用户登录
   */
  doLogin: function (request) {
    let that =this
    wx.login({
      success (res) {
        // console.log(res)
        // return
        if (res.code) {
          let url = '/order/producer/getToken'
          let data = { code: res.code}
          function success(res) {
            //console.log(res)
            if (res.status == 0) {
              wx.setStorageSync('token', res.token)
              //that.showSuccess("登陆成功")
              request && request()
            } else {
              that.showError("登陆失败！三分钟后自动登陆？",()=>{
                setTimeout(that.doLogin,180000)
              })
            }
          }
          that._get(url, data, success)   
        } else {
          console.log("登陆失败")
          setTimeout(that.doLogin,30000)
        }
      },
      fail () {
        setTimeout(that.doLogin, 30000)
      }
    })
  },

  /**
   * 对象转URL
   */
  urlEncode: function urlencode(data) {
    var _result = [];
    for (var key in data) {
      var value = data[key];
      if (value.constructor == Array) {
        value.forEach(function (_value) {
          _result.push(key + "=" + _value);
        });
      } else {
        _result.push(key + '=' + value);
      }
    }
    return _result.join('&');
  },
  //上传图片
  uploadPic(url, filePathList, name, success, fail,formData) {
    let App = this
    let i = 0, length = filePathList.length-1
    wx.showLoading({
      title: '图片上传中！',
      mask: true
    })
    uploadFile();
    function uploadFile(){
      wx.uploadFile({
        url: App.appConfig.apiroot + url,
        filePath: filePathList[i],
        formData:formData,
        name: name,
        header: { 'token': wx.getStorageSync('token') },
        success(res) {
          res.data = JSON.parse(res.data)
          if (res.statusCode !== 200 || typeof res.data !== 'object') {
            i = length
            wx.hideLoading();
            App.showError('系统维护中，请稍后重试！');
          } else if (res.data.status == -2) {
            i = length
            wx.hideLoading();
            App.showError(res.data.error_mesage);
          } else if (res.data.status == 0) {
            if (i == length){
              success && success(res.data);
            }
          } else if (res.data.status == -3) {
            i = length
            wx.hideLoading();
            App.showError("亲，请先绑定手机号呦！", function () {
              wx.navigateTo({
                url: '/pages/phone/phone',
              })
            })
          } else if (res.data.status == -4) {
            App.showError("亲，审批通过才能继续操作呦！", function () {
              wx.switchTab({
                url: '/pages/setting/setting',
              })
            })
          }
        },
        fail: function (res) {
          i = length
          wx.hideLoading();
          App.showError("网络异常，请稍后重试！", function () {
            fail && fail(res.data);
          });
        },
        complete: function () {  
          if(i < length){
            i++;
            uploadFile()
          }else{
            wx.hideLoading();
          }
        }
      })
    }  
  }
})