export type JudgmentStatus = '已研判' | '待研判'
export type AlertLevel = '高' | '中' | '低' | '—'
export type AiConclusion = '疑似违规' | '待核实' | '正常' | '—'

export interface JudgmentItem {
  id: string
  type: string
  captureTime: string
  location: string
  dept: string
  status: JudgmentStatus
  aiConclusion: AiConclusion
  alertLevel: AlertLevel
  aiReason: string
  aiFeatures: string[]
  suggestAction: string
  orthoImage?: string
  historyImage?: string
  parcelNo: string
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
  airport: string
}

const img = (name: string) => `images/judgment/${name}`

const rows: Array<{
  id: string
  captureTime: string
  location: string
  status: JudgmentStatus
  aiConclusion: AiConclusion
  alertLevel: AlertLevel
  parcelNo: string
  urbanBoundary: string
  ownershipUnit: string
  cadastralOwner: string
  redLineArea: string
  farmlandArea: string
  basicFarmlandArea: string
  plotInfo: { label: string; value: string }[]
  planInfo: { label: string; value: string }[]
  airport: string
  aiReason: string
  aiFeatures: string[]
  suggestAction: string
  orthoImage?: string
  historyImage?: string
}> = [
  {
    id: 'YJ-20260927-0007',
    captureTime: '2026/9/27 12:28',
    location: '高邮市・汤庄镇・汉留村',
    status: '已研判',
    aiConclusion: '疑似违规',
    alertLevel: '高',
    parcelNo: '321084202606280002',
    urbanBoundary: '外',
    ownershipUnit: '汉留村 / 资规所',
    cadastralOwner: '高邮市',
    redLineArea: '1.24 亩',
    farmlandArea: '0.00 亩',
    basicFarmlandArea: '0.00 亩',
    plotInfo: [
      { label: '二调地类', value: '采矿用地' },
      { label: '三调地类', value: '其他林地' },
      { label: '征地信息', value: '-' },
      { label: '供地信息', value: '-' },
      { label: '设农备案', value: '-' },
    ],
    planInfo: [
      { label: '总体规划', value: '一般农业区' },
      { label: '详细规划', value: '-' },
      { label: '村庄规划', value: '其他林地' },
      { label: '林保地块', value: '-' },
      { label: '河湖管控区', value: '-' },
    ],
    airport: '友好村村委会',
    aiReason: '正射影像识别到大面积堆料与施工扰动，疑似未批先建。',
    aiFeatures: ['红线范围内扰动', '施工机械聚集', '与规划用途冲突'],
    suggestAction: '建议下发自规局现场核查',
    orthoImage: img('YJ-20260927-0007-ortho.jpg'),
    historyImage: img('YJ-20260927-0007-history.jpg'),
  },
  {
    id: 'YJ-20260927-0008',
    captureTime: '2026/9/27 11:03',
    location: '高邮市・汤庄镇・沙堰村',
    status: '已研判',
    aiConclusion: '疑似违规',
    alertLevel: '中',
    parcelNo: '321084202606160001',
    urbanBoundary: '外',
    ownershipUnit: '沙堰村 / 资规所',
    cadastralOwner: '高邮市',
    redLineArea: '13.12 亩',
    farmlandArea: '0.00 亩',
    basicFarmlandArea: '0.00 亩',
    plotInfo: [
      { label: '二调地类', value: '建制镇' },
      { label: '三调地类', value: '农村宅基地' },
      { label: '征地信息', value: '-' },
      { label: '供地信息', value: '已供地' },
    ],
    planInfo: [
      { label: '总体规划', value: '居住生活区' },
      { label: '详细规划', value: '-' },
      { label: '村庄规划', value: '-' },
      { label: '林保地块', value: '-' },
    ],
    airport: '缓阳村村委会',
    aiReason: '历史影像对比显示楼栋持续增高，存在越界施工风险。',
    aiFeatures: ['塔吊作业', '楼体轮廓扩张', '临近河道'],
    suggestAction: '建议复核规划红线后处置',
    orthoImage: img('YJ-20260927-0008-ortho.jpg'),
    historyImage: img('YJ-20260927-0008-history.jpg'),
  },
  {
    id: 'YJ-20260927-0009',
    captureTime: '2026/9/27 13:02',
    location: '高邮市・汤庄镇・汤庄村',
    status: '已研判',
    aiConclusion: '疑似违规',
    alertLevel: '中',
    parcelNo: '321084202606040004',
    urbanBoundary: '外',
    ownershipUnit: '联谊村 / 资规所',
    cadastralOwner: '高邮市汤庄镇联谊村八组',
    redLineArea: '0.34 亩',
    farmlandArea: '0.00 亩',
    basicFarmlandArea: '0.00 亩',
    plotInfo: [
      { label: '二调地类', value: '村庄' },
      { label: '三调地类', value: '农村宅基地' },
      { label: '征地信息', value: '-' },
      { label: '供地信息', value: '-' },
    ],
    planInfo: [
      { label: '总体规划', value: '村庄建设区' },
      { label: '详细规划', value: '-' },
      { label: '村庄规划', value: '-' },
      { label: '林保地块', value: '-' },
    ],
    airport: '联谊村村委会',
    aiReason: '识别到混凝土基础与施工痕迹，疑似新增建筑物。',
    aiFeatures: ['基础轮廓清晰', '周边农田对比明显'],
    suggestAction: '建议现场确认建设手续',
    orthoImage: img('YJ-20260927-0009-ortho.jpg'),
    historyImage: img('YJ-20260927-0009-history.jpg'),
  },
  {
    id: 'YJ-20260927-0010',
    captureTime: '2026/9/27 11:03',
    location: '高邮市・汤庄镇・四异村',
    status: '已研判',
    aiConclusion: '待核实',
    alertLevel: '低',
    parcelNo: '321084202605080001',
    urbanBoundary: '外',
    ownershipUnit: '甸垛村 / 资规所',
    cadastralOwner: '高邮市汤庄镇甸垛村十一组',
    redLineArea: '7.71 亩',
    farmlandArea: '7.71 亩',
    basicFarmlandArea: '0.00 亩',
    plotInfo: [
      { label: '二调地类', value: '水田' },
      { label: '三调地类', value: '水田' },
      { label: '征地信息', value: '-' },
      { label: '供地信息', value: '-' },
    ],
    planInfo: [
      { label: '总体规划', value: '永久基本农田保护区' },
      { label: '详细规划', value: '-' },
      { label: '村庄规划', value: '水田' },
      { label: '林保地块', value: '-' },
    ],
    airport: '友好村村委会',
    aiReason: '建筑物形态变化轻微，证据不足，需人工复核。',
    aiFeatures: ['屋顶纹理轻微变化', '证据不够充分'],
    suggestAction: '建议人工抽检后再决定是否下发',
    orthoImage: img('YJ-20260927-0010-ortho.jpg'),
    historyImage: img('YJ-20260927-0010-history.jpg'),
  },
  {
    id: 'YJ-20260927-0011',
    captureTime: '2026/9/27 8:46',
    location: '高邮市・汤庄镇・友好村',
    status: '已研判',
    aiConclusion: '正常',
    alertLevel: '—',
    parcelNo: '321084202606280011',
    urbanBoundary: '外',
    ownershipUnit: '友好村 / 资规所',
    cadastralOwner: '高邮市汤庄镇友好村',
    redLineArea: '2.10 亩',
    farmlandArea: '0.00 亩',
    basicFarmlandArea: '0.00 亩',
    plotInfo: [
      { label: '二调地类', value: '村庄' },
      { label: '三调地类', value: '农村宅基地' },
      { label: '征地信息', value: '-' },
      { label: '供地信息', value: '已供地' },
    ],
    planInfo: [
      { label: '总体规划', value: '村庄建设区' },
      { label: '详细规划', value: '-' },
      { label: '村庄规划', value: '农村宅基地' },
      { label: '林保地块', value: '-' },
    ],
    airport: '友好村村委会',
    aiReason: '施工范围与已备案在建工程一致，未见新增违规迹象。',
    aiFeatures: ['与备案图斑重合', '无越界扰动'],
    suggestAction: '可归档通过，无需下发',
    orthoImage: img('YJ-20260927-0011-ortho.jpg'),
    historyImage: img('YJ-20260927-0011-history.jpg'),
  },
  {
    id: 'YJ-20260927-0012',
    captureTime: '2026/9/27 9:32',
    location: '高邮市・汤庄镇・甸垛村',
    status: '待研判',
    aiConclusion: '—',
    alertLevel: '—',
    parcelNo: '321084202606280012',
    urbanBoundary: '外',
    ownershipUnit: '甸垛村 / 资规所',
    cadastralOwner: '高邮市汤庄镇甸垛村',
    redLineArea: '-',
    farmlandArea: '-',
    basicFarmlandArea: '-',
    plotInfo: [
      { label: '二调地类', value: '-' },
      { label: '三调地类', value: '-' },
      { label: '征地信息', value: '-' },
      { label: '供地信息', value: '-' },
    ],
    planInfo: [
      { label: '总体规划', value: '-' },
      { label: '详细规划', value: '-' },
      { label: '村庄规划', value: '-' },
      { label: '林保地块', value: '-' },
    ],
    airport: '甸垛村村委会',
    aiReason: '事件已入库，智能体排队研判中。',
    aiFeatures: ['等待模型推理'],
    suggestAction: '请等待 AI 研判完成后人工确认',
  },
]

