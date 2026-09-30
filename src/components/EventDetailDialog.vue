<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Star,
  Download,
  Share,
  RefreshRight,
  Clock,
  Location,
  Compass,
  View,
  Picture,
} from '@element-plus/icons-vue'
import type { WarningEvent } from '../mock/warnings'

const visible = defineModel<boolean>({ default: false })

const props = defineProps<{
  event: WarningEvent | null
}>()

const emit = defineEmits<{
  handled: [id: string, status: WarningEvent['status']]
}>()

const base = import.meta.env.BASE_URL

function assetUrl(path?: string) {
  if (!path) return ''
  if (/^https?:\/\//.test(path) || path.startsWith('data:')) return path
  return `${base}${path.replace(/^\//, '')}`
}

const photoUrl = computed(() => assetUrl(props.event?.photo))
const mapUrl = computed(() => assetUrl(props.event?.mapImage))
const titleText = computed(() =>
  props.event ? `${props.event.type} ${props.event.displayCode}` : '',
)

function close() {
  visible.value = false
}

function onIgnore() {
  if (!props.event) return
  ElMessage.info('已忽略该预警')
  emit('handled', props.event.id, '误报')
  close()
}

function onProcess() {
  if (!props.event) return
  ElMessage.success('已进入处理流程')
  emit('handled', props.event.id, '处置中')
  close()
}
</script>

<template>
  <el-dialog
    v-model="visible"
    width="1180px"
    top="3vh"
    class="warning-detail-dialog"
    destroy-on-close
    :show-close="true"
    :close-on-click-modal="false"
  >
    <template #header>
      <span class="dlg-title">事件预警详情</span>
    </template>

    <div v-if="event" class="detail-layout">
      <section class="visual-pane">
        <div v-if="photoUrl" class="photo-stage">
          <img :src="photoUrl" :alt="titleText" class="photo" />
          <div v-if="event.dateBadge" class="date-badge">
            <span>{{ event.dateBadge[0] }}</span>
            <i />
            <span>{{ event.dateBadge[1] }}</span>
          </div>
          <button class="eye-btn" type="button" title="查看标注">
            <el-icon :size="16"><View /></el-icon>
          </button>
        </div>
        <div v-else class="photo-stage empty">
          <el-icon :size="48"><Picture /></el-icon>
          <div class="empty-title">暂无抓拍照片</div>
          <div class="empty-desc">事件 {{ event.id }}（{{ event.type }}）尚未回传影像</div>
        </div>
      </section>

      <aside class="info-pane">
        <div class="tool-row">
          <button type="button" class="icon-btn" title="收藏"><el-icon><Star /></el-icon></button>
          <button type="button" class="icon-btn" title="下载"><el-icon><Download /></el-icon></button>
          <button type="button" class="icon-btn" title="分享"><el-icon><Share /></el-icon></button>
          <button type="button" class="icon-btn" title="重新识别"><el-icon><RefreshRight /></el-icon></button>
          <button type="button" class="icon-btn history" title="历史">
            <el-icon><Clock /></el-icon>
            <i class="dot">1</i>
          </button>
        </div>

        <div class="head-block">
          <span class="status-pill">新发现</span>
          <h2 class="event-title">{{ titleText }}</h2>
          <p class="meta-line">
            拍照 {{ event.photoTime }}，识别 {{ event.recognizeTime }}
          </p>
          <p class="meta-line">
            预警 <b class="accent">{{ event.warnCount }}</b> 次，上报
            <b class="accent">{{ event.reportCount }}</b> 次
          </p>
        </div>

        <div class="section">
          <div class="section-title">
            <el-icon><Location /></el-icon>
            <span>位置</span>
          </div>
          <div class="section-body">
            <div>{{ event.location }}</div>
            <div class="sub">责任单位：{{ event.dept }}</div>
            <div class="sub">事件编号：{{ event.id }}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">
            <el-icon><Compass /></el-icon>
            <span>其他</span>
          </div>
          <div class="section-body">
            <div>机场：{{ event.airport }}</div>
            <div class="route-line">
              航线：{{ event.route }}
              <span class="chev">›</span>
            </div>
          </div>
        </div>

        <div class="mini-map">
          <img v-if="mapUrl" :src="mapUrl" alt="位置地图" />
          <div v-else class="map-fallback">
            <el-icon :size="22"><Location /></el-icon>
            <span>{{ event.location }}</span>
          </div>
        </div>

        <div class="actions">
          <button type="button" class="btn ignore" @click="onIgnore">忽略</button>
          <button type="button" class="btn process" @click="onProcess">处理</button>
        </div>
      </aside>
    </div>
  </el-dialog>
</template>

<style scoped>
.dlg-title {
  font-size: 16px;
  font-weight: 700;
}

.detail-layout {
  display: grid;
  grid-template-columns: 1.55fr 0.9fr;
  gap: 0;
  min-height: 560px;
  margin: -8px -16px -12px;
  border-radius: 8px;
  overflow: hidden;
  background: #0f1419;
}

.visual-pane {
  min-width: 0;
  background: #111;
}

.photo-stage {
  position: relative;
  height: 100%;
  min-height: 560px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.photo-stage.empty {
  flex-direction: column;
  gap: 10px;
  color: #9aa8b5;
  background: linear-gradient(160deg, #1a222b, #121820);
}

.empty-title {
  font-size: 16px;
  font-weight: 600;
  color: #d7e1ea;
}

.empty-desc {
  font-size: 13px;
  opacity: 0.8;
}

.date-badge {
  position: absolute;
  left: 12px;
  top: 42%;
  transform: translateY(-50%);
  width: 34px;
  padding: 10px 0;
  border-radius: 18px;
  background: rgba(20, 24, 30, 0.55);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.date-badge i {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #fff;
  opacity: 0.7;
}

.eye-btn {
  position: absolute;
  right: 14px;
  bottom: 14px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.75);
  background: rgba(0, 0, 0, 0.25);
  color: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.info-pane {
  background: #fff;
  color: #1f2a33;
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.tool-row {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
  margin-bottom: 10px;
}

.icon-btn {
  position: relative;
  width: 32px;
  height: 32px;
  border: 0;
  background: transparent;
  color: #5b6b78;
  border-radius: 8px;
  cursor: pointer;
  display: grid;
  place-items: center;
}

.icon-btn:hover {
  background: #f2f5f8;
}

.icon-btn.history .dot {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 14px;
  height: 14px;
  padding: 0 3px;
  border-radius: 8px;
  background: #e34d4d;
  color: #fff;
  font-size: 10px;
  line-height: 14px;
  font-style: normal;
}

.head-block {
  margin-bottom: 16px;
}

.status-pill {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 6px;
  background: #3a4450;
  color: #fff;
  font-size: 12px;
  margin-bottom: 8px;
}

.event-title {
  margin: 0 0 8px;
  font-size: 22px;
  line-height: 1.25;
  font-weight: 750;
}

.meta-line {
  margin: 0 0 4px;
  font-size: 13px;
  color: #6a7b88;
}

.accent {
  color: #e34d4d;
  font-weight: 700;
}

.section {
  margin-bottom: 14px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  margin-bottom: 8px;
}

.section-body {
  font-size: 13px;
  line-height: 1.7;
  color: #334555;
  padding-left: 22px;
}

.sub {
  color: #6a7b88;
}

.route-line {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.chev {
  color: #98a6b3;
  font-size: 16px;
}

.mini-map {
  margin-top: auto;
  border-radius: 8px;
  overflow: hidden;
  background: #eef2f5;
  height: 140px;
  border: 1px solid #e4ebf0;
}

.mini-map img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.map-fallback {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #7a8d9c;
  font-size: 12px;
  text-align: center;
  padding: 12px;
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 10px;
  margin-top: 14px;
}

.btn {
  height: 42px;
  border: 0;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.btn.ignore {
  background: #2f3740;
  color: #fff;
}

.btn.process {
  background: #2f7bff;
  color: #fff;
}

.btn.process:hover {
  background: #1f6aef;
}

@media (max-width: 960px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }

  .photo-stage {
    min-height: 320px;
  }
}
</style>

<style>
.warning-detail-dialog .el-dialog__body {
  padding-top: 8px;
}
</style>
