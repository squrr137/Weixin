// pages/profile/questions/questions.js
const storage = require('../../../utils/storage')
const mockData = require('../../../utils/mockData')

Page({
  data: {
    questions: [],
    faqList: [],
    showFAQ: true,
    showQuestionModal: false,
    statusFilters: ['全部', '待回复', '已回复', '已关闭'],
    currentStatus: '全部',
    questionForm: {
      title: '',
      content: ''
    },
    canSubmit: false
  },

  onLoad() {
    this.loadQuestions()
    this.loadFAQ()
  },

  onShow() {
    this.loadQuestions()
  },

  loadQuestions() {
    let questions = storage.getQuestions()
    
    // 按状态过滤
    if (this.data.currentStatus !== '全部') {
      const statusMap = {
        '待回复': 'pending',
        '已回复': 'replied',
        '已关闭': 'closed'
      }
      const status = statusMap[this.data.currentStatus]
      questions = questions.filter(q => q.status === status)
    }
    
    // 按时间排序
    questions.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
    
    // 格式化时间
    const formattedQuestions = questions.map(q => ({
      ...q,
      createTime: this.formatDate(q.createTime)
    }))
    
    this.setData({ questions: formattedQuestions })
  },

  loadFAQ() {
    const faqList = mockData.faqList
    this.setData({ faqList })
  },

  formatDate(dateStr) {
    const date = new Date(dateStr)
    const now = new Date()
    
    if (date.toDateString() === now.toDateString()) {
      return `今天 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    }
    
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    if (date.toDateString() === yesterday.toDateString()) {
      return `昨天 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    }
    
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${month}-${day}`
  },

  onStatusChange(e) {
    const status = this.data.statusFilters[e.detail.value]
    this.setData({ currentStatus: status })
    this.loadQuestions()
  },

  askQuestion() {
    this.setData({
      showQuestionModal: true,
      questionForm: { title: '', content: '' },
      canSubmit: false
    })
  },

  onTitleInput(e) {
    this.setData({
      'questionForm.title': e.detail.value
    })
    this.checkCanSubmit()
  },

  onContentInput(e) {
    this.setData({
      'questionForm.content': e.detail.value
    })
    this.checkCanSubmit()
  },

  checkCanSubmit() {
    const { title, content } = this.data.questionForm
    this.setData({
      canSubmit: title.trim() && content.trim()
    })
  },

  submitQuestion() {
    const { title, content } = this.data.questionForm
    
    storage.addQuestion(title, content)
    
    this.setData({ showQuestionModal: false })
    
    wx.showToast({
      title: '提交成功',
      icon: 'success'
    })
    
    this.loadQuestions()
  },

  closeModal() {
    this.setData({ showQuestionModal: false })
  },

  viewFAQ(e) {
    const id = e.currentTarget.dataset.id
    const faq = this.data.faqList.find(f => f.id === id)
    
    wx.showModal({
      title: faq.question,
      content: faq.answer,
      showCancel: false
    })
  },

  viewQuestion(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/profile/questions/detail/detail?id=${id}`
    })
  }
})