// pages/result/index.js
// import SkylineBehavior from '@behaviors/skyline.js';

import { testResult } from './testResult.js'
import { questions } from '../q1/q.js'
import { Toast } from 'tdesign-miniprogram';
import useToastBehavior from '~/behaviors/useToast';


Page({
  behaviors: [useToastBehavior],

  /**
   * 页面的初始数据
   */
  data: {
    character: "",
    avatar: "",
    text: "",
    visible: false,
    url: "/static/R-C.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      let qsize = questions.length
      console.log('q size: ', qsize)
      let result = ""
      for (let x = 0; x < qsize; x++) {
        result += wx.getStorageSync('q' + x)
      }
      let info = testResult[result]
      console.log('result', info)
      this.setData({
        character: info.character,
        avatar: info.avatar,
        text: info.text
      })
  },
  handlePopup(e) {
    // const { item } = e.currentTarget.dataset;
    this.setData({ visible: true });
  },
  onVisibleChange(e) {
    this.setData({
      visible: e.detail.visible,
    });
  },

  focusUs() {
    this.onShowToast('#t-toast', "前往非夕站台参加活动");
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

  }
})