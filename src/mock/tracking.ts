export type TrackStatus =
  | '已上报'
  | '已分流'
  | '已研判'
  | '已推送'
  | '待处置'
  | '已办结'

export interface TrackNode {
  title: TrackStatus
  time: string
  done: boolean
  remark?: string
  detail?: string
  image?: string
}

export interface TrackItem {
  id: string
  type: string
  captureTime: string
  location: string
  dept: string
  status: TrackStatus
  nodes: TrackNode[]
}

const FLOW: TrackStatus[] = [
  '已上报',
  '已分流',
  '已研判',
  '已推送',
  '待处置',
  '已办结',
]

const img = (name: string) => `images/req-adjust/${name}`

/** 需求样例：全过程节点补充内容 */
function buildFullProcessNodes(): TrackNode[] {
  return [
    {
      title: '已上报',
      time: '2026/9/27 8:44',
      done: true,
      detail: '无人机平台上报事件',
      image: img('track-report.png'),
    },
    {
      title: '已分流',
      time: '2026/9/27 8:45',
      done: true,
      detail: '分流至资规局',
    },
    {
      title: '已研判',
      time: '2026/9/27 8:46',
      done: true,
      detail: '研判数据图',
      image: img('judgment-process.png'),
    },
    {
      title: '已推送',
      time: '2026/9/27 8:50',
      done: true,
      detail: '推送给资规局执法人员：衡东',
    },
    {
      title: '待处置',
      time: '2026/9/27 8:51',
      done: true,
      detail: '处置类型：在建工程',
      image: img('track-dispose.png'),
    },
    {
      title: '已办结',
      time: '2026/9/28 9:31',
      done: true,
      detail: '备注：已现场核实处理',
      image: img('track-finish.png'),
    },
  ]
}

function buildPartialNodes(status: TrackStatus): TrackNode[] {
  const full = buildFullProcessNodes()
  const idx = FLOW.indexOf(status)
  return full.map((node, i) => {
    if (i < idx) {
      return { ...node, done: true }
    }
    if (i === idx) {
      return { ...node, done: true }
    }
    return {
      title: node.title,
      time: '—',
      done: false,
      remark: i === idx + 1 ? '进行中' : '未到达',
    }
  })
}

const rows: Array<Omit<TrackItem, 'nodes'> & { useFull?: boolean }> = [
  {
    id: 'YJ-20260927-0001',
    type: '在建工程',
    captureTime: '2026/9/27 8:46',
    location: '高邮市・汤庄镇・汉留村',
    dept: '自规局',
    status: '已办结',
    useFull: true,
  },
  {
    id: 'YJ-20260927-0002',
    type: '秸秆焚烧',
    captureTime: '2026/9/27 9:32',
    location: '高邮市・汤庄镇・沙堰村',
    dept: '农业农村局',
    status: '已分流',
  },
  {
    id: 'YJ-20260927-0003',
    type: '建筑垃圾',
    captureTime: '2026/9/27 10:15',
    location: '高邮市・汤庄镇・汤庄村',
    dept: '城管局',
    status: '已研判',
  },
  {
    id: 'YJ-20260927-0004',
    type: '私搭乱建',
    captureTime: '2026/9/27 11:03',
    location: '高邮市・汤庄镇・四异村',
    dept: '城管局',
    status: '已推送',
  },
  {
    id: 'YJ-20260927-0005',
    type: '在建工程',
    captureTime: '2026/9/27 12:28',
    location: '高邮市・汤庄镇・友好村',
    dept: '自规局',
    status: '待处置',
  },
  {
    id: 'YJ-20260927-0006',
    type: '秸秆焚烧',
    captureTime: '2026/9/27 13:02',
    location: '高邮市・汤庄镇・甸垛村',
    dept: '农业农村局',
    status: '已上报',
  },
]

export const trackItems: TrackItem[] = rows.map((row) => ({
  id: row.id,
  type: row.type,
  captureTime: row.captureTime,
  location: row.location,
  dept: row.dept,
  status: row.status,
  nodes: row.useFull ? buildFullProcessNodes() : buildPartialNodes(row.status),
}))

export const trackStatusOptions: TrackStatus[] = [...FLOW]
