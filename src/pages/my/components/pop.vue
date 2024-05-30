<template>
  <div class="container">
    <div class="container-head">
<!--      icon-close-white   -->
      <div>我的店铺</div>
      <div></div>
    </div>
    <div class="container-stores" v-for="item in stores" :key="item.id" @click="switchToSaasPage(item.id)">
      <div class="container-stores-content">
        <div class="container-stores-content-name">
          <image class="container-stores-content-name-avatar" :src="item.storeLogo"/>
          <span class="container-stores-content-name-text">{{item.storeName}}</span>
        </div>
        <div class="container-stores-content-right">
          <span class="container-stores-content-right-text" >距离你</span>
          <span class="container-stores-content-right-content">
            {{filters.metersTransferThousand(item.distance)}}
          </span>
          <image class="container-stores-content-right-image" :src="filters.icon('right-arrow-gray')"/>
        </div>
      </div>
      <div class="container-stores-line"/>
    </div>
  </div>
</template>
<script setup lang="ts">
const { useUser, filters, api,storeApi, useStore } = useInstance();

const props = defineProps({
  /**
   * 店铺收藏列表
   */
  stores: {
    type: Array<any>,
    default: () => [],
  },
});

async function switchToSaasPage( storeId:number ) {
  await useStore.setStoreId( storeId );
  uni.navigateTo({
    url: "/store-saas-package/pages/index"
  });
}




</script>
<style scoped lang="scss">
.container{
  min-height: 30vh;
  background: linear-gradient(180deg, #FFFAF1 0%, #FFFFFF 20%);
  opacity: 1;
  border-radius: 26rpx;
  &-head{
    height: 128rpx;
    width: 100vw;
    border-radius: 26rpx;
    @include hor-center-center;
    @include text-custom(500, 32rpx, #000000);
    line-height: 38rpx;
  }
  &-stores{
    height: 120rpx;
    width: 100vw;
    margin-bottom: 10rpx;
    @include ver-center-center;
    position: relative;
    &-content{
      width: 90vw;
      height: 50rpx;
      @include hor-between-center;
      &-name{
        @include hor-center;
        &-text{
          margin-left: 12rpx;
          @include text-custom(600, 28rpx, #2E323E);
          @include text-overflow-line(1);
          max-width: 40vw;
        }
        &-avatar{
          width: 52rpx;
          height: 52rpx;
          border-radius: 24rpx;
          border: 2rpx solid #DFDFDF;
          box-sizing: border-box;
        }
      }
      &-right{
        margin-top: -10rpx;
        &-text{
          @include text-custom(400, 26rpx, #959AA5)
        }
        &-content{
          margin-left: 4rpx;
          margin-right: 8rpx;
          @include text-custom(400, 26rpx, #959AA5)
        }
        &-image{
          width: 16rpx;
          height: 20rpx;
        }
      }
    }
    &-line{
      position: absolute;
      bottom: 0;
      right: 0;
      width: 710rpx;
      height: 0;
      border-radius: 2rpx 2rpx 2rpx 2rpx;
      opacity: 1;
      border: 2rpx solid #F5F5F5;
    }
  }
}
</style>