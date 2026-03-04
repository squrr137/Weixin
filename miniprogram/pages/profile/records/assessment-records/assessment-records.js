// pages/profile/records/assessment-records/assessment-records.js
const storage = require('../../../../utils/storage')

Page({
  data: {
    records: [],
    stats: {
      total: 0,
      avgScore: 0,
      points: 0
    },
    chartData: [],
    assessmentTypes: ['全部类型', '药物素养', '服药依从性', '自我管理', '自我效能'],
    currentType: '全部类型',
    typeMap: {
      drugLiteracy: '药物素养',
      mmas8: '服药依从性',
      selfManagement: '自我管理',
      selfEfficacy: '自我效能'
    }
  },

  onLoad() {
    this.loadRecords()
  },

  onShow() {
    this.loadRecords()
  },

  loadRecords() {
    let records = storage.getAssessmentRecords()
    
    // 按类型过滤
    if (this.data.currentType !== '全部类型') {
      const typeKey = this.getTypeKey(this.data.currentType)
      records = records.filter(r => r.type === typeKey)
    }
    
    // 按时间排序
    records.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
    
    // 格式化时间
    const formattedRecords = records.map(record => ({
      ...record,
      createTime: this.formatDate(record.createTime)
    }))
    
    // 计算统计
    const total = records.length
    const avgScore = total > 0 
      ? (records.reduce((sum, r) => sum + parseFloat(r.score), 0) / total).toFixed(1)
      : 0
    const points = total * 20
    
    // 准备图表数据
    const chartData = records.slice(0, 10).reverse().map(r => ({
      score: parseFloat(r.score),
      date: this.formatShortDate(r.createTime)
    }))
    
    this.setData({
      records: formattedRecords,
      stats: { total, avgScore, points },
      chartData
    })
    
    if (chartData.length > 1) {
      this.drawChart()
    }
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
    
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  },

  formatShortDate(dateStr) {
    const date = new Date(dateStr)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${month}-${day}`
  },

  getTypeName(type) {
    return this.data.typeMap[type] || type
  },

  getTypeKey(name) {
    const map = {
      '药物素养': 'drugLiteracy',
      '服药依从性': 'mmas8',
      '自我管理': 'selfManagement',
      '自我效能': 'selfEfficacy'
    }
    return map[name]
  },

  getLevelClass(level) {
    if (level.includes('优秀') || level.includes('高')) return 'high'
    if (level.includes('良好') || level.includes('中等')) return 'medium'
    return 'low'
  },

  onTypeChange(e) {
    const type = this.data.assessmentTypes[e.detail.value]
    this.setData({ currentType: type })
    this.loadRecords()
  },

  drawChart() {
    const ctx = wx.createCanvasContext('trendChart', this)
    const data = this.data.chartData
    const width = 600
    const height = 200
    const padding = 40
    
    // 清空画布
    ctx.clearRect(0, 0, width, height)
    
    // 计算最大值和最小值
    const scores = data.map(d => d.score)
    const maxScore = Math.max(...scores, 10)
    const minScore = Math.min(...scores, 0)
    
    // 绘制坐标轴
    ctx.beginPath()
    ctx.setStrokeStyle('#DDDDDD')
    ctx.setLineWidth(2)
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()
    
    // 绘制折线
    const pointWidth = (width - 2 * padding) / (data.length - 1)
    
    ctx.beginPath()
    ctx.setStrokeStyle('#4A90E2')
    ctx.setLineWidth(4)
    
    data.forEach((item, index) => {
      const x = padding + index * pointWidth
      const y = height - padding - ((item.score - minScore) / (maxScore - minScore)) * (height - 2 * padding)
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()
    
    // 绘制数据点
    data.forEach((item, index) => {
      const x = padding + index * pointWidth
      const y = height - padding - ((item.score - minScore) / (maxScore - minScore)) * (height - 2 * padding)
      
      ctx.beginPath()
      ctx.setFillStyle('#4A90E2')
      ctx.arc(x, y, 6, 0, 2 * Math.PI)
      ctx.fill()
      
      // 绘制数值
      ctx.setFillStyle('#333333')
      ctx.setFontSize(20)
      ctx.setTextAlign('center')
      ctx.fillText(item.score.toFixed(1), x, y - 20)
      
      // 绘制日期
      ctx.setFillStyle('#999999')
      ctx.setFontSize(18)
      ctx.fillText(item.date, x, height - padding + 25)
    })
    
    ctx.draw()
  },

  viewDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/self-assessment/result/result?id=${id}`
    })
  },

  goToAssessment() {
    wx.switchTab({
      url: '/pages/self-assessment/self-assessment'
    })
  }
})