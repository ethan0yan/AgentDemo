<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { warningEvents, type WarningEvent } from '../mock/warnings'
import EventDetailDialog from '../components/EventDetailDialog.vue'

const list = ref<WarningEvent[]>(warningEvents.map((item) => ({ ...item })))
const filters = reactive({
  id: '',
  type: '',
  timeRange: null as [string, string] | null,
  dept: '',
})

const detailVisible = ref(false)
const current = ref<WarningEvent | null>(null)

const typeOptions = computed(() => [...new Set(list.value.map((i) => i.type))])
const deptOptions = computed(() => [...new Set(list.value.map((i) => i.dept))])

function parseCaptureTime(value: string) {
  // 支持 2026/9/27 8:46 这类格式
  const normalized = value.replace(/\//g, '-').replace(/-/g, '/')
  const date = new Date(normalized)
  return Number.isNaN(date.getTime()) ? null : date.getTime()
}

const filtered = computed(() =>
  list.value.filter((item) => {
    const hitId = !filters.id || item.id.includes(filters.id.trim())
    const hitType = !filters.type || item.type === filters.type
    const hitDept = !filters.dept || item.dept === filters.dept

    let hitTime = true
    if (filters.timeRange?.length === 2) {
      const ts = parseCaptureTime(item.captureTime)
      const start = new Date(filters.timeRange[0]).getTime()
      const end = new Date(filters.timeRange[1]).getTime()
      hitTime = ts !== null && ts >= start && ts <= end
    }

    return hitId && hitType && hitDept && hitTime
  }),
)

function resetFilters() {
  filters.id = ''
  filters.type = ''
  filters.timeRange = null
  filters.dept = ''
}

function openDetail(row: WarningEvent) {
  current.value = row
  detailVisible.value = true
}

function onHandled(id: string, status: WarningEvent['status']) {
  const target = list.value.find((i) => i.id === id)
  if (target) target.status = status
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
          style="width: 200px"
        />
        <el-select
          v-model="filters.type"
          clearable
          placeholder="事件类型"
          style="width: 160px"
        >
          <el-option v-for="t in typeOptions" :key="t" :label="t" :value="t" />
        </el-select>
        <el-date-picker
          v-model="filters.timeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="起始时间"
          end-placeholder="终止时间"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY/M/D HH:mm"
          style="width: 360px"
        />
        <el-select
          v-model="filters.dept"
          clearable
          placeholder="责任单位"
          style="width: 160px"
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
        <el-table-column prop="dept" label="责任单位" min-width="120" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDetail(row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <EventDetailDialog
      v-model="detailVisible"
      :event="current"
      @handled="onHandled"
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
</style>
