<template>
  <div>
    <t-card :bordered="false" class="list-card-container">
      <t-loading :loading="loading" text="加载中...">
        <div class="detail-container">
          <div class="section">
            <div class="section-header">
              <div class="section-title">
                <span class="section-title-marker"></span>
                <span>基础信息</span>
              </div>
              <t-button theme="default" variant="text" @click="toggleCollapse">
                {{ isCollapsed ? '展开' : '收起' }}
                <t-icon :name="isCollapsed ? 'chevron-down' : 'chevron-up'" />
              </t-button>
            </div>

            <div class="section-content" :class="{ 'collapsed': isCollapsed }">
              <t-row :gutter="[16, 16]">
                <t-col :span="4">
                  <div class="field-item">
                    <label>计划编号</label>
                    <t-input v-model="basicInfo.planId" disabled placeholder="" />
                  </div>
                </t-col>
                <t-col :span="4">
                  <div class="field-item">
                    <label>行政区划</label>
                    <div style="display: flex; gap: 8px;">
                      <t-input v-model="basicInfo.adminRegion" disabled placeholder="" style="flex: 1;" />
                      <t-button theme="default" variant="outline" size="medium" @click="handleViewRegion">查看</t-button>
                    </div>
                  </div>
                </t-col>
                <t-col :span="4">
                  <div class="field-item">
                    <label>采价点类型</label>
                    <t-input v-model="basicInfo.pointType" disabled placeholder="" />
                  </div>
                </t-col>
              </t-row>

              <t-row :gutter="[16, 16]">
                <t-col :span="4">
                  <div class="field-item">
                    <label>采价点归属</label>
                    <t-input v-model="basicInfo.pointAffiliation" disabled placeholder="" />
                  </div>
                </t-col>
                <t-col :span="4">
                  <div class="field-item">
                    <label>采价点客户标识</label>
                    <t-input v-model="basicInfo.customerIdentifier" disabled placeholder="" />
                  </div>
                </t-col>
                <t-col :span="4">
                  <div class="field-item">
                    <label>品种大类</label>
                    <t-input v-model="basicInfo.category" disabled placeholder="" />
                  </div>
                </t-col>
              </t-row>

              <t-row :gutter="[16, 16]" v-if="!isCollapsed">
                <t-col :span="4">
                  <div class="field-item">
                    <label>计划周期</label>
                    <t-input v-model="basicInfo.planPeriod" disabled placeholder="" />
                  </div>
                </t-col>
                <t-col :span="4">
                  <div class="field-item">
                    <label>上报周期(天)</label>
                    <t-input v-model="basicInfo.reportPeriod" disabled placeholder="" />
                  </div>
                </t-col>
                <t-col :span="4">
                  <div class="field-item">
                    <label>是否发送短信提醒</label>
                    <t-select v-model="basicInfo.sendSmsReminder" :options="smsReminderOptions" disabled />
                  </div>
                </t-col>
              </t-row>

              <t-row :gutter="[16, 16]" v-if="!isCollapsed">
                <t-col :span="4">
                  <div class="field-item">
                    <label>采价方式</label>
                    <t-input v-model="pricingMethodDisplay" disabled placeholder="" />
                  </div>
                </t-col>
                <t-col :span="4" v-if="pricingMethod === 'ratio'">
                  <div class="field-item">
                    <label>占比 (%)</label>
                    <t-input v-model="basicInfo.ratio" disabled placeholder="" />
                  </div>
                </t-col>
                <t-col :span="4" v-if="pricingMethod === 'specific'">
                  <div class="field-item">
                    <label>采价点</label>
                    <t-input v-model="basicInfo.specificPoint" disabled placeholder="" />
                  </div>
                </t-col>
                <t-col :span="4">
                  <div class="field-item">
                    <label>创建人</label>
                    <t-input v-model="basicInfo.creator" disabled placeholder="" />
                  </div>
                </t-col>
              </t-row>

              <t-row :gutter="[16, 16]" v-if="!isCollapsed">
                <t-col :span="4">
                  <div class="field-item">
                    <label>任务创建时间</label>
                    <t-input v-model="basicInfo.createTime" disabled placeholder="" />
                  </div>
                </t-col>
                <t-col :span="4">
                  <div class="field-item">
                    <label>任务结束/终止时间</label>
                    <t-input v-model="basicInfo.endTime" disabled placeholder="" />
                  </div>
                </t-col>
                <t-col :span="4">
                  <div class="plan-terminate-btn">
                    <t-button theme="warning" :disabled="!basicInfo.canTerminate"
                      @click="handleTerminate">计划终止</t-button>
                  </div>
                </t-col>
              </t-row>
            </div>
          </div>

          <div class="section">
            <div class="section-title">
              <span class="section-title-marker"></span>
              <span>任务列表</span>
            </div>

            <div class="filter-row">
              <div class="filter-item">
                <label>行政区划</label>
                <t-select v-model="filterParams.areaCode" :options="areaOptions" placeholder="请选择" clearable />
              </div>

              <div class="filter-item" v-if="pricingMethod === 'specific'">
                <label>采价点</label>
                <t-select v-model="filterParams.pointId" :options="pointOptions" placeholder="请选择" clearable />
              </div>

              <div class="filter-item">
                <label>任务状态</label>
                <t-select v-model="filterParams.taskStatus" :options="taskStatusOptions" placeholder="请选择" clearable />
              </div>

              <div class="filter-actions">
                <t-button theme="primary" @click="handleSearch">查询</t-button>
                <t-button theme="default" @click="handleReset" style="margin-left: 8px">重置</t-button>
              </div>
            </div>

            <div class="table-container">
              <t-table :columns="tableColumns" :data="tableData" :rowKey="rowKey" :verticalAlign="verticalAlign"
                :hover="hover" :pagination="pagination" :loading="tableLoading" :headerAffixedTop="true"
                height="calc(100vh - 580px)">

                <template #customerIdentifier="{ row }">
                  <span v-if="row.customerIdentifier.includes('客户')" style="color: #e34d59">
                    {{ row.customerIdentifier }}
                  </span>
                  <span v-else>{{ row.customerIdentifier }}</span>
                </template>

                <template #status="{ row }">
                  <t-tag v-if="row.status === '待采价'" theme="primary" variant="light">待采价</t-tag>
                  <t-tag v-else-if="row.status === '采价中'" theme="warning" variant="light">采价中</t-tag>
                  <t-tag v-else-if="row.status === '已完成'" theme="success" variant="light">已完成</t-tag>
                  <t-tag v-else-if="row.status === '已终止'" theme="danger" variant="light">已终止</t-tag>
                </template>

                <template #op="slotProps">
                  <t-button theme="primary" variant="text" class="t-button-link"
                    style="color: #0052d9; padding: 0px 0px 10px 0px"
                    @click="handleViewTaskDetail(slotProps.row)">详情</t-button>
                </template>
              </t-table>
            </div>

            <div class="pagination">
              <t-pagination showFirstAndLastPageBtn :total="pagination.total" :default-current="pagination.pageNo"
                :default-page-size="pagination.pageSize" @current-change="onCurrentChange"
                @page-size-change="onPageSizeChange" />
            </div>
          </div>

          <div class="actions-container">
            <t-button theme="default" @click="goBack">返回</t-button>
          </div>
        </div>
      </t-loading>
    </t-card>

    <!-- 确认终止计划的对话框 -->
    <t-dialog header="终止计划" :visible.sync="terminateDialogVisible" :closeOnOverlayClick="false">
      <template>
        <p>确定要终止该计划吗？终止后无法恢复。</p>
      </template>
      <template #footer>
        <t-button theme="default" @click="terminateDialogVisible = false">取消</t-button>
        <t-button theme="danger" @click="confirmTerminate">确定终止</t-button>
      </template>
    </t-dialog>

    <!-- 行政区划查看弹窗 -->
    <t-dialog header="查看行政区划" :visible.sync="regionDialogVisible" :closeOnOverlayClick="false" width="600px">
      <div class="region-tree-container">
        <t-tree :data="areaList" :keys="treeProps.keys" :value="selectedAreaCodes" :checkable="true" :activable="false"
          :expandOnClickNode="true" :hover="true" disabled
          style="height: 400px; overflow-y: auto; border: 1px solid #dcdcdc; border-radius: 4px; padding: 8px;" />
      </div>
      <template #footer>
        <t-button theme="default" @click="regionDialogVisible = false">关闭</t-button>
      </template>
    </t-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ChevronUpIcon, ChevronDownIcon } from 'tdesign-icons-vue';

