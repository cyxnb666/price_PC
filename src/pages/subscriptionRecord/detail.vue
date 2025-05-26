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
                        <t-row :gutter="[16, 24]">
                            <t-col :span="3">
                                <div class="field-item">
                                    <label>上报价格归属</label>
                                    <t-input v-model="basicInfo.priceAffiliation" disabled placeholder="" />
                                </div>
                            </t-col>
                            <t-col :span="3">
                                <div class="field-item">
                                    <label>订购来源</label>
                                    <t-input v-model="basicInfo.subscriptionSource" disabled placeholder="" />
                                </div>
                            </t-col>
                            <t-col :span="3">
                                <div class="field-item">
                                    <label>品种大类</label>
                                    <t-input v-model="basicInfo.categoryType" disabled placeholder="" />
                                </div>
                            </t-col>
                            <t-col :span="3">
                                <div class="field-item">
                                    <label>品种</label>
                                    <t-input v-model="basicInfo.varietyName" disabled placeholder="" />
                                </div>
                            </t-col>
                        </t-row>

                        <t-row :gutter="[16, 24]">
                            <t-col :span="3">
                                <div class="field-item">
                                    <label>预采购时间</label>
                                    <t-input v-model="basicInfo.plannedPurchaseTime" disabled placeholder="" />
                                </div>
                            </t-col>
                            <t-col :span="3">
                                <div class="field-item">
                                    <label>上报时间</label>
                                    <t-input v-model="basicInfo.reportTime" disabled placeholder="" />
                                </div>
                            </t-col>
                            <t-col :span="3">
                                <div class="field-item">
                                    <label>上报人</label>
                                    <t-input v-model="basicInfo.reporter" disabled placeholder="" />
                                </div>
                            </t-col>
                        </t-row>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">
                        <span class="section-title-marker"></span>
                        <span>订购信息</span>
                    </div>

                    <div>
                        <t-row :gutter="[16, 24]">
                            <t-col :span="3">
                                <div class="field-item">
                                    <label>种植户姓名</label>
                                    <t-input v-model="subscriptionInfo.planterName" disabled placeholder="" />
                                </div>
                            </t-col>
                            <t-col :span="3">
                                <div class="field-item">
                                    <label>身份证号码</label>
                                    <t-input v-model="subscriptionInfo.idCardNumber" disabled placeholder="" />
                                </div>
                            </t-col>
                            <t-col :span="3">
                                <div class="field-item">
                                    <label>果园定位</label>
                                    <t-input v-model="subscriptionInfo.orchardLocation" disabled placeholder="" />
                                </div>
                            </t-col>
                            <t-col :span="3">
                                <div class="field-item">
                                    <label>种植户电话</label>
                                    <t-input v-model="subscriptionInfo.planterPhone" disabled placeholder="" />
                                </div>
                            </t-col>
                        </t-row>

                        <div class="price-info">
                            <t-table :data="priceData" :columns="priceColumns" rowKey="id" bordered>
                                <template #unitPrice="{ row }">
                                    <span>{{ row.unitPrice }}</span>
                                </template>
                                <template #quantity="{ row }">
                                    <span>{{ row.quantity }}</span>
                                </template>
                            </t-table>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">
                        <span class="section-title-marker"></span>
                        <span>订购凭据</span>
                    </div>

                    <div class="evidence-section">
                        <div class="credentials-container">
                            <t-image-viewer v-for="(file, index) in subscriptionImageFiles" :key="file.fileId"
                                :default-index="index" :images="subscriptionImageUrls">
                                <template #trigger="{ open }">
                                    <div class="tdesign-demo-image-viewer__ui-image tdesign-demo-image-viewer__base">
                                        <img :alt="file.fileName" :src="file.fileUrl"
                                            class="tdesign-demo-image-viewer__ui-image--img" />
                                        <div class="tdesign-demo-image-viewer__ui-image--hover" @click="open">
                                            <span><browse-icon size="1.4em" /> 预览</span>
                                        </div>
                                    </div>
                                </template>
                            </t-image-viewer>

                            <!-- 视频文件 -->
                            <div v-for="file in subscriptionVideoFiles" :key="file.fileId" class="credential-item">
                                <div class="image-container">
                                    <icon-font name="cloud-download" class="downVideo"
                                        @click="downloadFile(file.fileId, file.fileName)" />
                                    <video :src="file.fileUrl" autoplay controls controlsList="nodownload"></video>
                                </div>
                            </div>

                            <!-- 其他类型文件 -->
                            <div v-for="file in subscriptionOtherFiles" :key="file.fileId" class="credential-item">
                                <div class="file-container" @click="handleFileClick(file)">
                                    <div class="file-icon">
                                        <i class="file-type">{{ file.fileSuffix }}</i>
                                    </div>
                                    <div class="file-name">{{ file.fileName }}</div>
                                </div>
                            </div>

                            <!-- 如果没有文件，显示占位符 -->
                            <div v-if="!subscriptionOtherFiles.length && !subscriptionVideoFiles.length && !subscriptionImageFiles.length"
                                class="credential-item">
                                <div class="image-placeholder">
                                    <div class="placeholder-x"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="action-buttons">
                    <t-button theme="default" @click="goBack">返回</t-button>
                </div>
            </div>
        </t-card>
    </t-loading>
