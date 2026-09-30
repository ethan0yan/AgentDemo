<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'
import type { WarningEvent } from '../mock/warnings'

const visible = defineModel<boolean>({ default: false })

const props = defineProps<{
  event: WarningEvent | null
}>()

const emit = defineEmits<{
  handled: [id: string, status: WarningEvent['status']]
}>()

const statusType = computed(() => {
  const map: Record<string, '' | 'success' | 'warning' | 'danger' | 'info'> = {
    待处理: 'danger',
    处置中: 'warning',
    已办结: 'success',
    误报: 'info',
  }
  return props.event ? map[props.event.status] || 'info' : 'info'
})

function close() {
  visible.value = false
}

function onHandle() {
  if (!props.event) return
  ElMessage.success('已进入初次处置')
  emit('handled', props.event.id, '处置中')
  close()
}

function onFalseAlarm() {
  if (!props.event) return
  ElMessage.warning('已标记为误报')
  emit('handled', props.event.id, '误报')
  close()
}

function onReport() {
  ElMessage.success('已上报')
}
</script>

<template>
  <el-dialog
    v-model="visible"
    width="1120px"
    top="4vh"
    class="event-detail-dialog"
    destroy-on-close
    :close-on-click-modal="false"
  >
    <template #header>
      <div class="dlg-header" v-if="event">
        <span class="dlg-title">事件详情</span>
        <el-tag type="primary" effect="light" round>{{ event.type }}</el-tag>
        <el-tag :type="statusType" effect="light" round>{{ event.status }}</el-tag>
      </div>
    </template>

    <div v-if="event" class="dlg-body">
      <div class="left-col">
        <div class="media-row">
          <div class="media-card">
            <div class="media-head">
              <span>正射图片</span>
              <el-button size="small" type="primary" plain>地图显示</el-button>
            </div>
            <div class="media-box empty">
              <el-icon :size="36"><Picture /></el-icon>
              <span>暂未上传正射图片</span>
            </div>
          </div>
          <div class="media-card">
            <div class="media-head">
              <span>事件历史图片</span>
            </div>
            <div class="media-box">
              <img :src="event.historyImage" alt="事件历史图片" />
            </div>
          </div>
        </div>

        <div class="info-card">
          <div class="card-title">基础信息</div>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">图斑编号</span>
              <span class="value">{{ event.parcelNo }}</span>
            </div>
            <div class="info-item">
              <span class="label">所在位置</span>
              <span class="value">{{ event.location }}</span>
            </div>
            <div class="info-item">
              <span class="label">所属村界</span>
              <span class="value">{{ event.village }}</span>
            </div>
            <div class="info-item">
              <span class="label">城镇开发边界</span>
              <span class="value">{{ event.urbanBoundary }}</span>
            </div>
            <div class="info-item">
              <span class="label">责任单位</span>
              <span class="value">{{ event.dept }}</span>
            </div>
            <div class="info-item">
              <span class="label">权属单位</span>
              <span class="value">{{ event.ownershipUnit }}</span>
            </div>
            <div class="info-item">
              <span class="label">地籍权属</span>
              <span class="value">{{ event.cadastralOwner }}</span>
            </div>
            <div class="info-item">
              <span class="label">红线面积</span>
              <span class="value">{{ event.redLineArea }}</span>
            </div>
            <div class="info-item">
              <span class="label">耕地面积</span>
              <span class="value">{{ event.farmlandArea }}</span>
            </div>
            <div class="info-item">
              <span class="label">基本农田面积</span>
              <span class="value">{{ event.basicFarmlandArea }}</span>
            </div>
          </div>
        </div>

        <div class="bottom-row">
          <div class="info-card">
            <div class="card-title">地块信息</div>
            <div class="kv-list">
              <div v-for="item in event.plotInfo" :key="item.label" class="kv-item">
                <span class="label">{{ item.label }}</span>
                <span class="value">{{ item.value }}</span>
              </div>
            </div>
          </div>
          <div class="info-card">
            <div class="card-title">规划信息</div>
            <div class="kv-list">
              <div v-for="item in event.planInfo" :key="item.label" class="kv-item">
                <span class="label">{{ item.label }}</span>
                <span class="value">{{ item.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="right-col">
        <div class="info-card records-card">
          <div class="card-title">处置记录</div>
          <el-timeline>
            <el-timeline-item
              v-for="(rec, idx) in event.records"
              :key="idx"
              type="primary"
              :timestamp="rec.time"
              placement="top"
            >
              <div class="rec-title">
                <b>{{ rec.title }}</b>
                <span class="op">{{ rec.operator }}</span>
              </div>
              <div class="rec-content">{{ rec.content }}</div>
              <div class="rec-status">
                <span class="from">{{ rec.fromStatus }}</span>
                <span class="arrow">→</span>
                <el-tag size="small" type="danger" effect="plain">{{ rec.toStatus }}</el-tag>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dlg-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="onHandle">初次处置</el-button>
        <el-button type="warning" @click="onFalseAlarm">标记误报</el-button>
        <el-button class="report-btn" @click="onReport">上报</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.dlg-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dlg-title {
  font-size: 18px;
  font-weight: 700;
  margin-right: 4px;
}

.dlg-body {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 14px;
  max-height: calc(92vh - 160px);
  overflow: auto;
  padding-right: 4px;
}

.left-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.media-row,
.bottom-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.media-card,
.info-card {
  background: #fff;
  border: 1px solid #e8eef3;
  border-radius: 10px;
  padding: 12px;
}

.media-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  font-weight: 600;
  color: #334555;
}

.media-box {
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  background: #f4f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-box.empty {
  flex-direction: column;
  gap: 8px;
  color: #8aa0b2;
  border: 1px dashed #d5dee7;
}

.card-title {
  font-weight: 700;
  margin-bottom: 12px;
  color: #243747;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 20px;
}

.info-item,
.kv-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-size: 13px;
  line-height: 1.5;
}

.label {
  flex: 0 0 118px;
  color: #7a8d9c;
}

.value {
  color: #1f2a33;
  word-break: break-all;
}

.kv-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.records-card {
  height: 100%;
  min-height: 420px;
}

.rec-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.op {
  color: #8aa0b2;
  font-size: 12px;
}

.rec-content {
  font-size: 13px;
  color: #4b6070;
  margin-bottom: 6px;
}

.rec-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.from {
  color: #98a6b3;
}

.arrow {
  color: #98a6b3;
}

.dlg-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.report-btn {
  --el-button-bg-color: #e8f7f4;
  --el-button-border-color: #7ec8b8;
  --el-button-text-color: #1f7a63;
  --el-button-hover-bg-color: #d8f1eb;
  --el-button-hover-border-color: #1f7a63;
  --el-button-hover-text-color: #155a49;
}

@media (max-width: 1100px) {
  .dlg-body {
    grid-template-columns: 1fr;
  }

  .media-row,
  .bottom-row {
    grid-template-columns: 1fr;
  }
}
</style>
