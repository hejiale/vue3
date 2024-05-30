<template>
  <!-- 弹出框顶部 -->
  <div class="header">
    <image class="header-close" :src="filters.icon('saas-icon-close')"/>
    <div class="header-title">开场价格</div>
    <div class="header-content">若使用优惠券开本，未支付成功，优惠券将在半小时后退回</div>
  </div>
  <!-- 优惠券选择 -->
  <scroll-view class="couponBox" scroll-y="true">
    <coupon class="couponBox-coupon" v-for="coupon in couponList" :coupon="coupon" :key="coupon.id" @on-coupon="onClickCoupon">
      <template>
        <image class="couponBox-coupon-btn" :src="coupon.id === current.id ? filters.icon('selected') : filters.icon('unselected')" @click="select(coupon)" v-if="coupon.couponUseStatus !== 'NONE'"/>
      </template>
    </coupon>
  </scroll-view>
  <!-- 支付按钮 -->
  <div class="tabbar">
    <button class="tabbar-btn" @click="pay">
      <span class="white26">确认支付</span>
      <span class="white24">￥</span>
      <span class="white40">{{ price > current.cutPrice ? price/100 - current.cutPrice/100 : 0 }}</span>
      <span class="white22" v-show="current.couponUseStatus !== 'NONE'">(已优惠{{ current.cutPrice/100 }}元)</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const { filters, sassApi, useUser , useStore, doPay } = useInstance();
import coupon from "./coupon.vue"

const props = defineProps({
  dramaId: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    default: 0,
  },
})

const emits = defineEmits(['pay'])

let couponList: any[] = reactive([]); //优惠券列表
let current:any = reactive({}) //当前选中优惠券

onLoad(async () => {
  /*获取优惠券卡包信息*/
  let res: any = await sassApi.myTicket(
      {
        "couponTicketStatus": 'CAN_USE',
        "dramaId": props.dramaId,
        "storeId": 17,
        "targetType": "STORE",
      })
  res.forEach((item: any)=> {
    couponList.push(item)
  });
  couponList.push({ couponUseStatus: 'NONE', useEndTime: '', cutPrice: 0, productApplicableVOList: [] })
  Object.assign(current, couponList[couponList.length-1]);
});
// 选择优惠券
function select(coupon : any){
  if(current.id == coupon.id){
    Object.assign(current, {});
  } else {
    Object.assign(current, coupon);
  }
}

function onClickCoupon(coupon:any){
  if(coupon.couponUseStatus === 'NONE'){
    Object.assign(current, {});
  }
}

// 支付
function pay() {
  emits('pay', current);
}
</script>

<style scoped lang="scss">
.header {
  position: relative;
  width: 686rpx;
  height: 86rpx;
  margin: 28rpx auto 0 auto;

  &-close {
    position: absolute;
    width: 52rpx;
    height: 52rpx;
    right: 0;
  }

  &-title {
    @include text-custom(500,34rpx,#2E323E);
  }
  
  &-content {
    margin-top: 4rpx;
    @include text-custom(400,24rpx,#959AA5);
  }
}

.couponBox {
  height: 860rpx;
  margin-top: 28rpx;
  overflow: hidden;

  &-coupon {
    position: relative;
    &-btn {
      width: 40rpx;
      height: 40rpx;
      position: absolute;
      right: 40rpx;
    }
  }
}

.tabbar {
  overflow: hidden;
  border: 1rpx solid #EBECEB;

  &-btn {
    width: 670rpx;
    height: 88rpx;
    margin: 24rpx auto 0 auto;
    background: #1D202A;
    line-height: 88rpx;
    border-radius: 24rpx;

    &:active {
      background: rgba(0, 0, 0, 0.7);
    }
  }
}

.white26 {
  @include text-custom(400,26rpx,#FFFFFF)
}

.white24 {
  @include text-custom(500,24rpx,#FFFFFF)
}

.white40 {
  @include text-custom(800,40rpx,#FFFFFF)
}

.white22 {
  margin-left: 8rpx;
  @include text-custom(400,22rpx,rgba(255,255,255,0.8))
}
</style>