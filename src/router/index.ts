import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/warning' },
    { path: '/classification', redirect: '/warning' },
    {
      path: '/warning',
      name: 'warning',
      component: () => import('../views/WarningView.vue'),
      meta: { title: '事件预警' },
    },
    {
      path: '/data-dispatch',
      name: 'data-dispatch',
      component: () => import('../views/DataDispatchView.vue'),
      meta: { title: '数据分流' },
    },
    {
      path: '/event-dispatch',
      name: 'event-dispatch',
      component: () => import('../views/EventDispatchView.vue'),
      meta: { title: '事件研判' },
    },
    {
      path: '/tracking',
      name: 'tracking',
      component: () => import('../views/TrackingView.vue'),
      meta: { title: '事件跟踪' },
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('../views/StatisticsView.vue'),
      meta: { title: '多维度统计' },
    },
  ],
})

export default router
