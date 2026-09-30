export type WarningStatus = '待处理' | '处置中' | '已办结' | '误报'

export interface WarningEvent {
  id: string
  type: string
  captureTime: string
  location: string
  dept: string
  status: WarningStatus
  parcelNo: string
  village: string
  urbanBoundary: string
  ownershipUnit: string
  cadastralOwner: string
  redLineArea: string
  farmlandArea: string
  basicFarmlandArea: string
  orthoImage?: string
  historyImage?: string
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

const defaultPlotInfo = [
  { label: '二调地类', value: '村庄' },
  { label: '三调地类', value: '农村宅基地' },
  { label: '供地信息', value: '-' },
  { label: '征地信息', value: '-' },
  { label: '不动产登记信息', value: '-' },
  { label: '设施农用地备案信息', value: '-' },
  { label: '设施农用地备案信息(部级)', value: '-' },
]

const defaultPlanInfo = [
  { label: '总体规划', value: '村庄建设区' },
  { label: '详细规划', value: '-' },
  { label: '村庄规划', value: '农村宅基地' },
  { label: '生态保护红线', value: '-' },
  { label: '永久基本农田', value: '-' },
  { label: '自然保护区', value: '-' },
  { label: '风景名胜区', value: '-' },
]

function buildEvent(
  partial: Pick<WarningEvent, 'id' | 'type' | 'captureTime' | 'location' | 'dept'> &
    Partial<WarningEvent>,
): WarningEvent {
  const village = partial.location.split('・').at(-1) || ''
  return {
    status: '待处理',
    parcelNo: partial.id,
    village,
    urbanBoundary: '内',
    ownershipUnit: partial.dept === '—' ? village : `${village} / ${partial.dept}`,
    cadastralOwner: partial.location.replaceAll('・', ''),
    redLineArea: '-',
    farmlandArea: '-',
    basicFarmlandArea: '-',
    historyImage: '/images/event-history.svg',
    plotInfo: defaultPlotInfo,
    planInfo: defaultPlanInfo,
    records: [
      {
        title: '事件同步',
        operator: 'system',
        content: `无人机平台同步事件（位置：${partial.location}）`,
        fromStatus: '---',
        toStatus: '待处理',
        time: partial.captureTime,
      },
    ],
    ...partial,
  }
}

export const warningEvents: WarningEvent[] = [
  buildEvent({
    id: 'YJ-20260927-0001',
    type: '在建工程',
    captureTime: '2026/9/27 8:46',
    location: '高邮市・汤庄镇・汉留村',
    dept: '自规局',
  }),
  buildEvent({
    id: 'YJ-20260927-0002',
    type: '秸秆焚烧',
    captureTime: '2026/9/27 9:32',
    location: '高邮市・汤庄镇・沙堰村',
    dept: '农业农村局',
  }),
  buildEvent({
    id: 'YJ-20260927-0003',
    type: '建筑垃圾',
    captureTime: '2026/9/27 10:15',
    location: '高邮市・汤庄镇・汤庄村',
    dept: '城管局',
  }),
  buildEvent({
    id: 'YJ-20260927-0004',
    type: '私搭乱建',
    captureTime: '2026/9/27 11:03',
    location: '高邮市・汤庄镇・四异村',
    dept: '城管局',
  }),
  buildEvent({
    id: 'YJ-20260927-0005',
    type: '在建工程',
    captureTime: '2026/9/27 12:28',
    location: '高邮市・汤庄镇・友好村',
    dept: '—',
  }),
  buildEvent({
    id: 'YJ-20260927-0006',
    type: '秸秆焚烧',
    captureTime: '2026/9/27 13:02',
    location: '高邮市・汤庄镇・甸垛村',
    dept: '农业农村局',
  }),
]
