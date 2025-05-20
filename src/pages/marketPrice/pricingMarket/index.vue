<template>
  <div>
    <t-card class="list-card-container" :bordered="false">
      <t-form ref="form" :data="formData" :label-width="80" colon @reset="onReset" @submit="onSearch">
        <t-row :gutter="[16, 24]" :style="{ marginBottom: '10px' }">
          <t-col :span="3">
            <t-form-item label="行政区划" name="areaCode">
              <tree-select-dialog v-model="formData.areaCode" :data="areaList" :placeholder="'默认'"
                :multiple="true" title="选择行政区划" :width="800" :treeHeight="500" @change="handleAreaChange" />
            </t-form-item>
          </t-col>
          <t-col :span="3">
            <t-form-item label="品类" name="categoryType">
              <t-select clearable v-model="formData.categoryType" class="form-item-content" :options="categoryOptions"
                placeholder="默认全部支持，模糊输入带出" />
            </t-form-item>
          </t-col>
          <t-col :span="3">
            <t-form-item label="品种" name="varietyType">
              <t-select clearable v-model="formData.varietyType" class="form-item-content" :options="varietyOptions"
                placeholder="默认全部支持，模糊输入带出" />
            </t-form-item>
          </t-col>
          <t-col :span="3">
            <t-form-item label="计价方式" name="pricingMethod">
              <t-select clearable v-model="formData.pricingMethod" class="form-item-content"
                :options="pricingMethodOptions" placeholder="全部" />
            </t-form-item>
          </t-col>
        </t-row>

        <t-row :gutter="[16, 24]">
          <t-col :span="3">
            <t-form-item label="规格" name="specification">
              <t-select clearable v-model="formData.specification" class="form-item-content"
                :options="specificationOptions" placeholder="默认全部，模糊品显+计价方式带出" />
            </t-form-item>
          </t-col>
          <t-col :span="3">
            <t-form-item label="采价员" name="collector">
              <t-select clearable v-model="formData.collector" class="form-item-content" :options="collectorOptions"
                placeholder="默认全部支持，模糊输入带出" />
            </t-form-item>
          </t-col>
          <t-col :span="4">
            <t-form-item label="价格日期" name="priceDate">
              <t-date-range-picker v-model="formData.priceDate" placeholder="请选择日期区间" />
            </t-form-item>
          </t-col>
        </t-row>

        <t-row :gutter="20" style="margin-top: 16px">
          <t-col :span="24">
            <div class="operation-container" style="display: flex; justify-content: space-between">
              <div></div>
              <div>
                <t-button theme="primary" type="submit">查询</t-button>
                <t-button type="reset" variant="base" theme="default" :style="{ marginLeft: '8px' }">重置</t-button>
              </div>
            </div>
          </t-col>
        </t-row>
      </t-form>
      <div class="table-container">
        <t-table :columns="columns" :data="data" :rowKey="rowKey" :verticalAlign="verticalAlign" :hover="hover"
          :pagination="pagination" :loading="dataLoading" :headerAffixedTop="true" height="calc(100vh - 420px)">
          <template #operation="slotProps">
            <t-button theme="primary" variant="text" class="t-button-link"
              style="color: #0052d9; padding: 0px 0px 10px 0px" @click="handleViewDetails(slotProps)">详情</t-button>
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
import TreeSelectDialog from '../../../components/Tree/TreeSelectDialog.vue';

