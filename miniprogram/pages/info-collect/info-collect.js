// pages/info-collect/info-collect.js
const app = getApp()
const request = require('../../utils/request')

Page({
  data: {
    // 表单数据
    nickname: '',
    age: '',
    gender: '',
    education: '',
    diagnosis: '',
    durationYear: '',
    durationMonth: '',
    firstOnsetDate: '',
    allergy: '',
    medications: [],

    // 下拉选项
    ageRange: Array.from({ length: 83 }, (_, i) => i + 18), // 18-100岁
    educationLevels: ['小学及以下', '初中', '高中/中专', '大专', '本科', '硕士及以上'],
    diagnosisTypes: ['精神分裂症', '抑郁症', '焦虑症', '双相情感障碍', '强迫症', '其他'],

    // 当前日期
    currentDate: new Date().toISOString().split('T')[0],

    // 弹窗相关
    showMedicationModal: false,
    editingMedication: null,
    medicationForm: {
      name: '',
      dose: '',
      frequency: ''
    },

    // 提交状态
    submitting: false,
    canSubmit: false
  },

  onLoad() {
    this.checkCanSubmit()
  },

  // 检查表单完整性
  checkCanSubmit() {
    const { nickname, age, gender, diagnosis, durationYear, durationMonth } = this.data
    const canSubmit = nickname && age && gender && diagnosis && 
                     (durationYear || durationMonth)
    this.setData({ canSubmit })
  },

  // 输入处理
  onNicknameInput(e) {
    this.setData({ nickname: e.detail.value })
    this.checkCanSubmit()
  },

  onAgeChange(e) {
    this.setData({ age: this.data.ageRange[e.detail.value] })
    this.checkCanSubmit()
  },

  onGenderChange(e) {
    this.setData({ gender: e.detail.value })
    this.checkCanSubmit()
  },

  onEducationChange(e) {
    this.setData({ education: this.data.educationLevels[e.detail.value] })
  },

  onDiagnosisChange(e) {
    this.setData({ diagnosis: this.data.diagnosisTypes[e.detail.value] })
    this.checkCanSubmit()
  },

  onDurationYearInput(e) {
    this.setData({ durationYear: e.detail.value })
    this.checkCanSubmit()
  },

  onDurationMonthInput(e) {
    this.setData({ durationMonth: e.detail.value })
    this.checkCanSubmit()
  },

  onFirstOnsetChange(e) {
    this.setData({ firstOnsetDate: e.detail.value })
  },

  onAllergyInput(e) {
    this.setData({ allergy: e.detail.value })
  },

  // 药物弹窗相关
  addMedication() {
    this.setData({
      showMedicationModal: true,
      editingMedication: null,
      medicationForm: { name: '', dose: '', frequency: '' }
    })
  },

  editMedication(e) {
    const index = e.currentTarget.dataset.index
    const medication = this.data.medications[index]
    this.setData({
      showMedicationModal: true,
      editingMedication: index,
      medicationForm: { ...medication }
    })
  },

  deleteMedication(e) {
    const index = e.currentTarget.dataset.index
    const medications = this.data.medications
    medications.splice(index, 1)
    this.setData({ medications })
  },

  onMedicationNameInput(e) {
    this.setData({ 'medicationForm.name': e.detail.value })
  },

  onMedicationDoseInput(e) {
    this.setData({ 'medicationForm.dose': e.detail.value })
  },

  onMedicationFreqInput(e) {
    this.setData({ 'medicationForm.frequency': e.detail.value })
  },

  saveMedication() {
    const { name, dose, frequency } = this.data.medicationForm
    if (!name || !dose || !frequency) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }

    const medications = [...this.data.medications]
    
    if (this.data.editingMedication !== null) {
      medications[this.data.editingMedication] = this.data.medicationForm
    } else {
      medications.push(this.data.medicationForm)
    }

    this.setData({
      medications,
      showMedicationModal: false
    })
  },

  closeMedicationModal() {
    this.setData({ showMedicationModal: false })
  },

  // 提交表单
  async handleSubmit() {
    if (!this.data.canSubmit) return

    this.setData({ submitting: true })

    try {
      const baseInfo = {
        age: this.data.age,
        gender: this.data.gender,
        education: this.data.education,
        diagnosis: this.data.diagnosis,
        duration: {
          years: this.data.durationYear,
          months: this.data.durationMonth
        },
        firstOnsetDate: this.data.firstOnsetDate,
        allergy: this.data.allergy,
        medications: this.data.medications
      }

      const res = await request({
        url: '/user/base-info',
        method: 'POST',
        data: baseInfo
      })

      app.setGlobalData('baseInfoCollected', true)

      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000,
        success: () => {
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/index/index'
            })
          }, 1500)
        }
      })
    } catch (error) {
      wx.showToast({
        title: error.message || '提交失败',
        icon: 'none'
      })
    } finally {
      this.setData({ submitting: false })
    }
  }
})