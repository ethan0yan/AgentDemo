<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { dispatchItems, type DispatchItem, type PushStatus } from '../mock/dispatch'

const list = ref<DispatchItem[]>(dispatchItems.map((item) => ({ ...item })))

const filters = reactive({
  id: '',
  type: '',
  captureRange: null as [string, string] | null,
  location: '',
  dept: '',
  status: '' as '' | PushStatus,
  pushRange: null as [string, string] | null,
})

const typeOptions = computed(() => [...new Set(list.value.map((i) => i.type))])
const locationOptions = computed(() => [...new Set(list.value.map((i) => i.location))])
const deptOptions = computed(() => [...new Set(list.value.map((i) => i.dept))])
const statusOptions: PushStatus[] = ['已推送', '待推送', '推送失败']

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
    const hitPush = inRange(item.pushedAt, filters.pushRange)
    return hitId && hitType && hitLocation && hitDept && hitStatus && hitCapture && hitPush
  }),
)

function resetFilters() {
  filters.id = ''
  filters.type = ''
  filters.captureRange = null
  filters.location = ''
  filters.dept = ''
  filters.status = ''
  filters.pushRange = null
}

function formatNow() {
  const d = new Date()
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
}

function retry(row: DispatchItem) {
  row.status = '已推送'
  row.pushedAt = formatNow()
  ElMessage.success('重新推送成功')
}

function statusType(status: PushStatus) {
  if (status === '已推送') return 'success'
  if (status === '推送失败') return 'danger'
  return 'warning'
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
          <el-option v-for="s in statusOptions" :key="s" :label="s" :value="s" />
        </el-select>
        <el-date-picker
          v-model="filters.pushRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="推送起始时间"
          end-placeholder="推送终止时间"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY/M/D HH:mm"
          style="width: 360px"
        />
        <el-button @click="resetFilters">重置</el-button>
      </div>

      <el-table :data="filtered" stripe>
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
        <el-table-column prop="pushedAt" label="推送时间" min-width="140" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.status === '推送失败'"
              link
              type="warning"
              @click="retry(row)"
            >
              重推
            </el-button>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
      </el-table>
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

.muted {
  color: #98a6b3;
}
</style>
