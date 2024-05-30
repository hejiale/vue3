<template>
  <div class="container">
    <div class="container-cover"></div>
    <swiper class="container-swiper"
            previous-margin="108rpx"
            next-margin="102rpx"
            :current="currentVal">
      <swiper-item class="container-swiper-item"
                   v-for="(picture, index) in pictures"
                   :key="index">
        <div class="container-swiper-item-box"  :style="[itemStyle(index)]">
          <image class="container-swiper-item-box-img" :src="picture"  mode="aspectFill"/>
        </div>
      </swiper-item>
    </swiper>
  </div>
</template>
<script setup lang="ts">

let pictures = [
  'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230628/124fff0f-9184-4dc1-a7a0-2c7b7ca04e71/%E4%BA%95%E5%B7%9D%E4%B8%8D%E7%BE%8E.png',
  'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230628/b7cce87a-1444-4f29-ac39-0901227fa5cf/%E7%BE%8E%E6%9C%A8%E9%A6%99%E8%87%B3.png',
  'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230628/ac253564-6a8d-4587-8520-c447206cdc7d/%E5%B9%B3%E5%B2%97%E5%8F%B72.png',
  'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230628/4c9fe0c1-b618-47d0-a1fa-0a418ae14923/%E7%94%B0%E4%B8%AD%E8%AF%9A.png',
  'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230628/0ba3bb94-2f35-4eb9-9a7c-908f56e59767/%E4%BA%95%E5%B7%9D%E5%8D%83%E5%8F%B6.png',
  'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230628/5475c497-1fa0-4457-a56c-dfce58ad4a95/%E4%BA%95%E5%B7%9D%E5%81%A5.png',
  'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230628/5475c497-1fa0-4457-a56c-dfce58ad4a95/%E4%BA%95%E5%B7%9D%E5%81%A5.png',
]
// 定义接收的props
const props = defineProps({
  currentVal: Number
});


let itemStyle = computed(() => {
  return (index: number) => {
    const style: Record<string, any> = {
      transition: 'transform 0.5s ease',
      transformOrigin: '50% 50%',
    };
    if (index === props.currentVal) {
      style.transform = 'scale(1) ;';
    }else{
      style.transform = 'scale(0.75) ;';
    }
    return style;
  };

});


</script>
<style scoped lang="scss">
.container{
  position: relative;
  &-cover{
    position: absolute;
    height: 45rpx;
    width: 250rpx;
    background: transparent;
    z-index: 2;
  }
  &-swiper{
    height: 45rpx;
    width: 250rpx;
    &-item{
      margin-top: 5rpx;
      &-box{
        //width: 19rpx;
        //height: 19rpx;
        width: 30rpx;
        height: 30rpx;
        border: 2rpx solid rgba(255,255,255,0.6);
        border-radius: 50%;
        &-img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

    }
  }
}


</style>