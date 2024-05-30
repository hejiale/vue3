<template>
  <div class="container">
    <!--  头部BOX  -->
    <div class="container-head">
      <div class="container-head-top">
        <span class="container-head-top-text">我的打本生涯</span>
      </div>
      <div class="container-head-bottom" >
        <div class="container-head-bottom-first">
          <div class="container-head-bottom-first-top">
            <span class="container-head-bottom-first-top-content" >{{myPlayInfo.wantPlayDramaNum}}</span>
            <span class="container-head-bottom-first-top-text ml4" >本</span>
          </div>
          <div class="container-head-bottom-first-bottom">想玩剧本</div>
        </div>
        <div class="container-head-bottom-second">
          <div class="container-head-bottom-first-top">
            <span class="container-head-bottom-first-top-content" >{{myPlayInfo.playedDramaNum}}</span>
            <span class="container-head-bottom-first-top-text ml4" >本</span>
          </div>
          <div class="container-head-bottom-first-bottom">玩过的剧本</div>
        </div>
        <div class="container-head-bottom-third">
          <div class="container-head-bottom-first-top">
            <span class="container-head-bottom-first-top-content" >{{myPlayInfo.playedStoreNum + myPlayInfo.playedStoreNum}}</span>
            <span class="container-head-bottom-first-top-text ml4" >家</span>
          </div>
          <div class="container-head-bottom-first-bottom">店铺足迹</div>
        </div>
      </div>
    </div>
    <!--  daily life 组件  -->
    <div class="container-dailyLife">
      <daily-life :myDailyLifeList="myDailyLifeList"/>
    </div>
  </div>



</template>
<script setup lang="ts">
import dailyLife from "./dailyLife.vue"

const props = defineProps({
  /**
   * 剧评列表
   */
  myDailyLifeList: {
    type: Object,
    default: () => {},
  },
  myPlayInfo:{
  }
})


</script>
<style scoped lang="scss">
.container{
  padding-left: 10rpx;
  padding-right: 10rpx;
  padding-top: 10rpx;
  &-head{
    width: calc(100vw - 20rpx);
    height: 236rpx;
    border-radius: 44rpx;
    margin-bottom: 40rpx;
    background: #FFFFFF;
    &-top{
      height: 80rpx;
      margin-left: 32rpx;
      position: relative;
      &-text{
        position: absolute;
        top: 30rpx;
        @include text-custom(500, 34rpx, #111111);
      }
    }
    &-bottom{
      height: 156rpx;
      width: calc(100vw - 20rpx);
      @include hor;
      &-first, &-second, &-third{
        height: 156rpx;
        width: calc((100vw - 20rpx)/3);
        border-radius: 24rpx;
        @include ver-center-center;
        &-top{
          &-content{
            @include text-custom(500, 40rpx, #111111)
          }
          &-text{
            @include text-custom(400, 28rpx, #A1A1A1)
          }
        }
        &-bottom{
          @include text-custom(400, 28rpx, #A1A1A1)
        }
      }
    }
  }
  &-dailyLife{
    width: calc(100vw - 20rpx);
  }
}



</style>