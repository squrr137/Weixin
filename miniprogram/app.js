// app.js
const storage = require('./utils/storage')
const request = require('./utils/request')

App({
  onLaunch() {
    // 获取本地存储的数据
    this.globalData = {
      token: storage.getToken(),
      userInfo: storage.getUserInfo(),
      hasConsented: storage.getHasConsented(),
      baseInfoCollected: storage.getBaseInfoCollected(),
      currentPoints: storage.getPoints() || 0
    }

    // 检查网络状态
    this.checkNetworkStatus()
  },

  // 检查网络状态
  checkNetworkStatus() {
    wx.getNetworkType({
      success: (res) => {
        if (res.networkType === 'none') {
          wx.showToast({
            title: '网络已断开，请检查网络连接',
            icon: 'none',
            duration: 3000
          })
        }
      }
    })
  },

  // 检查登录状态
  checkLoginStatus() {
    return this.globalData.token !== null
  },

  // 检查知情同意
  checkConsent() {
    return this.globalData.hasConsented
  },

  // 更新全局数据
  setGlobalData(key, value) {
    this.globalData[key] = value
    
    // 同步到本地存储
    switch(key) {
      case 'token':
        storage.setToken(value)
        break
      case 'userInfo':
        storage.setUserInfo(value)
        break
      case 'hasConsented':
        storage.setHasConsented(value)
        break
      case 'baseInfoCollected':
        storage.setBaseInfoCollected(value)
        break
      case 'currentPoints':
        storage.setPoints(value)
        break
    }
  },

  // 积分操作
  async addPoints(points, reason) {
    try {
      // 这里应该调用后端API
      // 暂时先本地处理
      const newPoints = storage.addPoints(points, reason)
      this.globalData.currentPoints = newPoints
      return newPoints
    } catch (error) {
      console.error('增加积分失败:', error)
      return this.globalData.currentPoints
    }
  },

  // 请求方法挂载到app
  request: request,

  globalData: {
    token: null,
    userInfo: null,
    hasConsented: false,
    baseInfoCollected: false,
    currentPoints: 0
  }
})