<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  judgmentItems,
  type AlertLevel,
  type AiConclusion,
  type JudgmentItem,
  type JudgmentStatus,
} from '../mock/judgment'
import JudgmentDetailDialog from '../components/JudgmentDetailDialog.vue'

const list = ref<JudgmentItem[]>(judgmentItems.map((item) => ({ ...item })))

const filters = reactive({
  id: '',
  type: '',
  captureRange: null as [string, string] | null,
  location: '',
  status: '' as '' | JudgmentStatus,
  aiConclusion: '' as '' | AiConclusion,
  alertLevel: '' as '' | AlertLevel,
  dept: '',
})

const detailVisible = ref(false)
const current = ref<JudgmentItem | null>(null)

const typeOptions = computed(() => [...new Set(list.value.map((i) => i.type))])
const locationOptions = computed(() => [...new Set(list.value.map((i) => i.location))])
const deptOptions = computed(() => [...new Set(list.value.map((i) => i.dept))])
const statusOptions: JudgmentStatus[] = ['已研判', '待研判']
const conclusionOptions: AiConclusion[] = ['疑似违规', '待核实', '正常', '—']
const levelOptions: AlertLevel[] = ['高', '中', '低', '—']

function parseTime(value: string) {
  if (!value || value === '—') return null
  const date = new Date(value.replace(/-/g, '/'))
  return Number.isNaN(date.getTime()) ? null : date.getTime()
}

function inRange(value: string, range: [string, string] | null) {
  if (!range?.length) return true
  const ts = parseTime(value)
  if (ts === null) return false
  const start = new Date(range[0]).getTime()
  const end = new Date(range[1]).getTime()
  return ts >= start && ts <= end
}

const filtered = computed(() =>
  list.value.filter((item) => {
    const hitId = !filters.id || item.id.includes(filters.id.trim())
    const hitType = !filters.type || item.type === filters.type
    const hitLocation = !filters.location || item.location === filters.location
    const hitDept = !filters.dept || item.dept === filters.dept
    const hitStatus = !filters.status || item.status === filters.status
    const hitConclusion = !filters.aiConclusion || item.aiConclusion === filters.aiConclusion
    const hitLevel = !filters.alertLevel || item.alertLevel === filters.alertLevel
    const hitCapture = inRange(item.captureTime, filters.captureRange)
    return (
      hitId &&
      hitType &&
      hitLocation &&
      hitDept &&
      hitStatus &&
      hitConclusion &&
      hitLevel &&
      hitCapture
    )
  }),
)

function resetFilters() {
  filters.id = ''
  filters.type = ''
  filters.captureRange = null
  filters.location = ''
  filters.status = ''
  filters.aiConclusion = ''
  filters.alertLevel = ''
  filters.dept = ''
}

function openDetail(row: JudgmentItem) {
  current.value = row
  detailVisible.value = true
}

function onUpdated(id: string, status: JudgmentStatus, conclusion?: AiConclusion) {
  const target = list.value.find((i) => i.id === id)
  if (!target) return
  target.status = status
  if (conclusion) target.aiConclusion = conclusion
}

function statusType(status: JudgmentStatus) {
  return status === '已研判' ? 'success' : 'warning'
}

function levelType(level: AlertLevel) {
  if (level === '高') return 'danger'
  if (level === '中') return 'warning'
  if (level === '低') return 'info'
  return 'info'
}

function conclusionType(c: AiConclusion) {
  if (c === '疑似违规') return 'danger'
  if (c === '待核实') return 'warning'
  if (c === '正常') return 'success'
  return 'info'
}
</script>

<template>
  <div class="page">
    <el-card shadow="never" class="panel">
      <div class="toolbar">
        <el-input
          v-model="filters.id"
          clearable
          placeholder="事件编号"
          style="width: 180px"
        />
        <el-select
          v-model="filters.type"
          clearable
          placeholder="事件类型"
          style="width: 140px"
        >
          <el-option v-for="t in typeOptions" :key="t" :label="t" :value="t" />
        </el-select>
        <el-date-picker
          v-model="filters.captureRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="抓拍起始时间"
          end-placeholder="抓拍终止时间"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY/M/D HH:mm"
          style="width: 360px"
        />
        <el-select
          v-model="filters.location"
          clearable
          filterable
          placeholder="所在位置"
          style="width: 220px"
        >
          <el-option v-for="l in locationOptions" :key="l" :label="l" :value="l" />
        </el-select>
        <el-select
          v-model="filters.status"
          clearable
          placeholder="状态"
          style="width: 120px"
        >
          <el-option v-for="s in statusOptions" :key="s" :label="s" :value="s" />
        </el-select>
        <el-select
          v-model="filters.aiConclusion"
          clearable
          placeholder="AI研判结论"
          style="width: 140px"
        >
          <el-option v-for="c in conclusionOptions" :key="c" :label="c" :value="c" />
        </el-select>
        <el-select
          v-model="filters.alertLevel"
          clearable
          placeholder="预警等级"
          style="width: 120px"
        >
          <el-option v-for="l in levelOptions" :key="l" :label="l" :value="l" />
        </el-select>
        <el-select
          v-model="filters.dept"
          clearable
          placeholder="责任单位"
          style="width: 140px"
        >
          <el-option v-for="d in deptOptions" :key="d" :label="d" :value="d" />
        </el-select>
        <el-button @click="resetFilters">重置</el-button>
      </div>

      <el-table :data="filtered" stripe>
        <el-table-column prop="id" label="事件编号" min-width="160" />
        <el-table-column prop="type" label="事件类型" min-width="110" />
        <el-table-column prop="captureTime" label="抓拍时间" min-width="140" />
        <el-table-column prop="location" label="所在位置" min-width="200" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" effect="light">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="AI研判结论" min-width="120">
          <template #default="{ row }">
            <el-tag
              v-if="row.aiConclusion !== '—'"
              :type="conclusionType(row.aiConclusion)"
              effect="plain"
            >
              {{ row.aiConclusion }}
            </el-tag>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="预警等级" width="100">
          <template #default="{ row }">
            <el-tag
              v-if="row.alertLevel !== '—'"
              :type="levelType(row.alertLevel)"
              effect="plain"
            >
              {{ row.alertLevel }}
            </el-tag>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column prop="dept" label="责任单位" min-width="110" />
        <el-table-column label="操作" width="110" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDetail(row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <JudgmentDetailDialog
      v-model="detailVisible"
      :event="current"
      @updated="onUpdated"
    />
  </div>
</template>

<style scoped>
.panel {
  border: 0;
  border-radius: 14px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 14px;
  align-items: center;
}

.muted {
  color: #98a6b3;
}
</style>
