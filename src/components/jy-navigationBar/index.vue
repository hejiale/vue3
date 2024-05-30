<template>
  <div
    class="navigationBar"
    :style="{
      'padding-top': menuRect.top + 'px',
      'height': barHeight || menuRect.height + 'px',
      'background': background,
      'position': position
    }"
  >
    <image :src="bgImage" class="bg"></image>
    <slot name="content"></slot>
  </div>
  <div class="view" :style="{'top': menuRect.top + (barHeight || menuRect.height) + 'px'}">
    <slot name="view"></slot>
  </div>
</template>
<script setup lang="ts">
const { menuButtonRect } = useInstance();

let menuRect: any = reactive({});

const props = defineProps({
  barHeight: {
    type: Number,
    default: "",
  },
  background: {
    type: String,
    default: "unset",
  },
  bgImage: {
    type: String,
    default: "",
  },
  position: {
    type: String,
    default: 'fixed'
  }
});

onMounted(async () => {
  Object.assign(menuRect, await menuButtonRect());
});
</script>
<style lang="scss" scoped>
.navigationBar {
  left: 0;
  right: 0;
  top: 0;
  z-index: 10;
  padding-top: 96rpx;
  .bg {
    @include abs-center;
    z-index: -1;
  }
}
.view{
  position: fixed;
  left: 0px;
  right: 0px;
  top: 160rpx;
  bottom: 0px;
  overflow-y: scroll;
}
</style>