<template>
  <div class="container">
    <image class="container-background" :src="background" />
    <image class="container-cover" />
    <div class="container-text">
      <span class="container-text-top">解锁密码{{lockNum}}(位数字)   {{password}}</span>
      <span class="container-text-bottom">输入您要尝试的密码，点击“确定”按钮</span>
    </div>
    <div class="container-swiper">
      <image class="container-swiper-img" :src="filters.icon('lock-panel-bg')" />
      <div class="container-swiper-box">
        <swiperLock :size="lockNum" @update="handleUpdate1"/>
        <swiperLock :size="lockNum" @update="handleUpdate2"/>
        <swiperLock :size="lockNum" @update="handleUpdate3"/>
        <swiperLock :size="lockNum" @update="handleUpdate4"/>
        <swiperLock :size="lockNum" @update="handleUpdate5" v-if="lockNum >= 5"/>
        <swiperLock :size="lockNum" @update="handleUpdate6" v-if="lockNum >= 6"/>
        <swiperLock :size="lockNum" @update="handleUpdate7" v-if="lockNum >= 7"/>
        <swiperLock :size="lockNum" @update="handleUpdate8" v-if="lockNum >= 8"/>
      </div>
    </div>
    <div class="container-confirm">
      <image class="container-confirm-able" :src="filters.icon('lock-able')"  mode="aspectFill"/>
<!--      <image class="container-confirm-able" :src="filters.icon('lock-disable')"  mode="aspectFill"/>-->
    </div>
  </div>
</template>
<script setup lang="ts">
import swiperLock from '../components/animation/swiper-lock.vue';
const {api, myApi, dayjs, filters, getColor, menuButtonRect} = useInstance();


let background = 'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230711/cf9da8b8-573d-46ac-a551-026cac693b9c/%E7%A4%BE%E6%AD%BB%20%E5%8E%8B%E7%BC%A9.png';

// 目前只能写  4  5  6  7  8 因为其余数字，都没有适配组件的尺寸  如果有需要重新构建数字和 反转的长宽高
let lockNum = ref(8)
// lockNum 是几这个password就是几个0
let password = ref("00000000")

function handleUpdate1(val:any) {
  updatePassword(0,val);
  console.log("password",password.value)
}
function handleUpdate2(val:any) {
  updatePassword(1,val);
  console.log("password",password.value)
}
function handleUpdate3(val:any) {
  updatePassword(2,val);
  console.log("password",password.value)
}
function handleUpdate4(val:any) {
  updatePassword(3,val);
  console.log("password",password.value)
}
function handleUpdate5(val:any) {
  updatePassword(4,val);
  console.log("password",password.value)
}
function handleUpdate6(val:any) {
  updatePassword(5,val);
  console.log("password",password.value)
}
function handleUpdate7(val:any) {
  updatePassword(6,val);
  console.log("password",password.value)
}
function handleUpdate8(val:any) {
  updatePassword(7,val);
  console.log("password",password.value)
}

function updatePassword(position: number, value: string) {
  let passwordArray = password.value.split('');
  passwordArray[position] = value;
  password.value = passwordArray.join('');
}

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
  &-cover{
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0,0,0,0.8);
    z-index: -1;
  }
  &-text{
    position: fixed;
    top: 75rpx;
    left: 375rpx;
    @include ver-center-center;
    &-top{
      @include text-custom(400, 15rpx, #FFFFFF);
    }
    &-bottom{
      @include text-custom(400, 13rpx, rgba(255,255,255,0.6));
    }
  }
  &-swiper{
    position: fixed;
    left: 345rpx;
    right: 0;
    top: 118rpx;
    bottom: 0;
    width: 360rpx;
    height: 140rpx;
    &-img{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    &-box{
      position: absolute;
      top: 10rpx;
      left: 15rpx;
      border-radius: 28rpx;
      width: 330rpx;
      height: 120rpx;
      @include hor-between-around;
    }
  }
  &-confirm{
    position: fixed;
    top: 290rpx;
    left: 375rpx;
    width: 74rpx;
    height: 24rpx;
    &-able{
      width: 74rpx;
      height: 24rpx;
    }
  }
}


</style>