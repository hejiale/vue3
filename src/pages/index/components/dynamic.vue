<template>
  <div class="dynamicBox" @click="onGoDynamicDetail">
    <image :src="filters.processLogo(dynamic.fileUrl)" mode="aspectFill" class="dynamicBox-coverBox"/>
    <span class="dynamicBox-content">{{ dynamic.content }}</span>
    <div class="dynamicBox-bottom">
      <div class="dynamicBox-bottom-left">
        <image :src="filters.processLogo(dynamic.avatar)" mode="aspectFill" class="dynamicBox-bottom-left-avatar"/>
        <span class="dynamicBox-bottom-left-nickName">{{ dynamic.nickName }}</span>
      </div>
      <div class="dynamicBox-bottom-right" @click.stop="onChangePraise(dynamic)">
        <image :src="filters.icon('icon-like')" class="dynamicBox-bottom-right-like" v-if="dynamic.isPraise"/>
        <image :src="filters.icon('icon-unLike')" class="dynamicBox-bottom-right-like" v-else/>
        <span class="dynamicBox-bottom-right-num">{{ dynamic.praiseQuantity }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const { menuButtonRect, filters, dayjs, aliGetColor, systemInfo, api } = useInstance();

const props = defineProps({
  /**
   * 动态
   */
  dynamic: {
    type: Object,
    default: () => {},
  },
});

onMounted(async () => {});

async function onChangePraise(dynamic: any){
  await api.userPraiseDynamic({
    dynamicType: dynamic.dynamicType,
    statusEnum: dynamic.isPraise ? 'DISABLE': 'ENABLE',
    dynamicId: dynamic.id
  })
  
  dynamic.isPraise ? dynamic.praiseQuantity-- : dynamic.praiseQuantity++;
  dynamic.isPraise = !dynamic.isPraise;
}

//跳转动态详情 或 剧本详情
function onGoDynamicDetail() {
  if(props.dynamic.dynamicType === 1){
    uni.navigateTo({url: '/dynamic-package/pages/detail?id=' + props.dynamic.id})
  }else if(props.dynamic.dynamicType === 3){
    uni.navigateTo({url: '/drama-package/pages/index?dramaId=' + props.dynamic.detail})
  }
}

</script>
<style lang="scss" scoped>
.dynamicBox {
  background: #fff;
  width: calc((100vw - 66rpx) / 2);
  height: 540rpx;
  border-radius: 12rpx;
  overflow: hidden;
  &-coverBox{
    width: 100%;
    height: 376rpx;
  }
  &-content{
    @include text-overflow-line(2);
    @include text-middle(28rpx, #2E323E);
    padding: 18rpx;
    height: 60rpx;
  }
  &-bottom{
    margin-top: 18rpx;
    padding: 0px 18rpx;
    @include hor-between-center;
    &-left{
      @include hor-center;
      &-avatar{
        @include circle(30rpx);
      }
      &-nickName{
        @include text-normal(22rpx, #969BA6);
        margin-left: 6rpx;
        @include text-overflow-line(1);
        width: 80%;
      }
    }
    &-right{
      @include hor-center;
      &-like{
        @include react(28rpx);
      }
      &-num{
        margin-left: 6rpx;
        @include text-normal(22rpx, #939393);
      }
    }
  }
}
</style>  