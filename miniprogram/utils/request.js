// miniprogram/utils/request.js
const app = getApp()

// 后端API基础地址 - 根据您的实际情况修改
const BASE_URL = 'http://localhost:3000/api' 

const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token')
    
    // 显示加载中
    wx.showNavigationBarLoading()
    if (options.showLoading !== false) {
      wx.showLoading({
        title: options.loadingText || '加载中...',
        mask: true
      })
    }
    
    console.log('发送请求:', BASE_URL + options.url, options.data) // 调试用
    
    wx.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        console.log('请求响应:', res) // 调试用
        
        if (res.statusCode === 200) {
          if (res.data.success) {
            resolve(res.data)
          } else {
            wx.showToast({
              title: res.data.message || '请求失败',
              icon: 'none'
            })
            reject(res.data)
          }
        } else if (res.statusCode === 401) {
          // 未授权，跳转到登录页
          wx.removeStorageSync('token')
          wx.redirectTo({
            url: '/pages/login/login'
          })
          reject(res.data)
        } else if (res.statusCode === 404) {
          wx.showToast({
            title: '接口不存在，请检查后端路由',
            icon: 'none',
            duration: 3000
          })
          reject(new Error('接口不存在'))
        } else {
          wx.showToast({
            title: `服务器错误: ${res.statusCode}`,
            icon: 'none'
          })
          reject(res.data)
        }
      },
      fail: (err) => {
        console.error('请求失败:', err)
        
        let errorMsg = '网络错误'
        if (err.errMsg.includes('timeout')) {
          errorMsg = '请求超时'
        } else if (err.errMsg.includes('fail')) {
          errorMsg = '无法连接到服务器，请检查：\n1. 后端服务是否已启动\n2. 手机和电脑是否在同一网络\n3. 防火墙是否阻止'
        }
        
        wx.showToast({
          title: errorMsg,
          icon: 'none',
          duration: 3000
        })
        reject(err)
      },
      complete: () => {
        wx.hideNavigationBarLoading()
        if (options.showLoading !== false) {
          wx.hideLoading()
        }
      }
    })
  })
}

module.exports = request