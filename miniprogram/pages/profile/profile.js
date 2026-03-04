// pages/profile/profile.js
const storage = require('../../utils/storage')
const app = getApp()

Page({
  data: {
    userInfo: {},
    points: 0,
    stats: {
      medicationDays: 0,
      learnedCount: 0,
      assessmentCount: 0,
      rank: '--'
    }
  },

  onLoad() {
    this.loadUserData()
    this.loadStats()
  },

  onShow() {
    this.loadUserData()
    this.loadStats()
  },

  loadUserData() {
    const userInfo = app.globalData.userInfo || {}
    const points = app.globalData.currentPoints || 0
    
    this.setData({ userInfo, points })
  },

  loadStats() {
    // 计算连续用药天数
    const medications = storage.getMedications()
    const medicationDays = this.calculateMedicationDays(medications)
    
    // 学习内容数量
    const learningRecords = storage.getLearningRecords()
    const learnedCount = learningRecords.length
    
    // 测评次数
    const assessmentRecords = storage.getAssessmentRecords()
    const assessmentCount = assessmentRecords.length
    
    this.setData({
      stats: {
        medicationDays,
        learnedCount,
        assessmentCount,
        rank: Math.floor(Math.random() * 100) // 模拟排名
      }
    })
  },

  calculateMedicationDays(medications) {
    // 简化实现，实际应该计算连续打卡天数
    return medications.length > 0 ? Math.floor(Math.random() * 30) + 1 : 0
  },

  goToPoints() {
    wx.navigateTo({
      url: '/pages/profile/points/points'
    })
  },

  goToMedicationRecords() {
    wx.navigateTo({
      url: '/pages/profile/records/medication-records/medication-records'
    })
  },

  goToLearningRecords() {
    wx.navigateTo({
      url: '/pages/profile/records/learning-records/learning-records'
    })
  },

  goToAssessmentRecords() {
    wx.navigateTo({
      url: '/pages/profile/records/assessment-records/assessment-records'
    })
  },

  goToProfileEdit() {
    wx.navigateTo({
      url: '/pages/profile/edit/edit'
    })
  },

  goToQuestions() {
    wx.navigateTo({
      url: '/pages/profile/questions/questions'
    })
  },

  goToSupport() {
    wx.navigateTo({
      url: '/pages/profile/support/support'
    })
  },

  goToSettings() {
    wx.navigateTo({
      url: '/pages/profile/settings/settings'
    })
  },

  handleLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除登录信息
          app.setGlobalData('token', null)
          app.setGlobalData('userInfo', null)
          
          wx.reLaunch({
            url: '/pages/login/login'
          })
        }
      }
    })
  }
})