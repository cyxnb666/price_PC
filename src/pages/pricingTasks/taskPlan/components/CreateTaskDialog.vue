<template>
    <t-dialog header="创建采价任务" :visible.sync="visible" :destroyOnClose="true" :closeOnOverlayClick="false"
        @close="onClose" width="1200px" top="5%" class="create-task-dialog">
        <div class="dialog-content">
            <div class="form-container">
                <t-form :data="formData" label-width="110px">
                    <t-row :gutter="[16, 24]" :style="{ marginBottom: '10px' }">
                        <t-col :span="3">
                            <t-form-item label="行政区划" name="areaCode">
                                <t-select v-model="formData.areaCode" placeholder="请选择" clearable>
                                    <t-option key="1" label="双流县" value="双流县" />
                                </t-select>
                            </t-form-item>
                        </t-col>
                        <t-col :span="3">
                            <t-form-item label="采价点类型" name="pointType">
                                <t-select v-model="formData.pointType" placeholder="全部" clearable>
                                    <t-option key="1" label="全部" value="全部" />
                                </t-select>
                            </t-form-item>
                        </t-col>
                        <t-col :span="3">
                            <t-form-item label="采价点归属" name="pointAffiliation">
                                <t-select v-model="formData.pointAffiliation" placeholder="全部" clearable>
                                    <t-option key="1" label="全部" value="全部" />
                                </t-select>
                            </t-form-item>
                        </t-col>
                        <t-col :span="3">
                            <t-form-item label="采价点客户标识" name="customerType">
                                <t-select v-model="formData.customerType" placeholder="全部" clearable>
                                    <t-option key="1" label="全部" value="全部" />
                                </t-select>
                            </t-form-item>
                        </t-col>
                    </t-row>

                    <t-row :gutter="[16, 24]" :style="{ marginBottom: '10px' }">
                        <t-col :span="3">
                            <t-form-item label="品种" name="category">
                                <t-select v-model="formData.category" placeholder="全部" clearable>
                                    <t-option key="1" label="全部" value="全部" />
                                </t-select>
                            </t-form-item>
                        </t-col>
                        <t-col :span="3">
                            <t-form-item label="计划周期" name="planPeriod">
                                <t-date-range-picker v-model="formData.planPeriod" value-type="YYYY-MM-DD"
                                    placeholder="起始-止期" />
                            </t-form-item>
                        </t-col>
                        <t-col :span="3">
                            <t-form-item label="上报周期(天)" name="reportPeriod">
                                <t-input v-model="formData.reportPeriod" placeholder="输入正整数" />
                            </t-form-item>
                        </t-col>
                        <t-col :span="3">
                            <t-form-item label="是否发送短信提醒" name="sendSms">
                                <t-select v-model="formData.sendSms">
                                    <t-option key="true" label="是" :value="true" />
                                    <t-option key="false" label="否" :value="false" />
                                </t-select>
                            </t-form-item>
                        </t-col>
                    </t-row>

                    <t-row :gutter="[16, 24]" :style="{ marginBottom: '10px' }">
                        <t-col :span="3">
                            <t-form-item label="采价方式" name="pricingMethod">
                                <t-select v-model="formData.pricingMethod" placeholder="请选择">
                                    <t-option key="ratio" label="区域占比" value="ratio" />
                                    <t-option key="specific" label="指定采价点" value="specific" />
                                </t-select>
                            </t-form-item>
                        </t-col>
                        <t-col :span="3" v-if="formData.pricingMethod === 'ratio'">
                            <t-form-item label="占比(%)" name="ratio">
                                <t-input v-model="formData.ratio" placeholder="请输入占比" />
                            </t-form-item>
                        </t-col>
                        <t-col :span="3" v-if="formData.pricingMethod === 'specific'">
                            <t-form-item label="采价点" name="specificPoint">
                                <t-tree-select v-model="formData.specificPoint" :data="treeData" :treeProps="treeProps"
                                    placeholder="请选择采价点" />
                            </t-form-item>
                        </t-col>
                        <t-col :span="3">
                            <div class="action-buttons">
                                <t-button theme="default" @click="onClose">取消</t-button>
                                <t-button theme="success" @click="onPreview" style="margin-left: 8px">预览任务</t-button>
                            </div>
                        </t-col>
                    </t-row>
                </t-form>
            </div>

            <t-divider />

            <div class="preview-section">
                <div class="preview-title">计划任务下发日历预览</div>
                <div class="preview-container">
                    <!-- 左侧日历选择面板 - 简化为只显示日历并高亮今天 -->
                    <div class="calendar-panel">
                        <t-calendar theme="card" multiple :value="highlightedDates" />
                    </div>

                    <!-- 右侧采价任务部分 -->
                    <div class="task-preview" v-if="showPreview">
                        <div class="task-preview-title">采价任务</div>
                        <div class="task-preview-content">
                            <div class="task-info">
                                <span>计划周期: {{ formatDateRange(formData.planPeriod) }}</span>
                                <span class="task-info-item">上报周期: {{ formData.reportPeriod }}天</span>
                                <span class="task-info-item">次数: 16</span>
                            </div>

                            <t-table :data="previewData" :columns="currentColumns" bordered size="small" row-key="id">
                                <template #district="{ row }">
                                    {{ row.district }}
                                </template>
                                <template #ratio="{ row }">
                                    {{ row.ratio }}%
                                </template>
                                <template #pointName="{ row }">
                                    {{ row.pointName }}
                                </template>
                                <template #pointCount="{ row }">
                                    {{ row.pointCount }}
                                </template>
                                <template #taskCount="{ row }">
                                    {{ row.taskCount }}
                                </template>
                            </t-table>
                        </div>
                    </div>
                    <div class="empty-preview" v-else>
                        <div class="placeholder-text">点击"预览任务"查看采价任务详情</div>
                    </div>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="dialog-footer">
                <t-button theme="primary" @click="onConfirm">确定创建</t-button>
            </div>
        </template>
    </t-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from 'dayjs';

