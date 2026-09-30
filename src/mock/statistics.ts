export type StatsEventType = '在建工程' | '秸秆焚烧' | '建筑垃圾' | '私搭乱建'

export interface RegionStat {
  region: string
  count: number
  ratio: number
}

export interface StatsEvent {
  id: string
  type: StatsEventType
  captureTime: string
  location: string
  region: string
  dept: string
}

/** 扬州市主要行政区划 */
export const yangzhouRegions = [
  '高邮市',
  '江都区',
  '邗江区',
  '广陵区',
  '仪征市',
  '宝应县',
] as const

export const eventTypeOptions: StatsEventType[] = [
  '在建工程',
  '秸秆焚烧',
  '建筑垃圾',
  '私搭乱建',
]

/** 全市事件类型总量分布 */
export const typeDistribution = [
  { type: '在建工程', count: 46 },
  { type: '秸秆焚烧', count: 38 },
  { type: '建筑垃圾', count: 29 },
  { type: '私搭乱建', count: 33 },
]

/** 按事件类型切换的区县统计（扬州境内） */
export const regionStatsByType: Record<StatsEventType, RegionStat[]> = {
  在建工程: [
    { region: '高邮市', count: 18, ratio: 39 },
    { region: '江都区', count: 9, ratio: 20 },
    { region: '邗江区', count: 7, ratio: 15 },
    { region: '广陵区', count: 5, ratio: 11 },
    { region: '仪征市', count: 4, ratio: 9 },
    { region: '宝应县', count: 3, ratio: 6 },
  ],
  秸秆焚烧: [
    { region: '高邮市', count: 14, ratio: 37 },
    { region: '宝应县', count: 10, ratio: 26 },
    { region: '江都区', count: 6, ratio: 16 },
    { region: '仪征市', count: 4, ratio: 11 },
    { region: '邗江区', count: 3, ratio: 8 },
    { region: '广陵区', count: 1, ratio: 2 },
  ],
  建筑垃圾: [
    { region: '广陵区', count: 8, ratio: 28 },
    { region: '邗江区', count: 7, ratio: 24 },
    { region: '高邮市', count: 6, ratio: 21 },
    { region: '江都区', count: 4, ratio: 14 },
    { region: '仪征市', count: 3, ratio: 10 },
    { region: '宝应县', count: 1, ratio: 3 },
  ],
  私搭乱建: [
    { region: '高邮市', count: 12, ratio: 36 },
    { region: '江都区', count: 8, ratio: 24 },
    { region: '仪征市', count: 5, ratio: 15 },
    { region: '邗江区', count: 4, ratio: 12 },
    { region: '广陵区', count: 3, ratio: 9 },
    { region: '宝应县', count: 1, ratio: 4 },
  ],
}

/** 关联事件明细（与预警样例一致，并补充扬州其他区县示例） */
export const statsEvents: StatsEvent[] = [
  {
    id: 'YJ-20260927-0001',
    type: '在建工程',
    captureTime: '2026/9/27 8:46',
    location: '高邮市・汤庄镇・汉留村',
    region: '高邮市',
    dept: '自规局',
  },
  {
    id: 'YJ-20260927-0005',
    type: '在建工程',
    captureTime: '2026/9/27 12:28',
    location: '高邮市・汤庄镇・友好村',
    region: '高邮市',
    dept: '—',
  },
  {
    id: 'YJ-20260926-0011',
    type: '在建工程',
    captureTime: '2026/9/26 15:20',
    location: '江都区・仙女镇・砖桥村',
    region: '江都区',
    dept: '自规局',
  },
  {
    id: 'YJ-20260926-0012',
    type: '在建工程',
    captureTime: '2026/9/26 16:05',
    location: '邗江区・瓜洲镇・建华村',
    region: '邗江区',
    dept: '自规局',
  },
  {
    id: 'YJ-20260927-0002',
    type: '秸秆焚烧',
    captureTime: '2026/9/27 9:32',
    location: '高邮市・汤庄镇・沙堰村',
    region: '高邮市',
    dept: '农业农村局',
  },
  {
    id: 'YJ-20260927-0006',
    type: '秸秆焚烧',
    captureTime: '2026/9/27 13:02',
    location: '高邮市・汤庄镇・甸垛村',
    region: '高邮市',
    dept: '农业农村局',
  },
  {
    id: 'YJ-20260925-0021',
    type: '秸秆焚烧',
    captureTime: '2026/9/25 17:40',
    location: '宝应县・安宜镇・长沟村',
    region: '宝应县',
    dept: '农业农村局',
  },
  {
    id: 'YJ-20260925-0022',
    type: '秸秆焚烧',
    captureTime: '2026/9/25 18:12',
    location: '仪征市・陈集镇・新集村',
    region: '仪征市',
    dept: '农业农村局',
  },
  {
    id: 'YJ-20260927-0003',
    type: '建筑垃圾',
    captureTime: '2026/9/27 10:15',
    location: '高邮市・汤庄镇・汤庄村',
    region: '高邮市',
    dept: '城管局',
  },
  {
    id: 'YJ-20260924-0031',
    type: '建筑垃圾',
    captureTime: '2026/9/24 11:08',
    location: '广陵区・湾头镇・民和村',
    region: '广陵区',
    dept: '城管局',
  },
  {
    id: 'YJ-20260924-0032',
    type: '建筑垃圾',
    captureTime: '2026/9/24 14:33',
    location: '邗江区・蒋王街道・建华社区',
    region: '邗江区',
    dept: '城管局',
  },
  {
    id: 'YJ-20260927-0004',
    type: '私搭乱建',
    captureTime: '2026/9/27 11:03',
    location: '高邮市・汤庄镇・四异村',
    region: '高邮市',
    dept: '城管局',
  },
  {
    id: 'YJ-20260923-0041',
    type: '私搭乱建',
    captureTime: '2026/9/23 9:50',
    location: '江都区・丁沟镇・果园村',
    region: '江都区',
    dept: '城管局',
  },
  {
    id: 'YJ-20260923-0042',
    type: '私搭乱建',
    captureTime: '2026/9/23 10:26',
    location: '仪征市・真州镇・青浦村',
    region: '仪征市',
    dept: '城管局',
  },
]
