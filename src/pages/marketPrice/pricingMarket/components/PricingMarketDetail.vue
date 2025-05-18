<template>
    <t-loading :loading="loading" text="加载中...">
        <t-card :bordered="false" class="list-card-container">
            <div class="detail-container">
                <div class="section">
                    <div class="section-title">
                        <span class="section-title-marker"></span>
                        <span>基础信息</span>
                    </div>

                    <div>
                        <t-row :gutter="[16, 16]">
                            <t-col :span="4">
                                <div class="field-item">
                                    <label>行政区划</label>
                                    <t-input v-model="basicInfo.adminRegion" disabled placeholder="" />
                                </div>
                            </t-col>
                            <t-col :span="4">
                                <div class="field-item">
                                    <label>品种大类</label>
                                    <t-input v-model="basicInfo.majorCategory" disabled placeholder="" />
                                </div>
                            </t-col>
                            <t-col :span="4">
                                <div class="field-item">
                                    <label>上报地点</label>
                                    <t-input v-model="basicInfo.reportLocation" disabled placeholder="" />
                                </div>
                            </t-col>
                        </t-row>

                        <t-row :gutter="[16, 16]">
                            <t-col :span="4">
                                <div class="field-item">
                                    <label>价格日期</label>
                                    <t-input v-model="basicInfo.priceDate" disabled placeholder="" />
                                </div>
                            </t-col>
                            <t-col :span="4">
                                <div class="field-item">
                                    <label>上报时间</label>
                                    <t-input v-model="basicInfo.reportTime" disabled placeholder="" />
                                </div>
                            </t-col>
                            <t-col :span="4">
                                <div class="field-item">
                                    <label>采价员</label>
                                    <t-input v-model="basicInfo.collector" disabled placeholder="" />
                                </div>
                            </t-col>
                        </t-row>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">
                        <span class="section-title-marker"></span>
                        <span>采价信息</span>
                    </div>

                    <t-tabs v-model="activeTab" @change="handleTabChange">
                        <t-tab-panel v-for="(item, index) in varietyTabs" :key="index" :value="item.value"
                            :label="item.label">
                            <div class="price-info">
                                <t-table :data="item.priceData" :columns="priceColumns" rowKey="id" bordered />

                                <div class="evidence-section">
                                    <div class="evidence-title">价格佐证凭据</div>
                                    <div class="credentials-container">
                                        <!-- 图片文件 -->
                                        <t-image-viewer v-for="(file, fileIndex) in item.files.images" :key="fileIndex"
                                            :default-index="fileIndex" :images="item.files.imageUrls">
                                            <template #trigger="{ open }">
                                                <div
                                                    class="tdesign-demo-image-viewer__ui-image tdesign-demo-image-viewer__base">
                                                    <img :alt="file.name" :src="file.url"
                                                        class="tdesign-demo-image-viewer__ui-image--img" />
                                                    <div class="tdesign-demo-image-viewer__ui-image--hover"
                                                        @click="open">
                                                        <span><t-icon name="browse" size="1.4em" /> 预览</span>
                                                    </div>
                                                </div>
                                            </template>
                                        </t-image-viewer>

                                        <!-- 视频文件 -->
                                        <div v-for="(file, fileIndex) in item.files.videos" :key="`video-${fileIndex}`"
                                            class="credential-item">
                                            <div class="image-container">
                                                <div class="video-placeholder">
                                                    <t-icon name="cloud-download" class="downVideo"
                                                        @click="downloadFile(file.id, file.name)" />
                                                    <video :src="file.url" controls controlsList="nodownload"></video>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- 其他类型文件 -->
                                        <div v-for="(file, fileIndex) in item.files.others" :key="`other-${fileIndex}`"
                                            class="credential-item">
                                            <div class="file-container" @click="handleFileClick(file)">
                                                <div class="file-icon">
                                                    <i class="file-type">{{ file.type.toUpperCase() }}</i>
                                                </div>
                                                <div class="file-name">{{ file.name }}</div>
                                            </div>
                                        </div>

                                        <!-- 如果没有文件，显示占位符 -->
                                        <div v-if="item.files.images.length === 0 && item.files.videos.length === 0 && item.files.others.length === 0"
                                            class="credential-item">
                                            <div class="image-placeholder">
                                                <div class="placeholder-x"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </t-tab-panel>
                    </t-tabs>
                </div>

                <div class="back-button-container">
                    <t-button theme="default" @click="goBack">返回</t-button>
                </div>
            </div>
        </t-card>
    </t-loading>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'PricingMarketDetail',
    props: {
        id: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            loading: false,
            activeTab: 'variety1',
            basicInfo: {
                adminRegion: '四川-成都-龙泉',
                majorCategory: '柑橘',
                reportLocation: '都江堰市场',
                priceDate: '2025-02-02',
                reportTime: '2025-02-11 10:12:53',
                collector: '张五',
            },
            varietyTabs: [
                {
                    label: '肥妃柑',
                    value: 'variety1',
                    priceData: [
                        { id: 1, pricingMethod: '按果径', specification: '90-100mm', price: '2.2' },
                        { id: 2, pricingMethod: '按果径', specification: '101-200mm', price: '2.5' },
                        { id: 3, pricingMethod: '按重量', specification: '100-200g', price: '3' },
                    ],
                    files: {
                        images: [
                            { id: '1', name: '图片1.jpg', url: 'https://tdesign.gtimg.com/site/source/figma-pc.png' },
                            { id: '2', name: '图片2.jpg', url: 'https://tdesign.gtimg.com/site/source/figma-mobile.png' },
                        ],
                        imageUrls: [
                            'https://tdesign.gtimg.com/site/source/figma-pc.png',
                            'https://tdesign.gtimg.com/site/source/figma-mobile.png',
                        ],
                        videos: [
                            { id: '3', name: '视频1.mp4', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                        ],
                        others: [
                            { id: '4', name: '文档1.docx', url: '#', type: 'docx' },
                        ],
                    },
                },
                {
                    label: '不知火',
                    value: 'variety2',
                    priceData: [
                        { id: 4, pricingMethod: '按果径', specification: '80-90mm', price: '1.8' },
                        { id: 5, pricingMethod: '按果径', specification: '91-110mm', price: '2.2' },
                    ],
                    files: {
                        images: [
                            { id: '5', name: '图片3.jpg', url: 'https://tdesign.gtimg.com/site/source/figma-pc.png' },
                        ],
                        imageUrls: [
                            'https://tdesign.gtimg.com/site/source/figma-pc.png',
                        ],
                        videos: [],
                        others: [
                            { id: '6', name: '价格表.xlsx', url: '#', type: 'xlsx' },
                        ],
                    },
                },
            ],
            priceColumns: [
                { title: '计价方式', colKey: 'pricingMethod' },
                { title: '规格', colKey: 'specification' },
                { title: '行情价', colKey: 'price' },
            ],
        };
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            this.loading = true;
            // 模拟API请求延迟
            setTimeout(() => {
                this.loading = false;
                // 在实际应用中，这里会是一个真正的API请求
                // this.$request.get(`/api/pricingMarket/detail/${this.id}`)
                //   .then(res => {
                //     if (res.retCode === 200) {
                //       // 设置数据
                //     }
                //   })
            }, 500);
        },
        handleTabChange(value) {
            console.log('Tab changed to:', value);
            // 在实际应用中，可能需要根据选中的tab重新加载数据
        },
        handleFileClick(file) {
            console.log('File clicked:', file);
            // 在实际应用中，这里可能会下载文件或在新窗口中打开
        },
        downloadFile(fileId, fileName) {
            console.log('Download file:', fileId, fileName);
            // 在实际应用中，这里会实现文件下载功能
        },
        goBack() {
            this.$router.back();
        },
    },
});
</script>

