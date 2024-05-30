<template>
  <div class="container">
    <jy-navigationBar :barHeight="42">
      <template v-slot:content>
        <div class="topBar">
          <image
            :src="filters.icon('store-back')"
            class="back"
            @click="onBack"
          ></image>
          <div class="tabBar">
            <div
              class="tabBar-tab"
              :class="{ activeMenu: activeTab === tab }"
              v-for="tab in tabs"
              :key="tab"
              @click.stop="onChangeTab(tab)"
            >
              {{ tab }}
            </div>
          </div>
        </div>
      </template>
      <template v-slot:view>
        <swiper
          class="container-swiperBox"
          @change="onChangeSwiper"
          :current="current"
        >
          <swiper-item v-for="tab in tabs" :key="tab">
            <u-skeleton
              rows="30"
              title
              :loading="loading"
              animate
              :rowsWidth="['100%', '100%', '100%']"
              :rowsHeight="['308rpx', '308rpx', '308rpx']"
              class="skeleton"
            ></u-skeleton>
            <scroll-view
              scroll-y
              class="container-swiperBox-scrollBox"
              @scrolltolower="onLoadMore"
              refresher-enabled
              @refresherrefresh="onPull"
              @scroll="onScroll"
              :refresher-triggered="isPull"
              v-if="dynamicList.length"
            >
              <jy-dynamic :dynamics="dynamicList"></jy-dynamic>
              <jy-noMore v-if="endLoad"></jy-noMore>
            </scroll-view>
            <jy-noData
              bgUrl="empty-dymaic"
              title="暂无发现任何动态"
              v-if="!loading && !dynamicList.length"
            ></jy-noData>
          </swiper-item>
        </swiper>
      </template>
    </jy-navigationBar>
    <image
      :src="filters.icon('fixed-dynamic-add')"
      class="fixed-add"
      v-if="!isScroll"
      @click="onAdd"
    ></image>
  </div>
</template>
<script setup lang="ts">
const { myApi, useUser, filters } = useInstance();

let tabs = ref(["关注", "推荐", "同城"]);

let activeTab = ref("关注");

let pageNo = ref(1);

let userInfo: any = reactive({});

let current = ref(0);

let dynamicList: Array<any> = reactive([]);

let dynamicTotal = ref(0);

let loading = ref(true);

let isPull = ref(true);

let isScroll = ref(false);

let timer: number;

//监听
watch(current, () => {
  activeTab.value =
    current.value === 0 ? "关注" : current.value === 1 ? "推荐" : "同城";
  refresh();
});

onShow(async () => {
  if (uni.getStorageSync("isPrview")) {
    uni.removeStorageSync("isPrview");
    return;
  }
  let res = await useUser.getUserInfo();
  Object.assign(userInfo, res);

  await queryDynamicList();
});

function onScroll() {
  isScroll.value = true;

  clearTimeout(timer);

  timer = setTimeout(() => {
    isScroll.value = false;
  }, 200);
}

//加载完的标志位
const endLoad = computed(() => {
  return dynamicTotal.value === dynamicList.length;
});

function onBack() {
  uni.navigateBack();
}

function onAdd() {
  uni.navigateTo({ url: "./edit" });
}

//切换轮播页面
function onChangeSwiper(event: any) {
  current.value = event.detail.current;
}

//切换tab
function onChangeTab(tab: any) {
  current.value = tab === "关注" ? 0 : tab === "推荐" ? 1 : 2;
  refresh();
}

//刷新页面
function refresh() {
  loading.value = true;
  pageNo.value = 1;
  queryDynamicList();
}

async function onPull() {
  if (isPull.value) return;
  isPull.value = true;

  pageNo.value = 1;
  await queryDynamicList();
}

//加载更多
function onLoadMore() {
  pageNo.value++;
  queryDynamicList();
}

//查询动态列表
async function queryDynamicList() {
  if (pageNo.value === 1) {
    dynamicList.splice(0);
  }
  let res: any = await myApi.getDramaDynamics({
    pageNo: pageNo.value,
    pageSize: 10,
    queryType:
      current.value === 0
        ? "FOCUS"
        : current.value === 1
        ? "RECOMMEND"
        : "SAME_CITY",
    regionId: uni.getStorageSync("city-info").id,
    userId: userInfo.id,
    lon: uni.getStorageSync("longitude"),
    lat: uni.getStorageSync("latitude"),
  });
  if (res.records.length) {
    dynamicList.push(...res.records);
  }
  loading.value = false;
  dynamicTotal.value = res.total;
  setTimeout(() => {
    isPull.value = false;
  }, 500);
}
</script>
<style lang="scss" scoped>
.container {
  height: 100vh;
  &-swiperBox {
    margin-top: 20rpx;
    height: 90vh;
    &-scrollBox {
      height: 100%;
    }
  }
}
.topBar {
  @include hor-center;
}
.back {
  width: 48rpx;
  height: 48rpx;
  padding-left: 32rpx;
}
.tabBar {
  @include hor;
  padding-left: 32rpx;
  height: 64rpx;
  align-items: flex-end;
  &-tab {
    @include text-bold(30rpx, #2e323e);
    margin-right: 32rpx;
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
      bottom: 0rpx;
      left: 50%;
      transform: translateX(-50%);
      z-index: -1;
      width: 100%;
      height: 16rpx;
      background: #36e4bb;
    }
  }
}
.fixed-add {
  width: 82rpx;
  height: 120rpx;
  position: fixed;
  right: 0px;
  bottom: 20vh;
  z-index: 1;
}
</style>