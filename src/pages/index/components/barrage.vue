<template>
  <div class="barrageBox">
    <ul
      class="barrage-area"
      v-if="checkPromotionData"
      :style="{ 'margin-left': randomMarginLeft }"
    >
      <li
        class="barrage"
        v-for="item in middleBanner.info.font.slice(0, 3)"
        :key="item"
      >
        {{ item }}
      </li>
    </ul>
    <ul
      class="barrage-area"
      v-if="checkPromotionData"
      :style="{ 'margin-left': randomMarginLeft }"
    >
      <li
        class="barrage"
        v-for="item in middleBanner.info.font.slice(3, 6)"
        :key="item"
      >
        {{ item }}
      </li>
    </ul>
    <ul
      class="barrage-area"
      v-if="checkPromotionData"
      :style="{ 'margin-left': randomMarginLeft }"
    >
      <li
        class="barrage"
        v-for="item in middleBanner.info.font.slice(6, 10)"
        :key="item"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">

const props = defineProps({
  /**
   * 中部banner
   */
  promotionList: {
    type: Array<any>,
    default: () => [],
  },
});

//轮播弹幕
const checkPromotionData = computed(() => {
  return (
    props.promotionList &&
    props.promotionList.length > 1 &&
    props.promotionList[1].activityPromotionList &&
    props.promotionList[1].activityPromotionList[0].info &&
    props.promotionList[1].activityPromotionList[0].info.font
  );
});

const middleBanner = computed(() => {
  return props.promotionList[1].activityPromotionList[0];
});

/*生成0到100之间的随机数*/
const randomMarginLeft = computed(() => {
  const marginLeft = Math.random() * 100;
  return marginLeft + "rpx";
});
</script>
<style lang="scss" scoped>
.barrageBox{
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 80rpx;
    overflow: hidden;
}
.barrage-area {
  // width: 100%;
  display: flex;
  flex-direction: row;
  white-space: pre;
  margin-top: 10rpx;
  .barrage {
    font-size: 24rpx;
    display: inline-block;
    border-radius: 24rpx;
    padding: 6rpx 12rpx;
    background-color: rgba(245, 245, 245, 0.6);
    margin-left: 34rpx;
    margin-top: 12rpx;
    opacity: 0.5;
    animation: move 15s linear infinite;
    /*持续时间   就是动画运行时间*/
  }

  @keyframes move {
    0% {
      transform: translate(750rpx, 0);
    }

    50% {
      transform: translate(100rpx, 0);
    }

    100% {
      transform: translate(-750rpx, 0);
    }
  }
}
</style>