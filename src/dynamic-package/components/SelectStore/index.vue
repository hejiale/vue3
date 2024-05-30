<template>
  <div class="popStoreBox">
    <div class="popStoreBox-title">关联店铺 ({{ storeTotal }})</div>
    <div class="barBox">
      <div class="barBox-cityBox" @click="onGoCity">
        {{ cityName }}
        <image
          :src="filters.icon('down-arrow')"
          class="barBox-cityBox-arrow"
        ></image>
      </div>
      <div class="popStoreBox-searchBox">
        <input
          v-model="searchValue"
          @focus="onFocus"
          @input="onFocus"
          @blur="onSearch"
        />
        <div class="popStoreBox-searchBox-placeholderBox" v-if="!isFocus">
          <image :src="filters.icon('icon-search')" />
          <span class="popStoreBox-searchBox-placeholderBox-title"
            >输入关键词搜索</span
          >
        </div>
      </div>
    </div>
    <scroll-view
      class="popStoreBox-listBox"
      scroll-y
      @scrolltolower="onLoadMore"
      v-if="storeList.length"
    >
      <div
        class="popStoreBox-listBox-item"
        v-for="store in storeList"
        :key="store.id"
        @click.stop="onChooseStore(store)"
      >
        <div class="popStoreBox-listBox-item-cover">
          <image :src="filters.processLogoImage(store)" mode="aspectFill" />
        </div>
        <div class="popStoreBox-listBox-item-info">
          <span class="popStoreBox-listBox-item-info-name">{{
            store.storeName
          }}</span>
          <div class="popStoreBox-listBox-item-info-address">
            距你{{ filters.metersTransferThousand(store.distance) }}
          </div>
          <div class="popStoreBox-listBox-item-info-address">
            {{ store.address }}
          </div>
        </div>
        <image
          :src="filters.icon('pop-select')"
          class="popStoreBox-listBox-item-status"
          v-if="selectStore.id === store.id"
        />
        <image
          :src="filters.icon('pop-unSelect')"
          class="popStoreBox-listBox-item-status"
          v-else
        />
      </div>
    </scroll-view>
    <jy-noData
      v-if="!storeList.length"
      bgUrl="empty-store"
      title="暂无门店～"
    ></jy-noData>
    <div class="popStoreBox-sureBox" @click="onSureSelect">
      <image
        :src="filters.icon('pop-sure-select')"
        class="popStoreBox-sureBox-select"
        v-if="selectStore"
      />
      <image
        :src="filters.icon('pop-sure-unSelect')"
        class="popStoreBox-sureBox-select"
        v-else
      />
    </div>
  </div>
</template>
<script setup lang="ts">
const { api, storeApi, filters } = useInstance();

let pageNo = ref(1);
let searchValue = ref("");
let storeList: Array<any> = reactive([]);
let selectStore: any = reactive({});
let storeTotal = ref(0);
let isFocus = ref(false);
let cityName = ref('');

const emits = defineEmits(["getStore"]);
defineExpose({ refresh });

//加载更多
function onLoadMore() {
  if (storeTotal.value === storeList.length) return;

  pageNo.value++;
  querystoreList();
}

function onChooseStore(v: any) {
  if (selectStore.id === v.id) {
    Object.assign(selectStore, { id: -1 });
  } else {
    Object.assign(selectStore, v);
  }
}

//输入搜索框处理
function onFocus() {
  isFocus.value = true;
}
function onSearch() {
  if (!searchValue.value) {
    isFocus.value = false;
  }
  pageNo.value = 1;
  querystoreList();
}

function onSureSelect() {
  if (selectStore) {
    emits("getStore", JSON.parse(JSON.stringify(selectStore)));
    pageNo.value = 1;
    searchValue.value = "";
    Object.assign(selectStore, { id: -1 });
  }
}

async function refresh() {
  cityName.value = uni.getStorageSync("city-info").name;
  pageNo.value = 1;
  searchValue.value = "";
  await querystoreList();
}

async function querystoreList() {
  try {
    let data: any = await storeApi.queryRelateStore({
      pageNo: pageNo.value,
      pageSize: 10,
      keyWord: searchValue.value,
      cityId: uni.getStorageSync("city-info").id,
      userLatitude: uni.getStorageSync("latitude"),
      userLongitude: uni.getStorageSync("longitude"),
    });
    if (pageNo.value === 1) storeList.splice(0);

    if (data.records.length) {
      storeList.push(...data.records);
    }
    storeTotal.value = data.total;
  } catch (e) {}
}

function onGoCity() {
  uni.navigateTo({
    url: "/city-package/pages/index",
  });
}
</script>
<style lang="scss" scoped>
.popStoreBox {
  margin-top: 30rpx;
  height: 78vh;
  border-radius: 32rpx;
  &-title {
    @include text-middle(32rpx, #000);
    text-align: center;
  }
  &-subTitle {
    margin-top: 4rpx;
    @include text-normal(24rpx, rgba($color: #444, $alpha: 0.4));
    text-align: center;
    width: 80%;
    margin-left: 10%;
  }
  .barBox {
    margin-top: 38rpx;
    @include hor-center;
    &-cityBox {
      margin-left: 32rpx;
      @include text-middle(30rpx, #2e323e);
      &-arrow {
        width: 16rpx;
        height: 10rpx;
      }
    }
  }
  &-searchBox {
    margin-left: 34rpx;
    width: 544rpx;
    height: 72rpx;
    background: #f5f6f8;
    border-radius: 30rpx;
    @include hor-center-center;
    position: relative;
    &-placeholderBox {
      image {
        width: 32rpx;
        height: 32rpx;
      }
      &-title {
        @include text-normal(26rpx, #959aa5);
      }
    }
    input {
      position: absolute;
      left: 40rpx;
      right: 40rpx;
      text-align: center;
    }
  }
  &-listBox {
    position: fixed;
    left: 0px;
    width: 100vw;
    bottom: 11.1vh;
    top: 33vh;
    background: #fafafa;
    &-item {
      margin-top: 20rpx;
      margin-left: 24rpx;
      width: calc(100vw - 48rpx);
      background: #ffffff;
      border-radius: 12rpx;
      @include hor-center;
      position: relative;
      padding: 24rpx 0px;
      overflow: hidden;
      &-cover {
        width: 112rpx;
        height: 112rpx;
        border-radius: 12rpx;
        margin-left: 24rpx;
        overflow: hidden;
        position: relative;
      }
      &-info {
        margin-left: 16rpx;
        @include ver;
        width: 60%;
        &-name {
          @include text-bold(28rpx, #2e323e);
          @include text-overflow-line(1);
        }
        &-address {
          margin-top: 14rpx;
          @include text-normal(24rpx, #959aa5);
        }
      }
      &-status {
        position: absolute;
        right: 24rpx;
        top: 50%;
        transform: translateY(-50%);
        width: 40rpx;
        height: 40rpx;
      }
    }
  }
  &-sureBox {
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 11vh;
    background: #fff;
    @include hor-center-center;
    &-select {
      width: 91.46vw;
      height: 80rpx;
    }
  }
}
</style>