export default Vue.extend({
  name: 'PricingMarket',
  components: {
    TreeSelectDialog, // 注册组件
  },
  data() {
    return {
      prefix,
      dataLoading: false,
      loading: false,
      data: [],
      columns: [
        {
          title: '行政区划',
          align: 'left',
          width: 150,
          ellipsis: true,
          colKey: 'area',
        },
        {
          title: '日期',
          align: 'left',
          width: 120,
          ellipsis: true,
          colKey: 'date',
        },
        {
          title: '品类',
          width: 120,
          ellipsis: true,
          colKey: 'category',
        },
        {
          title: '品种',
          width: 120,
          ellipsis: true,
          colKey: 'variety',
        },
        {
          title: '计价方式',
          width: 120,
          ellipsis: true,
          colKey: 'pricingMethod',
        },
        {
          title: '规格',
          width: 120,
          ellipsis: true,
          colKey: 'specification',
        },
        {
          title: '行情价',
          width: 120,
          ellipsis: true,
          colKey: 'price',
        },
        {
          title: '采价员',
          width: 120,
          ellipsis: true,
          colKey: 'collector',
        },
        {
          title: '上报时间',
          width: 150,
          ellipsis: true,
          colKey: 'reportTime',
        },
        {
          title: '操作',
          width: 100,
          colKey: 'operation',
        }
      ],
      formData: {
        areaCode: [],
        categoryType: '',
        varietyType: '',
        pricingMethod: '',
        specification: '',
        collector: '',
        priceDate: [], // 日期区间，使用数组
      },
      // 模拟的下拉选项数据
      categoryOptions: [
        { label: '全部', value: '' },
        { label: '柑橘', value: '1' },
        { label: '猕猴桃', value: '2' },
        { label: '桃', value: '3' },
      ],
      varietyOptions: [
        { label: '全部', value: '' },
        { label: '不知火', value: '1' },
        { label: '绿果', value: '2' },
        { label: '东阳', value: '3' },
      ],
      pricingMethodOptions: [
        { label: '全部', value: '' },
        { label: '按重量', value: '1' },
        { label: '按个数', value: '2' },
      ],
      specificationOptions: [
        { label: '全部', value: '' },
        { label: '0-100mm', value: '1' },
        { label: '101-200mm', value: '2' },
      ],
      collectorOptions: [
        { label: '全部', value: '' },
        { label: '张五', value: '1' },
        { label: '李四', value: '2' },
      ],
      rowKey: 'id',
      verticalAlign: 'top',
      hover: true,
      areaList: [],
      pagination: {
        pageSize: 10,
        total: 0,
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
  mounted() {
    this.getAreaList();
    this.getList();
  },
  methods: {
    handleAreaChange(value) {
      this.formData.areaCode = value;
    },
    getAreaList() {
      // 显示加载状态
      this.dataLoading = true;

      this.$request
        .get('/web/area/selectWholeAreaTrees')
        .then((res) => {
          if (res.retCode === 200) {
            const originalData = res.retData || [];

            // 创建一个新的"全部"作为顶级父节点
            const rootNode = {
              areaname: '全部',
              areacode: 'all', // 这个值不会被传递到后端
              children: originalData // 将原始数据作为子节点
            };

            // 使用包含"全部"父节点的新结构
            this.areaList = [rootNode];
          } else {
            this.$message.error(res.retMsg || '获取行政区划数据失败');
          }
        })
        .catch((error) => {
          console.error('获取行政区划数据出错:', error);
          this.$message.error('获取行政区划数据出错');
        })
        .finally(() => {
          this.dataLoading = false;
        });
    },
    onSearch() {
      this.getList(true);
    },
    onReset() {
      this.$set(this.$data, 'formData', this.$options.data().formData);
      this.getList(true);
    },
    getList(isSearch = false) {
      if (isSearch) {
        this.pagination.pageNo = 1;
      }

      this.dataLoading = true;

      // 示例数据，实际应该是从API获取
      setTimeout(() => {
        this.data = [
          {
            id: '1',
            area: '四川-成都-龙泉',
            date: '2025-02-02',
            category: '柑橘',
            variety: '不知火',
            pricingMethod: '按重量',
            specification: '0-100mm',
            price: '2.5元/斤',
            collector: '张五',
            reportTime: '2025-02-11 10:12:53',
          },
          {
            id: '2',
            area: '四川-成都-都江堰',
            date: '2025-02-02',
            category: '柑橘',
            variety: '不知火',
            pricingMethod: '按重量',
            specification: '101-200mm',
            price: '2.5元/斤',
            collector: '张五',
            reportTime: '2025-02-11 10:12:53',
          },
          {
            id: '3',
            area: '四川-成都-都江堰',
            date: '2025-02-02至2025-02-05',
            category: '猕猴桃',
            variety: '绿果',
            pricingMethod: '',
            specification: '',
            price: '2.5元/斤',
            collector: '张五',
            reportTime: '2025-02-11 10:12:53',
          },
        ];
        this.pagination.total = 3;
        this.dataLoading = false;
      }, 300);
    },
    onPageSizeChange(size) {
      this.pagination.pageSize = size;
      this.getList();
    },
    onCurrentChange(current) {
      this.pagination.pageNo = current;
      this.getList();
    },
    handleViewDetails({ row }) {
      this.$router.push({
        name: 'pricingMarketDetail',
        params: {
          id: row.id,
        },
      });
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