<template>
  <div class="container">
    <jy-navigationBar :barHeight="42">
      <template v-slot:content>
        <div class="topBar">
            <up-icon name="arrow-left" color="#fff" size="22" @click="onBack"></up-icon>
            <span class="topBar-title">商户进件</span>
        </div>
      </template>
    </jy-navigationBar>
    <div class="container-bg"></div>
    <div class="container-content">
      <image :src="filters.icon('inComing-personal')" class="container-box" @click="onPersonal"></image>
      <image :src="filters.icon('inComing-company')" class="container-box" @click="onEnterprise"></image>
      <image :src="filters.icon('inComing-contact')" class="container-box"></image>
    </div>
  </div>
</template>
<script lang="ts" setup>
const { myApi, useUser, filters } = useInstance();

function onBack() {
  uni.navigateBack();
}

function onPersonal(){
  uni.navigateTo({url: './personal-parts'});
}

function onEnterprise(){
  uni.navigateTo({url: './enterprise-parts'});
}


</script>
<style lang="scss" scoped>
.container {
    .topBar{
        @include hor-center;
        padding-left: 40rpx;
        padding-top: 10rpx;
        position: relative;
        &-title{
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            @include text-normal(26rpx, #ffff);
        }
    }
    &-content{
      position: absolute;
      left: 0px;
      right: 0px;
      bottom: 0px;
      top: 246rpx;
      z-index: 1;
    }
  &-bg {
    @include fixed-center;
    height: 580rpx;
    background: linear-gradient(180deg, #4762f2 0%, rgba(71, 129, 242, 0) 100%);
    z-index: -1;
  }
  &-box{
    margin: 24rpx 0rpx 0px 32rpx;
    width: 686rpx;
    height: 192rpx;
  }
}
</style>