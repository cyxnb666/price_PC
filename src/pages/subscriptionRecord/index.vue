<template>
  <div>
    <t-card class="list-card-container" :bordered="false">
      <t-form ref="form" :data="formData" :label-width="80" colon @reset="onReset" @submit="onSearch">
        <t-row :gutter="[16, 24]" :style="{ marginBottom: '10px' }">
          <t-col :span="3">
            <t-form-item label="行政区划" name="areaCode">
              <t-tree-select clearable v-model="formData.areaCode" :treeProps="treeProps" :data="areaList"
                placeholder="请选择行政区划" />
            </t-form-item>
          </t-col>
          <t-col :span="3">
            <t-form-item label="品类" name="categoryType">
              <t-select clearable v-model="formData.categoryType" class="form-item-content" :options="categoryTypeOptions"
                placeholder="请选择品类" />
            </t-form-item>
          </t-col>
          <t-col :span="3">
            <t-form-item label="品种" name="varietyId">
              <t-select clearable v-model="formData.varietyId" class="form-item-content" :options="varietyOptions"
                placeholder="请选择品种" />
            </t-form-item>
          </t-col>
          <t-col :span="3">
            <t-form-item label="订购来源" name="subscriptionSource">
              <t-select clearable v-model="formData.subscriptionSource" class="form-item-content" :options="subscriptionSourceOptions"
                placeholder="请选择订购来源" />
            </t-form-item>
          </t-col>
        </t-row>

        <t-row :gutter="[16, 24]">
          <t-col :span="3">
            <t-form-item label="来源名称" name="sourceName">
              <t-select clearable v-model="formData.sourceName" class="form-item-content" :options="sourceNameOptions"
                placeholder="请选择来源名称" />
            </t-form-item>
          </t-col>
          <t-col :span="3">
            <t-form-item label="订购月份" name="subscriptionMonth">
              <t-date-picker v-model="formData.subscriptionMonth" mode="month" format="YYYY-MM" clearable placeholder="请选择订购月份" />
            </t-form-item>
          </t-col>
        </t-row>

        <!-- 按钮区域 -->
        <t-row :gutter="20" style="margin-top: 16px">
          <t-col :span="24">
            <div class="operation-container" style="display: flex; justify-content: flex-end">
              <t-button theme="primary" type="submit">查询</t-button>
              <t-button type="reset" variant="base" theme="default" :style="{ marginLeft: '8px' }">重置</t-button>
              <t-button theme="default" @click="handleExport" :style="{ marginLeft: '8px' }"
                :loading="exportLoading">导出</t-button>
            </div>
          </t-col>
        </t-row>
      </t-form>

      <div class="table-container">
        <t-table :columns="columns" :data="data" :rowKey="rowKey" :verticalAlign="verticalAlign" :hover="hover"
          :pagination="pagination" :loading="dataLoading" :headerAffixedTop="true" height="calc(100vh - 420px)">
          <template #op="slotProps">
            <a class="t-button-link" style="color: #0052d9" @click="handleViewDetails(slotProps)">详情</a>
          </template>
        </t-table>
      </div>

      <div class="pagination">
        <t-pagination showFirstAndLastPageBtn :total="pagination.total" :default-current="pagination.pageNo"
          :default-page-size="pagination.pageSize" @current-change="onCurrentChange"
          @page-size-change="onPageSizeChange" />
      </div>
    </t-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { prefix } from '@/config/global';

