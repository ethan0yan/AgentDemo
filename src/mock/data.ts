export type MissionStatus = '待分类' | '已分类' | '执行中' | '已完成'
export type DispatchStatus = '待分流' | '已推送' | '推送失败' | '已接收'
export type TrackStatus = '未执行' | '执行中' | '已回传' | '已识别' | '已分流' | '处置中' | '已闭环'

export interface Mission {
  id: string
  name: string
  content: string
  area: string
  purpose: string
  initiator: string
  bizType: string
  dept: string
  confidence: number
  status: MissionStatus
  createdAt: string
}

export interface DataItem {
  id: string
  missionId: string
  missionName: string
  dataType: '视频' | '图片' | '结构化'
  content: string
  bizType: string
  targetDept: string
  status: DispatchStatus
  pushedAt: string
}

export interface EventItem {
  id: string
  name: string
  type: string
  location: string
  region: string
  missionId: string
  level: '一般' | '较大' | '重大'
  targetDept: string
  status: DispatchStatus
  foundAt: string
}

export interface TrackItem {
  id: string
  missionId: string
  missionName: string
  eventType: string
  region: string
  dept: string
  status: TrackStatus
  nodes: { title: string; time: string; done: boolean; remark?: string }[]
}

export const missions: Mission[] = [
  {
    id: 'RW-20260327-001',
    name: '玄武大道交通秩序巡查',
    content: '针对早高峰违停与拥堵开展巡查',
    area: '南京市玄武区玄武大道',
    purpose: '道路交通秩序巡查',
    initiator: '市交管局',
    bizType: '道路交通秩序巡查',
    dept: '交警部门',
    confidence: 0.93,
    status: '已分类',
    createdAt: '2026-03-27 08:10',
  },
  {
    id: 'RW-20260327-002',
    name: '江宁违建专项巡查',
    content: '排查沿街新增违法建设与施工占道',
    area: '南京市江宁区东山街道',
    purpose: '违法建设巡查',
    initiator: '市住建局',
    bizType: '违法建设巡查',
    dept: '住建部门',
    confidence: 0.88,
    status: '已分类',
    createdAt: '2026-03-27 09:20',
  },
  {
    id: 'RW-20260327-003',
    name: '秦淮河河道巡查',
    content: '检查岸线漂浮物与疑似排污点',
    area: '南京市秦淮区外秦淮河段',
    purpose: '河道巡查',
    initiator: '市水务局',
    bizType: '河道巡查',
    dept: '水务部门',
    confidence: 0.91,
    status: '执行中',
    createdAt: '2026-03-27 10:05',
  },
  {
    id: 'RW-20260327-004',
    name: '新街口城市管理巡查',
    content: '巡查占道经营与环境秩序',
    area: '南京市鼓楼区新街口',
    purpose: '城市管理巡查',
    initiator: '市城管局',
    bizType: '待研判',
    dept: '待确认',
    confidence: 0.62,
    status: '待分类',
    createdAt: '2026-03-27 11:30',
  },
]

export const dataItems: DataItem[] = [
  {
    id: 'SJ-001',
    missionId: 'RW-20260327-001',
    missionName: '玄武大道交通秩序巡查',
    dataType: '视频',
    content: '路口全景视频 12 分钟',
    bizType: '道路交通',
    targetDept: '交警部门',
    status: '已接收',
    pushedAt: '2026-03-27 08:45',
  },
  {
    id: 'SJ-002',
    missionId: 'RW-20260327-001',
    missionName: '玄武大道交通秩序巡查',
    dataType: '结构化',
    content: '违停车辆识别结果 36 条',
    bizType: '道路交通',
    targetDept: '交警部门',
    status: '已推送',
    pushedAt: '2026-03-27 08:48',
  },
  {
    id: 'SJ-003',
    missionId: 'RW-20260327-002',
    missionName: '江宁违建专项巡查',
    dataType: '图片',
    content: '疑似违建航拍图 18 张',
    bizType: '违法建设',
    targetDept: '住建部门',
    status: '已推送',
    pushedAt: '2026-03-27 09:50',
  },
  {
    id: 'SJ-004',
    missionId: 'RW-20260327-003',
    missionName: '秦淮河河道巡查',
    dataType: '视频',
    content: '河道巡航视频 20 分钟',
    bizType: '水域巡查',
    targetDept: '水务部门',
    status: '待分流',
    pushedAt: '-',
  },
  {
    id: 'SJ-005',
    missionId: 'RW-20260327-002',
    missionName: '江宁违建专项巡查',
    dataType: '结构化',
    content: '施工占道识别 5 条',
    bizType: '违法建设',
    targetDept: '城管部门',
    status: '推送失败',
    pushedAt: '2026-03-27 09:55',
  },
]