<style lang="less" scoped>
.detail-container {
    // padding: 20px;
}

.section {
    margin-bottom: 40px;
}

.section-title {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;

    .section-title-marker {
        width: 4px;
        height: 16px;
        background-color: var(--td-brand-color);
        margin-right: 8px;
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

.price-info {
    margin-top: 20px;
}

.evidence-section {
    margin-top: 24px;
}

.evidence-title {
    font-weight: bold;
    margin-bottom: 16px;
}

.credentials-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 16px;
}

.credential-item {
    width: 120px;
    height: 120px;
    position: relative;
}

video {
    height: 100%;
    width: 100%;
}

.image-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e5e5e5;
    overflow: hidden;
    cursor: pointer;
}

.file-container {
    width: 100%;
    height: 100%;
    border: 1px solid #e5e5e5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    cursor: pointer;
}

.file-icon {
    width: 60px;
    height: 60px;
    background-color: #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
}

.file-type {
    font-style: normal;
    font-size: 12px;
    font-weight: bold;
}

.file-name {
    font-size: 12px;
    text-align: center;
    padding: 0 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
}

.image-placeholder {
    width: 100%;
    height: 100%;
    border: 1px dashed #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    position: relative;
}

.placeholder-x {
    position: relative;
    width: 100%;
    height: 100%;

    &:before,
    &:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 80%;
        height: 1px;
        background-color: #ccc;
    }

    &:before {
        transform: translate(-50%, -50%) rotate(45deg);
    }

    &:after {
        transform: translate(-50%, -50%) rotate(-45deg);
    }
}

.video-placeholder {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;

    .downVideo {
        height: 20px;
        position: absolute;
        right: 0;
        top: 0px;
        color: red;
        font-size: 20px;
        z-index: 999;
    }
}

.back-button-container {
    display: flex;
    justify-content: center;
    bottom: 0;
    margin-top: 40px;
    padding: 16px 0;
    z-index: 10;
}

/* 图片查看器样式 */
.tdesign-demo-image-viewer__ui-image {
    width: 100%;
    height: 100%;
    display: inline-flex;
    position: relative;
    justify-content: center;
    align-items: center;
    border-radius: var(--td-radius-small);
    overflow: hidden;
}

.tdesign-demo-image-viewer__ui-image--hover {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    background-color: rgba(0, 0, 0, 0.6);
    color: var(--td-text-color-anti);
    line-height: 22px;
    transition: 0.2s;
}

.tdesign-demo-image-viewer__ui-image:hover .tdesign-demo-image-viewer__ui-image--hover {
    opacity: 1;
    cursor: pointer;
}

.tdesign-demo-image-viewer__ui-image--img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    cursor: pointer;
    position: absolute;
}

.tdesign-demo-image-viewer__base {
    width: 120px;
    height: 120px;
    margin: 0;
    border: 1px solid var(--td-bg-color-secondarycontainer);
    border-radius: var(--td-radius-medium);
}
</style>