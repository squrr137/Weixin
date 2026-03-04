// utils/storage.js
const STORAGE_KEYS = {
    TOKEN: 'token',
    USER_INFO: 'userInfo',
    HAS_CONSENTED: 'hasConsented',
    BASE_INFO_COLLECTED: 'baseInfoCollected',
    MEDICATIONS: 'medications',
    LEARNING_RECORDS: 'learningRecords',
    ASSESSMENT_RECORDS: 'assessmentRecords',
    POINTS: 'points',
    POINTS_RECORDS: 'pointsRecords',
    QUESTIONS: 'questions'
  }
  
  // 用户相关
  const setToken = (token) => wx.setStorageSync(STORAGE_KEYS.TOKEN, token)
  const getToken = () => wx.getStorageSync(STORAGE_KEYS.TOKEN) || null
  const removeToken = () => wx.removeStorageSync(STORAGE_KEYS.TOKEN)
  
  const setUserInfo = (userInfo) => wx.setStorageSync(STORAGE_KEYS.USER_INFO, userInfo)
  const getUserInfo = () => wx.getStorageSync(STORAGE_KEYS.USER_INFO) || null
  
  const setHasConsented = (value) => wx.setStorageSync(STORAGE_KEYS.HAS_CONSENTED, value)
  const getHasConsented = () => wx.getStorageSync(STORAGE_KEYS.HAS_CONSENTED) || false
  
  const setBaseInfoCollected = (value) => wx.setStorageSync(STORAGE_KEYS.BASE_INFO_COLLECTED, value)
  const getBaseInfoCollected = () => wx.getStorageSync(STORAGE_KEYS.BASE_INFO_COLLECTED) || false
  
  // 用药相关
  const getMedications = () => wx.getStorageSync(STORAGE_KEYS.MEDITATIONS) || []
  const setMedications = (medications) => wx.setStorageSync(STORAGE_KEYS.MEDITATIONS, medications)
  const addMedication = (medication) => {
    const medications = getMedications()
    medication.id = generateId()
    medication.createTime = new Date().toISOString()
    medications.push(medication)
    setMedications(medications)
    return medication
  }
  const updateMedication = (id, updatedData) => {
    const medications = getMedications()
    const index = medications.findIndex(m => m.id === id)
    if (index > -1) {
      medications[index] = { ...medications[index], ...updatedData, updateTime: new Date().toISOString() }
      setMedications(medications)
      return medications[index]
    }
    return null
  }
  const deleteMedication = (id) => {
    const medications = getMedications()
    const newMedications = medications.filter(m => m.id !== id)
    setMedications(newMedications)
  }
  
  // 积分相关
  const getPoints = () => wx.getStorageSync(STORAGE_KEYS.POINTS) || 0
  const setPoints = (points) => wx.setStorageSync(STORAGE_KEYS.POINTS, points)
  const addPoints = (points, reason) => {
    const currentPoints = getPoints()
    const newPoints = currentPoints + points
    setPoints(newPoints)
    
    // 记录积分获取
    const records = getPointsRecords()
    records.push({
      id: generateId(),
      points,
      reason,
      createTime: new Date().toISOString()
    })
    setPointsRecords(records)
    
    return newPoints
  }
  
  const getPointsRecords = () => wx.getStorageSync(STORAGE_KEYS.POINTS_RECORDS) || []
  const setPointsRecords = (records) => wx.getStorageSync(STORAGE_KEYS.POINTS_RECORDS, records)
  
  // 学习记录
  const getLearningRecords = () => wx.getStorageSync(STORAGE_KEYS.LEARNING_RECORDS) || []
  const addLearningRecord = (contentId, title) => {
    const records = getLearningRecords()
    records.push({
      id: generateId(),
      contentId,
      title,
      createTime: new Date().toISOString()
    })
    setLearningRecords(records)
  }
  
  const setLearningRecords = (records) => wx.setStorageSync(STORAGE_KEYS.LEARNING_RECORDS, records)
  
  // 测评记录
  const getAssessmentRecords = () => wx.getStorageSync(STORAGE_KEYS.ASSESSMENT_RECORDS) || []
  const addAssessmentRecord = (type, score, result) => {
    const records = getAssessmentRecords()
    records.push({
      id: generateId(),
      type,
      score,
      result,
      createTime: new Date().toISOString()
    })
    setAssessmentRecords(records)
  }
  
  const setAssessmentRecords = (records) => wx.setStorageSync(STORAGE_KEYS.ASSESSMENT_RECORDS, records)
  
  // 问题留言
  const getQuestions = () => wx.getStorageSync(STORAGE_KEYS.QUESTIONS) || []
  const addQuestion = (title, content) => {
    const questions = getQuestions()
    const question = {
      id: generateId(),
      title,
      content,
      status: 'pending', // pending, replied, closed
      reply: null,
      replyTime: null,
      createTime: new Date().toISOString()
    }
    questions.push(question)
    setQuestions(questions)
    return question
  }
  
  const setQuestions = (questions) => wx.setStorageSync(STORAGE_KEYS.QUESTIONS, questions)
  
  // 工具函数
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
  
  // 清除所有数据
  const clearAll = () => {
    wx.clearStorageSync()
  }
  
  module.exports = {
    STORAGE_KEYS,
    // 用户
    setToken,
    getToken,
    removeToken,
    setUserInfo,
    getUserInfo,
    setHasConsented,
    getHasConsented,
    setBaseInfoCollected,
    getBaseInfoCollected,
    // 用药
    getMedications,
    setMedications,
    addMedication,
    updateMedication,
    deleteMedication,
    // 积分
    getPoints,
    setPoints,
    addPoints,
    getPointsRecords,
    // 学习记录
    getLearningRecords,
    addLearningRecord,
    // 测评记录
    getAssessmentRecords,
    addAssessmentRecord,
    // 问题
    getQuestions,
    addQuestion,
    // 其他
    clearAll,
    generateId
  }