export default Vue.extend({
  name: 'TaskPlanDetail',
  components: {
    ChevronUpIcon,
    ChevronDownIcon
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      regionDialogVisible: false, // 控制行政区划查看弹窗
      areaList: [], // 行政区划树形数据
      selectedAreaCodes: [], // 选中的行政区划代码，后续用于回显
      loading: false,
      tableLoading: false,
      isCollapsed: false,
      pricingMethod: 'ratio', // 'ratio'表示区域占比, 'specific'表示指定采价点
      terminateDialogVisible: false,

      basicInfo: {
        planId: 'JH202501010001',
        adminRegion: '四川-成都-xx镇',
        pointType: '农户',
        pointAffiliation: '保司',
        customerIdentifier: '客户、非客户',
        category: '柑橘',
        planPeriod: '2025/3/12-2025/5/15',
        reportPeriod: '2',
        sendSmsReminder: true,
        ratio: '30',
        specificPoint: '点击查看已选采价点',
        creator: '王五',
        createTime: '2025-03-10 10:30:22',
        endTime: '',
        canTerminate: true
      },

      smsReminderOptions: [
        { label: '是', value: true },
        { label: '否', value: false }
      ],

      filterParams: {
        areaCode: '',
        pointId: '',
        taskStatus: ''
      },

      areaOptions: [
        { label: '四川-成都-xx镇', value: 'SC-CD-XX' },
        { label: '四川-自贡-xx镇', value: 'SC-ZG-XX' }
      ],

      pointOptions: [
        { label: '雨祖果蔬', value: 'P1' },
        { label: '成都果蔬批发', value: 'P2' }
      ],

      taskStatusOptions: [
        { label: '全部', value: '' },
        { label: '待采价', value: '待采价' },
        { label: '采价中', value: '采价中' },
        { label: '已完成', value: '已完成' },
        { label: '已终止', value: '已终止' }
      ],

      // 表格配置
      rowKey: 'id',
      verticalAlign: 'top',
      hover: true,

      ratioColumns: [
        { title: '任务编号', align: 'left', width: 150, ellipsis: true, colKey: 'id' },
        { title: '行政区划', align: 'left', width: 150, ellipsis: true, colKey: 'adminRegion' },
        { title: '采价时间', width: 180, ellipsis: true, colKey: 'collectTime' },
        { title: '采价员', width: 100, ellipsis: true, colKey: 'collector' },
        { title: '任务状态', width: 100, ellipsis: true, colKey: 'status' },
        { title: '操作', align: 'left', fixed: 'right', width: 100, colKey: 'op' }
      ],

      specificColumns: [
        { title: '任务编号', align: 'left', width: 150, ellipsis: true, colKey: 'id' },
        { title: '行政区划', align: 'left', width: 150, ellipsis: true, colKey: 'adminRegion' },
        { title: '采价点', width: 180, ellipsis: true, colKey: 'pointName' },
        { title: '采价时间', width: 180, ellipsis: true, colKey: 'collectTime' },
        { title: '采价员', width: 100, ellipsis: true, colKey: 'collector' },
        { title: '任务状态', width: 100, ellipsis: true, colKey: 'status' },
        { title: '操作', align: 'left', fixed: 'right', width: 100, colKey: 'op' }
      ],

      // 区域占比的表格数据
      ratioData: [
        { id: 'JH202501010001-0001', adminRegion: '四川-成都-xx镇', collectTime: '2025/3/12-2025/3/13', collector: '张三', status: '待采价' },
        { id: 'JH202501010001-0002', adminRegion: '四川-自贡-xx镇', collectTime: '2025/3/14-2025/3/15', collector: '', status: '待认领' },
        { id: 'JH202501010001-0003', adminRegion: '四川-成都-xx区', collectTime: '2025/3/16-2025/3/17', collector: '张三', status: '已完成' },
        { id: 'JH202501010001-0004', adminRegion: '四川-绵阳-xx县', collectTime: '2025/3/18-2025/3/19', collector: '张三', status: '采价中' }
      ],

      // 指定采价点的表格数据
      specificData: [
        { id: 'JH202501010001-0001', adminRegion: '四川-成都-xx镇', pointName: '采价点xxx, aaaaa....', collectTime: '2025/3/12-2025/3/13', collector: '张三', status: '待采价' },
        { id: 'JH202501010001-0002', adminRegion: '四川-自贡-xx镇', pointName: '采价点ccccc, 22222....', collectTime: '2025/3/14-2025/3/15', collector: '', status: '待认领' },
        { id: 'JH202501010001-0003', adminRegion: '四川-成都-xx区', pointName: '', collectTime: '2025/3/16-2025/3/17', collector: '张三', status: '已完成' },
        { id: 'JH202501010001-0004', adminRegion: '四川-绵阳-xx县', pointName: '', collectTime: '2025/3/18-2025/3/19', collector: '张三', status: '采价中' }
      ],

      pagination: {
        pageSize: 10,
        total: 4,
        pageNo: 1,
      },
      treeProps: {
        keys: {
          label: 'areaname',
          value: 'areacode',
          children: 'children',
        }
      },
    };
  },
  computed: {
    pricingMethodDisplay() {
      return this.pricingMethod === 'ratio' ? '区域占比' : '指定采价点';
    },
    tableColumns() {
      return this.pricingMethod === 'ratio' ? this.ratioColumns : this.specificColumns;
    },
    tableData() {
      return this.pricingMethod === 'ratio' ? this.ratioData : this.specificData;
    }
  },
  mounted() {
    this.fetchData();
    this.getAreaList();
  },
  methods: {
    fetchData() {
      this.loading = true;

      const params = {
        condition: {
          primaryKey: this.id
        }
      };

      console.log('调用API参数:', params);

      this.$request
        .post('/web/taskScheduling/taskScheduleDetails', params)
        .then((res) => {
          console.log('API返回数据:', res);
          if (res.retCode === 200) {
            console.log('获取任务详情成功:', res.retData);
            // 先打印数据，后续根据数据结构进行页面更新

            // 根据获取的数据设置pricingMethod
            this.pricingMethod = this.$route.query.pricingMethod as string || 'ratio';
          } else {
            console.error('获取任务详情失败:', res.retMsg);
            this.$message.error(res.retMsg || '获取任务详情失败');
          }
        })
        .catch((error) => {
          console.error('API调用出错:', error);
          this.$message.error('获取任务详情失败');
        })
        .finally(() => {
          this.loading = false;
        });
    },

    handleViewRegion() {
      this.regionDialogVisible = true;
    },

    getAreaList() {
      this.$request
        .post('/web/area/selectUserDataAreaTree')
        .then((res) => {
          if (res.retCode === 200) {
            this.areaList = res.retData || [];
          } else {
            this.$message.error(res.retMsg || '获取行政区划数据失败');
          }
        })
        .catch((e) => {
          console.error(e);
          this.$message.error('获取行政区划数据失败');
        });
    },

    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },

    handleSearch() {
      this.tableLoading = true;

      // 模拟搜索
      setTimeout(() => {
        this.tableLoading = false;
        // 实际中需要根据筛选条件调用API获取数据
      }, 300);
    },

    handleReset() {
      this.filterParams = {
        areaCode: '',
        pointId: '',
        taskStatus: ''
      };
      this.handleSearch();
    },

    onCurrentChange(current) {
      this.pagination.pageNo = current;
      this.handleSearch();
    },

    onPageSizeChange(size) {
      this.pagination.pageSize = size;
      this.handleSearch();
    },

    handleViewTaskDetail(row) {
      console.log('查看任务详情', row);
      // 实际中可以跳转到任务详情页面
    },

    handleTerminate() {
      this.terminateDialogVisible = true;
    },

    confirmTerminate() {
      // 实际中调用API终止计划
      console.log('确认终止计划', this.id);
      this.terminateDialogVisible = false;
      this.$message.success('计划已成功终止');

      // 更新基础信息
      this.basicInfo.canTerminate = false;
      this.basicInfo.endTime = '2025-03-17 15:30:22';
    },

    goBack() {
      this.$router.back();
    }
  }
});
</script>