export default Vue.extend({
  name: 'SubscriptionRecord',
  data() {
    return {
      prefix,
      dataLoading: false,
      exportLoading: false,
      loading: false,
      data: [
        {
          id: '1',
          reportSequence: 'SUB2024001',
          priceAffiliation: '华南区域',
          subscriptionSource: '线上订购',
          sourceName: '京东商城',
          categoryType: '水果',
          varietyName: '苹果',
          subscriptionMonth: '2024-01',
          reportTime: '2024-01-15 09:30:00',
          reporter: '张三'
        },
        {
          id: '2',
          reportSequence: 'SUB2024002',
          priceAffiliation: '华东区域',
          subscriptionSource: '线下订购',
          sourceName: '批发市场',
          categoryType: '蔬菜',
          varietyName: '白菜',
          subscriptionMonth: '2024-01',
          reportTime: '2024-01-14 14:20:00',
          reporter: '李四'
        },
        {
          id: '3',
          reportSequence: 'SUB2024003',
          priceAffiliation: '华北区域',
          subscriptionSource: '线上订购',
          sourceName: '天猫超市',
          categoryType: '水果',
          varietyName: '橙子',
          subscriptionMonth: '2024-02',
          reportTime: '2024-01-16 11:10:00',
          reporter: '王五'
        },
        {
          id: '4',
          reportSequence: 'SUB2024004',
          priceAffiliation: '华南区域',
          subscriptionSource: '电话订购',
          sourceName: '供应商直销',
          categoryType: '蔬菜',
          varietyName: '萝卜',
          subscriptionMonth: '2024-02',
          reportTime: '2024-01-13 16:30:00',
          reporter: '赵六'
        },
        {
          id: '5',
          reportSequence: 'SUB2024005',
          priceAffiliation: '华中区域',
          subscriptionSource: '线上订购',
          sourceName: '拼多多',
          categoryType: '水果',
          varietyName: '香蕉',
          subscriptionMonth: '2024-03',
          reportTime: '2024-01-17 08:45:00',
          reporter: '孙七'
        }
      ],
      columns: [
        {
          title: '上报序号',
          align: 'left',
          width: 150,
          ellipsis: true,
          colKey: 'reportSequence',
          fixed: 'left',
        },
        {
          title: '上报价格归属',
          align: 'left',
          width: 120,
          ellipsis: true,
          colKey: 'priceAffiliation',
        },
        {
          title: '订购来源',
          width: 100,
          ellipsis: true,
          colKey: 'subscriptionSource',
        },
        {
          title: '来源名称',
          width: 120,
          ellipsis: true,
          colKey: 'sourceName',
        },
        {
          title: '品类',
          width: 80,
          ellipsis: true,
          colKey: 'categoryType',
        },
        {
          title: '品种',
          width: 80,
          ellipsis: true,
          colKey: 'varietyName',
        },
        {
          title: '订购月份',
          width: 100,
          ellipsis: true,
          colKey: 'subscriptionMonth',
        },
        {
          title: '上报时间',
          width: 160,
          ellipsis: true,
          colKey: 'reportTime',
        },
        {
          title: '上报人',
          width: 100,
          ellipsis: true,
          colKey: 'reporter',
        },
        {
          align: 'left',
          fixed: 'right',
          width: 120,
          colKey: 'op',
          title: '操作',
        },
      ],
      formData: {
        areaCode: '',
        categoryType: '',
        varietyId: '',
        subscriptionSource: '',
        sourceName: '',
        subscriptionMonth: '',
      },
      rowKey: 'id',
      verticalAlign: 'top',
      hover: true,
      areaList: [],
      categoryTypeOptions: [
        { label: '全部', value: '' },
        { label: '水果', value: 'fruit' },
        { label: '蔬菜', value: 'vegetable' },
      ],
      varietyOptions: [
        { label: '全部', value: '' },
        { label: '苹果', value: 'apple' },
        { label: '橙子', value: 'orange' },
        { label: '香蕉', value: 'banana' },
        { label: '白菜', value: 'cabbage' },
        { label: '萝卜', value: 'radish' },
      ],
      subscriptionSourceOptions: [
        { label: '全部', value: '' },
        { label: '线上订购', value: 'online' },
        { label: '线下订购', value: 'offline' },
        { label: '电话订购', value: 'phone' },
      ],
      sourceNameOptions: [
        { label: '全部', value: '' },
        { label: '京东商城', value: 'jd' },
        { label: '天猫超市', value: 'tmall' },
        { label: '拼多多', value: 'pdd' },
        { label: '批发市场', value: 'wholesale' },
        { label: '供应商直销', value: 'supplier' },
      ],
      pagination: {
        pageSize: 10,
        total: 5,
        pageNo: 1,
      },
      treeProps: {
        keys: {
          label: 'areaname',
          value: 'areacode',
          children: 'children',
        },
      },
    };
  },
  watch: {
    // 监听品类变化，动态更新品种选项
    'formData.categoryType': function (newVal) {
      this.updateVarietyOptions(newVal);
    },
    // 监听订购来源变化，动态更新来源名称选项
    'formData.subscriptionSource': function (newVal) {
      this.updateSourceNameOptions(newVal);
    },
  },
  mounted() {
    const hasState = this.loadStateFromStorage();
    if (hasState) {
      this.getList();
    } else {
      this.getList();
      this.saveStateToStorage();
    }
    this.getAreaList();
  },
  methods: {
    // 获取行政区划数据
    getAreaList() {
      this.$request
        .post('/web/area/selectUserDataAreaTree')
        .then((res) => {
          if (res.retCode === 200) {
            this.areaList = res.retData || [];
          }
        })
        .catch((e: Error) => {
          console.log(e);
        });
    },
    // 根据品类更新品种选项
    updateVarietyOptions(categoryType) {
      if (categoryType === 'fruit') {
        this.varietyOptions = [
          { label: '全部', value: '' },
          { label: '苹果', value: 'apple' },
          { label: '橙子', value: 'orange' },
          { label: '香蕉', value: 'banana' },
        ];
      } else if (categoryType === 'vegetable') {
        this.varietyOptions = [
          { label: '全部', value: '' },
          { label: '白菜', value: 'cabbage' },
          { label: '萝卜', value: 'radish' },
        ];
      } else {
        this.varietyOptions = [
          { label: '全部', value: '' },
          { label: '苹果', value: 'apple' },
          { label: '橙子', value: 'orange' },
          { label: '香蕉', value: 'banana' },
          { label: '白菜', value: 'cabbage' },
          { label: '萝卜', value: 'radish' },
        ];
      }
      // 如果当前选择的品种不在新的选项中，清空选择
      if (this.formData.varietyId && !this.varietyOptions.some(option => option.value === this.formData.varietyId)) {
        this.formData.varietyId = '';
      }
    },
    // 根据订购来源更新来源名称选项
    updateSourceNameOptions(subscriptionSource) {
      if (subscriptionSource === 'online') {
        this.sourceNameOptions = [
          { label: '全部', value: '' },
          { label: '京东商城', value: 'jd' },
          { label: '天猫超市', value: 'tmall' },
          { label: '拼多多', value: 'pdd' },
        ];
      } else if (subscriptionSource === 'offline') {
        this.sourceNameOptions = [
          { label: '全部', value: '' },
          { label: '批发市场', value: 'wholesale' },
          { label: '供应商直销', value: 'supplier' },
        ];
      } else if (subscriptionSource === 'phone') {
        this.sourceNameOptions = [
          { label: '全部', value: '' },
          { label: '供应商直销', value: 'supplier' },
        ];
      } else {
        this.sourceNameOptions = [
          { label: '全部', value: '' },
          { label: '京东商城', value: 'jd' },
          { label: '天猫超市', value: 'tmall' },
          { label: '拼多多', value: 'pdd' },
          { label: '批发市场', value: 'wholesale' },
          { label: '供应商直销', value: 'supplier' },
        ];
      }
      // 如果当前选择的来源名称不在新的选项中，清空选择
      if (this.formData.sourceName && !this.sourceNameOptions.some(option => option.value === this.formData.sourceName)) {
        this.formData.sourceName = '';
      }
    },
    // 保存状态到本地存储
    saveStateToStorage() {
      const stateToSave = {
        formData: this.formData,
        pagination: {
          pageSize: this.pagination.pageSize,
          pageNo: this.pagination.pageNo
        }
      };
      sessionStorage.setItem('subscriptionRecordState', JSON.stringify(stateToSave));
    },
    // 从本地存储加载状态
    loadStateFromStorage() {
      const savedState = sessionStorage.getItem('subscriptionRecordState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        this.formData = { ...parsedState.formData };
        this.pagination.pageNo = parsedState.pagination.pageNo;
        this.pagination.pageSize = parsedState.pagination.pageSize;
        return true;
      }
      return false;
    },
    onSearch() {
      this.getList(true);
      this.saveStateToStorage();
    },
    onReset() {
      this.$set(this.$data, 'formData', this.$options.data().formData);
      this.getList(true);
      this.saveStateToStorage();
      // 重置时恢复所有选项
      this.updateVarietyOptions('');
      this.updateSourceNameOptions('');
    },
    getList(isSearch = false) {
      if (isSearch) {
        this.pagination.pageNo = 1;
      }

      this.dataLoading = true;

      // 模拟API请求，根据搜索条件过滤数据
      setTimeout(() => {
        // 这里可以根据formData中的条件过滤数据
        let filteredData = [...this.data];
        
        // 简单的搜索过滤逻辑示例
        if (this.formData.categoryType) {
          const mapping = { 'fruit': '水果', 'vegetable': '蔬菜' };
          filteredData = filteredData.filter(item => item.categoryType === mapping[this.formData.categoryType]);
        }
        
        if (this.formData.subscriptionSource) {
          const mapping = { 'online': '线上订购', 'offline': '线下订购', 'phone': '电话订购' };
          filteredData = filteredData.filter(item => item.subscriptionSource === mapping[this.formData.subscriptionSource]);
        }

        this.data = filteredData;
        this.pagination.total = filteredData.length;
        this.dataLoading = false;
        this.saveStateToStorage();
      }, 800);
    },
    onPageSizeChange(size) {
      this.pagination.pageSize = size;
      this.getList();
      this.saveStateToStorage();
    },
    onCurrentChange(current) {
      this.pagination.pageNo = current;
      this.getList();
      this.saveStateToStorage();
    },
    handleViewDetails({ row }) {
      this.$router.push({
        name: 'subscriptionRecordDetail',
        params: {
          id: String(row.id),
        },
      });
    },
    handleExport() {
      this.exportLoading = true;

      // 模拟导出功能
      setTimeout(() => {
        this.$message.success('导出成功');
        this.exportLoading = false;
        
        // 实际项目中的导出逻辑：
        // const params = {
        //   condition: {
        //     areaCode: this.formData.areaCode,
        //     categoryType: this.formData.categoryType,
        //     varietyId: this.formData.varietyId,
        //     subscriptionSource: this.formData.subscriptionSource,
        //     sourceName: this.formData.sourceName,
        //     subscriptionMonth: this.formData.subscriptionMonth,
        //   },
        // };
        
        // this.$request
        //   .post('/web/subscriptionRecord/export', params, {
        //     responseType: 'arraybuffer',
        //     headers: {
        //       'Content-Type': 'application/json;charset=UTF-8',
        //       Accept: 'application/vnd.ms-excel',
        //     },
        //   })
        //   .then((response) => {
        //     // 处理导出文件
        //   })
        //   .catch((error) => {
        //     console.error('导出失败:', error);
        //     this.$message.error('导出失败，请稍后重试');
        //   })
        //   .finally(() => {
        //     this.exportLoading = false;
        //   });
      }, 1500);
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
}

.t-button-link {
  margin-right: 8px;
}
</style>