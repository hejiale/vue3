<template>
    <image :src="filters.icon('icon-load-end')" class="tag" v-if="isImage"></image>
    <div class="noMoreBox" v-else>~全部加载完了~</div>
</template>
<script lang="ts" setup>
const { filters } = useInstance();

const props = defineProps({
  /**
   *  是否使用图片
   */
  isImage: {
    type: Boolean,
    default: false,
  },
});
</script>
<style lang="scss" scoped>
.noMoreBox {
  padding-top: 20rpx;
  height: 100rpx;
  color: #5F6572;
  font-size: 24rpx;
  text-align: center;
}
.tag{
  width: 178rpx;
  height: 48rpx;
  margin-top: 40rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  padding-bottom: 24rpx;
}
</style>