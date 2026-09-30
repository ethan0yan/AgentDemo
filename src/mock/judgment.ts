export type JudgmentStatus = '研判通过' | '研判未通过' | '待研判'
export type AlertLevel = '高' | '中' | '低' | '—'

export interface JudgmentItem {
  id: string
  type: string
  captureTime: string
  location: string
  dept: string
  status: JudgmentStatus
  aiConclusion: string
  alertLevel: AlertLevel
  confidence: number | null
  aiLabel: string
  aiReason: string
  aiFeatures: string[]
  suggestAction: string
  historyImage?: string
  village: string
  urbanBoundary: string
  ownershipUnit: string
  cadastralOwner: string
  redLineArea: string
  farmlandArea: string
  basicFarmlandArea: string
  plotInfo: { label: string; value: string }[]
  planInfo: { label: string; value: string }[]
  records: {
    title: string
    operator: string
    content: string
    fromStatus: string
    toStatus: string
    time: string
  }[]
}

const plotInfo = [
  { label: '二调地类', value: '村庄' },
  { label: '三调地类', value: '农村宅基地' },
  { label: '供地信息', value: '-' },
  { label: '征地信息', value: '-' },
  { label: '不动产登记信息', value: '-' },
  { label: '设施农用地备案信息', value: '-' },
  { label: '设施农用地备案信息(部级)', value: '-' },
]

const planInfo = [
  { label: '总体规划', value: '村庄建设区' },
  { label: '详细规划', value: '-' },
  { label: '村庄规划', value: '农村宅基地' },
  { label: '生态保护红线', value: '-' },
  { label: '永久基本农田', value: '-' },
  { label: '自然保护区', value: '-' },
  { label: '风景名胜区', value: '-' },
]

const baseRows = [
  {
    id: 'YJ-20260927-0001',
    type: '在建工程',
    captureTime: '2026/9/27 8:46',
    location: '高邮市・汤庄镇・汉留村',
    dept: '自规局',
    aiConclusion: '疑似违规・93%',
    alertLevel: '高' as AlertLevel,
    status: '研判未通过' as JudgmentStatus,
    confidence: 93,
    aiLabel: '疑似违规',
    aiReason: '影像中出现大面积裸土与施工机械，疑似未批先建。',
    aiFeatures: ['施工机械识别', '裸土扰动明显', '与规划建设区边界冲突'],
    suggestAction: '建议人工复核后下发至自规局现场核查',
  },
  {
    id: 'YJ-20260927-0002',
    type: '秸秆焚烧',
    captureTime: '2026/9/27 9:32',
    location: '高邮市・汤庄镇・沙堰村',
    dept: '农业农村局',
    aiConclusion: '疑似违规・89%',
    alertLevel: '中' as AlertLevel,
    status: '研判未通过' as JudgmentStatus,
    confidence: 89,
    aiLabel: '疑似违规',
    aiReason: '检测到烟羽与热点区域，疑似秸秆露天焚烧。',
    aiFeatures: ['烟雾羽流', '地表热点', '农田周边位置'],
    suggestAction: '建议农业农村局立即核查并处置',
  },
  {
    id: 'YJ-20260927-0003',
    type: '建筑垃圾',
    captureTime: '2026/9/27 10:15',
    location: '高邮市・汤庄镇・汤庄村',
    dept: '城管局',
    aiConclusion: '疑似违规・85%',
    alertLevel: '中' as AlertLevel,
    status: '研判未通过' as JudgmentStatus,
    confidence: 85,
    aiLabel: '疑似违规',
    aiReason: '识别到建筑垃圾堆放特征，可能侵占公共空间。',
    aiFeatures: ['堆体纹理异常', '非正规堆放点', '临近道路'],
    suggestAction: '建议城管局核实清理责任主体',
  },
  {
    id: 'YJ-20260927-0004',
    type: '私搭乱建',
    captureTime: '2026/9/27 11:03',
    location: '高邮市・汤庄镇・四异村',
    dept: '城管局',
    aiConclusion: '待核实・76%',
    alertLevel: '低' as AlertLevel,
    status: '研判未通过' as JudgmentStatus,
    confidence: 76,
    aiLabel: '待核实',
    aiReason: '疑似新增附属构筑物，证据不够充分，需人工确认。',
    aiFeatures: ['屋顶轮廓变化', '置信度偏低', '历史影像差异轻微'],
    suggestAction: '建议人工抽检后再决定是否下发',
  },
  {
    id: 'YJ-20260927-0005',
    type: '在建工程',
    captureTime: '2026/9/27 12:28',
    location: '高邮市・汤庄镇・友好村',
    dept: '—',
    aiConclusion: '正常・91%',
    alertLevel: '—' as AlertLevel,
    status: '研判通过' as JudgmentStatus,
    confidence: 91,
    aiLabel: '正常',
    aiReason: '施工区域与已备案在建工程范围一致，未见新增违规迹象。',
    aiFeatures: ['与备案图斑重合', '无越界扰动', '无异常堆料'],
    suggestAction: '可归档通过，无需下发业务单位',
  },
  {
    id: 'YJ-20260927-0006',
    type: '秸秆焚烧',
    captureTime: '2026/9/27 13:02',
    location: '高邮市・汤庄镇・甸垛村',
    dept: '农业农村局',
    aiConclusion: '—',
    alertLevel: '—' as AlertLevel,
    status: '待研判' as JudgmentStatus,
    confidence: null,
    aiLabel: '待研判',
    aiReason: '事件已入库，智能体排队研判中。',
    aiFeatures: ['等待模型推理', '影像已回传'],
    suggestAction: '请等待 AI 研判完成后人工确认',
  },
]

export const judgmentItems: JudgmentItem[] = baseRows.map((row) => {
  const village = row.location.split('・').at(-1) || ''
  return {
    ...row,
    historyImage: '/images/event-history.svg',
    village,
    urbanBoundary: '内',
    ownershipUnit: row.dept === '—' ? village : `${village} / ${row.dept}`,
    cadastralOwner: row.location.replaceAll('・', ''),
    redLineArea: '-',
    farmlandArea: '-',
    basicFarmlandArea: '-',
    plotInfo,
    planInfo,
    records: [
      {
        title: '事件同步',
        operator: 'system',
        content: `无人机平台同步事件（位置：${row.location}）`,
        fromStatus: '---',
        toStatus: '待研判',
        time: row.captureTime,
      },
      ...(row.status !== '待研判'
        ? [
            {
              title: 'AI研判',
              operator: '智能体',
              content: `结论：${row.aiConclusion}；等级：${row.alertLevel}`,
              fromStatus: '待研判',
              toStatus: row.status,
              time: row.captureTime,
            },
          ]
        : []),
    ],
  }
})
