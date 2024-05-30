<template>
  <div class="container" :class="{flashBreathe: isShaking}" >
    <div class="container-frame" :style="frameCover">
      <image v-if="chooseFlag" class="container-frame-img" :src="filters.icon('silvery-frame')"  mode="aspectFill"/>
      <image v-if="!chooseFlag" class="container-frame-img" :src="filters.icon('golden-frame')"  mode="aspectFill" />
    </div>
    <div v-if="disable" class="container-cover" />
    <swiper class="container-swiper"
            previous-margin="310rpx"
            next-margin="305rpx"
            :current="currentVal"
            @change="swiperChange"
            >
      <swiper-item class="container-swiper-item"
                   v-for="(picture, index) in pictures"
                   :key="index">
        <div class="container-swiper-item-box" :style="[itemStyle(index)]">
          <image class="container-swiper-item-box-img" :src="picture"  mode="aspectFill"/>
        </div>

      </swiper-item>
    </swiper>
  </div>
</template>

<script setup lang="ts">
const {api, myApi, dayjs, filters, getColor, menuButtonRect} = useInstance();


let pictures = [
  'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230628/124fff0f-9184-4dc1-a7a0-2c7b7ca04e71/%E4%BA%95%E5%B7%9D%E4%B8%8D%E7%BE%8E.png',
  'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230628/b7cce87a-1444-4f29-ac39-0901227fa5cf/%E7%BE%8E%E6%9C%A8%E9%A6%99%E8%87%B3.png',
  'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230628/ac253564-6a8d-4587-8520-c447206cdc7d/%E5%B9%B3%E5%B2%97%E5%8F%B72.png',
  'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230628/4c9fe0c1-b618-47d0-a1fa-0a418ae14923/%E7%94%B0%E4%B8%AD%E8%AF%9A.png',
  'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230628/0ba3bb94-2f35-4eb9-9a7c-908f56e59767/%E4%BA%95%E5%B7%9D%E5%8D%83%E5%8F%B6.png',
  'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230628/5475c497-1fa0-4457-a56c-dfce58ad4a95/%E4%BA%95%E5%B7%9D%E5%81%A5.png',
  'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230628/5475c497-1fa0-4457-a56c-dfce58ad4a95/%E4%BA%95%E5%B7%9D%E5%81%A5.png',
]

const props = defineProps({
  icon: Number
});


const isShaking = ref(false);
let currentVal = ref(0);


const emits = defineEmits(['update']);


//切换校色
function swiperChange(e:any ){
  currentVal.value = e.detail.current;
  // console.log("3D-currentVal",currentVal.value)
  //传递参数给父组件
  emits('update', currentVal.value);
  //轻微震动
  uni.vibrateShort({
    success: function () {
      // console.log('vibrate-success');
    }
  });
  //播放音频
  const innerAudioContext = uni.createInnerAudioContext();
  innerAudioContext.autoplay = true;
  innerAudioContext.volume = 1;
  innerAudioContext.src = 'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20240226/073f6a20-07d8-4777-9def-7aca68eb1860/2323.MP3';
  innerAudioContext.onPlay(() => {
    // console.log('start-play');
  });

  // 触发抖动效果
  isShaking.value = true;
  setTimeout(() => {
    // console.log("isShaking--------")
    isShaking.value = false;
  }, 500); // 这里的时间应与动画持续时间一致

}



// 选中边框  覆盖透明图层让用户无法拖动
let disable = computed(() => {
  return props.icon === 2;
})
//  选中边框切换  为金色
let chooseFlag = computed(() => {
  return props.icon !== 2;
})
// 选中边框 图层级别调高  为了覆盖原图片
let frameCover = computed(() => {
  return props.icon === 2 ? {'z-index': '2'} : {};
})

// 样式
let itemStyle = computed(() => {
  return (index: number) => {
    const style: Record<string, any> = {
      transition: 'transform 0.5s ease',
      transformOrigin: '50% 50%',
    };

    if (index === currentVal.value) {
      style.transform = 'scale(0.8) ;';
    }

    if(index + 1 === currentVal.value){
      style.transform = 'scale(0.84) rotateY(30deg)';
    }
    if(index + 2 === currentVal.value){
      style.transform = 'scale(0.88) rotateY(35deg)';
    }
    if(index + 3 === currentVal.value){
      style.transform = 'scale(0.9) rotateY(40deg)';
    }
    if(index - 1 === currentVal.value){
      style.transform = 'scale(0.84) rotateY(-30deg)';
    }
    if(index - 2 === currentVal.value){
      style.transform = 'scale(0.88) rotateY(-35deg)';
    }
    if(index - 3 === currentVal.value){
      style.transform = 'scale(0.9) rotateY(-40deg)';
    }
    return style;
  };
})



onMounted(() => {

})

</script>
<style scoped lang="scss">
@keyframes flashBreathe {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  25% {
    transform: scale(1.05);
    opacity: 0.75;
  }
  75% {
    transform: scale(1.05);
    opacity: 0.75;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.flashBreathe {
  animation: flashBreathe 0.5s ease-in-out both;
}

.container{
  position: relative;
  &-cover{
    position: absolute;
    height: 250rpx;
    width: 100vw;
    background: transparent;
    z-index: 2;
  }
  &-frame{
    position: absolute;
    width: 113rpx;
    height: 206rpx;
    top: 27rpx;
    left: 317rpx;
    &-img{
      width: 100%;
      height: 100%;
    }
  }
  &-swiper{
    height: 250rpx;
    &-item{
      margin-top: 15rpx;
      perspective: 1000px;
      perspective-origin: 50% 50%;
      transform-style: preserve-3d;
      &-box{
        width: 124rpx;
        height: 227rpx;
        border: 2rpx solid rgba(255,255,255,0.6);
        &-img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}

</style>