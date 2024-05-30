<template>
  <div class="container">
    <image class="container-background" :src="background" />
    <div class="container-top" :style="topStyle">
      <span class="container-top-top">《剧本名称》</span>
      <span class="container-top-bottom">房间编号:1111111111111</span>
    </div>
    <div class="container-icon" :style="iconStyle">
      <image class="container-icon-img" :src="filters.icon('refresh')"  mode="aspectFill"/>
    </div>

    <div class="container-swiper">
      <swiper3 @update="handleUpdate" :icon="icon"/>
    </div>
    <div class="container-smallSwiper">
      <swiperCircular :currentVal="currentIndex"/>
    </div>
    <div class="container-confirm">
      <image v-if="icon === 1" class="container-confirm-img" :src="filters.icon('choose-character')"  mode="aspectFill" @click="confirmChoose"/>
      <image v-if="icon === 2" class="container-confirm-img" :src="filters.icon('cancel-choose')"  mode="aspectFill" @click="cancelChoose"/>
      <image v-if="icon === 3" class="container-confirm-img" :src="filters.icon('choose-character-disable')" mode="aspectFill"/>
    </div>
  </div>
</template>
<script setup lang="ts">
import swiper3 from '../components/animation/swiper-3d.vue';
import swiperCircular from '../components/animation/swiper-circular.vue';
const {api, myApi, dayjs, filters, getColor, menuButtonRect} = useInstance();

let background = 'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230711/cf9da8b8-573d-46ac-a551-026cac693b9c/%E7%A4%BE%E6%AD%BB%20%E5%8E%8B%E7%BC%A9.png';
// 1选择角色  2取消选择  3选择角色-灰色
let icon = ref(1)



// 当前swiper-3D索性
let currentIndex = ref(0);
function handleUpdate(val:any) {
  // 当前swiper-3D index 从子组件获得
  currentIndex.value = val;
  // console.log("father-currentIndex",currentIndex.value)
}

function confirmChoose(){
  icon.value = 2
  playMusic();
  console.log("confirmChoose",icon.value)
}
function cancelChoose(){
  icon.value = 1
  playMusic();
  console.log("cancelChoose",icon.value)
}

function playMusic(){
  //播放音频
  const innerAudioContext = uni.createInnerAudioContext();
  innerAudioContext.autoplay = true;
  innerAudioContext.volume = 10;
  innerAudioContext.src = 'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20240223/30fbcd10-b68d-4b4a-a566-a55bc1e414c1/aaa.MP3';
  innerAudioContext.onPlay(() => {
    // console.log('start-play');
  });
}

let topStyle = ref('')
let iconStyle = ref('')
onLoad(async () => {
  let menuRect:any = await menuButtonRect();
  topStyle.value = `top : ${menuRect.top}px`;
  let leftPosition = menuRect.left - 60;
  iconStyle.value = `top: ${menuRect.top}px; left: ${leftPosition}px;`;
})


</script>
<style scoped lang="scss">
.container{
  position: relative;
  &-top{
    position: fixed;
    width: 240rpx;
    height: 40rpx;
    left: 50%;
    right: 0;
    bottom: 0;
    transform: translateX(-50%);
    @include ver-center-center;
    &-top{
      @include text-custom(500, 13rpx, #F7CB3F)
    }
    &-bottom{
      @include text-custom(400, 11rpx, #FFFFFF)
    }
  }
  &-icon{
    position: fixed;
    width: 45rpx;
    height: 26rpx;
    right: 0;
    bottom: 0;
    &-img{
      width: 45rpx;
      height: 26rpx;
    }
  }
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
  &-swiper{
    position: fixed;
    left: 0;
    right: 0;
    top: 37rpx;
    bottom: 0;
  }
  &-smallSwiper{
    position: fixed;
    left: 490rpx;
    right: 0;
    top: 290rpx;
    bottom: 0;
  }
  &-confirm{
    position: fixed;
    left: 300rpx;
    right: 0;
    top: 280rpx;
    bottom: 0;
    width: 146rpx;
    @include ver-center;
    &-img{
      width: 146rpx;
      height: 55rpx;
    }
    &-text{
      @include text-custom(400, 11rpx, #FFFFFF)
    }
  }

}


</style>