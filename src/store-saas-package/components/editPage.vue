<template>
  <!-- 门店管理 -->
  <div class="manage">
    <image class="manage-item" v-for="(icon, index) in manageIconList" :key="index" :src="filters.icon(icon)"/>
  </div>
  <!-- 商户认证 -->
  <image class="authenticate" :src="filters.icon('saas-authentication')" @click="onMerchantBase"/>
  <!-- 剧本管理 -->
  <div class="drama">
    <div class="drama-manage">
      <div class="drama-manage-title">剧本管理</div>
      <div class="drama-manage-info">
        <span class="drama-manage-info-text">共计9975本</span>
        <image class="drama-manage-info-arrow" :src="filters.icon('sass_right_arrow')"/>
      </div>
    </div>
    <div class="drama-stats">
      <div class="drama-stats-title">23/9975</div>
      <div class="drama-stats-progress">
        <div class="drama-stats-progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <div class="drama-stats-info">
        <span class="drama-stats-info-text">上架剧本</span>
        <image class="drama-stats-info-arrow" :src="filters.icon('sass_right_arrow')"/>
      </div>
    </div>
    <div class="drama-price">
      <div class="drama-price-title">剧本价格</div>
      <div class="drama-price-info">
        <span class="drama-price-info-text">修改价格</span>
        <image class="drama-price-info-arrow" :src="filters.icon('sass_right_arrow')"/>
      </div>
    </div>
  </div>
  <!-- 运营管理 -->
  <div class="operation">
    <div class="operation-title">运营管理</div>
    <div class="operation-box">
      <image class="operation-box-item" v-for="(icon, index) in operateIconList" :key="index" :src="filters.icon(icon)"/>
    </div>
  </div>
</template>

<script setup lang="ts">
const { filters } = useInstance();

let progress = 10; //剧本百分比数目
let manageIconList= [ "saas-store-info", "saas-store-expenses", "saas-store-withdrawal", "saas-customer-orders", "saas-customer-service" ] //门店管理列表
let operateIconList =[ 'saas-store-organization', 'saas-store-qrcode', 'saas-staff-invitation', 'saas-staff-management' ] //运营管理列表

function onMerchantBase(){
  uni.navigateTo({url: '/inComingParts/pages/index'})
}
</script>

<style scoped lang="scss">
.manage {
  width: 710rpx;
  height: 160rpx;
  margin-top: 18rpx;
  background: #ffffff;
  border-radius: 20rpx;
  @include hor-between-around;

  &-item {
    width: 98rpx;
    height: 88rpx;
  }
}

.authenticate {
  width: 710rpx;
  height: 144rpx;
  margin-top: 24rpx;
}

.drama {
  position: relative;
  width: 710rpx;
  height: 168rpx;
  margin-top: 24rpx;
  border-radius: 20rpx;
  @include hor-between-center;

  &-manage,
  &-stats,
  &-price {
    position: relative;
    width: 226rpx;
    height: 168rpx;
    background: #ffffff;
    border-radius: 28rpx;

    &-title {
      margin-top: 28rpx;
      margin-left: 26rpx;
      @include text-custom(500,30rpx,#000000);
    }

    &-progress {
      position: relative;
      width: 166rpx;
      height: 6rpx;
      margin: 12rpx auto auto 26rpx;
      background: #F1F3F7;
      border-radius: 12rpx;

      &-bar {
        position: absolute;
        height: 6rpx;
        background: #0094FF;
        border-radius: 12rpx;
      }
    }
    &-info {
      position: absolute;
      left: 26rpx;
      bottom: 20rpx;
      @include hor-center;

      &-text {
        @include text-custom(400,26rpx,#A1ABBD);
      }

      &-arrow {
        width: 20rpx;
        height: 20rpx;
        margin-left: 4rpx;
      }
    }
  }
}

.operation {
  width: 710rpx;
  height: 254rpx;
  margin-top: 26rpx;
  background: #ffffff;
  border-radius: 20rpx;

  &-title {
    margin-left: 24rpx;
    padding-top: 28rpx;
    @include text-custom(500, 32rpx, #030A19);
  }

  &-box {
    margin-top: 36rpx;
    @include hor-between-around;

    &-item {
      height: 124rpx;
      width: 124rpx;
    }
  }
}
</style>