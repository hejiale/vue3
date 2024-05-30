<template>
  <div class="container">
    <div class="container-evaluate" v-for="item in evaluates" :key="item.id">
      <image class="container-evaluate-image" :src="item.fileUrl" mode="aspectFill"/>
      <div class="container-evaluate-content">{{item.content}}</div>
      <div class="container-evaluate-bottom">
        <div class="container-evaluate-bottom-left">
          {{dayjs(item.createdTime).format("MM-DD")}} 发布
        </div>
        <div class="container-evaluate-bottom-right">
          <image v-if="item.isPraise" class="container-evaluate-bottom-right-image" :src="filters.icon('icon-like')"/>
          <image v-else class="container-evaluate-bottom-right-image" :src="filters.icon('icon-unLike')"/>
          <span class="container-evaluate-bottom-right-text">{{item.praiseQuantity}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const { api, myApi, filters, dayjs } = useInstance();
const props = defineProps({
  /**
   * 剧评列表
   */
  evaluates: {
    type: Array<any>,
    default: () => [],
  },
})



</script>
<style scoped lang="scss">
.container{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-left: 10rpx;
  padding-right: 10rpx;
  &-evaluate{
    width: calc((100vw - 30rpx) / 2);
    border-radius: 24rpx;
    background: #FFFFFF;
    margin-bottom: 10rpx;
    @include ver-center;
    &-image{
      width: calc((100vw - 30rpx) / 2);;
      height: 496rpx;
      border-radius: 24rpx;
      opacity: 1;
    }
    &-content{
      width: 332rpx;
      height: 96rpx;
      line-height: 48rpx;
      @include text-overflow-line(2);
      @include text-custom(500, 30rpx, #111111)
    }
    &-bottom{
      width: 332rpx;
      height: 96rpx;
      @include hor-between-center;
      &-left{
        @include text-custom(400, 24rpx, #666666)
      }
      &-right{
        transform: translateY(-20%);
        &-text{
          @include text-custom(400, 24rpx, #666666)
        }
        &-image{
          width: 31rpx;
          height: 31rpx;
        }
      }
    }
  }

}



</style>