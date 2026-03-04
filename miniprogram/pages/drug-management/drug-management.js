// pages/drug-management/drug-management.js
const storage = require('../../utils/storage')

Page({
  data: {
    selectedDate: '',
    displayDate: '',
    medications: [],
    timelineData: [],
    stats: {
      total: 0,
      completed: 0,
      pending: 0,
      missed: 0
    },
    complianceRate: 0
  },

  onLoad() {
    const today = new Date()
    const dateStr = this.formatDate(today)
    this.setData({ 
      selectedDate: dateStr,
      displayDate: this.getDisplayDate(today)
    })
    this.loadMedications(dateStr)
  },

  onShow() {
    this.loadMedications(this.data.selectedDate)
  },

  formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  },

  getDisplayDate(date) {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return '今天'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return '明天'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '昨天'
    } else {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      const weekday = weekdays[date.getDay()]
      return `${year}年${month}月${day}日 ${weekday}`
    }
  },

  onDateChange(e) {
    const dateStr = e.detail.value
    const date = new Date(dateStr)
    this.setData({ 
      selectedDate: dateStr,
      displayDate: this.getDisplayDate(date)
    })
    this.loadMedications(dateStr)
  },

  loadMedications(date) {
    const allMedications = storage.getMedications()
    
    // 过滤出当天的用药
    const timelineData = []
    const stats = {
      total: 0,
      completed: 0,
      pending: 0,
      missed: 0
    }

    allMedications.forEach(med => {
      // 检查是否包含该日期
      if (med.schedule && med.schedule[date]) {
        med.schedule[date].forEach(item => {
          timelineData.push({
            id: `${med.id}_${item.time}`,
            name: med.name,
            dosage: med.dosage,
            time: item.time,
            status: item.status || 'pending',
            note: item.note || ''
          })
        })
      }
    })

    // 按时间排序
    timelineData.sort((a, b) => a.time.localeCompare(b.time))

    // 计算统计数据
    stats.total = timelineData.length
    stats.completed = timelineData.filter(item => item.status === 'completed').length
    stats.pending = timelineData.filter(item => item.status === 'pending').length
    stats.missed = timelineData.filter(item => item.status === 'missed').length

    // 计算依从率
    const complianceRate = stats.total > 0 
      ? Math.round((stats.completed / stats.total) * 100) 
      : 0

    this.setData({
      timelineData,
      stats,
      complianceRate
    })
  },

  takeMedication(e) {
    const id = e.currentTarget.dataset.id
    const [medId, time] = id.split('_')
    
    // 更新用药状态
    const medications = storage.getMedications()
    const medIndex = medications.findIndex(m => m.id === medId)
    
    if (medIndex > -1 && medications[medIndex].schedule[this.data.selectedDate]) {
      const items = medications[medIndex].schedule[this.data.selectedDate]
      const itemIndex = items.findIndex(i => i.time === time)
      
      if (itemIndex > -1) {
        items[itemIndex].status = 'completed'
        items[itemIndex].takenTime = new Date().toLocaleTimeString()
        storage.setMedications(medications)
        
        // 增加积分
        getApp().addPoints(5, '按时服药')
        
        wx.showToast({
          title: '打卡成功 +5积分',
          icon: 'success'
        })
        
        // 刷新页面
        this.loadMedications(this.data.selectedDate)
      }
    }
  },

  delayMedication(e) {
    const id = e.currentTarget.dataset.id
    const [medId, time] = id.split('_')
    
    wx.showActionSheet({
      itemList: ['15分钟后', '30分钟后', '1小时后', '2小时后'],
      success: (res) => {
        const medications = storage.getMedications()
        const medIndex = medications.findIndex(m => m.id === medId)
        
        if (medIndex > -1 && medications[medIndex].schedule[this.data.selectedDate]) {
          const items = medications[medIndex].schedule[this.data.selectedDate]
          const itemIndex = items.findIndex(i => i.time === time)
          
          if (itemIndex > -1) {
            items[itemIndex].status = 'delayed'
            items[itemIndex].delayTime = res.tapIndex
            storage.setMedications(medications)
            
            wx.showToast({
              title: '已设置为延迟',
              icon: 'success'
            })
            
            this.loadMedications(this.data.selectedDate)
          }
        }
      }
    })
  },

  goToAddMedication() {
    wx.navigateTo({
      url: '/pages/drug-management/add/add'
    })
  },

  goToDiscomfort() {
    wx.navigateTo({
      url: '/pages/drug-management/discomfort/discomfort'
    })
  },

  goToMissedRecord() {
    wx.navigateTo({
      url: '/pages/drug-management/missed/missed'
    })
  },

  goToSideEffect() {
    wx.navigateTo({
      url: '/pages/drug-management/side-effect/side-effect'
    })
  }
})