// pages/profile/support/support.js
const mockData = require('../../../utils/mockData')

Page({
  data: {
    faqList: []
  },

  onLoad() {
    // 加载常见问题
    const faqList = mockData.faqList.map(item => ({
      ...item,
      expanded: false
    }))
    
    this.setData({ faqList })
  },

  toggleFaq(e) {
    const id = e.currentTarget.dataset.id
    const faqList = this.data.faqList.map(item => {
      if (item.id === id) {
        return { ...item, expanded: !item.expanded }
      }
      return item
    })
    
    this.setData({ faqList })
  },

  callPhone(e) {
    const phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },

  makePhoneCall(e) {
    const phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },

  copyText(e) {
    const text = e.currentTarget.dataset.text
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({
          title: '复制成功',
          icon: 'success'
        })
      }
    })
  }
})