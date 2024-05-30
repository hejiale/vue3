<template>
  <div class="container" :style="bg" @click="onClickCoupon(coupon)">
    <!-- 优惠券减免金额 -->
    <div class="container-discount">
      <div>
        <span class="red44" :class="fontColor">{{ coupon.cutPrice / 100 }}</span>
        <span class="red22" :class="fontColor">元</span>
      </div>
      <div class="red22" :class="fontColor">无门槛</div>
    </div>
    <!-- 优惠券信息 -->
    <div class="container-info">
      <div class="red26" :class="fontColor">{{ coupon.couponName }}</div>
      <div class="grey22" :class="fontColor">适用商品: {{ productType }}</div>
      <div class="grey22" :class="fontColor">有效期至{{ coupon.useEndTime.replace(/-/g, '.').replace(/:\d{2}$/, '') }}</div>
    </div>
    <!-- 插槽 -->
    <div class="container-status">
      <span class="grey24">{{ status }}</span>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const { filters } = useInstance();

const props = defineProps({
  coupon: {
    type: Object,
    default: null,
  }
})

const emits = defineEmits(['on-coupon']);

// 优惠券背景图片
const bg = computed(() => {
  let couponBackground;
  switch (props.coupon.couponUseStatus) {
    case "NONE":
      couponBackground = filters.icon('noCoupon');
      break;
    case "NOT_USED":
      couponBackground = filters.icon('saas-coupon-pink');
      break;
    case "USED":
    case "EXPIRED":
      couponBackground = filters.icon('saas-coupon-grey');
      break;
  }

  return {
    background: `url(${couponBackground})`,
    backgroundSize: 'cover'
  };
});

let status = ref("")
let fontColor = ref("")
let productType = ref("") // 适用商品

onMounted(async () => {
  if(props.coupon.couponUseStatus === "NONE"){
    fontColor.value = "hide"
  }else if(props.coupon.couponUseStatus === "USED"){
    status.value = "未使用"
    fontColor.value = "grey"
  }else if(props.coupon.couponUseStatus === "EXPIRED"){
    status.value = "已过期"
    fontColor.value = "grey"
  }
  let productTypeList = []
  for(let item of props.coupon.productApplicableVOList) {
    let prefix = item.isAll ? "" : "部分";
    switch (item.productType) {
      case "BOX_OFFICE_PRODUCT":
        productTypeList.push(prefix + "票房本");break;
      case "GROUP_BUY_PRODUCT":
        productTypeList.push(prefix + "团购商品");break;
      case "APPLY_DRAMA_PRODUCT":
        productTypeList.push(prefix + "申领剧本");break;
      case "VIRTUAL_ITEM_PRODUCT":
        productTypeList.push(prefix + "道具商品");break;
      case "BLIND_BOX_PRODUCT":
        productTypeList.push(prefix + "盲盒商品");break;
      default:
        return "";
    }
  }
  productType.value = productTypeList.join(',')
});

function onClickCoupon(coupon:any){
  emits('on-coupon', coupon);
}

</script>

<style scoped lang="scss">
.container {
  width: 686rpx;
  height: 160rpx;
  margin: 0 auto 20rpx auto;
  @include hor-center;
  position: relative;

  &-discount {
    width: 210rpx;
    height: 90rpx;
    text-align: center;
  }

  &-info {
    width: 274rpx;
    height: 100rpx;
    padding-left: 26rpx;
  }

  &-status {
    width: 176rpx;
    @include hor-center-center;
  }
}

.red44 {
  @include text-custom(800, 44rpx, #EA586F)
}

.red22 {
  @include text-custom(400, 22rpx, #EA586F)
}

.red26 {
  @include text-custom(500, 26rpx, #EA586F)
}

.grey22 {
  @include text-overflow-line(1);
  @include text-custom(400, 22rpx, #928C8E)
}

.grey24 {
  @include text-custom(600, 24rpx, #BCBDC0)
}

.grey {
  color: #BCBDC0
}

.hide {
  display: none;
}
</style>