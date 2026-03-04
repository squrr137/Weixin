// pages/self-assessment/questionnaire/questionnaire.js
const mockData = require('../../../utils/mockData')
const storage = require('../../../utils/storage')
const app = getApp()

Page({
  data: {
    type: '',
    questions: [],
    currentIndex: 0,
    currentQuestion: null,
    answers: [],
    selectedIndex: null,
    totalQuestions: 0,
    progress: 0
  },

  onLoad(options) {
    const { type } = options
    this.setData({ type })
    this.loadQuestions(type)
  },

  loadQuestions(type) {
    let questions = []
    
    if (type === 'drugLiteracy') {
      questions = mockData.assessmentScales.drugLiteracy
    } else if (type === 'mmas8') {
      questions = mockData.assessmentScales.mmas8
    } else {
      // 默认使用药物素养评估
      questions = mockData.assessmentScales.drugLiteracy
    }
    
    const answers = new Array(questions.length).fill(null)
    
    this.setData({
      questions,
      answers,
      totalQuestions: questions.length,
      currentQuestion: questions[0]
    })
    
    this.updateProgress()
  },

  selectOption(e) {
    const index = e.currentTarget.dataset.index
    this.setData({ selectedIndex: index })
  },

  prevQuestion() {
    if (this.data.currentIndex > 0) {
      // 保存当前答案
      const answers = this.data.answers
      answers[this.data.currentIndex] = this.data.selectedIndex
      
      const newIndex = this.data.currentIndex - 1
      this.setData({
        currentIndex: newIndex,
        currentQuestion: this.data.questions[newIndex],
        answers,
        selectedIndex: answers[newIndex]
      })
      
      this.updateProgress()
    }
  },

  nextQuestion() {
    if (this.data.selectedIndex === null) return
    
    // 保存当前答案
    const answers = this.data.answers
    answers[this.data.currentIndex] = this.data.selectedIndex
    
    if (this.data.currentIndex === this.data.totalQuestions - 1) {
      // 完成测评
      this.calculateScore()
    } else {
      const newIndex = this.data.currentIndex + 1
      this.setData({
        currentIndex: newIndex,
        currentQuestion: this.data.questions[newIndex],
        answers,
        selectedIndex: answers[newIndex] || null
      })
      
      this.updateProgress()
    }
  },

  updateProgress() {
    const progress = ((this.data.currentIndex + 1) / this.data.totalQuestions) * 100
    this.setData({ progress })
  },

  calculateScore() {
    const { type, answers, questions } = this.data
    
    // 计算得分
    let score = 0
    let result = ''
    
    if (type === 'drugLiteracy') {
      // 药物素养：每个选项0-3分
      score = answers.reduce((sum, ans) => sum + ans, 0)
      const maxScore = questions.length * 3
      const percentage = (score / maxScore) * 100
      
      if (percentage >= 80) {
        result = '优秀'
      } else if (percentage >= 60) {
        result = '良好'
      } else {
        result = '待提高'
      }
    } else if (type === 'mmas8') {
      // MMAS-8 计分规则
      score = answers.reduce((sum, ans, index) => {
        if (index < 7) {
          // 前7题：否=1分，是=0分
          return sum + (ans === 1 ? 0 : 1)
        } else {
          // 第8题：5点量表
          const scores = [1, 0.75, 0.5, 0.25, 0]
          return sum + scores[ans]
        }
      }, 0)
      
      if (score === 8) {
        result = '高依从性'
      } else if (score >= 6) {
        result = '中等依从性'
      } else {
        result = '低依从性'
      }
    }
    
    // 保存测评记录
    const assessmentRecord = {
      id: storage.generateId(),
      type,
      score: score.toFixed(1),
      result,
      answers,
      createTime: new Date().toISOString()
    }
    
    storage.addAssessmentRecord(type, score, result)
    
    // 增加积分
    app.addPoints(20, '完成测评')
    
    // 显示结果
    wx.showModal({
      title: '测评结果',
      content: `您的得分：${score.toFixed(1)}分\n测评结果：${result}`,
      confirmText: '查看建议',
      success: (res) => {
        if (res.confirm) {
          // 根据结果推荐学习内容
          this.showRecommendations(result)
        } else {
          wx.navigateBack()
        }
      }
    })
  },

  showRecommendations(result) {
    wx.showActionSheet({
      itemList: ['查看相关学习内容', '再次测评', '返回首页'],
      success: (res) => {
        if (res.tapIndex === 0) {
          // 跳转到药物智库
          wx.switchTab({
            url: '/pages/drug-library/drug-library'
          })
        } else if (res.tapIndex === 1) {
          // 重新测评
          this.setData({
            currentIndex: 0,
            answers: new Array(this.data.totalQuestions).fill(null),
            selectedIndex: null,
            currentQuestion: this.data.questions[0]
          })
          this.updateProgress()
        } else {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      }
    })
  }
})