</template>

<script lang="ts">
import Vue from 'vue';
import { BrowseIcon } from 'tdesign-icons-vue';
import { IconFont } from 'tdesign-icons-vue';

export default Vue.extend({
    name: 'SubscriptionRecordDetail',
    components: {
        BrowseIcon,
        IconFont,
    },
    props: {
        id: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            loading: false,
            basicInfo: {
                priceAffiliation: '',
                subscriptionSource: '',
                categoryType: '',
                varietyName: '',
                plannedPurchaseTime: '',
                reportTime: '',
                reporter: '',
            },
            subscriptionInfo: {
                planterName: '',
                idCardNumber: '',
                orchardLocation: '',
                planterPhone: '',
            },
            priceData: [],
            priceColumns: [
                { title: '计价方式', colKey: 'pricingMethod', width: 150 },
                { title: '规格', colKey: 'specification', width: 200 },
                { title: '订购价', colKey: 'unitPrice', width: 150 },
                { title: '订购数量(kg)', colKey: 'quantity', width: 150 },
            ],
            subscriptionFiles: [], // 订购凭据文件列表
        };
    },
    computed: {
        // 订购凭据中的图片文件
        subscriptionImageFiles() {
            if (!this.subscriptionFiles) return [];
            return this.subscriptionFiles.filter((file) => this.isImageFile(file.fileSuffix));
        },
        // 订购凭据中的图片URL
        subscriptionImageUrls() {
            return this.subscriptionImageFiles.map((file) => file.fileUrl);
        },
        // 订购凭据中的视频文件
        subscriptionVideoFiles() {
            if (!this.subscriptionFiles) return [];
            return this.subscriptionFiles.filter((file) => this.isVideoFile(file.fileSuffix));
        },
        // 订购凭据中的其他文件
        subscriptionOtherFiles() {
            if (!this.subscriptionFiles) return [];
            return this.subscriptionFiles.filter(
                (file) => !this.isImageFile(file.fileSuffix) && !this.isVideoFile(file.fileSuffix),
            );
        },
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            this.loading = true;

            // 模拟API请求
            setTimeout(() => {
                // 模拟数据
                this.basicInfo = {
                    priceAffiliation: '华南区域',
                    subscriptionSource: '线上订购/京东商城',
                    categoryType: '水果',
                    varietyName: '苹果',
                    plannedPurchaseTime: '2024-02-15',
                    reportTime: '2024-01-15 09:30:00',
                    reporter: '张三',
                };

                this.subscriptionInfo = {
                    planterName: '李种植',
                    idCardNumber: '440123199001011234',
                    orchardLocation: '广东省广州市白云区果园路123号',
                    planterPhone: '13800138001',
                };

                this.priceData = [
                    {
                        id: '1',
                        pricingMethod: '按果径',
                        specification: '90-100mm',
                        unitPrice: '2.2元/公斤',
                        quantity: '500',
                    },
                    {
                        id: '2',
                        pricingMethod: '按果径',
                        specification: '101-200mm',
                        unitPrice: '2.5元/公斤',
                        quantity: '800',
                    },
                    {
                        id: '3',
                        pricingMethod: '按重量',
                        specification: '100-200g',
                        unitPrice: '3元/斤',
                        quantity: '1000',
                    },
                    {
                        id: '4',
                        pricingMethod: '统果',
                        specification: '-',
                        unitPrice: '2.8元/公斤',
                        quantity: '300',
                    },
                ];

                // 模拟订购凭据文件
                this.subscriptionFiles = [
                    {
                        fileId: '1',
                        fileName: '订购合同.jpg',
                        fileSuffix: 'jpg',
                        fileUrl: 'https://tdesign.gtimg.com/demo/demo-image-1.png',
                    },
                    {
                        fileId: '2',
                        fileName: '果园照片.jpg',
                        fileSuffix: 'jpg',
                        fileUrl: 'https://tdesign.gtimg.com/demo/demo-image-2.png',
                    },
                    {
                        fileId: '3',
                        fileName: '身份证复印件.jpg',
                        fileSuffix: 'jpg',
                        fileUrl: 'https://tdesign.gtimg.com/demo/demo-image-3.png',
                    },
                    {
                        fileId: '4',
                        fileName: '订购视频.mp4',
                        fileSuffix: 'mp4',
                        fileUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                    },
                ];

                this.loading = false;
            }, 1000);

            // 实际项目中的API调用：
            // const params = {
            //   condition: {
            //     primaryKey: this.id,
            //   },
            // };
            // 
            // this.$request
            //   .post('/web/subscriptionRecord/getDetail', params)
            //   .then(async (res) => {
            //     if (res.retCode === 200) {
            //       const data = res.retData;
            //       this.basicInfo = { ...data.basicInfo };
            //       this.subscriptionInfo = { ...data.subscriptionInfo };
            //       this.priceData = data.priceData || [];
            //       this.subscriptionFiles = data.subscriptionFiles || [];
            //     } else {
            //       this.$message.error(res.retMsg || '获取详情数据失败');
            //     }
            //   })
            //   .catch((e) => {
            //     console.error('API error:', e);
            //     this.$message.error('获取详情数据失败');
            //   })
            //   .finally(() => {
            //     this.loading = false;
            //   });
        },

        // 判断文件是否为图片
        isImageFile(fileSuffix) {
            if (!fileSuffix) return false;
            const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
            return imageExtensions.includes(fileSuffix.toLowerCase());
        },

        // 判断文件是否为视频
        isVideoFile(fileSuffix) {
            if (!fileSuffix) return false;
            const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'];
            return videoExtensions.includes(fileSuffix.toLowerCase());
        },

        handleFileClick(file) {
            if (!file.fileUrl) return;

            if (file.fileSuffix && file.fileSuffix.toLowerCase() === 'pdf') {
                this.downloadFile(file.fileUrl, file.fileName);
            } else if (this.isDocumentFile(file.fileSuffix)) {
                this.downloadFile(file.fileUrl, file.fileName);
            } else {
                this.viewFile(file.fileUrl);
            }
        },

        isDocumentFile(fileSuffix) {
            if (!fileSuffix) return false;
            const docExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
            return docExtensions.includes(fileSuffix.toLowerCase());
        },

        // 查看文件（视频）
        viewFile(url) {
            if (url) {
                window.open(url, '_blank');
            }
        },

        // 下载文件
        downloadFile(url, fileName) {
            console.log(url, 'url');
            if (url) {
                // 实际项目中的下载逻辑
                const params = {
                    condition: {
                        primaryKey: url,
                    },
                };
                this.$request.post('/file/preview', params, {
                    responseType: 'arraybuffer',
                })
                    .then((response) => {
                        const blob = new Blob([response.data]);
                        const url = window.URL.createObjectURL(blob);
                        let link = document.createElement('a');
                        link.style.display = 'none';
                        link.href = url;
                        link.setAttribute('download', fileName);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    });
            }
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

.credentials-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 16px;
}

.credential-item {
    width: 120px;
    height: 120px;
    cursor: pointer;
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
    position: relative;
}

.credential-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.downVideo {
    height: 20px;
    position: absolute;
    right: 0;
    top: 0px;
    color: red;
    font-size: 20px;
    z-index: 999;
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

.action-buttons {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 40px;
    padding: 16px 0;
    z-index: 10;
}

.detail-container {
    padding-bottom: 20px;
    position: relative;
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