<style lang="less" scoped>
.detail-container {
  padding-bottom: 20px;
}

.section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;

  .section-title-marker {
    width: 4px;
    height: 16px;
    background-color: var(--td-brand-color);
    margin-right: 8px;
  }
}

.section-content {
  transition: max-height 0.3s ease;
  overflow: hidden;
  max-height: 1000px;

  &.collapsed {
    max-height: 160px; // 约两行的高度
  }
}

.field-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;

  label {
    font-size: 14px;
    color: var(--td-text-color-secondary);
    margin-bottom: 8px;
  }
}

.plan-terminate-btn {
  margin-top: 28px; // 对齐输入框
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 16px;
  gap: 16px;

  .filter-item {
    display: flex;
    flex-direction: column;
    width: 200px;

    label {
      font-size: 14px;
      color: var(--td-text-color-secondary);
      margin-bottom: 8px;
    }
  }

  .filter-actions {
    display: flex;
    align-items: flex-end;
    margin-left: auto;
  }
}

.table-container {
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.actions-container {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.t-button-link {
  margin-right: 8px;
}

.region-tree-container {
  padding: 10px 0;

  :deep(.t-tree) {
    max-height: 400px;
    overflow-y: auto;

    // 美化滚动条
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: #c0c0c0;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #a0a0a0;
    }
  }
}
</style>