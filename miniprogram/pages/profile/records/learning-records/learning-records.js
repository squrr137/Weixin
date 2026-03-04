// pages/profile/records/learning-records/learning-records.js
const storage = require('../../../../utils/storage')
const mockData = require('../../../../utils/mockData')

Page({
  data: {
    records: [],
    stats: {
      total: 0,
      thisMonth: 0,
      points: 0
    },
    categoryStats: [],
    timeRanges: ['全部', '近一周', '近一月', '近三月'],
    currentTimeRange: '全部'
  },

  onLoad() {
    this.loadRecords()
    this.calculateStats()
  },

  onShow() {
    this.loadRecords()
    this.calculateStats()
  },

  loadRecords() {
    const records = storage.getLearningRecords()
    
    // 格式化时间
    const formattedRecords = records.map(record => ({
      ...record,
      createTime: this.formatDate(record.createTime)
    }))
    
    this.setData({
      records: this.filterRecordsByTimeRange(formattedRecords, this.data.currentTimeRange)
    })
  },

  formatDate(dateStr) {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now - date
    
    // 今天
    if (date.toDateString() === now.toDateString()) {
      return `今天 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    }
    
    // 昨天
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    if (date.toDateString() === yesterday.toDateString()) {
      return `昨天 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    }
    
    // 更早
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${month}-${day}`
  },

  calculateStats() {
    const records = storage.getLearningRecords()
    
    // 总学习数
    const total = records.length
    
    // 本月学习数
    const now = new Date()
    const thisMonth = records.filter(record => {
      const recordDate = new Date(record.createTime)
      return recordDate.getMonth() === now.getMonth() && 
             recordDate.getFullYear() === now.getFullYear()
    }).length
    
    // 获得积分
    const points = total * 10
    
    // 分类统计
    const contents = mockData.drugLibraryContents
    const categoryMap = {}
    
    contents.forEach(content => {
      if (!categoryMap[content.category]) {
        categoryMap[content.category] = {
          total: 0,
          learned: 0
        }
      }
      categoryMap[content.category].total++
    })
    
    records.forEach(record => {
      const content = contents.find(c => c.id === record.contentId)
      if (content && categoryMap[content.category]) {
        categoryMap[content.category].learned++
      }
    })
    
    const categoryStats = Object.keys(categoryMap).map(key => ({
      name: key,
      total: categoryMap[key].total,
      count: categoryMap[key].learned,
      percentage: Math.round((categoryMap[key].learned / categoryMap[key].total) * 100)
    }))
    
    this.setData({
      stats: { total, thisMonth, points },
      categoryStats
    })
  },

  onTimeRangeChange(e) {
    const range = this.data.timeRanges[e.detail.value]
    this.setData({ currentTimeRange: range })
    this.loadRecords()
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

  goToDrugLibrary() {
    wx.switchTab({
      url: '/pages/drug-library/drug-library'
    })
  }
})