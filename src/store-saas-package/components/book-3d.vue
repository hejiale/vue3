<template>
  <div class="container">
    <div class="container-book" :class="{rotate : true}">
      <div class="container-book-front" :style="frontStyles">
        <image class="container-book-front-img" :src="frontPic" mode="aspectFill"/>
      </div>
      <div class="container-book-back" :style="backStyles">
        <image class="container-book-back-img" :src="backPic" mode="aspectFill"/>
      </div>
      <div class="container-book-left" :style="leftStyles">
        <image class="container-book-left-img" :src="leftPic" mode="aspectFill"/>
      </div>
      <div class="container-book-right" :style="rightStyles">
        <image class="container-book-right-img" :src="filters.icon('book-right')" mode="aspectFill"/>
      </div>
      <div class="container-book-top" :style="topStyles">
        <image class="container-book-top-img" :src="filters.icon('book-top')" mode="aspectFill"/>
      </div>
      <div class="container-book-bottom" :style="bottomStyles">
        <image class="container-book-bottom-img" :src="filters.icon('book-top')" mode="aspectFill"/>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const {api, myApi, dayjs, filters, getColor, menuButtonRect} = useInstance();


const props = defineProps({
  width: {
    type: Number,
    default: 75
  },
  height: {
    type: Number,
    default: 100
  },
  depth: {
    type: Number,
    default: 15
  },
  cover: {
    type: String,
    default: ''
  }
});

let halfDepth = computed(() => props.depth / 2);

let frontStyles = computed(() => ({
  width: `${props.width}rpx`,
  height: `${props.height}rpx`,
  transform: `rotateY(0deg) translate3d(0rpx, 0rpx, 0rpx)`,
}));
let backStyles = computed(() => ({
  width: `${props.width}rpx`,
  height: `${props.height}rpx`,
  transform: `rotateY(180deg) translate3d(0rpx, 0rpx, ${props.depth}rpx)`,
}));
let leftStyles = computed(() => ({
  width: `${props.depth}rpx`,
  height: `${props.height}rpx`,
  transform: `rotateY(-90deg) translate3d(-${halfDepth.value}rpx, 0rpx, ${halfDepth.value}rpx)`,
}));
let rightStyles = computed(() => ({
  width: `${props.depth}rpx`,
  height: `${props.height}rpx`,
  transform: `rotateY(90deg) translate3d(${halfDepth.value}rpx, 0rpx, ${props.width - halfDepth.value}rpx)`,
}));
let topStyles = computed(() => ({
  width: `${props.width}rpx`,
  height: `${props.depth}rpx`,
  transform: `rotateX(90deg) translate3d(0rpx, -${halfDepth.value}rpx, ${halfDepth.value}rpx)`,
}));
let bottomStyles = computed(() => ({
  width: `${props.width}rpx`,
  height: `${props.depth}rpx`,
  transform: `rotateX(-90deg) translate3d(0rpx, ${halfDepth.value}rpx, ${props.height - halfDepth.value}rpx)`,
}));


let frontPic = ref("https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230105/2cf44b13812d4630bee44e5b87c5f6c8/微信图片_20230105110529.jpg");
let backPic = ref("https://juyyds.oss-cn-hangzhou.aliyuncs.com/20230404/1b34f359-1ce6-482d-a72c-d706b5b88a37/5.png");
let leftPic = ref("https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20240301/c49a6e76-444a-4814-828d-f90482dadbf4/bookright.png");
let rightPic = ref("https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20240301/c49a6e76-444a-4814-828d-f90482dadbf4/bookright.png");
let topPic = ref("https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20240301/199213d2-8bf4-4edb-91f5-cd777e05a31d/booktop.png");
let bottomPic = ref("https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20240301/199213d2-8bf4-4edb-91f5-cd777e05a31d/booktop.png");

onMounted(async () => {
  frontPic.value = props.cover;
});


</script>
<style scoped lang="scss">

@keyframes rotateRectangular  {
  from {
    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
  }
  to {
    transform: rotateX(-10deg) rotateY(-10deg) rotateZ(5deg);
  }
}
.rotate{
  animation: rotateRectangular 2s ease-in-out;
}
.container{
  position: relative;
  width: 100rpx;
  height: 100rpx;
  &-book{
    position: absolute;
    top: 0;
    left: 0;
    transform-style: preserve-3d;
    transform: rotateX(-10deg) rotateY(-10deg) rotateZ(5deg) translate3d(0rpx, 0rpx, 0rpx);
    &-front{
      position: absolute;
      top: 0;
      left: 0;
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
      transform-style: preserve-3d;
      &-img{
        width: 100%;
        height: 100%;
      }
    }

  }
}
</style>