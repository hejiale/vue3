<template>
    <div class="modelView">
        <span class="modelView-title">{{ props.title }}</span>
        <div class="modelView-close">
            <up-icon name="close" color="#1A1A1A"></up-icon>
        </div>
        <div class="modelView-content">锁车后拼车状态变为拼车完成，玩家将无法自主退款。</div>
        <div class="modelView-sure">确认锁车</div>
    </div>
</template>
<script lang="ts" setup>
const props = defineProps({
    title: {
        type: String,
        default: ''
    }
})
</script>
<style lang="scss" scoped>
.modelView{
    width: 626rpx;
    height: 372rpx;
    background: #FFFFFF;
    border-radius: 44rpx;
    position: relative;
    &-title{
        @include text-bold(28rpx, #1A1A1A);
        padding-top: 40rpx;
        width: 100%;
        @include hor-center-center;
    }
    &-close{
        position: absolute;
        right: 0px;
        top: 0px;
        padding: 40rpx;
        @include hor-center-center;
    }
    &-content{
        @include text-middle(26rpx, #999);
        margin: 30rpx 40rpx 0px 40rpx;
    }
    &-sure{
        position: absolute;
        bottom: 40rpx;
        left: 42rpx;
        width: 544rpx;
        height: 96rpx;
        background: #1A1A1A;
        border-radius: 32rpx;
        @include hor-center-center;
        @include text-bold(28rpx, #fff);
    }
}
</style>