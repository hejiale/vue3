<template>
  <div class="dmBox">
    <jy-navigationBar>
      <template v-slot:content>
        <div>
          <image
            :src="filters.icon('store-back')"
            class="backBox"
            @click="onBack"
          ></image>
          <div class="titleBox">
            <div class="titleBox-title">门店DM ({{ DM_total }})</div>
            <div class="titleBox-storeName">{{ storeInfo.storeName }}</div>
          </div>
        </div>
      </template>
    </jy-navigationBar>
    <scroll-view
      class="dmBox-listBox"
      scroll-y
      @scrolltolower="onLoadMore"
      refresher-enabled 
      @refresherrefresh="onPull" 
      :refresher-triggered="isPull"
      v-if="dmList.length"
      :style="{ top: `${menuRect.top + 40}px` }"
    >
      <div class="dmBox-listBox-item" v-for="dm in dmList" :key="dm.userId">
        <div class="dmBox-listBox-item-coverBox">
          <image :src="dm.avatar" mode="aspectFill" />
          <image
            class="dmBox-listBox-item-coverBox-cover"
            :src="filters.icon('icon-dm-bg')"
          />
          <span
            class="dmBox-listBox-item-coverBox-scoreBox"
            v-if="dm.evaluate"
            >{{ dm.evaluate }}</span
          >
        </div>
        <span class="dmBox-listBox-item-name">{{ dm.userName }}</span>
      </div>
      <jy-noMore v-if="endLoad && dmList.length"></jy-noMore>
      <jy-noData v-if="!dmList.length" title="该店铺暂未上传DM信息" bgUrl="empty-dm"></jy-noData>
    </scroll-view>
    <jy-noMore v-else />
  </div>
</template>
<script setup lang="ts">
const { storeApi, filters, menuButtonRect } = useInstance();

let pageNo = ref(1);
//DM列表
let dmList: Array<any> = reactive([]);
//DM总数
let DM_total = ref(0);
let storeInfo: any = reactive({});
//胶囊react
let menuRect: any = reactive({});
let isPull = ref(true);

onLoad(async () => {
  let res = await menuButtonRect();
  Object.assign(menuRect, res);

  Object.assign(storeInfo, JSON.parse(uni.getStorageSync("store-detail")));
  uni.removeStorageSync("store-detail");

  await queryDM_List();
});

function onBack() {
  uni.navigateBack();
}

function onPull(){
  isPull.value = true;
  pageNo.value = 1;
  queryDM_List();
}

//加载更多
function onLoadMore() {
  if (DM_total.value === dmList.length) return;

  pageNo.value++;
  queryDM_List();
}

//加载完的标志位
const endLoad = computed(() => {
  return DM_total.value === dmList.length;
})

//查询DM列表
async function queryDM_List() {
  try {
    let data: any = await storeApi.getStoreDMList({
      pageNo: pageNo.value,
      pageSize: 20,
      storeId: storeInfo.id,
      storeUserType: "DM",
    });
    if (pageNo.value === 1) dmList.splice(0);

    if (data.records.length) {
      dmList.push(...data.records);
    }
    DM_total.value = data.total;
    isPull.value = false;
  } catch (e) {}
}
</script>
<style lang="scss" scoped>
.dmBox {
  margin-top: 30rpx;
  height: 85vh;
  background: #fff;
  border-radius: 32rpx;
  .backBox {
    position: absolute;
    left: 24rpx;
    width: 36rpx;
    height: 36rpx;
    z-index: 1;
  }
  .titleBox {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    @include ver;
    align-items: center;
    &-title {
      @include text-middle(32rpx, #2e323e);
      line-height: 38rpx;
    }
    &-storeName {
      margin-top: 10rpx;
      @include text-normal(24rpx, #959aa5);
      line-height: 28rpx;
      @include text-overflow-line(1);
    }
  }
  &-listBox {
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: #fafafa;
    padding: 24rpx;
    &-item {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      margin-right: 6rpx;
      margin-bottom: 24rpx;
      position: relative;
      &-coverBox {
        width: 30.66vw;
        height: 30.66vw;
        position: relative;
        border-radius: 56rpx;
        overflow: hidden;
        &-cover {
          @include abs-center;
          z-index: 1;
        }
        &-scoreBox {
          position: absolute;
          top: 16rpx;
          right: 16rpx;
          font-size: 36rpx;
          font-family: OPPOSans-Heavy, OPPOSans;
          font-weight: 800;
          color: #ffffff;
          line-height: 42rpx;
          z-index: 1;
        }
        &-scoreBox::after {
          content: "分";
          @include text-normal(36rpx, #fff);
          line-height: 42rpx;
        }
      }
      &-name {
        @include text-normal(32rpx, #2e323e);
        line-height: 38rpx;
        margin-top: 16rpx;
        width: 28vw;
        text-align: center;
        @include text-overflow-line(1);
      }
      &-status {
        position: absolute;
        right: 24rpx;
        top: 24rpx;
        width: 40rpx;
        height: 40rpx;
      }
    }
  }
}
</style>