// pages/login/login.js
const app = getApp()
const request = require('../../utils/request')

Page({
  data: {
    activeTab: 'password',
    phone: '',
    password: '',
    verifyCode: '',
    passwordLoading: false,
    codeLoading: false,
    codeSending: false,
    codeCountdown: 0,
    canPasswordLogin: false,
    canCodeLogin: false,
    wxLoginLoading: false,
    canUseGetUserProfile: true, // 是否支持 getUserProfile
    hasUserInfo: false
  },

  onLoad() {
    // 检查是否已登录
    if (app.checkLoginStatus() && app.checkConsent()) {
      wx.switchTab({
        url: '/pages/index/index'
      })
      return
    }
    
    // 检查基础库版本
    this.checkSDKVersion()
    
    // 检查授权状态
    this.checkAuthSetting()
  },

  // 检查基础库版本
  checkSDKVersion() {
    const SDKVersion = wx.getSystemInfoSync().SDKVersion
    console.log('当前基础库版本:', SDKVersion)
    
    const versionArray = SDKVersion.split('.').map(v => parseInt(v))
    const canUse = versionArray[0] > 2 || 
                  (versionArray[0] === 2 && versionArray[1] >= 10)
    
    this.setData({ canUseGetUserProfile: canUse })
    
    if (!canUse) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本较低，建议更新到最新版本以获得更好的体验',
        showCancel: false
      })
    }
  },

  // 检查授权状态
  checkAuthSetting() {
    wx.getSetting({
      success: (res) => {
        console.log('授权状态:', res)
        
        // 检查是否有用户信息授权
        if (res.authSetting['scope.userInfo']) {
          // 已经有授权，可以直接获取用户信息
          wx.getUserInfo({
            success: (res) => {
              this.setData({ hasUserInfo: true })
            }
          })
        }
      }
    })
  },

  // 微信登录
  async handleWxLogin() {
    console.log('微信登录按钮点击')
    
    if (this.data.wxLoginLoading) {
      console.log('登录中，请勿重复点击')
      return
    }
    
    this.setData({ wxLoginLoading: true })
    wx.showLoading({ 
      title: '登录中...',
      mask: true 
    })

    try {
      // 1. 检查网络
      await this.checkNetwork()
      
      // 2. 获取微信 code
      const code = await this.getWxCode()
      console.log('获取code成功:', code)
      
      // 3. 获取用户信息（根据基础库版本使用不同方法）
      let userInfo = null
      
      if (this.data.canUseGetUserProfile) {
        // 新版本使用 getUserProfile
        try {
          userInfo = await this.getUserInfoNew()
        } catch (error) {
          console.log('getUserProfile失败，尝试降级方案:', error)
          // 如果用户拒绝，尝试使用已有授权
          userInfo = await this.getUserInfoLegacy()
        }
      } else {
        // 旧版本使用 getUserInfo
        userInfo = await this.getUserInfoLegacy()
      }
      
      console.log('获取用户信息成功:', userInfo)
      
      // 4. 调用后端登录
      await this.wechatLogin(code, userInfo)
      
    } catch (error) {
      console.error('微信登录失败:', error)
      this.handleError(error)
    } finally {
      wx.hideLoading()
      this.setData({ wxLoginLoading: false })
    }
  },

  // 检查网络
  checkNetwork() {
    return new Promise((resolve, reject) => {
      wx.getNetworkType({
        success: (res) => {
          if (res.networkType === 'none') {
            reject(new Error('network_error'))
          } else {
            resolve()
          }
        },
        fail: reject
      })
    })
  },

  // 获取微信 code
  getWxCode() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            resolve(res.code)
          } else {
            reject(new Error('code_error'))
          }
        },
        fail: reject
      })
    })
  },

  // 新版本获取用户信息（需要弹窗授权）
  getUserInfoNew() {
    return new Promise((resolve, reject) => {
      wx.getUserProfile({
        desc: '用于完善用户资料，提供更好的服务',
        lang: 'zh_CN',
        success: (res) => {
          resolve({
            nickName: res.userInfo.nickName,
            avatarUrl: res.userInfo.avatarUrl,
            gender: res.userInfo.gender
          })
        },
        fail: (err) => {
          console.error('getUserProfile失败:', err)
          reject(new Error('userinfo_denied'))
        }
      })
    })
  },

  // 旧版本获取用户信息（需要已授权）
  getUserInfoLegacy() {
    return new Promise((resolve, reject) => {
      // 先检查是否已有授权
      wx.getSetting({
        success: (setting) => {
          if (setting.authSetting['scope.userInfo']) {
            // 已有授权，直接获取
            wx.getUserInfo({
              success: (res) => {
                resolve({
                  nickName: res.userInfo.nickName,
                  avatarUrl: res.userInfo.avatarUrl,
                  gender: res.userInfo.gender
                })
              },
              fail: reject
            })
          } else {
            // 没有授权，返回默认信息
            resolve({
              nickName: '微信用户',
              avatarUrl: '',
              gender: 0
            })
          }
        },
        fail: reject
      })
    })
  },

  // 调用后端登录
  async wechatLogin(code, userInfo) {
    try {
      console.log('调用后端登录接口:', { code, userInfo })
      
      const res = await request({
        url: '/auth/wechat-login',
        method: 'POST',
        data: {
          code,
          userInfo
        },
        showLoading: false
      })

      console.log('后端登录成功:', res)

      // 保存登录信息
      app.setGlobalData('token', res.data.token)
      app.setGlobalData('userInfo', res.data.userInfo)

      // 跳转到相应页面
      if (res.data.userInfo.hasConsented) {
        if (res.data.userInfo.baseInfoCollected) {
          wx.switchTab({
            url: '/pages/index/index'
          })
        } else {
          wx.redirectTo({
            url: '/pages/info-collect/info-collect'
          })
        }
      } else {
        wx.redirectTo({
          url: '/pages/consent/consent'
        })
      }
    } catch (error) {
      console.error('后端登录失败:', error)
      throw new Error('backend_error')
    }
  },

  // 处理错误
  handleError(error) {
    const errorMsg = error.message || 'unknown'
    
    const errorMap = {
      'network_error': '网络连接失败，请检查网络设置',
      'code_error': '获取登录凭证失败，请重试',
      'userinfo_denied': '您拒绝了授权，无法使用微信登录',
      'backend_error': '服务器登录失败，请稍后重试',
      'unknown': '登录失败，请重试'
    }
    
    const message = errorMap[errorMsg] || errorMsg
    
    if (errorMsg === 'userinfo_denied') {
      wx.showModal({
        title: '提示',
        content: '需要您的授权才能使用微信登录',
        confirmText: '重新授权',
        cancelText: '使用其他方式',
        success: (res) => {
          if (res.confirm) {
            // 重新尝试
            setTimeout(() => {
              this.handleWxLogin()
            }, 500)
          }
        }
      })
    } else {
      wx.showToast({
        title: message,
        icon: 'none',
        duration: 2000
      })
    }
  },

  // 使用按钮方式获取用户信息（备选方案）
  getUserInfoByButton(e) {
    console.log('按钮获取用户信息:', e)
    
    if (e.detail.errMsg === 'getUserInfo:ok') {
      const userInfo = e.detail.userInfo
      
      // 继续登录流程
      this.continueLoginWithUserInfo(userInfo)
    } else {
      wx.showToast({
        title: '获取用户信息失败',
        icon: 'none'
      })
    }
  },

  // 继续登录流程
  async continueLoginWithUserInfo(userInfo) {
    wx.showLoading({ title: '登录中...' })
    
    try {
      const code = await this.getWxCode()
      
      await this.wechatLogin(code, {
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
        gender: userInfo.gender
      })
    } catch (error) {
      wx.hideLoading()
      this.handleError(error)
    }
  },

  // 快速体验登录（开发测试用）
  quickLogin() {
    wx.showLoading({
      title: '登录中...',
      mask: true
    })
    
    setTimeout(() => {
      const mockUserInfo = {
        _id: 'test_' + Date.now(),
        openid: 'test_' + Date.now(),
        phone: '13800138000',
        nickname: '体验用户',
        avatar: '',
        points: 100,
        hasConsented: false,
        baseInfoCollected: false
      }
      
      app.setGlobalData('token', 'test_token_' + Date.now())
      app.setGlobalData('userInfo', mockUserInfo)
      
      wx.hideLoading()
      
      wx.redirectTo({
        url: '/pages/consent/consent'
      })
    }, 1000)
  },

  // 测试后端连接
  async testBackend() {
    wx.showLoading({ title: '测试中...' })
    
    try {
      const res = await request({
        url: '/auth/test',
        method: 'GET',
        showLoading: false
      })
      
      wx.hideLoading()
      wx.showModal({
        title: '测试成功',
        content: '后端连接正常',
        showCancel: false
      })
    } catch (error) {
      wx.hideLoading()
      wx.showModal({
        title: '测试失败',
        content: '无法连接到后端，请检查后端服务是否启动',
        showCancel: false
      })
    }
  }
})