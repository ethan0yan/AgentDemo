<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'
import type { AlertLevel, AiConclusion, JudgmentItem, JudgmentStatus } from '../mock/judgment'

const visible = defineModel<boolean>({ default: false })

const props = defineProps<{
  event: JudgmentItem | null
}>()

const emit = defineEmits<{
  updated: [id: string, status: JudgmentStatus, conclusion?: AiConclusion]
}>()

const base = import.meta.env.BASE_URL

function assetUrl(path?: string) {
  if (!path) return ''
  return `${base}${path.replace(/^\//, '')}`
}

const orthoUrl = computed(() => assetUrl(props.event?.orthoImage))
const historyUrl = computed(() => assetUrl(props.event?.historyImage))

const statusType = computed(() => {
  const map: Record<JudgmentStatus, '' | 'success' | 'warning' | 'danger' | 'info'> = {
    已研判: 'success',
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
  const c = props.event?.aiConclusion
  if (c === '疑似违规') return 'risk'
  if (c === '正常') return 'ok'
  if (c === '待核实') return 'warn'
  return 'pending'
})

function close() {
  visible.value = false
}

function markJudged(conclusion: AiConclusion) {
  if (!props.event) return
  ElMessage.success(`已确认研判结论：${conclusion}`)
  emit('updated', props.event.id, '已研判', conclusion)
  close()
}

function rejudge() {
  ElMessage.success('已重新提交 AI 研判')
}
</script>

<template>
  <el-dialog
    v-model="visible"
    width="1180px"
    top="3vh"
    destroy-on-close
    :close-on-click-modal="false"
    class="judgment-detail-dialog"
  >
    <template #header>
      <div class="dlg-header" v-if="event">
        <span class="dlg-title">事件详情</span>
        <el-tag type="primary" effect="light" round>{{ event.type }}</el-tag>
        <el-tag :type="statusType" effect="light" round>{{ event.status }}</el-tag>
      </div>
    </template>

    <div v-if="event" class="dlg-body">
      <div class="main-col">
        <div class="ai-banner" :class="conclusionTone">
          <div class="ai-left">
            <div class="ai-label">AI 研判结论</div>
            <div class="ai-value">{{ event.aiConclusion }}</div>
          </div>
          <div class="ai-right">
            <div class="ai-meta">
              <span>预警等级</span>
              <el-tag
                v-if="event.alertLevel !== '—'"
                :type="levelType"
                effect="plain"
                round
              >
                {{ event.alertLevel }}
              </el-tag>
              <span v-else class="dash">—</span>
            </div>
            <div class="ai-meta">
              <span>研判状态</span>
              <strong>{{ event.status }}</strong>
            </div>
          </div>
          <div class="ai-reason">
            <b>研判依据：</b>{{ event.aiReason }}
            <div class="features">
              <el-tag
                v-for="f in event.aiFeatures"
                :key="f"
                size="small"
                effect="plain"
                round
              >
                {{ f }}
              </el-tag>
            </div>
            <div class="suggest"><b>处置建议：</b>{{ event.suggestAction }}</div>
          </div>
        </div>

        <div class="media-row">
          <div class="media-card">
            <div class="media-head">
              <span>正射图片</span>
              <el-button size="small" type="primary" plain>地图显示</el-button>
            </div>
            <div v-if="orthoUrl" class="media-box">
              <img :src="orthoUrl" alt="正射图片" />
            </div>
            <div v-else class="media-box empty">
              <el-icon :size="36"><Picture /></el-icon>
              <span>暂未上传正射图片</span>
            </div>
          </div>
          <div class="media-card">
            <div class="media-head"><span>事件历史图片</span></div>
            <div v-if="historyUrl" class="media-box">
              <img :src="historyUrl" alt="事件历史图片" />
            </div>
            <div v-else class="media-box empty">
              <el-icon :size="36"><Picture /></el-icon>
              <span>暂无历史图片</span>
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
              <span class="label">所属村界</span>
              <span class="value">{{ event.village }}</span>
            </div>
            <div class="info-item">
              <span class="label">城镇开发边界</span>
              <span class="value">{{ event.urbanBoundary }}</span>
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
                <span class="value">
                  <el-tag
                    v-if="item.value === '已供地'"
                    type="success"
                    effect="light"
                    size="small"
                  >
                    {{ item.value }}
                  </el-tag>
                  <template v-else>{{ item.value }}</template>
                </span>
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

      <aside class="side-col">
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
                状态变更 {{ rec.fromStatus }}
                <span class="arrow">→</span>
                <el-tag size="small" type="danger" effect="plain">{{ rec.toStatus }}</el-tag>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </aside>
    </div>

    <template #footer>
      <div class="dlg-footer">
        <el-button @click="close">取消</el-button>
        <el-button @click="rejudge">重新研判</el-button>
        <el-button type="danger" plain @click="markJudged('疑似违规')">疑似违规</el-button>
        <el-button type="warning" plain @click="markJudged('待核实')">待核实</el-button>
        <el-button type="success" @click="markJudged('正常')">正常</el-button>
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
}

.dlg-body {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 12px;
  max-height: calc(92vh - 150px);
  overflow: auto;
}

.main-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.ai-banner {
  border-radius: 10px;
  border: 1px solid #e8eef3;
  padding: 14px 16px;
  background: #f5f8fb;
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 10px 16px;
}

.ai-banner.risk {
  background: linear-gradient(135deg, #fff6f4, #fff0e8);
  border-color: #f0c7ba;
}

.ai-banner.ok {
  background: linear-gradient(135deg, #f2fbf6, #eaf7f1);
  border-color: #b7dfc8;
}

.ai-banner.warn {
  background: linear-gradient(135deg, #fff9ef, #fff4e4);
  border-color: #efd2a6;
}

.ai-banner.pending {
  background: #f5f7fa;
}

.ai-label {
  font-size: 12px;
  color: #6f8494;
}

.ai-value {
  margin-top: 4px;
  font-size: 24px;
  font-weight: 750;
}

.ai-right {
  display: flex;
  gap: 24px;
  align-items: center;
}

.ai-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #5f7383;
}

.dash {
  color: #98a6b3;
}

.ai-reason {
  grid-column: 1 / -1;
  font-size: 13px;
  color: #4b6070;
  line-height: 1.6;
}

.features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.suggest {
  margin-top: 8px;
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
  min-height: 420px;
  height: 100%;
}

.rec-title {
  display: flex;
  gap: 8px;
  align-items: center;
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
  color: #6a7b88;
}

.arrow {
  color: #98a6b3;
}

.dlg-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

@media (max-width: 1100px) {
  .dlg-body,
  .media-row,
  .bottom-row,
  .ai-banner {
    grid-template-columns: 1fr;
  }

  .ai-reason {
    grid-column: auto;
  }
}
</style>
