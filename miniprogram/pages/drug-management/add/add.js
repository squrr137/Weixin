// pages/drug-management/add/add.js
const storage = require('../../../utils/storage')

Page({
  data: {
    formData: {
      name: '',
      dosage: '',
      dosageForm: '',
      note: '',
      startDate: this.formatDate(new Date()),
      endDate: '',
      repeat: '每天',
      weekdays: []
    },
    schedule: [
      { time: '08:00', dose: '' },
      { time: '12:00', dose: '' },
      { time: '18:00', dose: '' }
    ],
    dosageForms: ['片剂', '胶囊', '口服液', '颗粒', '注射剂', '其他'],
    weekdays: [
      { label: '周一', value: '1' },
      { label: '周二', value: '2' },
      { label: '周三', value: '3' },
      { label: '周四', value: '4' },
      { label: '周五', value: '5' },
      { label: '周六', value: '6' },
      { label: '周日', value: '7' }
    ],
    canSubmit: false,
    submitting: false
  },

  onLoad() {
    this.checkFormValid()
  },

  formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    this.setData({
      [`formData.${field}`]: value
    })
    this.checkFormValid()
  },

  onDosageFormChange(e) {
    this.setData({
      'formData.dosageForm': this.data.dosageForms[e.detail.value]
    })
  },

  onStartDateChange(e) {
    this.setData({
      'formData.startDate': e.detail.value
    })
  },

  onEndDateChange(e) {
    this.setData({
      'formData.endDate': e.detail.value
    })
  },

  onRepeatChange(e) {
    this.setData({
      'formData.repeat': e.detail.value
    })
  },

  onWeekdayChange(e) {
    // 处理星期选择
  },

  addSchedule() {
    const schedule = this.data.schedule
    schedule.push({ time: '', dose: '' })
    this.setData({ schedule })
  },

  removeSchedule(e) {
    const index = e.currentTarget.dataset.index
    const schedule = this.data.schedule
    schedule.splice(index, 1)
    this.setData({ schedule })
  },

  onTimeChange(e) {
    const index = e.currentTarget.dataset.index
    const time = e.detail.value
    const key = `schedule[${index}].time`
    this.setData({ [key]: time })
  },

  onScheduleDoseInput(e) {
    const index = e.currentTarget.dataset.index
    const dose = e.detail.value
    const key = `schedule[${index}].dose`
    this.setData({ [key]: dose })
  },

  checkFormValid() {
    const { name, dosage } = this.data.formData
    const hasValidSchedule = this.data.schedule.some(item => item.time && item.dose)
    const canSubmit = name && dosage && hasValidSchedule
    this.setData({ canSubmit })
  },

  handleSubmit(e) {
    if (!this.data.canSubmit) return

    this.setData({ submitting: true })

    // 构建用药计划
    const medication = {
      id: storage.generateId(),
      ...this.data.formData,
      schedule: this.generateSchedule(),
      createTime: new Date().toISOString()
    }

    storage.addMedication(medication)

    wx.showToast({
      title: '添加成功',
      icon: 'success',
      duration: 2000,
      success: () => {
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      }
    })

    this.setData({ submitting: false })
  },

  generateSchedule() {
    const schedule = {}
    const startDate = new Date(this.data.formData.startDate)
    const endDate = this.data.formData.endDate ? new Date(this.data.formData.endDate) : null
    
    // 生成30天的用药计划
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      
      if (endDate && date > endDate) break
      
      const dateStr = this.formatDate(date)
      schedule[dateStr] = this.data.schedule.map(item => ({
        time: item.time,
        dose: item.dose || this.data.formData.dosage,
        status: 'pending'
      }))
    }
    
    return schedule
  }
})