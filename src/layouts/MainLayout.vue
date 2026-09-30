<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Bell,
  Share,
  Switch,
  Position,
  DataAnalysis,
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const menus = [
  { path: '/warning', title: '事件预警', icon: Bell },
  { path: '/data-dispatch', title: '数据分流', icon: Share },
  { path: '/event-dispatch', title: '事件研判', icon: Switch },
  { path: '/tracking', title: '事件跟踪', icon: Position },
  { path: '/statistics', title: '多维度统计', icon: DataAnalysis },
]

const active = computed(() => route.path)
const pageTitle = computed(() => (route.meta.title as string) || '低空控制平台')

function go(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="layout">
    <aside class="sider">
      <div class="brand">
        <div class="brand-mark" />
        <div>
          <div class="brand-name">低空控制平台</div>
          <div class="brand-sub">无人机研判与业务分流</div>
        </div>
      </div>
      <nav class="menu">
        <button
          v-for="item in menus"
          :key="item.path"
          class="menu-item"
          :class="{ active: active === item.path }"
          @click="go(item.path)"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.title }}</span>
        </button>
      </nav>
    </aside>

    <section class="main">
      <header class="header">
        <h1>{{ pageTitle }}</h1>
        <span class="hint">演示数据 · 智能体结果可人工确认</span>
      </header>
      <main class="content">
        <router-view />
      </main>
    </section>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background:
    radial-gradient(circle at 12% 10%, rgba(36, 120, 180, 0.12), transparent 36%),
    radial-gradient(circle at 88% 0%, rgba(20, 90, 70, 0.1), transparent 30%),
    #eef3f7;
  color: #1f2a33;
}

.sider {
  width: 232px;
  padding: 20px 14px;
  background: linear-gradient(180deg, #163247 0%, #1c3f52 55%, #214857 100%);
  color: #d9e8f0;
  box-shadow: inset -1px 0 0 rgba(255, 255, 255, 0.06);
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 8px 10px 22px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 16px;
}

.brand-mark {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background:
    linear-gradient(135deg, #3db2ff, #1f7a63);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.15);
}

.brand-name {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.brand-sub {
  margin-top: 2px;
  font-size: 12px;
  opacity: 0.7;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  border: 0;
  background: transparent;
  color: inherit;
  padding: 11px 12px;
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  transition: background 0.2s ease, transform 0.2s ease;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.menu-item.active {
  background: linear-gradient(90deg, rgba(61, 178, 255, 0.28), rgba(61, 178, 255, 0.08));
  color: #fff;
  transform: translateX(2px);
}

.main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 22px 28px 8px;
}

.header h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  font-family: "Source Han Sans SC", "Noto Sans SC", "PingFang SC", sans-serif;
}

.hint {
  font-size: 13px;
  color: #5f7383;
}

.content {
  padding: 12px 28px 28px;
}
</style>
