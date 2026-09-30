<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  trackItems,
  trackStatusOptions,
  type TrackItem,
  type TrackStatus,
} from '../mock/tracking'

const list = ref<TrackItem[]>(trackItems.map((item) => ({ ...item, nodes: [...item.nodes] })))

const filters = reactive({
  id: '',
  type: '',
  captureRange: null as [string, string] | null,
  location: '',
  dept: '',
  status: '' as '' | TrackStatus,
})

const current = ref<TrackItem | null>(list.value[0] ?? null)

const typeOptions = computed(() => [...new Set(list.value.map((i) => i.type))])
const locationOptions = computed(() => [...new Set(list.value.map((i) => i.location))])
const deptOptions = computed(() => [...new Set(list.value.map((i) => i.dept))])

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
    const hitCapture = inRange(item.captureTime, filters.captureRange)
    return hitId && hitType && hitLocation && hitDept && hitStatus && hitCapture
  }),
)

function resetFilters() {
  filters.id = ''
  filters.type = ''
  filters.captureRange = null
  filters.location = ''
  filters.dept = ''
  filters.status = ''
}

function selectRow(row: TrackItem | null) {
  if (row) current.value = row
}

function statusType(status: TrackStatus) {
  const map: Record<TrackStatus, '' | 'success' | 'warning' | 'danger' | 'info' | 'primary'> = {
    已上报: 'info',
    已分流: 'primary',
    已受理: '',
    反馈处理: 'warning',
    已退回: 'danger',
    已办结: 'success',
  }
  return map[status]
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
          v-model="filters.dept"
          clearable
          placeholder="责任单位"
          style="width: 140px"
        >
          <el-option v-for="d in deptOptions" :key="d" :label="d" :value="d" />
        </el-select>
        <el-select
          v-model="filters.status"
          clearable
          placeholder="状态"
          style="width: 130px"
        >
          <el-option
            v-for="s in trackStatusOptions"
            :key="s"
            :label="s"
            :value="s"
          />
        </el-select>
        <el-button @click="resetFilters">重置</el-button>
      </div>

      <div class="split">
        <el-table
          :data="filtered"
          stripe
          highlight-current-row
          @current-change="selectRow"
        >
          <el-table-column prop="id" label="事件编号" min-width="160" />
          <el-table-column prop="type" label="事件类型" min-width="110" />
          <el-table-column prop="captureTime" label="抓拍时间" min-width="140" />
          <el-table-column prop="location" label="所在位置" min-width="200" />
          <el-table-column prop="dept" label="责任单位" min-width="110" />
          <el-table-column label="状态" width="110">
            <template #default="{ row }">
              <el-tag :type="statusType(row.status)" effect="light">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
        </el-table>

        <div class="timeline-panel" v-if="current">
          <div class="card-title">全过程跟踪 · {{ current.id }}</div>
          <div class="current-status">
            当前状态：
            <el-tag :type="statusType(current.status)" effect="plain">{{ current.status }}</el-tag>
          </div>
          <el-timeline>
            <el-timeline-item
              v-for="node in current.nodes"
              :key="node.title"
              :type="node.done ? 'primary' : 'info'"
              :hollow="!node.done"
              :timestamp="node.time"
              placement="top"
            >
              <div class="node-title">{{ node.title }}</div>
              <div v-if="node.remark" class="node-remark">{{ node.remark }}</div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-card>
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

.split {
  display: grid;
  grid-template-columns: 1.5fr 0.9fr;
  gap: 18px;
}

.timeline-panel {
  background: #f5f9fc;
  border-radius: 12px;
  padding: 16px 16px 4px;
}

.card-title {
  font-weight: 600;
  margin-bottom: 10px;
}

.current-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  font-size: 13px;
  color: #5f7383;
}

.node-title {
  font-size: 14px;
  font-weight: 600;
}

.node-remark {
  margin-top: 4px;
  font-size: 12px;
  color: #c4561a;
}

@media (max-width: 1100px) {
  .split {
    grid-template-columns: 1fr;
  }
}
</style>
