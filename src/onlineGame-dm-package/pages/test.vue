<template>
  <div class="container">
    <image :src="filters.icon('match-background')" mode="aspectFill"/>
    <ring1 class="container-ring1"/>// 12
    <ring2 class="container-ring2"/>// 8
    <ring3 class="container-ring3"/>// 8
    <ring4 class="container-ring4"/>//12
    <ring5 class="container-ring5"/>// 8
    <ring6 class="container-ring6"/>// 8
  </div>
</template>
<script setup lang="ts">
const { filters, homeApi, getColor, enums } = useInstance();
import ring1 from '../components/ring1.vue';
import ring2 from '../components/ring2.vue';
import ring3 from '../components/ring3.vue';
import ring4 from '../components/ring4.vue';
import ring5 from '../components/ring5.vue';
import ring6 from '../components/ring6.vue';





</script>
<style scoped lang="scss">
.container{
  height: 100vh;
  width: 100vw;
  position: fixed;
  left: 0;
  top: 0;
  &-ring1, &-ring2, &-ring3{
    position: absolute;
    top: 194rpx;
    left: 8rpx;
  }
  &-ring4, &-ring5, &-ring6{
    position: absolute;
    top: 936rpx;
    left: -183rpx;
  }
}



</style>