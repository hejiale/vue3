<template>
  <div class="evaluateBox">
    <div class="evaluateBox-fixed-bg"></div>
    <view class="evaluateBox-scrollBox">
      <Evaluate :evaluateList="evaluateList"></Evaluate>
    </view>
  </div>
</template>
<script setup lang="ts">

const emmits = defineEmits(["changeMenu"]);

const props = defineProps({
  /**
   * 剧评列表
   */
  evaluateList: {
    type: Array<any>,
    default: () => [],
  },
});

</script>
<style lang="scss" scoped>
.evaluateBox {
  position: relative;
  height: 100vh;
  &-fixed-bg{
    @include fixed-center;
    background: #fff;
  }
  &-scrollBox {
    margin-top: 17vh;
    height: 80vh;
  }
}
</style>