export const judgmentItems: JudgmentItem[] = rows.map((row) => {
  const village = row.location.split('・').at(-1) || ''
  return {
    id: row.id,
    type: '在建工程',
    captureTime: row.captureTime,
    location: row.location,
    dept: '自规局',
    status: row.status,
    aiConclusion: row.aiConclusion,
    alertLevel: row.alertLevel,
    aiReason: row.aiReason,
    aiFeatures: row.aiFeatures,
    suggestAction: row.suggestAction,
    orthoImage: row.orthoImage,
    historyImage: row.historyImage,
    parcelNo: row.parcelNo,
    village,
    urbanBoundary: row.urbanBoundary,
    ownershipUnit: row.ownershipUnit,
    cadastralOwner: row.cadastralOwner,
    redLineArea: row.redLineArea,
    farmlandArea: row.farmlandArea,
    basicFarmlandArea: row.basicFarmlandArea,
    plotInfo: row.plotInfo,
    planInfo: row.planInfo,
    airport: row.airport,
    records: [
      {
        title: '事件同步',
        operator: 'system',
        content: `无人机平台同步事件（机场：${row.airport}）`,
        fromStatus: '—',
        toStatus: '待处理',
        time: '2026-07-20 15:37:54',
      },
      ...(row.status === '已研判'
        ? [
            {
              title: 'AI研判',
              operator: '智能体',
              content: `结论：${row.aiConclusion}；预警等级：${row.alertLevel}`,
              fromStatus: '待研判',
              toStatus: '已研判',
              time: row.captureTime,
            },
          ]
        : []),
    ],
  }
})
