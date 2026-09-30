export type TrackStatus =
  | '已上报'
  | '已分流'
  | '已受理'
  | '反馈处理'
  | '已退回'
  | '已办结'

export interface TrackNode {
  title: TrackStatus
  time: string
  done: boolean
  remark?: string
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
  '已受理',
  '反馈处理',
  '已退回',
  '已办结',
]

function addMinutes(base: string, minutes: number) {
  const date = new Date(base.replace(/-/g, '/'))
  date.setMinutes(date.getMinutes() + minutes)
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
}

function buildNodes(status: TrackStatus, captureTime: string): TrackNode[] {
  const currentIndex = FLOW.indexOf(status)

  return FLOW.map((title, index) => {
    let done = false
    let remark: string | undefined
    let time = '—'

    if (status === '已办结') {
      if (title === '已退回') {
        done = false
        remark = '未退回'
      } else {
        done = true
        time = addMinutes(captureTime, index * 25)
      }
    } else if (status === '已退回') {
      if (index <= currentIndex) {
        done = true
        time = addMinutes(captureTime, index * 25)
      } else {
        done = false
        remark = '流程已终止'
      }
    } else {
      if (index <= currentIndex) {
        done = true
        time = addMinutes(captureTime, index * 25)
      } else {
        done = false
        remark = index === currentIndex + 1 ? '进行中' : '未到达'
      }
    }

    return { title, time, done, remark }
  })
}

const rows: Omit<TrackItem, 'nodes'>[] = [
  {
    id: 'YJ-20260927-0001',
    type: '在建工程',
    captureTime: '2026/9/27 8:46',
    location: '高邮市・汤庄镇・汉留村',
    dept: '自规局',
    status: '已上报',
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
    status: '已受理',
  },
  {
    id: 'YJ-20260927-0004',
    type: '私搭乱建',
    captureTime: '2026/9/27 11:03',
    location: '高邮市・汤庄镇・四异村',
    dept: '城管局',
    status: '反馈处理',
  },
  {
    id: 'YJ-20260927-0005',
    type: '在建工程',
    captureTime: '2026/9/27 12:28',
    location: '高邮市・汤庄镇・友好村',
    dept: '—',
    status: '已退回',
  },
  {
    id: 'YJ-20260927-0006',
    type: '秸秆焚烧',
    captureTime: '2026/9/27 13:02',
    location: '高邮市・汤庄镇・甸垛村',
    dept: '农业农村局',
    status: '已办结',
  },
]

export const trackItems: TrackItem[] = rows.map((row) => ({
  ...row,
  nodes: buildNodes(row.status, row.captureTime),
}))

export const trackStatusOptions: TrackStatus[] = [...FLOW]
