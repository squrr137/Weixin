// pages/profile/points/points.js
const storage = require('../../../utils/storage')
const app = getApp()

Page({
  data: {
    totalPoints: 0,
    pointsRecords: [],
    timeRanges: ['全部', '近一周', '近一月', '近三月'],
    currentTimeRange: '全部'
  },

  onLoad() {
    this.loadPointsData()
  },

  onShow() {
    this.loadPointsData()
  },

  loadPointsData() {
    const totalPoints = app.globalData.currentPoints || 0
    const records = storage.getPointsRecords()
    
    this.setData({
      totalPoints,
      pointsRecords: this.filterRecordsByTimeRange(records, this.data.currentTimeRange)
    })
  },

  onTimeRangeChange(e) {
    const range = this.data.timeRanges[e.detail.value]
    this.setData({ currentTimeRange: range })
    this.loadPointsData()
  },

  filterRecordsByTimeRange(records, range) {
    if (range === '全部') return records
    
    const now = new Date()
    const startDate = new Date()
    
    if (range === '近一周') {
      startDate.setDate(now.getDate() - 7)
    } else if (range === '近一月') {
      startDate.setMonth(now.getMonth() - 1)
    } else if (range === '近三月') {
      startDate.setMonth(now.getMonth() - 3)
    }
    
    return records.filter(record => new Date(record.createTime) >= startDate)
  },

  showPointsRule() {
    wx.showModal({
      title: '积分规则',
      content: '1. 完成学习内容 +10积分\n2. 按时服药打卡 +5积分\n3. 完成测评 +20积分\n4. 连续7天打卡 +50积分\n5. 积分可用于兑换健康礼品',
      showCancel: false
    })
  }
})