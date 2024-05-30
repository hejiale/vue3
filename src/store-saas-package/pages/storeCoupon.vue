<template>
  <!-- 导航栏 -->
  <div class="navBar">
    <div class="navBar-item" :class="{ active: activeMenu === idx }" v-for="(item, idx) in menus" :key="idx" @click="onChangeTab(idx)">{{ item }}</div>
  </div>
  <!-- 文字提示 -->
  <div class="tips">
    <span>优惠券过锁定时间，将自动退回未使用状态</span>
  </div>
  <!-- 轮播图实现屏幕切换 -->
  <swiper class="swiperBox" :current="activeMenu" @change="onChangeSwiper">
    <swiper-item class="swiperBox-item" v-for="(item,idx) in couponStatus" :key="idx">
      <couponScroll :couponStatus="item"></couponScroll>
    </swiper-item>
  </swiper>
  <!-- 底部按键 -->
  <div class="tabBar">
    <div class="tabBar-btn">
      <span>有问题,联系客服</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import couponScroll from "../components/couponScroll.vue"

let menus = ["未使用", "已使用", "已过期"]; //导航栏
let activeMenu = ref(0); //控制导航栏和轮播图状态
let couponStatus = [ "CAN_USE", "USED", "EXPIRED" ]; //优惠券状态

/*点击导航栏更换轮播图*/
function onChangeTab(tab: number) {
  activeMenu.value = tab;
}

/*滑动轮播图同步导航栏*/
function onChangeSwiper(e: any) {
  activeMenu.value = e.detail.current;
}
</script>

<style scoped lang="scss">
.navBar {
  width: 100%;
  height: 58rpx;
  border-bottom: 1rpx solid #EFEFEF;
  margin-top: 28rpx;
  @include hor-between-around;

  &-item {
    @include text-custom(400,30rpx,#959AA5);
  }

  .active {
    position: relative;
    animation: pulse;
    animation-duration: 1s;
    @include text-custom(400,30rpx,#2E323E);
  }

  .active::before {
    position: absolute;
    left: 50%;
    bottom: -10rpx;
    width: 32rpx;
    height: 4rpx;
    background: #2E323E;
    content: "";
    transform: translateX(-50%);
  }
}

.tips {
  width: 686rpx;
  margin: 32rpx auto 0 auto;
  @include text-custom(400,24rpx,#959AA5);
}

.swiperBox {
  width: 100%;
  height: calc( 100vh - 345rpx); //轮播图高度
  margin-top: 24rpx;
}

.tabBar {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 168rpx;
  box-shadow: 0rpx -2rpx 20rpx 0rpx rgba(0,0,0,0.07);

  &-btn {
    width: 670rpx;
    height: 88rpx;
    border: 2rpx solid #D9D9D9;
    margin: 24rpx auto 0 auto;
    border-radius: 24rpx;
    @include hor-center-center;
    @include text-custom(500,28rpx,#5F6572);
  }

  &-btn:active {
    background: rgba(0, 0, 0, 0.1);
  }
}
</style>