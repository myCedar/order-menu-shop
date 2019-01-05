// pages/management/management.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,//当前页签
    candel:false,//是否可以删除分类
    inputType:'',// input类型
    changeInput:'',//input  输入内容
    foodClassifies:[],//分类
    checkIndex:0,//选择的下标
    position:[],//选择的分类数组
    classId:'',//分类iD
    focus:false,//是否聚焦
    inputWrapper:false,//输入框显示
    height: 0,//输入框距离底部高度
    classifies:[],//分类选择
    oldChoose:[],//选择
    showChoose:false,//显示筛选
    foodList:[],//食物菜单
    page:0,//页数
    count:20,//每页条数
    allChecked:false,//食物全选
    sortType:'',//排序
    monthlySaleBig:true,//从大到小排序
    praiseCountBig: true,//从大到小排序
    priceBig: true,//从大到小排序
    ids:[0],//筛选条件食物分类id
    status:2,//
    name:'',//模糊查询
    canLoad:true,//触底加载
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
  onShow: function (option) {
    // console.log(option)
    // this.data.name = ''
    // this.data.ids = [0]
    // this.data.status = 2
    this.data.page = 0
    this.data.foodList = []
    this.getFoodList()
    this.getFoodClassifies()
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
   /*
  * 滑动到底
  */
  bindscrolltolower(){
    if (this.data.canLoad) {
      this.data.page++
      this.getFoodList()
    }
  },
   /*
  * 页面滚动  禁止下拉
  */
  onPageScroll: function (e) {
    if (e.scrollTop < 0) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
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
   /*
  * 可以编辑
  */
  beginDeletItem () {
    this.setData({
      candel: true
    })
  },
   /*
  * 获取食物分类
  */
  getFoodClassifies(){
    var that = this
    let url = '/order/food/getFoodClassifies'
    let data = {}
    function success(res) {
      let dataArray = [{ name: '全部', id: '0', count: 0, checked: true}],all=0
      // console.log(res)
      res.message.forEach((item,index)=>{
        item["index"] = index
        dataArray.push({ name: item.classify_name, id: item.id, count: item.food_count,checked:true})
        all += item.food_count
      })
      dataArray[0].count = all
      that.setData({
        foodClassifies: res.message,
        classifies: dataArray
      })
    }
    app._get(url, data, success)
  },
   /*
  * 增加分类输入显示
  */
  addItem(){
    this.data.inputType = "addClassify"
    this.showInputWrapper()
  },
   /*
  * 确认增加
  */
  addClassify(value){
    var that = this
    if (!value || value.length>10){
      app.showError("名称长度在1-10个字符之间！")
      return
    }
    for (let i = 0; i < this.data.foodClassifies.length;i++){
      if (this.data.foodClassifies[i].classify_name == value){
        app.showError("已经有这个分类啦！")
        return
      }
    }
    let url = '/order/food/addClassify'
    let data = { name: value}
    function success(res) {
      // console.log(res)
      app.showSuccess('添加成功！')
      that.closeInput()
      that.getFoodClassifies()
    }
    app._post(url, data, success)
  },
   /*
  * 删除分类
  */
  delClassify(e){
    let value = e.currentTarget.dataset.index
    let classify = e.currentTarget.dataset.classify
    var that = this
    wx.showModal({
      title: '您好',
      content: '确定删除 <' + classify+'> 分类么？',
      success(res) {
        if (res.confirm) {
          let url = '/order/food/deleteClassify'
          let data = { id: value }
          function success(res) {
            // console.log(res)
            app.showSuccess('删除成功！')
            that.getFoodClassifies()
          }
          app._post(url, data, success)
        } else if (res.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
  },
   /*
  * 改变位置
  */
  changePosition(e){
    if (!this.data.candel){
      return;
    }
    let value = e.currentTarget.dataset.index
    if (this.data.position.length==0){
      this.data.position.push(value)
    } else {
      if (value != this.data.position[0]){
        let value2 = this.data.foodClassifies[this.data.position[0]].index
        this.data.foodClassifies[this.data.position[0]].index = this.data.foodClassifies[value].index
        this.data.foodClassifies[value].index = value2
      }
      this.data.position.length = 0
    }
    this.setData({
      position: this.data.position,
      foodClassifies: this.data.foodClassifies
    })
  },
   /*
  * 取消分类排序
  */
  canselClassify(){
    this.setData({
      candel: false,
      position: []
    })
    this.getFoodClassifies()
  },
   /*
  * 保存分类排序
  */
  saveChange(){
    let that = this
    let sendData=[]
    let cansend = false
    for (let i = 0; i < this.data.foodClassifies.length;i++){
      sendData[i]={}
      if (this.data.foodClassifies[i].index != i){
        cansend=true
      }
      sendData[i]["id"] = this.data.foodClassifies[i].id
      sendData[i]["index"] = this.data.foodClassifies[i].index
    }
    if (cansend){
      let url = '/order/food/classifySort'
      let data = { list: JSON.stringify(sendData)}
      function success(res) {
        // console.log(res)
        app.showSuccess('排序成功！')
        that.getFoodClassifies()
      }
      function fail(){
        app.showSuccess('排序失败！')
        that.getFoodClassifies()
      }
      app._post(url, data, success, fail)
    }
    this.setData({
      candel: false,
      position: []
    })
  },
   /*
  * 重命名分类输入显示
  */
  rename(e){
    let value = e.currentTarget.dataset.classify
    this.data.classId = e.currentTarget.dataset.classid || ''
    this.data.inputType = 'renameClassify'
    this.showInputWrapper(value)
  },
    /*
  * 重命名分类
  */
  renameClassify(value,id){
    var that = this
    if (value.length > 10 || value.length<1){
      app.showError("分类名称为1-10个字符！")
      return
    }
    for (let i = 0; i < this.data.foodClassifies.length; i++) {
      if (this.data.foodClassifies[i].classify_name == value) {
        app.showError("已经有这个分类啦！")
        return
      }
    }
    let url = '/order/food/updateClassifyName'
    let data = { id: id, name: value }
    function success(res) {
      // console.log(res)
      app.showSuccess('重命名成功！')
      that.data.foodClassifies.forEach((item)=>{
        if (item.id == id){
          item.classify_name = value
        }
      })
      that.data.foodList.forEach((item)=>{
        if (item.classify_id == id){
          item.classify_name = value
        }
      })
      that.data.classifies.forEach((item) => {
        if (item.id == id) {
          item.name = value
        }
      })
      that.setData({
        foodClassifies: that.data.foodClassifies,
        inputWrapper: false,
        focus: false,
        changeInput: '',
        foodList:that.data.foodList,
        classifies: that.data.classifies
      })
    }
    app._post(url, data, success)
  },
   /*
   * 编辑菜品
   */
  bindPickerChange(e){
    this.setData({
      checkIndex: e.detail.value
    })
  },
  /*
   * 弹窗输入框
   */
  changeInput(e) {
    this.data.changeInput = e.detail.value.trim()
  },
  /*
  * 弹框 确认
  */
  confirmInput (){
    this.setData({
      height:0
    })
    switch (this.data.inputType){
      case 'addClassify': this.addClassify(this.data.changeInput); break; 
      case 'renameClassify': this.renameClassify(this.data.changeInput, this.data.classId); break;
      case 'searchFoods': this.suresearchFoods(this.data.changeInput); break;
      // case 'addFood': this.sureAddFood(this.data.changeInput); break;  
    }
  },
  /*
  * 弹框 显示
  */
  showInputWrapper(value){
    this.setData({
      inputWrapper:true,
      focus:true,
      changeInput:value||''
    })
  },
  /*
  * 弹框 关闭
  */
  closeInput(){
    this.setData({
      inputWrapper: false,
      focus: false,
      changeInput:''
    })
  },
  /*
  * 弹框 失去焦点
  */
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
  /*
  * 编辑菜品
  */
  checkboxChange(e){
    //食物全选 暂时 无用。。
    // console.log(e.detail.value)
    // this.data.ids = e.detail.value
  },
   /*
  * 食物增加
  */
  addFood(){
    wx.navigateTo({
      url: '/pages/addFood/addFood',
    })
    // this.data.inputType = 'addFood'
    // this.showInputWrapper()
  },
  // sureAddFood(name){
  //   if (name.length > 0 && name.length<20){
  //     var that = this
  //     let url = '/order/food/add'
  //     let data = {
  //       name: name
  //     }
  //     function success(res) {
  //       app.showError("添加成功！",function(){

  //       }) 
  //     }
  //     app._post(url, data, success)
  //   }else{
  //     app.showError('名称长度必须为1-20个字符')
  //   }
  // },
  /*
  * 食物列表获取
  *isSearch：关闭搜索框 reset 重置列表
  */
  getFoodList(isSearch = false, reset = false){
    var that = this
    let url = '/order/food/getFoods'
    let data = { 
      ids: JSON.stringify(this.data.ids),
      page: this.data.page,
      count: this.data.count,
      status: this.data.status,
      name: this.data.name||''
    }
    function success(res) {
      // console.log(res)
      if(!res.message.length && that.data.page != 0){
        app.showError('已经加载到最后啦！')
        that.data.canLoad = false
        return;
      }else{
        that.data.canLoad = true
      }
      res.message.forEach((item, index) => {
        item['checked'] = false
      })
      if (reset){
        that.data.foodList.length = 0
        that.closeChoose()
      }
      if(that.data.foodList.length){
        that.data.foodList = that.data.foodList.concat(res.message)
      }else{
        that.data.foodList = res.message
      }
      that.setData({
        foodList: that.data.foodList,
        monthlySaleBig: true,
        praiseCountBig: true,
        priceBig: true,
        sortType: '',
        status: that.data.status,
        name:that.data.name
      })
    }
    function complete(){
      if (isSearch){
        that.data.classifies.forEach((item)=>{
          item.checked = true
        })
        that.setData({
          classifies: that.data.classifies,
          inputWrapper: false,
          focus: false,
          changeInput: ''
        })
      }
    }
    app._post(url, data, success, null, complete)
  },
  searchFoods(){
    this.data.inputType = 'searchFoods'
    this.showInputWrapper(this.data.name)
  },
  suresearchFoods(name){
    this.data.foodList = []; 
    this.data.ids = [0]; 
    this.data.status = 2; 
    this.data.page = 0; 
    this.data.name = name; 
    this.getFoodList(true)
  },
  //下架
  //上架
  updateFoodStatus(e) {
    let type  = e.currentTarget.dataset.type
    let foodIds = []
    this.data.foodList.forEach((item) => {
      if (item.checked){
        foodIds.push(item.id)
      }
    })
    let status = (type == 'soldOut' ? 0 : 1)
    var that = this
    let url = '/order/food/updateFoodStatus'
    let data = {
      ids: JSON.stringify(foodIds),
      status: status
    }
    function success(res) {
      app.showSuccess("操作成功！")
      that.data.foodList.forEach((item) => {
        if (item.checked) {
          item.status = status
        }
      })
      that.setData({
        foodList: that.data.foodList
      })
    }
    app._post(url, data, success)
  },
  //删除
  deleteFoods() {
    var that = this
    let foodIds = []
    let foodName = []
    this.data.foodList.forEach((item) => {
      if (item.checked) {
        foodIds.push(item.id)
        foodName.push(item.f_name)
      }
    })
    wx.showModal({
      title: '您好',
      content: '是否要删除以下菜品：' + foodName.join('、'),
      success(res) {
        if (res.confirm) {
          let url = '/order/food/delete'
          let data = {
            ids: JSON.stringify(foodIds)
          }
          function success(res) {
            app.showSuccess("删除成功！")
            let newList = []
            that.data.foodList.forEach((item) => {
              if (!item.checked) {
                newList.push(JSON.parse(JSON.stringify(item)))
              }
            })
            that.setData({
              foodList: newList
            })
            that.getFoodClassifies()
          }
          app._post(url, data, success)
        } else if (res.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
  },
  //编辑
  modifyFood(e){
    let id = e.currentTarget.dataset.id
    let sendItem = ''
    this.data.foodList.forEach((item)=>{
      if (item.id == id){
        sendItem = JSON.stringify(item)
      }
    })
    wx.navigateTo({
      url: '/pages/editFood/editFood?sendItem=' + sendItem
    })
  },
   /*
  * 食物排序
  */
  sortFood(e){
    let type = e.currentTarget.dataset.type
    var compare = function (prop, big = true) {
      return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
          val1 = Number(val1);
          val2 = Number(val2);
        }
        if (val1 < val2) {
          if (big) {
            return 1;
          } else {
            return -1;
          }
        } else if (val1 > val2) {
          if (big) {
            return -1;
          } else {
            return 1;
          }
        } else {
          return 0;
        }
      }
    }
    switch (type){
      case 'monthly_sale': this.data.monthlySaleBig = !this.data.monthlySaleBig; this.data.foodList.sort(compare(type, this.data.monthlySaleBig)) ;break;
      case 'praise_count': this.data.praiseCountBig = !this.data.praiseCountBig; this.data.foodList.sort(compare(type, this.data.praiseCountBig)); break;
      case 'price': this.data.priceBig = !this.data.priceBig; this.data.foodList.sort(compare(type, this.data.priceBig));break;
    }
    this.setData({
      foodList: this.data.foodList,
      monthlySaleBig: this.data.monthlySaleBig,
      praiseCountBig: this.data.praiseCountBig,
      priceBig: this.data.priceBig,
      sortType: type
    })
  },
   /*
  * 食物全选  全不选
  */
  allCheck(e){
    this.data.allChecked = !this.data.allChecked;
    if (this.data.allChecked){
      this.data.foodList.forEach(function(item){
        item.checked = true 
      })
    }else{
      this.data.foodList.forEach(function (item) {
        item.checked = false
      })
    }
    this.setData({
      foodList: this.data.foodList
    })
  },
  checkFood(e){
    let id = e.currentTarget.dataset.id;
    let isAll = true;
    this.data.foodList.forEach(function (item) {
      if (item.id == id){
        item.checked = !item.checked
      }
      if (item.checked == false){
        isAll = false
      }
    })
    this.setData({
      allChecked: isAll
    })
  },
   /*
  * 筛选
  */
  formSubmit (e){
    for (var i = 0; i < e.detail.value.ids.length;i++){
      e.detail.value.ids[i] = e.detail.value.ids[i]
    }
    // console.log(e.detail.value)
    this.data.ids = e.detail.value.ids || [0]
    this.data.status = e.detail.value.status
    this.data.page = 0
    this.getFoodList(false,true)
  },
  formReset () {
    this.data.ids = [0]
    this.data.status = 2
    this.data.page = 0
    this.getFoodList(false,true)
  },
  openChoose(){
    // this.data.classifies.forEach(function (item) {
    //   item.checked = false
    // })
    this.setData({ 
      showChoose: true,
      status:this.data.status,
      classifies: this.data.classifies
    })
  },
  closeChoose(){
    this.setData({ showChoose: false})
  },
  chooseClassify2(e){
    this.data.oldChoose = e.detail.value
  },
  chooseClassify(e){
    // console.log(e)
    let classifyId = e.currentTarget.dataset.id
    if (classifyId == 0){
      if (this.data.oldChoose.indexOf('0') > -1){
        this.data.classifies.forEach(function (item) {
          item.checked = true
        })
      }else{
        this.data.classifies.forEach(function (item) {
          item.checked = false
        })
      }
    }else{
      if (this.data.oldChoose.indexOf('0') > -1){
        this.data.classifies.forEach(function (item) {
          if (classifyId == item.id || item.id == '0') {
            item.checked = false
          }
        })
      } else if (this.data.oldChoose.length == this.data.classifies.length - 1){
        this.data.classifies.forEach(function (item) {
          item.checked = true
        })
      }else{
        this.data.classifies.forEach(function (item) {
          if (classifyId == item.id){
            item.checked = !item.checked
          }
        })
      }
    }
    this.setData({
      classifies: this.data.classifies
    })
  },
  notcatch(){}
})