// utils/mockData.js
// 药物智库内容
const drugLibraryContents = [
    {
      id: '1',
      title: '常见药物分类及用途',
      category: '用药基础知识',
      content: '精神科药物主要分为抗精神病药、抗抑郁药、心境稳定剂、抗焦虑药等。抗精神病药用于治疗精神分裂症等精神病性障碍；抗抑郁药用于改善抑郁情绪；心境稳定剂用于双相情感障碍；抗焦虑药用于缓解焦虑症状...',
      cover: '/images/library/1.png',
      readCount: 1250,
      createTime: '2024-01-15'
    },
    {
      id: '2',
      title: '按医嘱服药的重要性',
      category: '正确服药方法',
      content: '遵医嘱规律服药是精神科治疗成功的关键。不规律服药可能导致病情复发、治疗无效、耐药性增加等严重后果。即使感觉好转，也应在医生指导下调整用药...',
      cover: '/images/library/2.png',
      readCount: 980,
      createTime: '2024-01-16'
    },
    {
      id: '3',
      title: '常见副作用及应对方法',
      category: '常见不适与应对',
      content: '精神科药物常见的副作用包括：口干、嗜睡、体重增加、手抖等。出现副作用时不要自行停药，应及时与医生沟通，医生会根据情况调整用药方案...',
      cover: '/images/library/3.png',
      readCount: 1560,
      createTime: '2024-01-17'
    },
    {
      id: '4',
      title: '擅自停药的风险',
      category: '用药误区与风险认知',
      content: '擅自停药可能导致戒断症状、病情复发、治疗失败等严重后果。精神科药物需要在医生指导下逐渐减量，突然停药可能引起病情急剧恶化...',
      cover: '/images/library/4.png',
      readCount: 890,
      createTime: '2024-01-18'
    },
    {
      id: '5',
      title: '漏服药物处理方法',
      category: '正确服药方法',
      content: '如果漏服药物：1. 如果距离下次服药时间较长，可以立即补服；2. 如果接近下次服药时间，跳过漏服的剂量，按时服用下一次；3. 切勿一次服用双倍剂量...',
      cover: '/images/library/5.png',
      readCount: 1120,
      createTime: '2024-01-19'
    },
    {
      id: '6',
      title: '药物与饮食相互作用',
      category: '正确服药方法',
      content: '某些药物与特定食物同服可能影响药效：1. 葡萄柚汁影响多种药物代谢；2. 酒精可能增强镇静作用；3. 高脂饮食影响药物吸收...',
      cover: '/images/library/6.png',
      readCount: 760,
      createTime: '2024-01-20'
    }
  ]
  
  // 测评量表
  const assessmentScales = {
    // 药物素养评估
    drugLiteracy: [
      {
        id: 'dl1',
        question: '您是否清楚每种药物的名称和用途？',
        options: ['完全不清楚', '不太清楚', '基本清楚', '非常清楚']
      },
      {
        id: 'dl2',
        question: '您是否了解每种药物的服用时间和方法？',
        options: ['完全不了解', '不太了解', '基本了解', '非常了解']
      },
      {
        id: 'dl3',
        question: '您是否了解药物可能的副作用？',
        options: ['完全不了解', '不太了解', '基本了解', '非常了解']
      },
      {
        id: 'dl4',
        question: '您是否知道漏服药物后应该怎么处理？',
        options: ['完全不知道', '不太知道', '基本知道', '非常清楚']
      },
      {
        id: 'dl5',
        question: '您是否了解药物与食物的相互作用？',
        options: ['完全不了解', '不太了解', '基本了解', '非常了解']
      }
    ],
    
    // MMAS-8 服药依从性量表
    mmas8: [
      {
        id: 'mmas1',
        question: '您是否曾经忘记服用药物？',
        options: ['是', '否']
      },
      {
        id: 'mmas2',
        question: '过去两周，您是否有忘记服药的情况？',
        options: ['是', '否']
      },
      {
        id: 'mmas3',
        question: '您是否曾因感觉病情好转而自行减少药量或停药？',
        options: ['是', '否']
      },
      {
        id: 'mmas4',
        question: '您是否曾因感觉病情恶化而自行增加药量？',
        options: ['是', '否']
      },
      {
        id: 'mmas5',
        question: '当您外出旅行或离开家时，是否有时忘记携带药物？',
        options: ['是', '否']
      },
      {
        id: 'mmas6',
        question: '昨天您按时服用了所有药物吗？',
        options: ['是', '否']
      },
      {
        id: 'mmas7',
        question: '当您感觉病情已控制时，是否曾自行停药？',
        options: ['是', '否']
      },
      {
        id: 'mmas8',
        question: '您是否觉得坚持服药计划有困难？',
        options: ['从不', '偶尔', '有时', '经常', '总是']
      }
    ]
  }
  
  // 常见问题
  const faqList = [
    {
      id: 'faq1',
      question: '服药后出现嗜睡怎么办？',
      answer: '嗜睡是常见副作用，通常在服药初期明显。建议：1. 睡前服用引起嗜睡的药物；2. 避免驾驶或操作危险机械；3. 如持续存在，及时告知医生调整用药。'
    },
    {
      id: 'faq2',
      question: '忘记服药应该补服吗？',
      answer: '如果忘记服药：1. 如果距离下次服药时间较长（超过12小时），可以立即补服；2. 如果接近下次服药时间（小于6小时），跳过漏服的剂量，按时服用下一次；3. 切勿一次服用双倍剂量。'
    },
    {
      id: 'faq3',
      question: '可以喝酒吗？',
      answer: '服用精神科药物期间不建议饮酒。酒精可能：1. 增强药物的镇静作用，导致过度嗜睡；2. 影响药物代谢，增加副作用风险；3. 可能加重抑郁焦虑症状。'
    }
  ]
  
  // 紧急求助信息
  const emergencyInfo = {
    crisisHotline: '400-161-9995',
    psychologicalHotline: '010-82951332',
    hospitals: [
      {
        name: '北京安定医院',
        address: '北京市西城区德胜门外安康胡同5号',
        phone: '010-58303000'
      },
      {
        name: '上海市精神卫生中心',
        address: '上海市徐汇区宛平南路600号',
        phone: '021-64387250'
      }
    ]
  }
  
  module.exports = {
    drugLibraryContents,
    assessmentScales,
    faqList,
    emergencyInfo
  }