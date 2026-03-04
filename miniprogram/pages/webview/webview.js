// pages/webview/webview.js
Page({
    data: {
      url: ''
    },
  
    onLoad(options) {
      const { type } = options
      
      let url = ''
      if (type === 'privacy') {
        url = 'https://your-domain.com/privacy.html' // 替换为您的隐私政策页面
      } else if (type === 'terms') {
        url = 'https://your-domain.com/terms.html' // 替换为用户协议页面
      } else if (type === 'about') {
        url = 'https://your-domain.com/about.html' // 替换为关于我们页面
      }
      
      this.setData({ url })
    }
  })