export default Vue.extend({
    name: 'CreateTaskDialog',
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            highlightedDates: [
                dayjs().subtract(1, 'day').format('YYYY-MM-DD'), // 昨天
                dayjs().format('YYYY-MM-DD'),                    // 今天
                dayjs().add(1, 'day').format('YYYY-MM-DD'),     // 明天
            ],
            formData: {
                areaCode: '双流县',
                pointType: '全部',
                pointAffiliation: '全部',
                customerType: '全部',
                category: '全部',
                planPeriod: ['2025-05-01', '2025-07-01'], // 初始值
                reportPeriod: 2,
                pricingMethod: 'ratio', // 默认选择区域占比
                ratio: 30,
                specificPoint: '',
                sendSms: true, // 默认选择"是"
            },
            // 树形控件属性
            treeProps: {
                keys: {
                    label: 'name',
                    value: 'id',
                    children: 'children',
                }
            },
            // 树形数据
            treeData: [
                {
                    id: 'area1',
                    name: '四川省-成都市',
                    children: [
                        {
                            id: 'point1',
                            name: '成都果蔬批发市场'
                        },
                        {
                            id: 'point2',
                            name: '锦江区农贸市场'
                        }
                    ]
                },
                {
                    id: 'area2',
                    name: '四川省-绵阳市',
                    children: [
                        {
                            id: 'point3',
                            name: '绵阳农产品中心批发市场'
                        },
                        {
                            id: 'point4',
                            name: '涪城区农贸市场'
                        }
                    ]
                }
            ],
            showPreview: false, // 控制是否显示预览数据
            currentColumns: [], // 当前显示的列
            ratioColumns: [
                { colKey: 'district', title: '行政区划', width: '200' },
                { colKey: 'ratio', title: '区域占比%', width: '100' },
                { colKey: 'pointCount', title: '采价点总数', width: '100' },
                { colKey: 'taskCount', title: '采价数', width: '100' },
            ],
            specificColumns: [
                { colKey: 'district', title: '行政区划', width: '200' },
                { colKey: 'pointName', title: '采价点', width: '250' },
            ],
            // 预览数据 - 不同类型的数据示例
            ratioPreviewData: [
                { id: 1, district: '四川省-龙泉驿-A镇', ratio: 30, pointCount: 6, taskCount: 2 },
                { id: 2, district: '四川省-龙泉驿-A镇', ratio: 30, pointCount: 10, taskCount: 3 },
                { id: 3, district: '四川省-龙泉驿-A镇', ratio: 30, pointCount: 2, taskCount: 1 },
                { id: 4, district: '四川省-龙泉驿-B镇', ratio: 30, pointCount: 5, taskCount: 2 },
                { id: 5, district: '四川省-龙泉驿-B镇', ratio: 30, pointCount: 3, taskCount: 1 },
            ],
            specificPreviewData: [
                { id: 1, district: '四川省-成都市', pointName: '成都果蔬批发市场' },
                { id: 2, district: '四川省-成都市', pointName: '锦江区农贸市场' },
                { id: 3, district: '四川省-绵阳市', pointName: '绵阳农产品中心批发市场' },
                { id: 4, district: '四川省-绵阳市', pointName: '涪城区农贸市场' },
            ],
            previewData: [], // 实际显示的预览数据
        };
    },
    methods: {
        formatDateRange(dateRange) {
            if (!dateRange || dateRange.length !== 2) return '';
            return `${dateRange[0]} 至 ${dateRange[1]}`;
        },

        onClose() {
            this.$emit('close');
        },

        // 点击预览任务时更新预览数据
        onPreview() {
            console.log('预览任务', this.formData);

            // 根据选择的采价方式设置显示的列和数据
            if (this.formData.pricingMethod === 'ratio') {
                this.currentColumns = this.ratioColumns;
                this.previewData = this.ratioPreviewData;
            } else {
                this.currentColumns = this.specificColumns;
                this.previewData = this.specificPreviewData;
            }

            // 显示预览区域
            this.showPreview = true;
        },

        onConfirm() {
            console.log('确定创建', this.formData);
            this.$emit('confirm', this.formData);
        },
    }
});
</script>

