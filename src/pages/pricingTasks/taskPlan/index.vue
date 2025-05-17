<template>
    <div>
        <t-card class="list-card-container" :bordered="false">
            <t-form ref="form" :data="formData" :label-width="80" colon @reset="onReset" @submit="onSearch">
                <t-row :gutter="[16, 24]" :style="{ marginBottom: '10px' }">
                    <t-col :span="3">
                        <t-form-item label="行政区划" name="areaCode">
                            <t-select clearable v-model="formData.areaCode" class="form-item-content"
                                :options="areaOptions" placeholder="请选择行政区划" />
                        </t-form-item>
                    </t-col>
                    <t-col :span="3">
                        <t-form-item label="采价点类型" name="pointType">
                            <t-select clearable v-model="formData.pointType" class="form-item-content"
                                :options="pointTypeOptions" placeholder="请选择采价点类型" />
                        </t-form-item>
                    </t-col>
                    <t-col :span="3">
                        <t-form-item label="采价点归属" name="pointAffiliation">
                            <t-select clearable v-model="formData.pointAffiliation" class="form-item-content"
                                :options="pointAffiliationOptions" placeholder="请选择采价点归属" />
                        </t-form-item>
                    </t-col>
                    <t-col :span="3">
                        <t-form-item label="采价点客户标识" name="customerIdentifier">
                            <t-select clearable v-model="formData.customerIdentifier" class="form-item-content"
                                :options="customerIdentifierOptions" placeholder="请选择客户标识" />
                        </t-form-item>
                    </t-col>
                </t-row>

                <t-row :gutter="[16, 24]">
                    <t-col :span="3">
                        <t-form-item label="采价点" name="pointId">
                            <t-select clearable v-model="formData.pointId" class="form-item-content"
                                :options="pointOptions" placeholder="请选择采价点" />
                        </t-form-item>
                    </t-col>
                    <t-col :span="3">
                        <t-form-item label="品种" name="varietyId">
                            <t-select clearable v-model="formData.varietyId" class="form-item-content"
                                :options="varietyOptions" placeholder="请选择品种" />
                        </t-form-item>
                    </t-col>
                    <t-col :span="3">
                        <t-form-item label="任务状态" name="taskStatus">
                            <t-select clearable v-model="formData.taskStatus" class="form-item-content"
                                :options="taskStatusOptions" placeholder="请选择任务状态" />
                        </t-form-item>
                    </t-col>
                </t-row>

                <t-row :gutter="20" style="margin-top: 16px">
                    <t-col :span="24">
                        <div class="operation-container" style="display: flex; justify-content: flex-end">
                            <t-button theme="primary" type="submit">查询</t-button>
                            <t-button type="reset" variant="base" theme="default"
                                :style="{ marginLeft: '8px' }">重置</t-button>
                            <t-button theme="primary" :style="{ marginLeft: '8px' }"
                                @click="openCreateDialog">新增</t-button>
                        </div>
                    </t-col>
                </t-row>
            </t-form>

            <div class="table-container">
                <t-table :columns="columns" :data="data" :rowKey="rowKey" :verticalAlign="verticalAlign" :hover="hover"
                    :pagination="pagination" :loading="loading" :headerAffixedTop="true" height="calc(100vh - 420px)">
                    <template #customerIdentifier="{ row }">
                        <span v-if="row.customerIdentifier.includes('客户')">
                            <span style="color: #e34d59">{{ row.customerIdentifier }}</span>
                        </span>
                        <span v-else-if="row.customerIdentifier.includes('非客户')">
                            <span style="color: #e34d59">{{ row.customerIdentifier }}</span>
                        </span>
                        <span v-else>{{ row.customerIdentifier }}</span>
                    </template>

                    <template #status="{ row }">
                        <t-tag v-if="row.status === '计划执行中'" theme="primary" variant="light">计划执行中</t-tag>
                        <t-tag v-else-if="row.status === '任务结束'" theme="success" variant="light">任务结束</t-tag>
                        <t-tag v-else-if="row.status === '任务终止'" theme="warning" variant="light">任务终止</t-tag>
                        <t-tag v-else-if="row.status === '待开始'" theme="default" variant="light">待开始</t-tag>
                    </template>

                    <template #op="slotProps">
                        <t-button theme="primary" variant="text" class="t-button-link"
                            style="color: #0052d9; padding: 0px 0px 10px 0px"
                            @click="handleViewDetails(slotProps)">任务详情</t-button>
                        <t-button v-if="slotProps.row.canTerminate" theme="warning" variant="text" class="t-button-link"
                            style="color: #ed7b2f; padding: 0px 0px 10px 0px"
                            @click="handleTerminate(slotProps)">计划终止</t-button>
                        <t-button v-if="slotProps.row.canDelete" theme="danger" variant="text" class="t-button-link"
                            style="color: #e34d59; padding: 0px 0px 10px 0px"
                            @click="handleDelete(slotProps)">删除</t-button>
                    </template>
                </t-table>
            </div>
            <div class="pagination">
                <t-pagination showFirstAndLastPageBtn :total="pagination.total" :default-current="pagination.pageNo"
                    :default-page-size="pagination.pageSize" @current-change="onCurrentChange"
                    @page-size-change="onPageSizeChange" />
            </div>
        </t-card>

        <!-- 新增任务对话框 -->
        <create-task-dialog :visible="createDialogVisible" @close="createDialogVisible = false"
            @confirm="handleCreateTask" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { prefix } from '@/config/global';
