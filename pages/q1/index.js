// pages/q1/q1.js
import { questions } from './q.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
      questions: questions,
      i: -1,
      index: "",
      question: "",
      answers: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      this.data.i = options.i
      console.log('当前index', options.i)
      if (options.i == null) {
        this.data.i = 0
      }
      let size = questions.length
      console.log(size)
      for (let x = 0; x < size; x++) {
        let q = questions[x]
        console.log(q)
        if (q.i == this.data.i) {
          console.log("找到当前问题", q)
          this.setData({
            index: q.index,
            question: q.question,
            answers: q.answers
          })
          return;
        }
      }
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

  async handleOptionTap(e) {
    const type = e.currentTarget.dataset.type;
    // 这里可处理选项点击逻辑，比如记录用户选择、跳转等
    // wx.showToast({
    //   title: `你选择了${type}`,
    //   icon: 'none'
    // });
    let key = 'q' + this.data.i
    await wx.setStorageSync(key, type);

    if (this.data.i == questions.length - 1) {
       // 最后一道题 到结果页面
       wx.navigateTo({
        url: '/pages/result/index'
      });

    } else {
      let next_i = this.data.i + 1
      console.log('next i', next_i)
      wx.navigateTo({
        url: '/pages/q1/index?i=' + next_i,
      });
    }
  }

})