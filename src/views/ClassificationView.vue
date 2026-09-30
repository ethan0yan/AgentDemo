<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { missions, type Mission } from '../mock/data'

const keyword = ref('')
const status = ref('')
const list = ref<Mission[]>([...missions])
const drawer = ref(false)
const current = ref<Mission | null>(null)
const form = reactive({ bizType: '', dept: '' })

const filtered = computed(() =>
  list.value.filter((item) => {
    const hitKw =
      !keyword.value ||
      item.name.includes(keyword.value) ||
      item.id.includes(keyword.value)
    const hitStatus = !status.value || item.status === status.value
    return hitKw && hitStatus
  }),
)

function openDetail(row: Mission) {
  current.value = row
  form.bizType = row.bizType === '待研判' ? '' : row.bizType
  form.dept = row.dept === '待确认' ? '' : row.dept
  drawer.value = true
}

function confirmClassify() {
  if (!current.value) return
  if (!form.bizType || !form.dept) {
    ElMessage.warning('请选择业务类型和责任单位')
    return
  }
  current.value.bizType = form.bizType
  current.value.dept = form.dept
  current.value.status = '已分类'
  current.value.confidence = Math.max(current.value.confidence, 0.85)
  ElMessage.success('分类结果已确认')
  drawer.value = false
}
</script>

<template>
  <div class="page">
    <el-card shadow="never" class="panel">
      <div class="toolbar">
        <el-input
          v-model="keyword"
          clearable
          placeholder="搜索任务编号 / 名称"
          style="width: 240px"
        />
        <el-select v-model="status" clearable placeholder="分类状态" style="width: 140px">
          <el-option label="待分类" value="待分类" />
          <el-option label="已分类" value="已分类" />
          <el-option label="执行中" value="执行中" />
          <el-option label="已完成" value="已完成" />
        </el-select>
      </div>

      <el-table :data="filtered" stripe>
        <el-table-column prop="id" label="任务编号" min-width="150" />
        <el-table-column prop="name" label="任务名称" min-width="180" />
        <el-table-column prop="area" label="任务区域" min-width="180" />
        <el-table-column prop="initiator" label="发起单位" width="120" />
        <el-table-column prop="bizType" label="业务类型" min-width="140" />
        <el-table-column prop="dept" label="责任单位" width="110" />
        <el-table-column label="置信度" width="90">
          <template #default="{ row }">
            {{ Math.round(row.confidence * 100) }}%
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="90" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDetail(row)">研判</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-drawer v-model="drawer" title="任务分类研判" size="420px">
      <template v-if="current">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="任务编号">{{ current.id }}</el-descriptions-item>
          <el-descriptions-item label="任务内容">{{ current.content }}</el-descriptions-item>
          <el-descriptions-item label="任务目的">{{ current.purpose }}</el-descriptions-item>
          <el-descriptions-item label="任务区域">{{ current.area }}</el-descriptions-item>
        </el-descriptions>

        <div class="form-block">
          <div class="label">智能体建议</div>
          <p class="suggest">
            结合任务描述与区域信息，建议归属
            <b>{{ current.bizType }}</b> / <b>{{ current.dept }}</b>
            （置信度 {{ Math.round(current.confidence * 100) }}%）
          </p>
          <el-form label-position="top">
            <el-form-item label="业务类型">
              <el-select v-model="form.bizType" style="width: 100%">
                <el-option label="道路交通秩序巡查" value="道路交通秩序巡查" />
                <el-option label="违法建设巡查" value="违法建设巡查" />
                <el-option label="河道巡查" value="河道巡查" />
                <el-option label="城市管理巡查" value="城市管理巡查" />
              </el-select>
            </el-form-item>
            <el-form-item label="责任单位">
              <el-select v-model="form.dept" style="width: 100%">
                <el-option label="交警部门" value="交警部门" />
                <el-option label="住建部门" value="住建部门" />
                <el-option label="水务部门" value="水务部门" />
                <el-option label="城管部门" value="城管部门" />
              </el-select>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="confirmClassify">确认分类</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<style scoped>
.panel {
  border: 0;
  border-radius: 14px;
}

.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 14px;
}

.form-block {
  margin-top: 20px;
}

.label {
  font-weight: 600;
  margin-bottom: 8px;
}

.suggest {
  margin: 0 0 14px;
  color: #4b6070;
  line-height: 1.6;
  font-size: 13px;
}
</style>
