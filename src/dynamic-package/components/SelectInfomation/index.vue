<template>
  <div class="popInfoBox">
    <div class="popInfoBox-title">关联资讯 ({{ infoTotal }})</div>
    <div class="barBox">
      <div class="popInfoBox-searchBox">
        <input
          v-model="searchValue"
          @focus="onFocus"
          @input="onFocus"
          @blur="onSearch"
        />
        <div class="popInfoBox-searchBox-placeholderBox" v-if="!isFocus">
          <image :src="filters.icon('icon-search')" />
          <span class="popInfoBox-searchBox-placeholderBox-title"
            >输入关键词搜索</span
          >
        </div>
      </div>
    </div>
    <scroll-view
      class="popInfoBox-listBox"
      scroll-y
      @scrolltolower="onLoadMore"
      v-if="infomationList.length"
    >
      <div
        class="popInfoBox-listBox-item"
        v-for="info in infomationList"
        :key="info.id"
        @click.stop="onChooseInfo(info)"
      >
        <div class="popInfoBox-listBox-item-cover">
          <image :src="info.activityImg" mode="aspectFill" />
        </div>
        <div class="popInfoBox-listBox-item-info">
          <span class="popInfoBox-listBox-item-info-name">{{
            info.activityName
          }}</span>
          <div class="popInfoBox-listBox-item-info-address">
            {{ info.contentText }}
          </div>
        </div>
        <image
          :src="filters.icon('pop-select')"
          class="popInfoBox-listBox-item-status"
          v-if="selectInfo.id === info.id"
        />
        <image
          :src="filters.icon('pop-unSelect')"
          class="popInfoBox-listBox-item-status"
          v-else
        />
      </div>
    </scroll-view>
    <jy-noData
      v-if="!infomationList.length"
      bgUrl="empty-store"
      title="暂无资讯～"
    ></jy-noData>
    <div class="popInfoBox-sureBox" @click="onSureSelect">
      <image
        :src="filters.icon('pop-sure-select')"
        class="popInfoBox-sureBox-select"
        v-if="selectInfo"
      />
      <image
        :src="filters.icon('pop-sure-unSelect')"
        class="popInfoBox-sureBox-select"
        v-else
      />
    </div>
  </div>
</template>
<script setup lang="ts">
const { api, filters } = useInstance();

let pageNo = ref(1);
let searchValue = ref("");
let infomationList: Array<any> = reactive([]);
let selectInfo: any = reactive({});
let infoTotal = ref(0);
let isFocus = ref(false);

const emits = defineEmits(["getInfomation"]);
defineExpose({ refresh });

//加载更多
function onLoadMore() {
  if (infoTotal.value === infomationList.length) return;

  pageNo.value++;
  queryinfomationList();
}

function onChooseInfo(v: any) {
  if (selectInfo.id === v.id) {
    Object.assign(selectInfo, { id: -1 });
  } else {
    Object.assign(selectInfo, v);
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
  queryinfomationList();
}

function onSureSelect() {
  if (selectInfo) {
    emits("getInfomation", JSON.parse(JSON.stringify(selectInfo)));
    pageNo.value = 1;
    searchValue.value = "";
    Object.assign(selectInfo, { id: -1 });
  }
}

async function refresh() {
  pageNo.value = 1;
  searchValue.value = "";
  await queryinfomationList();
}

async function queryinfomationList() {
  try {
    let data: any = await api.officialDynamicList({
      typeEnum: 1,
      pageNo: pageNo.value,
      pageSize: 10,
      keyWord: searchValue.value,
      statusEnum: "ENABLE",
    });
    if (pageNo.value === 1) infomationList.splice(0);

    if (data.records.length) {
      infomationList.push(...data.records);
    }
    infoTotal.value = data.total;
  } catch (e) {}
}
</script>
  <style lang="scss" scoped>
.popInfoBox {
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
    margin-left: 32rpx;
    width: calc(100vw - 64rpx);
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
          @include text-overflow-line(2);
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