<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import {
  eventTypeOptions,
  regionStatsByType,
  statsEvents,
  typeDistribution,
  type StatsEventType,
} from '../mock/statistics'

const eventType = ref<StatsEventType>('在建工程')
const regionRef = ref<HTMLDivElement | null>(null)
const typeRef = ref<HTMLDivElement | null>(null)
let regionChart: echarts.ECharts | null = null
let typeChart: echarts.ECharts | null = null

const regionStats = computed(() =>
  [...regionStatsByType[eventType.value]].sort((a, b) => b.count - a.count),
)

const detailList = computed(() =>
  statsEvents.filter((item) => item.type === eventType.value),
)

const totalCount = computed(() =>
  regionStats.value.reduce((sum, item) => sum + item.count, 0),
)

function renderRegionChart() {
  if (!regionRef.value) return
  if (!regionChart) regionChart = echarts.init(regionRef.value)

  const sorted = regionStats.value
  regionChart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 50, right: 20, top: 36, bottom: 30 },
    xAxis: {
      type: 'category',
      data: sorted.map((i) => i.region),
      axisLabel: { interval: 0, fontSize: 12 },
    },
    yAxis: { type: 'value', name: '次数' },
    series: [
      {
        name: eventType.value,
        type: 'bar',
        data: sorted.map((i) => i.count),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#3db2ff' },
            { offset: 1, color: '#1f7a63' },
          ]),
          borderRadius: [6, 6, 0, 0],
        },
        barWidth: 28,
      },
    ],
  })
}

function renderTypeChart() {
  if (!typeRef.value) return
  if (!typeChart) typeChart = echarts.init(typeRef.value)

  typeChart.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [
      {
        type: 'pie',
        radius: ['42%', '68%'],
        data: typeDistribution.map((i) => ({
          name: i.type,
          value: i.count,
          itemStyle:
            i.type === eventType.value
              ? { shadowBlur: 8, shadowColor: 'rgba(31, 122, 99, 0.35)' }
              : undefined,
        })),
        label: { formatter: '{b}\n{c}' },
        emphasis: {
          scale: true,
          scaleSize: 8,
        },
      },
    ],
  })

  typeChart.off('click')
  typeChart.on('click', (params) => {
    const name = String(params.name) as StatsEventType
    if (eventTypeOptions.includes(name)) {
      eventType.value = name
    }
  })
}

function renderCharts() {
  renderRegionChart()
  renderTypeChart()
}

function onResize() {
  regionChart?.resize()
  typeChart?.resize()
}

watch(eventType, async () => {
  await nextTick()
  renderCharts()
})

onMounted(async () => {
  await nextTick()
  renderCharts()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  regionChart?.dispose()
  typeChart?.dispose()
})
</script>

<template>
  <div class="page">
    <el-card shadow="never" class="panel filter">
      <div class="toolbar">
        <span class="label">事件类型</span>
        <el-select v-model="eventType" style="width: 180px">
          <el-option
            v-for="t in eventTypeOptions"
            :key="t"
            :label="t"
            :value="t"
          />
        </el-select>
        <span class="tip">
          统计范围：扬州市（高邮、江都、邗江、广陵、仪征、宝应）；切换类型查看分区结果
        </span>
      </div>
    </el-card>

    <div class="summary">
      <div class="summary-item">
        <div class="summary-label">当前类型</div>
        <div class="summary-value">{{ eventType }}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">全市发生次数</div>
        <div class="summary-value">{{ totalCount }}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">最高发区县</div>
        <div class="summary-value">{{ regionStats[0]?.region || '—' }}</div>
      </div>
    </div>

    <div class="charts">
      <el-card shadow="never" class="panel">
        <div class="card-title">扬州区县「{{ eventType }}」数量排序</div>
        <div ref="regionRef" class="chart" />
      </el-card>
      <el-card shadow="never" class="panel">
        <div class="card-title">事件类型分布（点击可切换）</div>
        <div ref="typeRef" class="chart" />
      </el-card>
    </div>

    <el-card shadow="never" class="panel">
      <div class="card-title">「{{ eventType }}」行政区划明细</div>
      <el-table :data="regionStats" stripe style="margin-bottom: 16px">
        <el-table-column prop="region" label="行政区划" />
        <el-table-column prop="count" label="发生数量" />
        <el-table-column prop="ratio" label="占比(%)" />
      </el-table>

      <div class="card-title">关联事件列表</div>
      <el-table :data="detailList" stripe>
        <el-table-column prop="id" label="事件编号" min-width="160" />
        <el-table-column prop="type" label="事件类型" min-width="110" />
        <el-table-column prop="captureTime" label="抓拍时间" min-width="140" />
        <el-table-column prop="region" label="行政区划" min-width="100" />
        <el-table-column prop="location" label="所在位置" min-width="200" />
        <el-table-column prop="dept" label="责任单位" min-width="110" />
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.panel {
  border: 0;
  border-radius: 14px;
}

.filter {
  margin-bottom: 14px;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.label {
  font-weight: 600;
}

.tip {
  color: #667a8a;
  font-size: 13px;
}

.summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 14px;
}

.summary-item {
  background: #fff;
  border-radius: 14px;
  padding: 16px 18px;
}

.summary-label {
  font-size: 13px;
  color: #667a8a;
}

.summary-value {
  margin-top: 6px;
  font-size: 22px;
  font-weight: 700;
  color: #1f2a33;
}

.charts {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 14px;
  margin-bottom: 14px;
}

.card-title {
  font-weight: 600;
  margin-bottom: 10px;
}

.chart {
  height: 280px;
}

@media (max-width: 1100px) {
  .charts,
  .summary {
    grid-template-columns: 1fr;
  }
}
</style>
