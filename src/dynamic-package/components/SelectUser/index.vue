<template>
  <div class="popUserBox">
    <div class="popUserBox-title">关联资讯 ({{ userTotal }})</div>
    <div class="barBox">
      <div class="popUserBox-searchBox">
        <input
          v-model="searchValue"
          @focus="onFocus"
          @input="onFocus"
          @blur="onSearch"
        />
        <div class="popUserBox-searchBox-placeholderBox" v-if="!isFocus">
          <image :src="filters.icon('icon-search')" />
          <span class="popUserBox-searchBox-placeholderBox-title"
            >输入关键词搜索</span
          >
        </div>
      </div>
    </div>
    <scroll-view
      class="popUserBox-listBox"
      scroll-y
      @scrolltolower="onLoadMore"
      v-if="userList.length"
    >
      <div
        class="popUserBox-listBox-item"
        v-for="info in userList"
        :key="info.id"
        @click.stop="onChooseInfo(info)"
      >
        <div class="popUserBox-listBox-item-cover">
          <image :src="info.avatar" mode="aspectFill" />
        </div>
        <div class="popUserBox-listBox-item-info">
          <span class="popUserBox-listBox-item-info-name">{{
            info.nickName
          }}</span>
        </div>
        <image
          :src="filters.icon('pop-select')"
          class="popUserBox-listBox-item-status"
          v-if="selectUser.id === info.id"
        />
        <image
          :src="filters.icon('pop-unSelect')"
          class="popUserBox-listBox-item-status"
          v-else
        />
      </div>
    </scroll-view>
    <jy-noData
      v-if="!userList.length"
      bgUrl="empty-store"
      title="暂无用户～"
    ></jy-noData>
    <div class="popUserBox-sureBox" @click="onSureSelect">
      <image
        :src="filters.icon('pop-sure-select')"
        class="popUserBox-sureBox-select"
        v-if="selectUser"
      />
      <image
        :src="filters.icon('pop-sure-unSelect')"
        class="popUserBox-sureBox-select"
        v-else
      />
    </div>
  </div>
</template>
<script setup lang="ts">
const { api, filters } = useInstance();

let pageNo = ref(1);
let searchValue = ref("");
let userList: Array<any> = reactive([]);
let selectUser: any = reactive({});
let userTotal = ref(0);
let isFocus = ref(false);

const emits = defineEmits(["getUser"]);
defineExpose({ refresh });

//加载更多
function onLoadMore() {
  if (userTotal.value === userList.length) return;

  pageNo.value++;
  queryUserList();
}

function onChooseInfo(v: any) {
  if (selectUser.id === v.id) {
    Object.assign(selectUser, { id: -1 });
  } else {
    Object.assign(selectUser, v);
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
  queryUserList();
}

function onSureSelect() {
  if (selectUser) {
    emits("getUser", JSON.parse(JSON.stringify(selectUser)));
    pageNo.value = 1;
    searchValue.value = "";
    Object.assign(selectUser, { id: -1 });
  }
}

async function refresh() {
  pageNo.value = 1;
  searchValue.value = "";
  await queryUserList();
}

async function queryUserList() {
  try {
    let data: any = await api.queryUserList({
      pageNo: pageNo.value,
      pageSize: 10,
      keyWord: searchValue.value,
      userStatus: "ENABLED",
    });
    if (pageNo.value === 1) userList.splice(0);

    if (data.records.length) {
      userList.push(...data.records);
    }
    userTotal.value = data.total;
  } catch (e) {}
}
</script>
    <style lang="scss" scoped>
.popUserBox {
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
    &-item {
      margin-top: 20rpx;
      margin-left: 24rpx;
      width: calc(100vw - 48rpx);
      background: #ffffff;
      border-radius: 12rpx;
      @include hor-center;
      position: relative;
      overflow: hidden;
      &-cover {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        margin-left: 24rpx;
        overflow: hidden;
        position: relative;
      }
      &-info {
        margin-left: 20rpx;
        @include ver;
        width: 60%;
        border-bottom: 2rpx solid #F5F5F5;
        padding: 44rpx 0px;
        &-name {
          @include text-bold(30rpx, #2e323e);
          @include text-overflow-line(1);
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