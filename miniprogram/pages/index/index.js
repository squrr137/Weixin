// pages/index/index.js
const app = getApp()
const request = require('../../utils/request')

Page({
  data: {
    userInfo: {},
    currentDate: '',
    userPoints: 0,
    medicationStats: {
      total: 0,
      completed: 0
    },
    learningStats: {
      total: 0,
      completed: 0
    },
    todayMedications: [],
    recommendContents: []
  },

  onLoad() {
    this.loadUserData()
    this.loadTodayMedications()
    this.loadRecommendContents()
    this.loadUserStats()
  },

  onShow() {
    this.loadTodayMedications()
    this.loadUserPoints()
  },

  loadUserData() {
    const userInfo = app.globalData.userInfo || {}
    this.setData({ userInfo })
    
    // 格式化当前日期
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const weekday = weekdays[date.getDay()]
    
    this.setData({
      currentDate: `${year}年${month}月${day}日 ${weekday}`,
      userPoints: app.globalData.currentPoints || 0
    })
  },

  async loadUserPoints() {
    try {
      const res = await request({
        url: '/points'
      })
      this.setData({ 
        userPoints: res.data.currentPoints 
      })
      app.setGlobalData('currentPoints', res.data.currentPoints)
    } catch (error) {
      console.error('获取积分失败:', error)
    }
  },

  async loadTodayMedications() {
    try {
      const res = await request({
        url: '/medications/today'
      })
      this.setData({
        todayMedications: res.data.medications,
        medicationStats: res.data.stats
      })
    } catch (error) {
      console.error('获取今日用药失败:', error)
      this.setData({
        todayMedications: [],
        medicationStats: { total: 0, completed: 0 }
      })
    }
  },

  async loadRecommendContents() {
    try {
      const res = await request({
        url: '/contents?isRecommend=true&limit=5'
      })
      this.setData({
        recommendContents: res.data.contents || []
      })
    } catch (error) {
      console.error('获取推荐内容失败:', error)
      this.setData({ recommendContents: [] })
    }
  },

  async loadUserStats() {
    try {
      const res = await request({
        url: '/user/stats'
      })
      this.setData({
        learningStats: res.data.learning
      })
    } catch (error) {
      console.error('获取用户统计失败:', error)
    }
  },

  // 页面跳转
  goToMedicationRecords() {
    wx.navigateTo({
      url: '/pages/profile/records/medication-records/medication-records'
    })
  },

  goToPoints() {
    wx.navigateTo({
      url: '/pages/profile/points/points'
    })
  },

  goToLearningRecords() {
    wx.navigateTo({
      url: '/pages/profile/records/learning-records/learning-records'
    })
  },

  goToAddMedication() {
    wx.navigateTo({
      url: '/pages/drug-management/add/add'
    })
  },

  goToCheckIn() {
    wx.navigateTo({
      url: '/pages/drug-management/checkin/checkin'
    })
  },

  goToDiscomfort() {
    wx.navigateTo({
      url: '/pages/drug-management/discomfort/discomfort'
    })
  },

  goToAssessment() {
    wx.switchTab({
      url: '/pages/self-assessment/self-assessment'
    })
  },

  goToMedicationManagement() {
    wx.navigateTo({
      url: '/pages/drug-management/drug-management'
    })
  },

  goToMedicationDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/drug-management/detail/detail?id=${id}`
    })
  },

  goToContentDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/drug-library/detail/detail?id=${id}`
    })
  },

  checkIn(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/drug-management/checkin/checkin?id=${id}`
    })
  }
})