<template>
  <div class="container">
    <div class="container-cube" :class="{rotate : true}"  :style="cubeStyles">
      <div class="container-cube-front"  :style="frontStyles">
        <image class="container-cube-front-img" :src="frontPic" mode="aspectFill"/>
      </div>
      <div class="container-cube-back" :style="backStyles">
        <image class="container-cube-front-img" :src="backPic" mode="aspectFill"/>
      </div>
      <div class="container-cube-left" :style="leftStyles">
        <image class="container-cube-front-img" :src="leftPic" mode="aspectFill"/>
      </div>
      <div class="container-cube-right" :style="rightStyles">
        <image class="container-cube-front-img" :src="rightPic" mode="aspectFill"/>
      </div>
      <div class="container-cube-top" :style="topStyles">
        <image class="container-cube-front-img" :src="topPic" mode="aspectFill"/>
      </div>
      <div class="container-cube-bottom" :style="bottomStyles">
        <image class="container-cube-front-img" :src="bottomPic" mode="aspectFill"/>
      </div>
    </div>

  </div>
</template>
<script setup lang="ts">


const props = defineProps({
  cubeSize: {
    type: Number,
    default: 100 // 提供一个默认值，例如150
  }
});

let cubeStyles = computed(() => ({
  width: `${props.cubeSize}rpx`,
  height: `${props.cubeSize}rpx`,
}));

let halfSize = computed(() => props.cubeSize / 2);

let frontStyles = computed(() => ({
  transform: `rotateY(0deg) translate3d(0rpx, 0rpx, 0rpx)`,
}));
let backStyles = computed(() => ({
  transform: `rotateY(180deg) translate3d(0rpx, 0rpx, ${props.cubeSize}rpx)`,
}));
let leftStyles = computed(() => ({
  transform: `rotateY(-90deg) translate3d(-${halfSize.value}rpx, 0rpx, ${halfSize.value}rpx)`,
}));
let rightStyles = computed(() => ({
  transform: `rotateY(90deg) translate3d(${halfSize.value}rpx, 0rpx, ${halfSize.value}rpx)`,
}));
let topStyles = computed(() => ({
  transform: `rotateX(90deg) translate3d(0rpx, -${halfSize.value}rpx, ${halfSize.value}rpx)`,
}));
let bottomStyles = computed(() => ({
  transform: `rotateX(-90deg) translate3d(0rpx, ${halfSize.value}rpx, ${halfSize.value}rpx)`,
}));


let frontPic = ref("https://juyyds.oss-cn-hangzhou.aliyuncs.com/20230404/1b34f359-1ce6-482d-a72c-d706b5b88a37/6.png");
let backPic = ref("https://juyyds.oss-cn-hangzhou.aliyuncs.com/20230404/1b34f359-1ce6-482d-a72c-d706b5b88a37/5.png");
let leftPic = ref("https://juyyds.oss-cn-hangzhou.aliyuncs.com/20230404/1b34f359-1ce6-482d-a72c-d706b5b88a37/3.png");
let rightPic = ref("https://juyyds.oss-cn-hangzhou.aliyuncs.com/20230404/1b34f359-1ce6-482d-a72c-d706b5b88a37/2.png");
let topPic = ref("https://juyyds.oss-cn-hangzhou.aliyuncs.com/20230404/1b34f359-1ce6-482d-a72c-d706b5b88a37/1.png");
let bottomPic = ref("https://juyyds.oss-cn-hangzhou.aliyuncs.com/20230404/1b34f359-1ce6-482d-a72c-d706b5b88a37/4.png");






</script>
<style scoped lang="scss">
@keyframes rotateCube {
  from {
    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
  }
  to {
    transform: rotateX(360deg) rotateY(720deg) rotateZ(360deg);
  }
}
.rotate{
  animation: rotateCube 10s ease-in-out infinite;
}

.container{
  position: relative;
  &-cube{
    position: absolute;
    top: 0;
    left: 0;
    transform-style: preserve-3d;
    transform: rotateX(-25deg) rotateY(36deg) rotateZ(0deg) translate3d(0rpx, 0rpx, 0rpx);
    &-front{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      &-img{
        width: 100%;
        height: 100%;
      }
    }
    &-back{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      &-img{
        width: 100%;
        height: 100%;
      }
    }
    &-left{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      &-img{
        width: 100%;
        height: 100%;
      }
    }
    &-right{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      &-img{
        width: 100%;
        height: 100%;
      }
    }
    &-top{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      &-img{
        width: 100%;
        height: 100%;
      }
    }
    &-bottom{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      &-img{
        width: 100%;
        height: 100%;
      }
    }
  }



}
</style>