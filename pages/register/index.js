// pages/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personInfo: {
      name: '',
      mobile: '',
      company: '',
      email: '',
    },
    openId: ''
  },

  personInfoFieldChange(field, e) {
    const { value } = e.detail;
    this.setData({
      [`personInfo.${field}`]: value,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.cloud.init()
    let _this = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'userId',
      // 传给云函数的参数
      data: {},
      success: function(res) {
        console.log(res.result.userInfo.openId) // 3
        _this.setData({
          openId:  res.result.userInfo.openId
        })
        console.log(this.openId)
      },
      fail: console.error
    })
  },




  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  onNameChange(e) {
    this.personInfoFieldChange('name', e);
  },
  onMobileChange(e) {
    this.personInfoFieldChange('mobile', e);
  },
  onCompanyChange(e) {
    this.personInfoFieldChange('company', e);
  },
  onEmailChange(e) {
    this.personInfoFieldChange('email', e);
  },
  onSaveInfo(e) {
    console.log(this.data.personInfo, this.data.openId)
    wx.cloud.callFunction({
      // 云函数名称
      name: 'addUser',
      // 传给云函数的参数
      data: this.data,
      success: function(res) {
        console.log(res)
        wx.navigateTo({
          url: '/pages/q1/index',
        });
      },
      fail: console.error
    })
  },
})