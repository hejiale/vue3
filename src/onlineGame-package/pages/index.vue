<template>

  <div class="container">
    <image class="container-background" :src="background" />

    <cube3d class="container-cube" :cubeSize="190"/>
    <book3d class="container-book"/>


  </div>

</template>
<script setup lang="ts">
import cube3d from '../components/animation/cube-3d.vue';
import book3d from '../components/animation/book-3d.vue';


let background = 'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230711/cf9da8b8-573d-46ac-a551-026cac693b9c/%E7%A4%BE%E6%AD%BB%20%E5%8E%8B%E7%BC%A9.png';


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
  &-cube{
    position: fixed;
    left: 400rpx;
    top: 30rpx;
  }
  &-book{
    position: fixed;
    left: 100rpx;
    top: 70rpx;
  }




}


</style>