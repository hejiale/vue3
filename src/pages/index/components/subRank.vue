<template>
    <div class="subRankBox" @click="onGoRankCharts">
      <image :src="filters.icon('rank-top-bg')" class="subRankBox-bg"/>
      <div class="subRankBox-rankList">
        <span class="subRankBox-rankList-title" :class="rankStyle(idx)" v-for="(rank,idx) in rankingList" :key="rank.id"><span class="mr6">{{ idx + 1 }}</span> {{ rank.dramaName }}</span>
        <span class="subRankBox-rankList-title">……</span>
      </div>
    </div>
  </template>
  <script setup lang="ts">
  const { filters} = useInstance();
  
  const props = defineProps({
    /**
     * 排行榜列表
     */
    rankingList: {
      type: Array<any>,
      default: () => [],
    }
  })
  
  //排行榜样式
  const rankStyle = computed(() => (index: number) => {
    return index === 0 ? 'firstColor': (index === 1 ? 'secondColor': (index === 2 ? 'thirdColor':''));
  });

  onMounted(async() => {
  });

  //跳转排行榜
function onGoRankCharts(){
  uni.navigateTo({
    url: '/rank-charts/pages/index'
  })
}
  
  </script>
  <style lang="scss" scoped>
  .subRankBox {
    background: #fff;
    width: calc((100vw - 66rpx)/2);
    height: 630rpx;
    border-radius: 12rpx;
    &-bg{
      width: 100%;
      height: 212rpx;
    }
    &-rankList{
      margin-top: 14rpx;
      margin-left: 18rpx;
      @include ver;
      &-title{
        @include text-middle(24rpx, #2E323E);
        @include text-overflow-line(1);
        line-height: 30rpx;
        margin-bottom: 4rpx;
        width: 90%;
      }
      .firstColor{
        color: #F83131;
      }
      .secondColor{
        color: #FF7A00;
      }
      .thirdColor{
        color: #D27E1B;
      }
    }
  }
  </style>  