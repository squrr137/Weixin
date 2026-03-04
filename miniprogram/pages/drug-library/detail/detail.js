// pages/drug-library/detail/detail.js
const mockData = require('../../../utils/mockData')
const storage = require('../../../utils/storage')
const app = getApp()

Page({
  data: {
    content: {},
    formattedContent: '',
    isCollected: false,
    isRead: false,
    relatedContents: []
  },

  onLoad(options) {
    const { id } = options
    this.loadContent(id)
    this.checkReadStatus(id)
    this.checkCollectStatus(id)
  },

  loadContent(id) {
    // 从模拟数据查找
    const content = mockData.drugLibraryContents.find(item => item.id === id) || {
      id: id,
      title: '示例内容',
      category: '用药基础知识',
      content: '这是示例内容，实际数据将从服务器获取。',
      readCount: 100,
      createTime: '2024-01-01'
    }
    
    // 格式化内容，添加样式
    const formattedContent = this.formatContent(content.content)
    
    this.setData({ 
      content,
      formattedContent
    })
    
    // 加载相关推荐
    this.loadRelatedContents(content.category, id)
  },

  formatContent(content) {
    // 将纯文本转换为富文本，添加样式
    const paragraphs = content.split('\n').map(p => p.trim()).filter(p => p)
    
    let html = '<div class="content-body">'
    paragraphs.forEach(p => {
      if (p.startsWith('#')) {
        // 标题
        html += `<h3>${p.substring(1)}</h3>`
      } else if (p.startsWith('-')) {
        // 列表项
        html += `<li>${p.substring(1)}</li>`
      } else {
        // 普通段落
        html += `<p>${p}</p>`
      }
    })
    html += '</div>'
    
    return html
  },

  loadRelatedContents(category, currentId) {
    const related = mockData.drugLibraryContents
      .filter(item => item.category === category && item.id !== currentId)
      .slice(0, 3)
    
    this.setData({ relatedContents: related })
  },

  checkReadStatus(id) {
    const records = storage.getLearningRecords()
    const isRead = records.some(r => r.contentId === id)
    this.setData({ isRead })
  },

  checkCollectStatus(id) {
    const collects = wx.getStorageSync('collected_contents') || []
    const isCollected = collects.includes(id)
    this.setData({ isCollected })
  },

  handleCollect() {
    const { id } = this.data.content
    let collects = wx.getStorageSync('collected_contents') || []
    
    if (this.data.isCollected) {
      collects = collects.filter(item => item !== id)
      wx.showToast({
        title: '已取消收藏',
        icon: 'success'
      })
    } else {
      collects.push(id)
      wx.showToast({
        title: '收藏成功',
        icon: 'success'
      })
    }
    
    wx.setStorageSync('collected_contents', collects)
    this.setData({ isCollected: !this.data.isCollected })
  },

  handleShare() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  markAsRead() {
    const { id, title } = this.data.content
    
    // 添加学习记录
    storage.addLearningRecord(id, title)
    
    // 增加积分
    app.addPoints(10, '完成学习')
    
    this.setData({ isRead: true })
    
    wx.showToast({
      title: '已标记为已读 +10积分',
      icon: 'success'
    })
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.redirectTo({
      url: `/pages/drug-library/detail/detail?id=${id}`
    })
  },

  onShareAppMessage() {
    const { title } = this.data.content
    return {
      title: title,
      path: `/pages/drug-library/detail/detail?id=${this.data.content.id}`
    }
  }
})