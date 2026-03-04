// pages/consent/consent.js
const app = getApp()
const request = require('../../utils/request')

Page({
  data: {
    agreed: false
  },

  onLoad() {
    // 检查是否已同意
    if (app.checkConsent()) {
      wx.redirectTo({
        url: '/pages/info-collect/info-collect'
      })
    }
  },

  // 同意勾选变化
  onAgreeChange(e) {
    this.setData({
      agreed: e.detail.value.length > 0
    })
  },

  // 确认同意
  async handleConfirm() {
    if (!this.data.agreed) return

    wx.showLoading({ title: '提交中...' })

    try {
      const res = await request({
        url: '/user/consent',
        method: 'POST'
      })

      app.setGlobalData('hasConsented', true)
      
      wx.hideLoading()
      
      // 跳转到信息收集页
      wx.redirectTo({
        url: '/pages/info-collect/info-collect'
      })
    } catch (error) {
      wx.hideLoading()
      wx.showToast({
        title: error.message || '提交失败，请重试',
        icon: 'none'
      })
    }
  },

  // 拒绝使用
  handleReject() {
    wx.showModal({
      title: '提示',
      content: '您需要同意知情同意书才能使用本小程序。如有疑问，请联系管理员。',
      confirmText: '我知道了',
      showCancel: false
    })
  }
})