export const events: EventItem[] = [
  {
    id: 'SJ-EV-001',
    name: '车辆违停',
    type: '道路交通',
    location: '玄武大道与珠江路交叉口',
    region: '玄武区',
    missionId: 'RW-20260327-001',
    level: '一般',
    targetDept: '交警部门',
    status: '已接收',
    foundAt: '2026-03-27 08:42',
  },
  {
    id: 'SJ-EV-002',
    name: '道路拥堵',
    type: '道路交通',
    location: '玄武大道中段',
    region: '玄武区',
    missionId: 'RW-20260327-001',
    level: '较大',
    targetDept: '交警部门',
    status: '已推送',
    foundAt: '2026-03-27 08:50',
  },
  {
    id: 'SJ-EV-003',
    name: '违法建设',
    type: '城市建设',
    location: '东山街道某工地北侧',
    region: '江宁区',
    missionId: 'RW-20260327-002',
    level: '重大',
    targetDept: '住建部门',
    status: '已推送',
    foundAt: '2026-03-27 09:40',
  },
  {
    id: 'SJ-EV-004',
    name: '施工占道',
    type: '城市建设',
    location: '东山街道商业街',
    region: '江宁区',
    missionId: 'RW-20260327-002',
    level: '一般',
    targetDept: '城管部门',
    status: '待分流',
    foundAt: '2026-03-27 09:46',
  },
  {
    id: 'SJ-EV-005',
    name: '疑似排污',
    type: '水域巡查',
    location: '外秦淮河武定门段',
    region: '秦淮区',
    missionId: 'RW-20260327-003',
    level: '较大',
    targetDept: '水务部门',
    status: '待分流',
    foundAt: '2026-03-27 10:30',
  },
]

export const regionStats = [
  { region: '玄武区', count: 28, ratio: 22 },
  { region: '江宁区', count: 41, ratio: 32 },
  { region: '秦淮区', count: 19, ratio: 15 },
  { region: '鼓楼区', count: 23, ratio: 18 },
  { region: '建邺区', count: 16, ratio: 13 },
]

export const typeStats = [
  { type: '违法建设', count: 41 },
  { type: '车辆违停', count: 36 },
  { type: '施工占道', count: 22 },
  { type: '道路拥堵', count: 18 },
  { type: '疑似排污', count: 10 },
]

export const tracks: TrackItem[] = [
  {
    id: 'GZ-001',
    missionId: 'RW-20260327-001',
    missionName: '玄武大道交通秩序巡查',
    eventType: '车辆违停',
    region: '玄武区',
    dept: '交警部门',
    status: '处置中',
    nodes: [
      { title: '任务下派', time: '2026-03-27 08:10', done: true },
      { title: '任务执行', time: '2026-03-27 08:25', done: true },
      { title: '数据回传', time: '2026-03-27 08:40', done: true },
      { title: '事件识别', time: '2026-03-27 08:42', done: true },
      { title: '事件分流', time: '2026-03-27 08:45', done: true },
      { title: '单位接收', time: '2026-03-27 08:50', done: true },
      { title: '处置完成', time: '-', done: false, remark: '处置中' },
    ],
  },
  {
    id: 'GZ-002',
    missionId: 'RW-20260327-002',
    missionName: '江宁违建专项巡查',
    eventType: '违法建设',
    region: '江宁区',
    dept: '住建部门',
    status: '已分流',
    nodes: [
      { title: '任务下派', time: '2026-03-27 09:20', done: true },
      { title: '任务执行', time: '2026-03-27 09:30', done: true },
      { title: '数据回传', time: '2026-03-27 09:45', done: true },
      { title: '事件识别', time: '2026-03-27 09:40', done: true },
      { title: '事件分流', time: '2026-03-27 09:52', done: true },
      { title: '单位接收', time: '-', done: false, remark: '待接收' },
      { title: '处置完成', time: '-', done: false },
    ],
  },
  {
    id: 'GZ-003',
    missionId: 'RW-20260327-003',
    missionName: '秦淮河河道巡查',
    eventType: '疑似排污',
    region: '秦淮区',
    dept: '水务部门',
    status: '已识别',
    nodes: [
      { title: '任务下派', time: '2026-03-27 10:05', done: true },
      { title: '任务执行', time: '2026-03-27 10:20', done: true },
      { title: '数据回传', time: '2026-03-27 10:28', done: true },
      { title: '事件识别', time: '2026-03-27 10:30', done: true },
      { title: '事件分流', time: '-', done: false, remark: '未分流' },
      { title: '单位接收', time: '-', done: false },
      { title: '处置完成', time: '-', done: false },
    ],
  },
  {
    id: 'GZ-004',
    missionId: 'RW-20260327-004',
    missionName: '新街口城市管理巡查',
    eventType: '-',
    region: '鼓楼区',
    dept: '待确认',
    status: '未执行',
    nodes: [
      { title: '任务下派', time: '2026-03-27 11:30', done: true },
      { title: '任务执行', time: '-', done: false, remark: '未执行' },
      { title: '数据回传', time: '-', done: false },
      { title: '事件识别', time: '-', done: false },
      { title: '事件分流', time: '-', done: false },
      { title: '单位接收', time: '-', done: false },
      { title: '处置完成', time: '-', done: false },
    ],
  },
]
