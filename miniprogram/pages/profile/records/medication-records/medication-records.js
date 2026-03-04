// pages/profile/records/medication-records/medication-records.js
const storage = require('../../../../utils/storage')

Page({
  data: {
    selectedDate: '',
    displayDate: '',
    currentMonth: '',
    displayMonth: '',
    records: [],
    stats: {
      total: 0,
      completed: 0,
      compliance: 0
    },
    showCalendar: false,
    calendarDays: []
  },

  onLoad() {
    const today = this.formatDate(new Date())
    const currentMonth = today.substring(0, 7)
    
    this.setData({
      selectedDate: today,
      displayDate: this.getDisplayDate(today),
      currentMonth: currentMonth,
      displayMonth: this.formatMonth(currentMonth)
    })
    
    this.loadRecords(today)
    this.generateCalendar(currentMonth)
  },

  formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  },

  getDisplayDate(dateStr) {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return '今天'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '昨天'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return '明天'
    } else {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      const weekday = weekdays[date.getDay()]
      return `${year}年${month}月${day}日 ${weekday}`
    }
  },

  formatMonth(monthStr) {
    const [year, month] = monthStr.split('-')
    return `${year}年${month}月`
  },

  onDateChange(e) {
    const date = e.detail.value
    this.setData({
      selectedDate: date,
      displayDate: this.getDisplayDate(date)
    })
    this.loadRecords(date)
  },

  onMonthChange(e) {
    const month = e.detail.value.substring(0, 7)
    this.setData({
      currentMonth: month,
      displayMonth: this.formatMonth(month)
    })
    this.generateCalendar(month)
  },

  loadRecords(date) {
    const medications = storage.getMedications()
    const records = []
    let completed = 0

    medications.forEach(med => {
      if (med.schedule && med.schedule[date]) {
        med.schedule[date].forEach(item => {
          records.push({
            id: `${med.id}_${item.time}`,
            name: med.name,
            dosage: med.dosage || item.dose,
            time: item.time,
            status: item.status || 'pending',
            note: item.note || ''
          })
          if (item.status === 'completed') {
            completed++
          }
        })
      }
    })

    records.sort((a, b) => a.time.localeCompare(b.time))

    const total = records.length
    const compliance = total > 0 ? Math.round((completed / total) * 100) : 0

    this.setData({
      records,
      stats: { total, completed, compliance }
    })
  },

  generateCalendar(month) {
    const [year, monthNum] = month.split('-').map(Number)
    const firstDay = new Date(year, monthNum - 1, 1)
    const lastDay = new Date(year, monthNum, 0)
    
    const days = []
    const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1 // 周一为一周开始
    
    // 填充上月日期
    for (let i = 0; i < startOffset; i++) {
      days.push({ day: '', date: '', hasRecord: false })
    }
    
    // 填充当月日期
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dateStr = `${year}-${String(monthNum).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const hasRecord = this.checkDateHasRecord(dateStr)
      const compliance = this.calculateDateCompliance(dateStr)
      
      days.push({
        day: d,
        date: dateStr,
        hasRecord,
        compliance
      })
    }
    
    this.setData({ calendarDays: days })
  },

  checkDateHasRecord(dateStr) {
    const medications = storage.getMedications()
    return medications.some(med => med.schedule && med.schedule[dateStr])
  },

  calculateDateCompliance(dateStr) {
    const medications = storage.getMedications()
    let total = 0
    let completed = 0
    
    medications.forEach(med => {
      if (med.schedule && med.schedule[dateStr]) {
        med.schedule[dateStr].forEach(item => {
          total++
          if (item.status === 'completed') completed++
        })
      }
    })
    
    return total > 0 ? Math.round((completed / total) * 100) : 0
  },

  selectDay(e) {
    const date = e.currentTarget.dataset.date
    if (date) {
      this.setData({
        selectedDate: date,
        displayDate: this.getDisplayDate(date),
        showCalendar: false
      })
      this.loadRecords(date)
    }
  },

  toggleView(e) {
    const view = e.currentTarget.dataset.view
    this.setData({
      showCalendar: view === 'calendar'
    })
    if (view === 'calendar') {
      this.generateCalendar(this.data.currentMonth)
    }
  }
})