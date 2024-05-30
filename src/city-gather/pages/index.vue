<template>
  <div class="container">
    <div class="fixedBg"></div>
    <jy-navigationBar background="#fff">
      <template v-slot:content>
        <div class="topBarBox">
          <image
            :src="filters.icon('store-back')"
            class="topBarBox-back"
            @click="onBack"
          ></image>
          <div class="topBarBox-cityBox" @click="onGoCity">
            {{ cityName }}
            <image :src="filters.icon('down-arrow')" class="arrow"></image>
          </div>
          <jy-searchBar width="40vw" v-model="searchKeyword"></jy-searchBar>
        </div>
      </template>
      <template v-slot:view>
        <div
          class="tabBox"
        >
          <div
            class="tabBox-item"
            v-for="(tab, idx) in menus"
            :key="idx"
            :class="{ active: activeMenu === idx }"
            @click.stop="onChangeTab(idx)"
          >
            {{ tab }}
          </div>
        </div>
        <swiper
          class="swiperBox"
          @change="onChangeSwiper"
          :current="activeMenu"
        >
          <swiper-item>
            <gather
              :activeIndex="activeMenu"
              :menuRect="menuRect"
              :userInfo="userInfo"
              :searchWord="searchKeyword"
            ></gather>
          </swiper-item>
          <swiper-item>
            <store
              :activeIndex="activeMenu"
              :menuRect="menuRect"
              :userInfo="userInfo"
              :searchWord="searchKeyword"
            ></store>
          </swiper-item>
          <swiper-item>
            <hotDrama
              :activeIndex="activeMenu"
              :menuRect="menuRect"
              :userInfo="userInfo"
              :searchWord="searchKeyword"
            ></hotDrama>
          </swiper-item>
          <swiper-item>
            <wantPlay
              :activeIndex="activeMenu"
              :userInfo="userInfo"
              :searchWord="searchKeyword"
            >
            </wantPlay>
          </swiper-item>
        </swiper>
      </template>
    </jy-navigationBar>
    <div
      class="container-bottomBox"
      :class="isHiden ? 'menuMove' : 'menuMoveEnd'"
    >
      <div class="container-bottomBox-menu">
        <image :src="filters.icon('myGather_bottom')"></image>
        <span class="container-bottomBox-menu-title">我的组局</span>
      </div>
      <div class="container-bottomBox-menu" @click="onGoGather">
        <image :src="filters.icon('goGather_bottom')"></image>
        <span class="container-bottomBox-menu-title">发起组局</span>
      </div>
      <div class="container-bottomBox-menu">
        <image :src="filters.icon('game_bottom')"></image>
        <span class="container-bottomBox-menu-title">票房本</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import gather from "../components/gather.vue";
import store from "../components/store.vue";
import hotDrama from "../components/hot-drama.vue";
import wantPlay from "../components/wantPlay.vue";
const {
  bus,
  myApi,
  gatherApi,
  useUser,
  getColor,
  requestAuthorize,
  filters,
  menuButtonRect,
} = useInstance();

let searchKeyword = ref("");

let cityName = ref("");

let isHiden = ref(false);

let menuRect: any = reactive({});

let menus = ref(["同城组局", "优选门店", "热玩剧本", "我想玩的"]);

let activeMenu = ref(-1);

let userInfo: any = reactive({});

onLoad(async (option: any) => {
  if (option.type) {
    activeMenu.value = parseInt(option.type);
  } else {
    activeMenu.value = 0;
  }

  let res = await menuButtonRect();
  Object.assign(menuRect, res);

  res = await useUser.getUserInfo();
  Object.assign(userInfo, res);

  //监听筛选展开
  bus.on("showFilter", (e: any) => {
    isHiden.value = e;
  });
});

onShow(async () => {
  //刷新城市
  cityName.value = uni.getStorageSync("city-info").name;
});

function onBack() {
  uni.navigateBack();
}

function onChangeSwiper(e: any) {
  searchKeyword.value = "";
  activeMenu.value = e.detail.current;
  bus.emit("on-change-tab");
}

function onGoCity() {
  uni.navigateTo({
    url: "/city-package/pages/index",
  });
}

function onChangeTab(tab: any) {
  searchKeyword.value = "";
  activeMenu.value = tab;
  bus.emit("on-change-tab");
}

function onGoGather(){
  uni.navigateTo({url: '/player-gather/pages/initiate'});
}
</script>
<style lang="scss" scoped>
.container {
  .topBarBox {
    @include hor-center;
    height: 64rpx;
    &-back {
      padding: 16rpx 30rpx 16rpx 32rpx;
      width: 32rpx;
      height: 32rpx;
    }
    &-cityBox {
      @include text-middle(30rpx, #000);
    }
    .arrow {
      width: 16rpx;
      height: 8rpx;
    }
    :deep(.searchBox) {
      margin-left: 28rpx;
    }
  }
  .tabBox {
    position: fixed;
    left: 0px;
    right: 0px;
    @include hor-center;
    background: #fff;
    height: 94rpx;
    &-item {
      display: flex;
      flex: 1;
      @include text-middle(30rpx, #959aa5);
      justify-content: center;
    }
    .active {
      @include text-middle(30rpx, #2e323e);
      position: relative;
      animation: pulse;
      animation-duration: 1s;
    }
    .active::before {
      content: "";
      position: absolute;
      bottom: -10rpx;
      left: 50%;
      transform: translateX(-50%);
      z-index: -1;
      width: 36rpx;
      height: 8rpx;
      background: #36e4bb;
      border-radius: 60rpx;
    }
  }
  &-bottomBox {
    position: fixed;
    left: 80rpx;
    bottom: 100rpx;
    width: 78.4vw;
    height: 112rpx;
    background: rgba(46, 50, 62, 0.9);
    border-radius: 28px;
    @include hor-center;
    box-sizing: border-box;
    padding: 0 40rpx;
    &-menu {
      @include ver-center;
      flex: 1;
      image {
        width: 82rpx;
        height: 44rpx;
      }
      &-title {
        @include text-normal(20rpx, #fff);
      }
    }
  }
  .menuMove {
    transform: translateY(220rpx);
    transition: 0.4s;
  }
  .menuMoveEnd {
    transform: translateY(0px);
    transition: 0.4s;
  }
}
.swiperBox {
  position: fixed;
  left: 0px;
  right: 0px;
  bottom: 0px;
  height: calc(100vh - 127px);
}
</style>