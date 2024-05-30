<template>
  <div class="container">
    <image class="container-background" :src="background" />
    <movable-area class="container-movable">
      <div class="container-movable-grid">
        <div class="container-movable-grid-content" :style="gridStyle">
          <div class="container-movable-grid-content-unit" v-for="index in widthNum * heightNum" :key="index"></div>
        </div>
      </div>
      <div class="container-movable-pic">
        <image class="container-movable-pic-bg" :src="filters.icon('jigsaw-puzzle')"  mode="aspectFill"/>
        <div class="container-movable-pic-text">已经获得的碎片</div>
        <div class="container-movable-pic-content">
          <div />
          <movable-view class="container-movable-pic-content-move"
                        v-for="(pic, index) in pics"
                        :key="index"
                        :x="picXPositions[index]"
                        :y="picYPositions[index]"
                        @change="(event) => bindchange(index, event)"
                        direction="all">
            <image class="container-movable-pic-content-move-img" :src="pic" />
          </movable-view>
        </div>
      </div>
    </movable-area>
  </div>
</template>

<script setup lang="ts">
const {api, myApi, dayjs, filters, getColor, menuButtonRect} = useInstance();



let background = 'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230711/cf9da8b8-573d-46ac-a551-026cac693b9c/%E7%A4%BE%E6%AD%BB%20%E5%8E%8B%E7%BC%A9.png';

let pics = ref([
  "https://juyyds.oss-cn-hangzhou.aliyuncs.com/20230404/1b34f359-1ce6-482d-a72c-d706b5b88a37/6.png",
  "https://juyyds.oss-cn-hangzhou.aliyuncs.com/20230404/1b34f359-1ce6-482d-a72c-d706b5b88a37/5.png",
  "https://juyyds.oss-cn-hangzhou.aliyuncs.com/20230404/1b34f359-1ce6-482d-a72c-d706b5b88a37/3.png",
  "https://juyyds.oss-cn-hangzhou.aliyuncs.com/20230404/1b34f359-1ce6-482d-a72c-d706b5b88a37/2.png",
  "https://juyyds.oss-cn-hangzhou.aliyuncs.com/20230404/1b34f359-1ce6-482d-a72c-d706b5b88a37/1.png",
  "https://juyyds.oss-cn-hangzhou.aliyuncs.com/20230404/1b34f359-1ce6-482d-a72c-d706b5b88a37/4.png",
])



let widthNum = ref(3)
let heightNum = ref(4)
let gridStyle = computed(() => ({
  width: `${widthNum.value * 50}rpx`, // 计算宽度
  height: `${heightNum.value * 50}rpx` // 计算高度
  // 375  //812
}));



let screenWidth = wx.getSystemInfoSync().windowWidth;
let screenHeight = wx.getSystemInfoSync().windowHeight;

// 定义转换函数
function rpxWidthToPx(rpx:number) {
  return rpx * screenWidth / 812;
}
function rpxHeightToPx(rpx:number) {
  return rpx * screenHeight / 375;
}



let picXPositions = ref(pics.value.map(() => 100));
let picYPositions = ref(pics.value.map(() => 20));



const bindchange = (index: number, event: { detail: { x: number; y: number; } }) => {
  console.log("index", index, "x", event.detail.x, "y", event.detail.y)
  switch(index) {
    case 0:
      // 代码块 for index 0
      console.log('处理 index 为 0 的情况');
      break;
    case 1:
      // 代码块 for index 1
      console.log('处理 index 为 1 的情况');
      break;
    case 2:
      // 代码块 for index 2
      console.log('处理 index 为 2 的情况');
      break;
    case 3:
      // 代码块 for index 3
      console.log('处理 index 为 3 的情况');
      break;
    case 4:
      // 代码块 for index 4
      console.log('处理 index 为 4 的情况');
      break;
    case 5:
      // 代码块 for index 5
      console.log('处理 index 为 5 的情况');
      break;
    case 6:
      // 代码块 for index 6
      console.log('处理 index 为 6 的情况');
      break;
    case 7:
      // 代码块 for index 7
      console.log('处理 index 为 7 的情况');
      break;
    case 8:
      // 代码块 for index 8
      console.log('处理 index 为 8 的情况');
      break;
  }
};

let oneX = ref(460)
let oneY = ref(170)

let twoX = ref(520)
let twoY = ref(170)

let threeX = ref(580)
let threeY = ref(170)

let fourX = ref(640)
let fourY = ref(170)

let fiveX = ref(460)
let fiveY = ref(230)

let sixX = ref(520)
let sixY = ref(230)

let sevenX = ref(580)
let sevenY = ref(230)

let eightX = ref(640)
let eightY = ref(230)

onMounted(() => {
  pics.value.forEach((_, index) => {
    setTimeout(() => {
      picXPositions.value[0] = oneX.value;
      picYPositions.value[0] = oneY.value;

      picXPositions.value[1] = twoX.value;
      picYPositions.value[1] = twoY.value;

      picXPositions.value[2] = threeX.value;
      picYPositions.value[2] = threeY.value;

      picXPositions.value[3] = fourX.value;
      picYPositions.value[3] = fourY.value;

      picXPositions.value[4] = fiveX.value;
      picYPositions.value[4] = fiveY.value;

      picXPositions.value[5] = sixX.value;
      picYPositions.value[5] = sixY.value;

      picXPositions.value[6] = sevenX.value;
      picYPositions.value[6] = sevenY.value;

      picXPositions.value[7] = eightX.value;
      picYPositions.value[7] = eightY.value;

    }, index * 1000);
  });
});


</script>
<style scoped lang="scss">
.container{
  position: relative;
  &-background{
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -2;
  }
  &-movable{
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    @include hor;
    &-grid{
      width: 50vw;
      height: 100vh;
      @include ver-center-center;
      &-content{
        border-radius: 6rpx 6rpx 6rpx 6rpx;
        border: 2rpx solid;
        border-color: #DBC17D #866829;
        @include hor;
        flex-wrap: wrap;
        &-unit{
          width: 50rpx;
          height: 50rpx;
          background: #1B1B1A;
          border-radius: 6rpx 6rpx 6rpx 6rpx;
        }
      }
    }
    &-pic{
      width: 50vw;
      height: 100vh;
      &-bg{
        width: 200rpx;
        height: 95rpx;
        margin-left: 50rpx;
      }
      &-text{
        margin-top: 30rpx;
        margin-left: 50rpx;
        @include text-custom(400, 12rpx, #FFFFFF);
      }
      &-content{
        &-move{
          height: 50px;
          width: 50px;
          &-img{
            height: 100%;
            width: 100%;
          }
        }
      }
    }
  }
}
</style>