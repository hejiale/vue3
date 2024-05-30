<template>
    <div class="noDataBox" :style="{'padding-top': top}">
        <image :src="filters.icon(bgUrl)" class="noDataBox-bg" v-if="bgUrl"></image>
        <image :src="filters.icon(customUrl)" class="noDataBox-custom" :style="{'width': customSize}" mode="widthFix" v-if="customUrl"></image>
        <span class="noDataBox-title" v-if="title">{{ title  }}</span>
        <span class="noDataBox-subTitle" v-if="subTitle">{{ subTitle }}</span>
        <div class="noDataBox-button" v-if="button" @click.stop="onClick">{{ button }}</div>
    </div>
</template>
<script setup lang="ts">
const { filters } = useInstance();

const props = defineProps({
    /**
     * 图标
     */
    bgUrl: {
        type: String,
        default: null
    },
    /**
     * 自定义图标
     */
     customUrl: {
        type: String,
        default: null
    },
    /**
     * 自定义图标尺寸
     */
     customSize: {
        type: String,
        default: ''
    },
    /**
     * 主标题
     */
    title: {
        type: String,
        default: null
    },
    /**
     * 副标题
     */
    subTitle: {
        type: String,
        default: null
    },
    /**
     * 操作按钮图标
     */
    button: {
        type: String,
        default: null
    },
    /**
     * 居上位置
     */
    top: {
        type: String,
        default: '14vh'
    }
})

const emmits = defineEmits(['on-click'])

function onClick(){
    emmits('on-click')
}

</script>
<style lang="scss" scoped>
.noDataBox{
    @include ver-center;
    &-bg{
        width: 176rpx;
        height: 176rpx;
    }
    &-title{
        @include text-middle(30rpx, #2E323E);
    }
    &-subTitle{
        margin-top: 8rpx;
        @include text-normal(26rpx, #959AA5);
    }
    &-button{
        margin-top: 56rpx;
        padding: 20rpx 54rpx;
        background: #2E323E;
        border-radius: 46rpx;
        @include text-bold(28rpx, #36E4BB);
    }
}
</style>