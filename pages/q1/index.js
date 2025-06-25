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
      var storeQuestions = wx.getStorageSync('storeQuestions');
      if(storeQuestions) {
        this.setData({
          "questions": storeQuestions
        });
      }
      console.log("this.data.questions", this.data.questions)
      if (options.i == null) {
        this.data.i = 0
      }
      
      let size = this.data.questions.length
      console.log(size)
      for (let x = 0; x < size; x++) {
        let q = this.data.questions[x]
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
    console.log("e", e)
    const answerinfo = e.currentTarget.dataset.answerinfo;
    console.log("answerinfo", answerinfo);
    const i = answerinfo.i;
    var answers = this.data.questions[i].answers;
    console.log("answer", this.data.questions[i])
    for(var j = 0; j < answers.length; j++) {
      answers[j].selected = false;
    }
    console.log(answerinfo.id)
    for(var j = 0; j < answers.length; j++) {
      if(answers[j].id == answerinfo.id) {
        answers[j].selected = true;
      }
    }
    console.log("answer", answers)
    this.setData({
      "answers": answers
    });
    console.log("this.data.questions", this.data.questions);

    const type = answerinfo.id;
    let key = 'q' + this.data.i;
    await wx.setStorageSync(key, type);
    await wx.setStorageSync('storeQuestions', this.data.questions);
    if (answerinfo.i == this.data.questions.length - 1) {
      console.log("key111", key)
      // 最后一道题 到结果页面
      wx.navigateTo({
       url: '/pages/result/index'
     });
    } else {
      let next_i = answerinfo.i + 1
      console.log('next i', next_i) //第一题跳转到第二题 next_i 为1
      wx.navigateTo({
        url: '/pages/q1/index?i=' + next_i,
      });
    }
  },

  handleOptionTapNext(e) {
    const questionid = e.currentTarget.dataset.questionid;
    console.log("quesitionid", questionid)
    var answers = this.data.questions[questionid - 1].answers;
    if(questionid == answers.length) {
      wx.showToast({
        title: '该题目已是最后一题',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    var num = 0;
    for(var j = 0; j < answers.length; j++) {
      if(answers[j].selected == false) {
        num = num + 1;
      }
    }
    if(num == answers.length) {
      wx.showToast({
        title: '请填写当前题目',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    let next_i = Number(questionid);
    console.log('next i', next_i)
    wx.navigateTo({
      url: '/pages/q1/index?i=' + next_i,
    });
  },

  handleOptionTapUp(e) {
    const questionid = e.currentTarget.dataset.questionid;
    if(questionid == 1) {
      wx.showToast({
        title: '该题目已经是第一题',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    console.log("quesitionid", questionid);
    console.log("this.data.questions", this.data.questions)
    let next_i = Number(questionid) - 2;
    console.log('next i', next_i)
    wx.navigateTo({
      url: '/pages/q1/index?i=' + next_i,
    });
  }

})