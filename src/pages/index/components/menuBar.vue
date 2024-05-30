<template>
  <div class="menuBar">
    <div class="menuBar-menusBox">
      <div class="menuBar-menusBox-cityBox" @click.stop="onGoCity">
        <span class="menuBar-menusBox-cityBox-name" :style="menuFontColor">
          {{cityName}}
        </span>
        <u-icon name="arrow-down" :color="arrowColor" size="8"></u-icon>
      </div>
      <div
        class="menuBar-menusBox-menu"
        :style="menuFontColor"
        v-for="menu in menuList"
        :key="menu"
        :class="{activeMenu: activeMenu === menu}"
        @click="onChangeMenu(menu)"
      >
        {{ menu }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const menuList: Array<string> = ["推荐", "排行榜", "剧评"];

let activeMenu = ref("推荐");

const props = defineProps({
  cityName: {
    type: String,
    default: ''
  },
  current: {
    type: String,
    default: ''
  }
});

const emmits = defineEmits(["changeTab"]);

//监听
watch(
  props,() => {
    activeMenu.value = props.current;
  }
)

//导航栏字体颜色
const menuFontColor = computed(() => {
  return activeMenu.value === "推荐"
    ? "color: #fff"
    : activeMenu.value === "排行榜"
    ? "color: #fff"
    : "color: #5F6572";
});

const arrowColor = computed(() => {
  return activeMenu.value === "推荐"
    ? "#fff"
    : activeMenu.value === "排行榜"
    ? "#fff"
    : "#5F6572";
});


onMounted(async () => {});
/**
 *
 * @param menu 切换菜单
 */
function onChangeMenu(menu: string) {
  activeMenu.value = menu;
  emmits("changeTab", menu);
}

function onGoCity(){
  uni.navigateTo({
    url: '/city-package/pages/index'
  })
}

</script>
<style lang="scss" scoped>
.menuBar {
  @include hor;
  height: 80rpx;
  padding-left: 24rpx;
  &-menusBox {
    position: absolute;
    left: 24rpx;
    @include hor;
    align-items: flex-end;
    &-cityBox {
      @include hor;
      margin-right: 32rpx;
      align-items: center;
      &-name {
        @include text-normal(30rpx, #000);
        margin-right: 4rpx;
      }
    }
    &-menu {
      margin-right: 32rpx;
      @include text-normal(30rpx, #000);
      position: relative;
    }
    .activeMenu {
      font-size: 44rpx;
      font-weight: 600;
      animation: pulse;
      animation-duration: 1s;

      
      &::before {
        content: "";
        position: absolute;
        bottom: -10rpx;
        left: 50%;
        transform: translateX(-50%);
        z-index: -1;
        width: 36rpx;
        height: 8rpx;
        background: linear-gradient(76deg, #ABFB50 9%, #36E4BB 100%);
        border-radius: 60rpx;
      }
    }
  }
}
</style>