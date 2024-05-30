<template>
  <scroll-view class="scrollBox" scroll-y="true">
    <div class="coupon" v-for="(item,idx) in couponList" :key="idx">
      <!-- 优惠券背景图 -->
      <image class="coupon-background" :src="filters.icon('saas-coupon-pink')" :style="{ display: isCanUse() ? null : 'none' }"></image>
      <image class="coupon-background" :src="filters.icon('saas-coupon-grey')" :style="{ display: isCanUse() ? 'none' : null }"></image>
      <!-- 优惠券折扣 -->
      <div class="coupon-discount">
        <div class="coupon-discount-price">
          <span class="coupon-discount-price-num" :style="{ color: isCanUse() ? null : '#B0B0B4' }">{{ (item.cutPrice/100).toFixed(2) }}</span>
          <span class="coupon-discount-price-unit" :style="{ color: isCanUse() ? null : '#B0B0B4' }">元</span>
        </div>
        <div class="coupon-discount-info" :style="{ color: isCanUse() ? null : '#B0B0B4' }">无门槛</div>
      </div>
      <!-- 优惠券信息 -->
      <div class="coupon-info">
        <span class="coupon-info-name" :style="{ color: isCanUse() ? null : '#B0B0B4' }">{{ item.couponName }}</span>
        <div class="coupon-info-scope" :style="{ color: isCanUse() ? null : '#B0B0B4' }">全部商品可用</div>
        <div class="coupon-info-validity">
          <span class="coupon-info-validity-text" :style="{ color: isCanUse() ? null : '#B0B0B4' }">有效期至</span>
          <span class="coupon-info-validity-data" :style="{ color: isCanUse() ? null : '#B0B0B4' }">{{ item.useEndTime }}</span>
        </div>
      </div>
      <!-- 优惠券使用状态 -->
      <div class="coupon-status">
        <span class="coupon-status-unUsed" :style="{ display: isCanUse() ? null : 'none' }">立即使用</span>
        <span class="coupon-status-used" :style="{ display: isUsed() ?  null : 'none' }">已使用</span>
        <span class="coupon-status-used" :style="{ display: isExpired() ? null : 'none' }">已过期</span>
      </div>
    </div>
  </scroll-view>
</template>

<script setup lang="ts">
const { filters, sassApi, useStore } = useInstance();

const props = defineProps({
  couponStatus: {
    type: String,
    default: '',
  },
})

let couponList:any = reactive([]); //该类优惠券列表

onMounted(async () => {
  /*获取优惠券卡包信息*/
  let res:any = await sassApi.myTicket(
      {
        "couponTicketStatus": props.couponStatus,
        "storeId": useStore.storeInfo.id,
        "targetType": "STORE",
      })
  res.forEach((item:any) => {
    couponList.push(item)
  });
});

/*判断优惠券状态*/
function isCanUse() {
  return props.couponStatus === 'CAN_USE';
}
function isUsed() {
  return props.couponStatus === 'USED';
}
function isExpired() {
  return props.couponStatus === 'EXPIRED';
}
</script>

<style scoped lang="scss">
.scrollBox {
  height: calc( 100vh - 345rpx);
}

.coupon {
  position: relative;
  width: 680rpx;
  height: 166rpx;
  border: 1rpx solid #DDDDDE;
  margin: 0 auto 20rpx auto;
  border-radius: 20rpx;
  @include hor-center;

  &-background {
    position: absolute;
    width: 686rpx;
    height: 166rpx;
    z-index: -1;
  }

  &-discount {
    position: absolute;
    top: 38rpx;
    left: 0rpx;
    width: 210rpx;
    height: 90rpx;
    @include ver-center;

    &-price {

      &-num {
        @include text-custom(800,44rpx,#EA586F);
      }

      &-unit {
        margin-left: 4rpx;
        @include text-custom(400,22rpx,#EA586F);
      }
    }

    &-info {
      @include text-custom(400,22rpx,#EA586F);
    }
  }

  &-info {
    position: absolute;
    top: 30rpx;
    left: 236rpx;
    height: 106rpx;

    &-name {
      @include text-custom(500,26rpx,#EA586F);
    }

    &-scope {
      margin-top: 8rpx;
      @include text-custom(400,22rpx,#928C8E);
    }

    &-validity {
      margin-top: 2rpx;
      @include text-custom(400,22rpx,#928C8E);
    }
  }

  &-status {
    position: absolute;
    top: 60rpx;
    right: 24rpx;
    width: 128rpx;
    height: 48rpx;
    @include ver-center-center;

    &-unUsed {
      width: 128rpx;
      height: 48rpx;
      border: 1rpx solid #F04D6A;
      border-radius: 25rpx;
      @include hor-center-center;
      @include text-custom(600,24rpx,#F04D6A);
    }

    &-unUsed:active {
      background: rgba(0, 0, 0, 0.1);
    }

    &-used {
      @include text-custom(600,24rpx,#BCBDC0);
    }
  }
}

</style>