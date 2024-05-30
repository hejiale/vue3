<template>
  <div class="container" :style="{ width: computedWidth, height: computedHeight }">
    <swiper class="container-swiper" :style="{ width: computedWidth, height: computedHeight }"
            circular="true"
            vertical="true"
            :current="currentVal"
            @change="swiperChange">
      <swiper-item class="container-swiper-item" :style="{ width: computedWidth, height: computedHeight }"
                   v-for="index in 10"
                   :key="index - 1">
        <div class="container-swiper-item-box" :style="{ width: computedWidth, height: computedHeight }">
          <image class="container-swiper-item-box-img" :src="filters.icon('lock-background')" :style="{ width: computedWidth, height: computedHeight }"/>
          <span class="container-swiper-item-box-text">{{index - 1}}</span>
        </div>
      </swiper-item>
    </swiper>
  </div>
</template>
<script setup lang="ts">
const {api, myApi, dayjs, filters, getColor, menuButtonRect} = useInstance();

const props = defineProps({
  size: Number
});


const emits = defineEmits(['update']);

let currentVal = ref(0);
function swiperChange(e:any ){
  currentVal.value = e.detail.current;
  //播放音频
  const innerAudioContext = uni.createInnerAudioContext();
  innerAudioContext.autoplay = true;
  innerAudioContext.volume = 1;
  innerAudioContext.src = 'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20240226/073f6a20-07d8-4777-9def-7aca68eb1860/2323.MP3';
  innerAudioContext.onPlay(() => {
    // console.log('start-play');
  });
  //传递参数给父组件
  emits('update', currentVal.value);
}

let computedWidth = computed(() => {
  switch (props.size) {
    case 4:
      return '53rpx';
    case 5:
      return '48rpx';
    case 6:
      return '40rpx';
    case 7:
      return '40rpx';
    case 8:
      return '38rpx';
  }
});
let computedHeight = computed(() => {
  switch (props.size) {
    case 4:
      return '83rpx';
    case 5:
      return '81rpx';
    case 6:
      return '79rpx';
    case 7:
      return '78rpx';
    case 8:
      return '77rpx';
  }
});




</script>
<style scoped lang="scss">
.container{
  &-swiper{
    &-item{
      &-box{
        position: relative;
        @include hor-center-center;
        &-img{
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 10rpx;
        }
        &-text{
          @include text-custom(500, 59rpx, #2B3030);
          z-index: 2;
        }
      }
    }
  }
}
</style>
