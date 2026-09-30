<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'
import type { AlertLevel, JudgmentItem, JudgmentStatus } from '../mock/judgment'

const visible = defineModel<boolean>({ default: false })

const props = defineProps<{
  event: JudgmentItem | null
}>()

const emit = defineEmits<{
  updated: [id: string, status: JudgmentStatus]
}>()

const statusType = computed(() => {
  const map: Record<JudgmentStatus, '' | 'success' | 'warning' | 'danger' | 'info'> = {
    研判通过: 'success',
    研判未通过: 'danger',
    待研判: 'warning',
  }
  return props.event ? map[props.event.status] : 'info'
})

const levelType = computed(() => {
  const map: Record<AlertLevel, '' | 'success' | 'warning' | 'danger' | 'info'> = {
    高: 'danger',
    中: 'warning',
    低: 'info',
    '—': 'info',
  }
  return props.event ? map[props.event.alertLevel] : 'info'
})

const conclusionTone = computed(() => {
  const label = props.event?.aiLabel || ''
  if (label.includes('违规')) return 'risk'
  if (label.includes('正常')) return 'ok'
  if (label.includes('待核实')) return 'warn'
  return 'pending'
})

function close() {
  visible.value = false
}

function pass() {
  if (!props.event) return
  ElMessage.success('已确认研判通过')
  emit('updated', props.event.id, '研判通过')
  close()
}

function reject() {
  if (!props.event) return
  ElMessage.warning('已标记为研判未通过')
  emit('updated', props.event.id, '研判未通过')
  close()
}

function rejudge() {
  ElMessage.success('已重新提交 AI 研判')
}
</script>