import CreateTaskDialog from './components/CreateTaskDialog.vue';

export default Vue.extend({
    name: 'TaskPlan',
    components: {
        CreateTaskDialog,
    },
    data() {
        return {
            prefix,
            loading: false,
            createDialogVisible: false, // 控制创建任务对话框的显示
            data: [
                {
                    id: 'JH202501010001',
                    area: '四川-成都-xx镇',
                    category: '柑橘',
                    pointType: '农户',
                    pointAffiliation: '保司',
                    customerIdentifier: '客户、非客户',
                    pricingMethod: '区域占比',
                    point: '30%',
                    reportPeriod: '2',
                    planPeriod: '2025/3/12-2025/5/15',
                    status: '计划执行中',
                    creator: '王五',
                    canTerminate: true,
                    canDelete: true
                },
                {
                    id: 'JH202501010002',
                    area: '四川-自贡-xx镇',
                    category: '柑橘',
                    pointType: '农户',
                    pointAffiliation: '城调队',
                    customerIdentifier: '客户',
                    pricingMethod: '指定采价点',
                    point: '雨祖果蔬',
                    reportPeriod: '1',
                    planPeriod: '2025/3/15-2025/3/25',
                    status: '任务结束',
                    creator: '王五',
                    canTerminate: false,
                    canDelete: true
                },
                {
                    id: 'JH202501010003',
                    area: '四川-成都-xx区',
                    category: '柑橘',
                    pointType: '批发市场',
                    pointAffiliation: '保司',
                    customerIdentifier: '非客户',
                    pricingMethod: '指定采价点',
                    point: '成都果蔬批发',
                    reportPeriod: '3',
                    planPeriod: '2025/3/15-2025/6/25',
                    status: '任务终止',
                    creator: '王七',
                    canTerminate: false,
                    canDelete: false
                },
                {
                    id: 'JH202501010004',
                    area: '四川-绵阳-xx县',
                    category: '苹果',
                    pointType: '农贸市场',
                    pointAffiliation: '保司',
                    customerIdentifier: '客户',
                    pricingMethod: '区域占比',
                    point: '25%',
                    reportPeriod: '7',
                    planPeriod: '2025/5/01-2025/6/01',
                    status: '待开始',
                    creator: '王七',
                    canTerminate: true,
                    canDelete: true
                }
            ],
            columns: [
                {
                    title: '计划编号',
                    align: 'left',
                    width: 150,
                    ellipsis: true,
                    colKey: 'id',
                    fixed: 'left',
                },
                {
                    title: '行政区划',
                    align: 'left',
                    width: 150,
                    ellipsis: true,
                    colKey: 'area',
                },
                {
                    title: '品种',
                    width: 100,
                    ellipsis: true,
                    colKey: 'category',
                },
                {
                    title: '采价点类型',
                    width: 120,
                    ellipsis: true,
                    colKey: 'pointType',
                },
                {
                    title: '采价点归属',
                    width: 120,
                    ellipsis: true,
                    colKey: 'pointAffiliation',
                },
                {
                    title: '采价点客户标识',
                    width: 150,
                    ellipsis: true,
                    colKey: 'customerIdentifier',
                },
                {
                    title: '采价方式',
                    width: 120,
                    ellipsis: true,
                    colKey: 'pricingMethod',
                },
                {
                    title: '采价点',
                    width: 120,
                    ellipsis: true,
                    colKey: 'point',
                },
                {
                    title: '上报周期(天)',
                    width: 120,
                    ellipsis: true,
                    colKey: 'reportPeriod',
                },
                {
                    title: '计划周期',
                    width: 180,
                    ellipsis: true,
                    colKey: 'planPeriod',
                },
                {
                    title: '任务计划状态',
                    width: 120,
                    ellipsis: true,
                    colKey: 'status',
                },
                {
                    title: '任务创建人',
                    width: 100,
                    ellipsis: true,
                    colKey: 'creator',
                },
                {
                    align: 'left',
                    fixed: 'right',
                    width: 180,
                    colKey: 'op',
                    title: '操作',
                },
            ],
            formData: {
                areaCode: '',
                pointType: '',
                pointAffiliation: '',
                customerIdentifier: '',
                pointId: '',
                varietyId: '',
                taskStatus: '',
            },
            // 模拟下拉选项数据
            areaOptions: [
                { label: '四川省', value: 'SC' },
                { label: '重庆市', value: 'CQ' },
            ],
            pointTypeOptions: [
                { label: '农户', value: 'NH' },
                { label: '批发市场', value: 'PF' },
            ],
            pointAffiliationOptions: [
                { label: '保司', value: 'BS' },
                { label: '城调队', value: 'CTD' },
            ],
            customerIdentifierOptions: [
                { label: '客户', value: 'KH' },
                { label: '非客户', value: 'FKH' },
            ],
            pointOptions: [
                { label: '雨祖果蔬', value: 'P1' },
                { label: '成都果蔬批发', value: 'P2' },
            ],
            varietyOptions: [
                { label: '柑橘', value: 'GJ' },
                { label: '苹果', value: 'PG' },
            ],
            taskStatusOptions: [
                { label: '计划执行中', value: 'EXECUTING' },
                { label: '任务结束', value: 'FINISHED' },
                { label: '任务终止', value: 'TERMINATED' },
                { label: '待开始', value: 'PENDING' },
            ],
            rowKey: 'id',
            verticalAlign: 'top',
            hover: true,
            pagination: {
                pageSize: 10,
                total: 4,
                pageNo: 1,
            },
        };
    },
    methods: {
        onSearch() {
            // 查询逻辑，现在是静态页面不需要实现
            console.log('Search with:', this.formData);
        },
        onReset() {
            // 重置表单
            this.$set(this.$data, 'formData', this.$options.data().formData);
        },
        onCurrentChange(current) {
            this.pagination.pageNo = current;
        },
        onPageSizeChange(size) {
            this.pagination.pageSize = size;
        },
        openCreateDialog() {
            this.createDialogVisible = true;
        },
        handleCreateTask(formData) {
            console.log('创建任务:', formData);
            // 处理创建任务的逻辑
            this.createDialogVisible = false;
            this.$message.success('创建任务成功');
        },
        handleViewDetails({ row }) {
            this.$router.push({
                name: 'taskPlanDetail',
                params: { id: row.id },
                query: { pricingMethod: row.pricingMethod === '区域占比' ? 'ratio' : 'specific' }
            });
        },
        handleTerminate({ row }) {
            console.log('终止计划:', row.id);
            // 实际实现时可能会显示一个确认对话框
        },
        handleDelete({ row }) {
            console.log('删除计划:', row.id);
            // 实际实现时可能会显示一个确认对话框
        },
    },
});
</script>

<style lang="less" scoped>
.list-card-container {
    // padding: 20px;
}

.operation-container {
    display: flex;
    align-items: flex-end;
    margin-bottom: 16px;
}

.table-container {
    margin-bottom: 20px;
}

.pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

.t-button-link {
    margin-right: 8px;
}
</style>