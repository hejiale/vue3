<template>
  <jy-navigationBar background= #F1F3F7;>
    <template v-slot:content>
      <div class="topBar">
        <image :src="filters.icon('store-back')" class="topBar-back" @click="onBack"/>
      </div>
    </template>
    <template v-slot:view>
      <div class="fixedBg"></div>
      <div class="wrapper">
        <!-- 门店信息 -->
        <div class="store">
          <!-- 门店头像 -->
          <image class="store-avatar" :src="filters.processLogoImage(storeInfo)" mode="aspectFill"/>
          <!-- 门店名称ID -->
          <div class="store-info">
            <div class="store-info-title">
              <div class="store-info-title-nickname">{{ storeInfo.storeName }}</div>
              <image class="store-info-title-tag" :src="filters.icon('change-stores')"/>
            </div>
            <div class="store-info-id">ID: {{ storeInfo.storeNumber }}</div>
          </div>
          <!-- 门店二维码 -->
          <div class="store-qrcode">
            <div class="store-qrcode-img" v-show="activeTab === 0"></div>
            <div class="store-qrcode-text" v-show="activeTab === 0">门店二维码</div>
          </div>
        </div>
        <!-- 数据页面 -->
        <dataPage v-show="activeTab === 0"/>
        <!-- 管理页面-->
        <editPage v-show="activeTab === 1"/>
      </div>
      <!-- 底部导航栏 -->
      <u-tabbar :value="activeTab" @change="changeTab" :border="true" :fixed="true" :placeholder="true" :safeAreaInsetBottom="true" inactiveColor="#999999" activeColor="#111111">
        <u-tabbar-item v-for="(tab, index) in tabs" :key="index" :text="tab.text">
          <template #active-icon>
            <image style="width: 24px; height: 24px"  :src="filters.icon(tab.selectedIcon)"/>
          </template>
          <template #inactive-icon>
            <image style="width: 24px; height: 24px"  :src="filters.icon(tab.icon)"/>
          </template>
        </u-tabbar-item>
      </u-tabbar>
    </template>
  </jy-navigationBar>
</template>

<script setup lang="ts">
import dataPage from "../components/dataPage.vue"
import editPage from "../components/editPage.vue"

const { filters, useStore } = useInstance();

let activeTab = ref(0); //导航栏当前页面
let storeInfo:any = reactive({}); //门店信息
// 导航栏信息
const tabs = [
  {
    name: 'data',
    text: '数据',
    icon: 'saas-data',
    selectedIcon: 'sel-saas-data',
  },
  {
    name: 'edit',
    text: '管理',
    icon: 'saas-edit',
    selectedIcon: 'sel-saas-edit',
  }
];

onLoad(async () => {
  Object.assign(storeInfo, useStore.storeInfo);
});

/*返回上一级*/
function onBack() {
  if (getCurrentPages().length === 1) {
    uni.switchTab({
      url: "/pages/index/index",
    });
  } else {
    uni.navigateBack();
  }
}

/*导航栏切换页面*/
const changeTab = (tag: number) => {
  activeTab.value = tag;
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 0
  });
};
</script>

<style scoped lang="scss">
.topBar {
  @include hor-center;
  height: 64rpx;
  position: relative;

  &-back {
    width: 32rpx;
    height: 32rpx;
    margin-left: 32rpx;
  }
}
.fixedBg {
  background: #F1F3F7;
}

.wrapper {
  height: 100%;
  @include ver-center;
}

.store {
  position: relative;
  margin-top: 46rpx;
  width: 710rpx;
  height: 102rpx;

  &-avatar {
    position: absolute;
    left: 0;
    top: 2rpx;
    overflow: hidden;
    border: 4rpx solid #FFFFFF;
    @include circle(76rpx);
  }

  &-info {
    position: absolute;
    left: 108rpx;
    top: 0;
    height: 84rpx;

    &-title {
      @include hor-center;

      &-nickname {
        max-width: 340rpx;
        @include text-overflow-line(1);
        @include text-custom(500,32rpx,#030A19);
      }

      &-tag {
        width: 130rpx;
        height: 32rpx;
        margin-left: 16rpx;
      }
    }

    &-id {
      margin-top: 6rpx;
      @include text-custom(400,24rpx,#A1ABBD);
    }
  }

  &-qrcode {
    position: absolute;
    right: 24rpx;
    bottom: 0;
    @include ver-center;

    &-img {
      height: 64rpx;
      width: 64rpx;
      border: 2rpx solid #E4E4E4;
      border-radius: 20rpx;
    }

    &-text {
      margin-top: 8rpx;
      @include text-custom(400, 20rpx, #959AA5);
    }
  }
}
</style>
