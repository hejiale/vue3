<template>
  <div class="container">
    <div class="box" v-for="index in 8" :key="index" :style="{ top: circleTop(index), left: circleLeft(index) }">
      <div class="box-circle"></div>
      <div class="box-name">{{index}}剧游宇宙</div>
    </div>
  </div>
</template>
<script setup lang="ts">


// 计算每个小圆点在圆周上的角度
const angleInterval = (2 * Math.PI) / 8; // 12等分，单位是弧度

// 根据索引计算每个小圆点的 top 值
const circleTop = (index:any) => {
  const radius = 370; // 圆的半径
  const angle = index * angleInterval;
  //微调 中间数值改变位置
  return `calc(50% - 20rpx - ${radius * Math.sin(angle)}rpx)`;
};

// 根据索引计算每个小圆点的 left 值
const circleLeft = (index:any) => {
  const radius = 370; // 圆的半径
  const angle = index * angleInterval;
  //微调 中间数值改变位置
  return `calc(50% - 45rpx + ${radius * Math.cos(angle)}rpx)`;
};


</script>
<style scoped lang="scss">
.container {
  height: 544rpx;
  width: 544rpx;
  border-radius: 50%;
  //background: #1ee9c4;
  position: relative;
  animation: rotateContainer 30s linear infinite; /* 顺时针旋转容器 */
}

@keyframes rotateContainer {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.box {
  position: absolute;
  width: 40px;
  height: 40px;
  /* 逆时针旋转每个小圆点 */
  animation: rotateCircle 30s linear infinite;
  @include ver-center;
  &-circle{
    width: 12px;
    height: 12px;
    background: #D5AA86;
    border-radius: 50%;
  }
  &-name{
    margin-top: 4rpx;
    @include text-custom(500, 12rpx, #FFFFFF)
  }
}

@keyframes rotateCircle {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-180deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}


</style>