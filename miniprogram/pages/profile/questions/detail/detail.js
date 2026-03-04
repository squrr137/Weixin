// pages/profile/questions/detail/detail.js
const storage = require('../../../../utils/storage')

Page({
  data: {
    question: {}
  },

  onLoad(options) {
    const { id } = options
    this.loadQuestion(id)
  },

  loadQuestion(id) {
    const questions = storage.getQuestions()
    const question = questions.find(q => q.id === id)
    
    if (question) {
      question.createTime = this.formatDate(question.createTime)
      if (question.replyTime) {
        question.replyTime = this.formatDate(question.replyTime)
      }
      this.setData({ question })
    }
  },

  formatDate(dateStr) {
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hour}:${minute}`
  },

  closeQuestion() {
    wx.showModal({
      title: '提示',
      content: '确定要关闭这个问题吗？',
      success: (res) => {
        if (res.confirm) {
          const questions = storage.getQuestions()
          const index = questions.findIndex(q => q.id === this.data.question.id)
          
          if (index > -1) {
            questions[index].status = 'closed'
            storage.setQuestions(questions)
            
            this.setData({
              'question.status': 'closed'
            })
            
            wx.showToast({
              title: '已关闭',
              icon: 'success'
            })
          }
        }
      }
    })
  }
})