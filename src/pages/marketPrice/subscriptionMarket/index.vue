<template>
  <div>
    <t-card class="list-card-container" :bordered="false">
      <t-form ref="form" :data="formData" :label-width="80" colon @reset="onReset" @submit="onSearch">
        <t-row :gutter="[16, 24]" :style="{ marginBottom: '10px' }">
          <t-col :span="3">
            <t-form-item label="行政区划" name="areaCode">
              <t-tree-select clearable v-model="formData.areaCode" :treeProps="treeProps" :data="areaList"
                placeholder="默认全部支持，模糊输入带出" />
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
            <t-form-item label="价格来源" name="priceSource">
              <t-select clearable v-model="formData.priceSource" class="form-item-content" :options="priceSourceOptions"
                placeholder="默认全部支持" />
            </t-form-item>
          </t-col>
          <t-col :span="3">
            <t-form-item label="价格月份" name="priceMonth">
              <t-select clearable v-model="formData.priceMonth" class="form-item-content" :options="priceMonthOptions"
                placeholder="默认全部" />
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
  name: 'SubscriptionMarket',
  data() {
    return {
      prefix,
      dataLoading: false,
      loading: false,
      data: [],
      columns: [
        {
          title: '所在产地',
          align: 'left',
          width: 150,
          ellipsis: true,
          colKey: 'location',
        },
        {
          title: '月份',
          align: 'left',
          width: 120,
          ellipsis: true,
          colKey: 'month',
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
          title: '价格方式',
          width: 120,
          ellipsis: true,
          colKey: 'priceMethod',
        },
        {
          title: '规格',
          width: 120,
          ellipsis: true,
          colKey: 'specification',
        },
        {
          title: '价格',
          width: 120,
          ellipsis: true,
          colKey: 'price',
        },
        {
          title: '来源',
          width: 120,
          ellipsis: true,
          colKey: 'source',
        },
        {
          title: '上报序号',
          width: 150,
          ellipsis: true,
          colKey: 'reportNumber',
        }
      ],
      formData: {
        areaCode: '',
        categoryType: '',
        varietyType: '',
        pricingMethod: '',
        specification: '',
        priceSource: '',
        priceMonth: '',
      },
      // 模拟的下拉选项数据
      categoryOptions: [
        { label: '全部', value: '' },
        { label: '柑橘', value: '1' },
        { label: '桃', value: '2' },
        { label: '猕猴桃', value: '3' }
      ],
      varietyOptions: [
        { label: '全部', value: '' },
        { label: '肥妃柑', value: '1' },
        { label: '皮球桃', value: '2' },
        { label: '东阳', value: '3' }
      ],
      pricingMethodOptions: [
        { label: '全部', value: '' },
        { label: '按重量', value: '1' },
        { label: '按个数', value: '2' }
      ],
      specificationOptions: [
        { label: '全部', value: '' },
        { label: '0-100mm', value: '1' },
        { label: '101-200mm', value: '2' }
      ],
      priceSourceOptions: [
        { label: '全部', value: '' },
        { label: 'xxx经销商', value: '1' },
        { label: '批发市场', value: '2' }
      ],
      priceMonthOptions: [
        { label: '全部', value: '' },
        { label: '一月', value: '01' },
        { label: '二月', value: '02' },
        { label: '三月', value: '03' },
        { label: '四月', value: '04' },
        { label: '五月', value: '05' },
        { label: '六月', value: '06' },
        { label: '七月', value: '07' },
        { label: '八月', value: '08' },
        { label: '九月', value: '09' },
        { label: '十月', value: '10' },
        { label: '十一月', value: '11' },
        { label: '十二月', value: '12' }
      ],
      rowKey: 'id',
      verticalAlign: 'top',
      hover: true,
      areaList: [
        {
          areaname: '四川',
          areacode: 'SC',
          children: [
            {
              areaname: '成都',
              areacode: 'CD',
              children: [
                {
                  areaname: '双区',
                  areacode: 'SQ',
                },
                {
                  areaname: '金堂',
                  areacode: 'JT',
                },
              ],
            },
          ],
        },
        {
          areaname: '重庆',
          areacode: 'CQ',
          children: [],
        },
      ],
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
    this.getList();
  },
  methods: {
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
            location: '四川-成都-双区',
            month: '2025-02',
            category: '柑橘',
            variety: '肥妃柑',
            priceMethod: '',
            specification: '',
            price: '1.55元/斤',
            source: 'xxx经销商',
            reportNumber: '年月日时分秒毫秒',
          },
          {
            id: '2',
            location: '四川-成都-金堂',
            month: '2025-02',
            category: '桃',
            variety: '皮球桃',
            priceMethod: '',
            specification: '',
            price: '5.26元/公斤',
            source: 'xxx经销商',
            reportNumber: '',
          },
          {
            id: '3',
            location: '四川-成都-金堂',
            month: '2025-02',
            category: '猕猴桃',
            variety: '东阳',
            priceMethod: '',
            specification: '',
            price: '5.26元/公斤',
            source: 'xxx',
            reportNumber: '',
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