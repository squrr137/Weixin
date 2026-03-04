// pages/drug-library/drug-library.js
const mockData = require('../../utils/mockData')
const storage = require('../../utils/storage')

Page({
  data: {
    currentCategory: 'all',
    searchKeyword: '',
    contents: [],
    filteredContents: []
  },

  onLoad() {
    this.loadContents()
  },

  onShow() {
    // 每次显示时刷新
    this.filterContents()
  },

  loadContents() {
    // 从模拟数据加载
    const contents = mockData.drugLibraryContents
    this.setData({ 
      contents,
      filteredContents: contents
    })
  },

  // 切换分类
  switchCategory(e) {
    const category = e.currentTarget.dataset.category
    this.setData({ currentCategory: category })
    this.filterContents()
  },

  // 搜索输入
  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value })
    this.filterContents()
  },

  // 执行搜索
  handleSearch() {
    this.filterContents()
  },

  // 过滤内容
  filterContents() {
    let filtered = this.data.contents
    
    // 按分类过滤
    if (this.data.currentCategory !== 'all') {
      filtered = filtered.filter(item => item.category === this.data.currentCategory)
    }
    
    // 按关键词搜索
    if (this.data.searchKeyword) {
      const keyword = this.data.searchKeyword.toLowerCase()
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(keyword) || 
        item.content.toLowerCase().includes(keyword)
      )
    }
    
    this.setData({ filteredContents: filtered })
  },

  // 跳转到详情
  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/drug-library/detail/detail?id=${id}`
    })
  }
})