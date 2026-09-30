export type PushStatus = '已推送' | '待推送' | '推送失败'

export interface DispatchItem {
  id: string
  type: string
  captureTime: string
  location: string
  dept: string
  status: PushStatus
  pushedAt: string
}

export const dispatchItems: DispatchItem[] = [
  {
    id: 'YJ-20260927-0001',
    type: '在建工程',
    captureTime: '2026/9/27 8:46',
    location: '高邮市・汤庄镇・汉留村',
    dept: '自规局',
    status: '已推送',
    pushedAt: '2026/9/27 8:50',
  },
  {
    id: 'YJ-20260927-0002',
    type: '秸秆焚烧',
    captureTime: '2026/9/27 9:32',
    location: '高邮市・汤庄镇・沙堰村',
    dept: '农业农村局',
    status: '已推送',
    pushedAt: '2026/9/27 9:36',
  },
  {
    id: 'YJ-20260927-0003',
    type: '建筑垃圾',
    captureTime: '2026/9/27 10:15',
    location: '高邮市・汤庄镇・汤庄村',
    dept: '城管局',
    status: '推送失败',
    pushedAt: '2026/9/27 10:18',
  },
  {
    id: 'YJ-20260927-0004',
    type: '私搭乱建',
    captureTime: '2026/9/27 11:03',
    location: '高邮市・汤庄镇・四异村',
    dept: '城管局',
    status: '待推送',
    pushedAt: '—',
  },
  {
    id: 'YJ-20260927-0005',
    type: '在建工程',
    captureTime: '2026/9/27 12:28',
    location: '高邮市・汤庄镇・友好村',
    dept: '—',
    status: '待推送',
    pushedAt: '—',
  },
  {
    id: 'YJ-20260927-0006',
    type: '秸秆焚烧',
    captureTime: '2026/9/27 13:02',
    location: '高邮市・汤庄镇・甸垛村',
    dept: '农业农村局',
    status: '推送失败',
    pushedAt: '2026/9/27 13:05',
  },
]
