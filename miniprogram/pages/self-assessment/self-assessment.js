// pages/self-assessment/self-assessment.js
const storage = require('../../utils/storage')
const mockData = require('../../utils/mockData')

Page({
  data: {
    latestResults: {},
    recentHistory: [],
    assessmentTypes: {
      drugLiteracy: '药物素养评估',
      mmas8: '服药依从性评估',
      selfManagement: '精神症状自我管理',
      selfEfficacy: '合理用药自我效能'
    }
  },

  onLoad() {
    this.loadAssessmentHistory()
  },

  onShow() {
    this.loadAssessmentHistory()
  },

  loadAssessmentHistory() {
    const records = storage.getAssessmentRecords()
    
    // 获取最新结果
    const latestResults = {}
    records.forEach(record => {
      if (!latestResults[record.type] || 
          new Date(record.createTime) > new Date(latestResults[record.type].createTime)) {
        latestResults[record.type] = record
      }
    })
    
    // 获取最近5条记录
    const recentHistory = records
      .sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
      .slice(0, 5)
    
    this.setData({ latestResults, recentHistory })
  },

  goToAssessment(e) {
    const type = e.currentTarget.dataset.type
    
    // 检查测评是否开放
    const app = getApp()
    if (!app.globalData.systemSettings.assessmentOpen) {
      wx.showToast({
        title: '测评暂未开放',
        icon: 'none'
      })
      return
    }
    
    wx.navigateTo({
      url: `/pages/self-assessment/questionnaire/questionnaire?type=${type}`
    })
  },

  getAssessmentTypeName(type) {
    return this.data.assessmentTypes[type] || type
  },

  viewAllHistory() {
    wx.navigateTo({
      url: '/pages/profile/records/assessment-records/assessment-records'
    })
  }
})