<style lang="less" scoped>
.create-task-dialog {
    :deep(.t-dialog__header) {
        font-weight: bold;
    }

    .dialog-content {
        padding: 0 20px;
    }

    .form-container {
        margin-bottom: 20px;
    }

    .action-buttons {
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;
        height: 100%;
        padding-bottom: 4px;
    }

    .preview-section {
        margin-top: 20px;
        margin-bottom: 20px;

        .preview-title {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 16px;
        }
    }

    .preview-container {
        display: flex;
        gap: 20px;

        .calendar-panel {
            flex: 0 0 33%;

            :deep(.t-calendar) {
                border: 1px solid #e7e7e7;
                border-radius: 4px;
                box-shadow: none;
                width: 100%;
            }
        }

        .task-preview {
            flex: 0 0 65%;
            border: 1px solid #e7e7e7;
            border-radius: 4px;
            padding: 16px;

            .task-preview-title {
                font-weight: bold;
                margin-bottom: 16px;
            }

            .task-info {
                margin-bottom: 16px;

                .task-info-item {
                    margin-left: 20px;
                }
            }
        }

        .empty-preview {
            flex: 0 0 65%;
            border: 1px solid #e7e7e7;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f9f9f9;
            height: 300px;

            .placeholder-text {
                color: #999;
                font-size: 14px;
            }
        }
    }

    .dialog-footer {
        display: flex;
        justify-content: center;
    }
}
</style>