<template>
  <el-dialog
    v-model="visible"
    width="1160px"
    top="4vh"
    destroy-on-close
    :close-on-click-modal="false"
  >
    <template #header>
      <div class="dlg-header" v-if="event">
        <span class="dlg-title">研判详情</span>
        <el-tag type="primary" effect="light" round>{{ event.type }}</el-tag>
        <el-tag :type="statusType" effect="light" round>{{ event.status }}</el-tag>
        <el-tag v-if="event.alertLevel !== '—'" :type="levelType" effect="plain" round>
          预警{{ event.alertLevel }}
        </el-tag>
      </div>
    </template>

    <div v-if="event" class="dlg-body">
      <div class="left-col">
        <div class="ai-panel" :class="conclusionTone">
          <div class="ai-top">
            <div>
              <div class="ai-eyebrow">AI 研判结果</div>
              <div class="ai-conclusion">{{ event.aiConclusion }}</div>
            </div>
            <div class="ai-score" v-if="event.confidence !== null">
              <div class="score-num">{{ event.confidence }}%</div>
              <div class="score-label">置信度</div>
            </div>
            <div class="ai-score pending" v-else>
              <div class="score-num">—</div>
              <div class="score-label">待推理</div>
            </div>
          </div>

          <div class="ai-meta">
            <div class="meta-item">
              <span class="meta-label">研判标签</span>
              <span class="meta-value">{{ event.aiLabel }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">预警等级</span>
              <span class="meta-value">{{ event.alertLevel }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">研判状态</span>
              <span class="meta-value">{{ event.status }}</span>
            </div>
          </div>

          <div class="ai-reason">
            <div class="sub-title">研判依据</div>
            <p>{{ event.aiReason }}</p>
          </div>

          <div class="ai-features">
            <div class="sub-title">关键特征</div>
            <div class="feature-list">
              <el-tag
                v-for="f in event.aiFeatures"
                :key="f"
                effect="plain"
                round
                class="feature-tag"
              >
                {{ f }}
              </el-tag>
            </div>
          </div>

          <div class="ai-suggest">
            <span class="sub-title">处置建议</span>
            <span>{{ event.suggestAction }}</span>
          </div>
        </div>

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
            <div class="media-head"><span>事件历史图片</span></div>
            <div class="media-box">
              <img :src="event.historyImage" alt="事件历史图片" />
            </div>
          </div>
        </div>

        <div class="info-card">
          <div class="card-title">基础信息</div>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">事件编号</span>
              <span class="value">{{ event.id }}</span>
            </div>
            <div class="info-item">
              <span class="label">所在位置</span>
              <span class="value">{{ event.location }}</span>
            </div>
            <div class="info-item">
              <span class="label">抓拍时间</span>
              <span class="value">{{ event.captureTime }}</span>
            </div>
            <div class="info-item">
              <span class="label">责任单位</span>
              <span class="value">{{ event.dept }}</span>
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
              <span class="label">地籍权属</span>
              <span class="value">{{ event.cadastralOwner }}</span>
            </div>
            <div class="info-item">
              <span class="label">权属单位</span>
              <span class="value">{{ event.ownershipUnit }}</span>
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
          <div class="card-title">研判记录</div>
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
                <el-tag size="small" effect="plain">{{ rec.toStatus }}</el-tag>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dlg-footer">
        <el-button @click="close">取消</el-button>
        <el-button @click="rejudge">重新研判</el-button>
        <el-button type="success" @click="pass">确认通过</el-button>
        <el-button type="danger" @click="reject">研判未通过</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.dlg-header {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
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

.ai-panel {
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e8eef3;
  background: linear-gradient(135deg, #f4f9fc 0%, #eef6f2 100%);
}

.ai-panel.risk {
  background: linear-gradient(135deg, #fff6f4 0%, #fff0e8 100%);
  border-color: #f0c7ba;
}

.ai-panel.ok {
  background: linear-gradient(135deg, #f2fbf6 0%, #eaf7f1 100%);
  border-color: #b7dfc8;
}

.ai-panel.warn {
  background: linear-gradient(135deg, #fff9ef 0%, #fff4e4 100%);
  border-color: #efd2a6;
}

.ai-panel.pending {
  background: linear-gradient(135deg, #f5f7fa 0%, #eef2f6 100%);
}

.ai-top {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.ai-eyebrow {
  font-size: 12px;
  color: #6f8494;
  margin-bottom: 4px;
}

.ai-conclusion {
  font-size: 24px;
  font-weight: 750;
  color: #1f2a33;
}

.ai-score {
  min-width: 76px;
  text-align: center;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(31, 42, 51, 0.08);
}

.score-num {
  font-size: 22px;
  font-weight: 750;
  color: #1f7a63;
  line-height: 1.1;
}

.ai-panel.risk .score-num {
  color: #c4561a;
}

.ai-score.pending .score-num {
  color: #7a8d9c;
}

.score-label {
  font-size: 12px;
  color: #7a8d9c;
  margin-top: 2px;
}

.ai-meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 14px;
}

.meta-item {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  padding: 8px 10px;
}

.meta-label {
  display: block;
  font-size: 12px;
  color: #7a8d9c;
  margin-bottom: 2px;
}

.meta-value {
  font-size: 14px;
  font-weight: 600;
  color: #243747;
}

.ai-reason,
.ai-features,
.ai-suggest {
  margin-top: 12px;
}

.sub-title {
  font-size: 13px;
  font-weight: 700;
  color: #334555;
  margin-bottom: 6px;
}

.ai-reason p {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #4b6070;
}

.feature-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.feature-tag {
  border-color: rgba(31, 122, 99, 0.25);
  color: #1f5f52;
}

.ai-suggest {
  display: flex;
  gap: 10px;
  align-items: baseline;
  font-size: 13px;
  color: #4b6070;
  padding-top: 4px;
}

.ai-suggest .sub-title {
  margin: 0;
  flex-shrink: 0;
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
  height: 170px;
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
  flex: 0 0 110px;
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

.from,
.arrow {
  color: #98a6b3;
}

.dlg-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@media (max-width: 1100px) {
  .dlg-body,
  .media-row,
  .bottom-row,
  .ai-meta {
    grid-template-columns: 1fr;
  }
}
</style>
