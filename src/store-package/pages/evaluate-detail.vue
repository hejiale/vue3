<template>
  <div class="container">
    <jy-navigationBar>
      <template v-slot:content>
        <div class="topBar">
          <image
            :src="filters.icon('store-back')"
            class="topBar-back"
            @click="onBack"
          ></image>
          <span class="topBar-title">店铺评价详情</span>
        </div>
      </template>
    </jy-navigationBar>
    <div class="titleBox">
      <div class="titleBox-left">
        <image
          :src="evaluateDetail.avatar"
          mode="aspectFill"
          class="titleBox-left-avatar"
        />
        <div class="titleBox-left-info">
          <span>{{ evaluateDetail.nickName || "" }}</span>
        </div>
      </div>
      <div class="titleBox-right">
        <div v-if="userInfo.id !== evaluateDetail.userId">
          <image
            :src="filters.icon('follow')"
            class="titleBox-right-focus"
            @click="evaluateRequest"
            v-if="evaluateDetail.focusId"
          />
          <image
            :src="filters.icon('icon-unFocus')"
            class="titleBox-right-focus"
            @click="evaluateRequest"
            v-else
          />
        </div>
        <image
          :src="filters.icon('icon-more-gray')"
          class="titleBox-right-more"
          @click="onDoMore"
        ></image>
      </div>
    </div>
    <scroll-view scroll-y class="container-scrollBox">
      <div class="comment">{{ evaluateDetail.comment }}</div>
      <div class="status">
        <div class="status-left">
          <span class="status-left-storeName">{{
            evaluateDetail.nickName || ""
          }}</span>
          <span class="status-left-note">评价这家店铺：</span>
          <image
            :src="filters.icon(evaluateDetail.summarizeEvaluate)"
            class="status-left-tag"
          />
          <span class="status-left-tagText">{{
            enums.EVALUATE_Type.getName(evaluateDetail.summarizeEvaluate)
          }}</span>
        </div>
        <div class="status-right">
          <span
            >环境{{ evaluateDetail.environmentScore }} 服务{{
              evaluateDetail.serviceScore
            }}
            DM{{ evaluateDetail.dmScore }}</span
          >
        </div>
      </div>
      <div class="imageGridBox">
        <jy-imageGrid :images="images" size="30.13" />
      </div>
      <div class="dateBox">
        <span
          >发布于{{
            dayjs(evaluateDetail.updatedTime).format("YYYY年MM月DD日")
          }}
          {{ dayjs(evaluateDetail.updatedTime).format("HH:mm") }}
        </span>
        <span>{{ evaluateDetail.cityName }}</span>
        <div v-if="evaluateDetail.hasGathered"></div>
        <span v-if="evaluateDetail.hasGathered">通过剧游组局评价</span>
      </div>
      <div
        class="dramaBox"
        v-if="evaluateDetail.dramaDetailVo"
        @click="onGoDramaDetail"
      >
        <image
          :src="evaluateDetail.dramaDetailVo.dramaCover"
          class="dramaBox-cover"
          mode="aspectFill"
        />
        <span class="dramaBox-title">{{
          evaluateDetail.dramaDetailVo.dramaName
        }}</span>
        <div class="dramaBox-dictBox">
          <span class="dramaBox-dictBox-gamer"
            >{{ evaluateDetail.dramaDetailVo.maleGamerNum }}男{{
              evaluateDetail.dramaDetailVo.femaleGamerNum
            }}女</span
          >
          <span class="dramaBox-dictBox-timer"
            >{{ evaluateDetail.dramaDetailVo.gameTime }}小时</span
          >
          <div class="dramaBox-dictBox-line"></div>
          <span>{{
            filters.doCalculateDramaDicts(evaluateDetail.dramaDetailVo.dicts)
          }}</span>
        </div>
        <div v-if="evaluateDetail.dramaDetailVo.playStatus !== 'HAS_PLAY'">
          <image
            :src="filters.icon('hasWantPlay')"
            class="wantPlay"
            @click.stop="cancelPlayerWantPlay"
            v-if="evaluateDetail.dramaDetailVo.playStatus"
          />
          <image
            :src="filters.icon('icon-unWantPlay')"
            class="wantPlay"
            @click.stop="addPlayerWantPlay"
            v-else
          />
        </div>
        <image
          :src="filters.icon(evaluateDetail.dramaDetailVo.sellType)"
          v-if="filters.icon(evaluateDetail.dramaDetailVo.sellType)"
          class="dramaBox-sellType"
        />
        <jy-bindPhone
          v-if="!userInfo.phone"
          ref="BindPhone"
          @on-success-authorize="onRefreshUserInfo"
        />
      </div>
      <div class="dmBox" v-if="evaluateDetail.dmuserInfo">
        <image
          :src="evaluateDetail.dmuserInfo.avatar"
          class="dmBox-cover"
          mode="aspectFill"
        />
        <span class="dmBox-nickName">{{
          evaluateDetail.dmuserInfo.nickName || ""
        }}</span>
        <image :src="filters.icon('icon-dm-tag')" class="dmBox-tag" />
      </div>
      <div style="height: 40px"></div>
    </scroll-view>
    <u-popup :show="showPop" @close="showPop = false" @open="showPop = true">
      <div class="popBox">
        <div class="menu" @click="onGoPoster">
          <image :src="filters.icon('icon-store-poster')" />
          <span class="menu-title">生成海报</span>
        </div>
        <div class="menu">
          <image :src="filters.icon('icon-store-share')" />
          <span class="menu-title">微信好友</span>
          <button open-type="share" @click.stop="showPop = false" />
        </div>
        <div
          class="menu"
          @click="onJubao"
          v-if="userInfo.id !== evaluateDetail.userId"
        >
          <image :src="filters.icon('icon-store-report')" />
          <span class="menu-title">举报</span>
        </div>
        <div
          class="menu"
          @click="onEdit"
          v-if="userInfo.id === evaluateDetail.userId"
        >
          <image :src="filters.icon('icon-store-edit')" />
          <span class="menu-title">编辑</span>
        </div>
        <div
          class="menu"
          @click="onDelete"
          v-if="userInfo.id === evaluateDetail.userId"
        >
          <image :src="filters.icon('icon-store-delete')" />
          <span class="menu-title">删除</span>
        </div>
      </div>
    </u-popup>
  </div>
</template>
<script setup lang="ts">
const { storeApi, filters, useUser, enums, dayjs } = useInstance();
/**
 * 评价详情信息
 */
let evaluateId: any = ref();
let evaluateDetail: any = reactive({});
let userInfo: any = reactive({});
let showPop = ref(false);
let isShowPoster = ref(false);
let canDo = ref(false);
let canvasImgPortrait = ref(false);
let canvasBg: any = reactive({});
let storeInfo: any = reactive({});

onLoad(async (options: any) => {
  evaluateId.value = options.id;
});

onShow(async (options) => {
  let res = await useUser.getUserInfo();
  Object.assign(userInfo, res);

  await queryEvaluateDetail();
});

const images = computed(() => {
  if (!evaluateDetail.attachments) return [];
  return evaluateDetail.attachments.map((v: any) => v.fileUrl);
});

function onBack() {
  if (getCurrentPages().length === 1) {
    uni.switchTab({
      url: "/pages/index/index",
    });
  } else {
    uni.navigateBack();
  }
}
//刷新用户信息
async function onRefreshUserInfo() {
  let res = await useUser.getUserInfo(true);
  Object.assign(userInfo, res);
}
//查询评价详情
async function queryEvaluateDetail() {
  try {
    let res: any = await storeApi.evaluateDetail({
      id: evaluateId.value,
    });
    Object.assign(evaluateDetail, res);
    queryStoreInfo(res.storeId);
  } catch (e) {}
}
//关注
async function evaluateRequest() {
  if (canDo.value) return;
  canDo.value = true;

  try {
    await storeApi.updateUserFocus({
      flag: evaluateDetail.focusId ? false : true,
      focusUserId: evaluateDetail.userId,
      userId: userInfo.id,
    });
    queryEvaluateDetail();
    canDo.value = false;
  } catch (e) {
    canDo.value = false;
  }
}
function onDoMore() {
  showPop.value = true;
}
//举报
async function onJubao() {
  showPop.value = false;
  uni.setStorageSync("evaluateDetail", evaluateDetail);

  uni.navigateTo({
    url: "./evaluate-report",
  });
}
//想玩
async function addPlayerWantPlay() {
  if (canDo.value) return;
  canDo.value = true;

  try {
    await storeApi.updateUserDramaPlayMP({
      playStatus: "WANT_PLAY",
      userId: userInfo.id,
      dramaId: evaluateDetail.dramaDetailVo.id,
    });
    queryEvaluateDetail();
    canDo.value = false;
  } catch (e) {
    canDo.value = false;
  }
}
//取消想玩
async function cancelPlayerWantPlay() {
  if (canDo.value) return;
  canDo.value = true;

  try {
    await storeApi.cancelUserDramaPlayMP({
      playStatus: "WANT_PLAY",
      userId: userInfo.id,
      dramaId: evaluateDetail.dramaDetailVo.id,
    });
    queryEvaluateDetail();
    canDo.value = false;
  } catch (e) {
    canDo.value = false;
  }
}
function onGoDramaDetail() {}
//编辑
function onEdit() {
  showPop.value = false;
  uni.setStorageSync('store-info', storeInfo);
  
  uni.navigateTo({
    url: `./evaluate-edit?id=${evaluateDetail.id}`
  })
}
//删除
function onDelete() {
  uni.showModal({
    title: "提示",
    content: "确认删除该条评价吗？",
    success: async function (res:any) {
      if (res.confirm) {
        try {
          await storeApi.evaluateOperation({
            id: evaluateDetail.id,
            status: "DISABLE",
            storeId: evaluateDetail.storeId,
          });
          uni.navigateBack();
        } catch (e) {
          console.log(e);
        }
      }
    },
  });
}
//生成海报
async function onGoPoster() {}
//查询店铺信息
async function queryStoreInfo(storeId: any) {
  try {
    let res: any = await storeApi.getStoreHome({
      storeId,
      userId: userInfo.id,
    });
    Object.assign(storeInfo, res);
  } catch (e) {}
}
</script>
<style lang="scss" scoped>
.container {
  background: #fff;
  height: 100vh;
  &-scrollBox {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 17.85vh;
  }
}
.topBar {
  @include hor-center;
  height: 64rpx;
  position: relative;
  &-back {
    width: 32rpx;
    height: 32rpx;
    padding-left: 32rpx;
  }
  &-title {
    @include text-normal(26rpx, #2e323e);
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
}
.titleBox {
  position: fixed;
  left: 32rpx;
  right: 0rpx;
  top: 192rpx;
  @include hor-between-center;
  &-left {
    @include hor;
    align-items: center;
    width: 70%;
    &-info {
      @include ver;
      align-items: center;
      margin-left: 18rpx;
      max-width: 80%;
      span {
        @include text-middle(26rpx, #2e323e);
        @include text-overflow-line(1);
      }
      &-tag {
        width: 116rpx;
        height: 26rpx;
        margin-top: 4rpx;
      }
    }
    &-avatar {
      width: 64rpx;
      height: 64rpx;
      border-radius: 64rpx;
    }
  }
  &-right {
    @include hor;
    align-items: center;
    position: relative;
    &-focus {
      width: 108rpx;
      height: 52rpx;
      margin-right: 40rpx;
    }
    &-more {
      padding: 20rpx 30rpx 20rpx 0px;
      width: 40rpx;
      height: 8rpx;
    }
  }
}
.comment {
  @include text-normal(30rpx, #2e323e);
  padding: 0rpx 30rpx 0 30rpx;
  word-break: break-all;
  line-height: 36rpx;
}
.status {
  margin: 30rpx;
  padding: 18rpx 30rpx;
  background: #fff6ea;
  border-radius: 6px;
  border: 1px solid rgba(182, 100, 64, 0.2);
  @include hor-between-center;
  &-left {
    width: 68%;
    @include hor;
    align-items: center;
    &-storeName {
      @include text-normal(26rpx, #b66440);
      @include text-overflow-line(1);
      max-width: 25%;
    }
    &-note {
      @include text-normal(26rpx, #b66440);
    }
    &-tag {
      width: 40rpx;
      height: 40rpx;
    }
    &-tagText {
      margin-left: 8rpx;
      @include text-bold(26rpx, #b66440);
    }
  }
  &-right {
    @include hor;
    align-items: center;
    @include text-normal(20rpx, #b66440);
  }
}
.imageGridBox {
  margin: 30rpx;
}
.dateBox {
  margin: 28rpx 30rpx 0 30rpx;
  @include hor;
  align-items: center;
  @include text-normal(24rpx, #959aa5);
  span:nth-child(2) {
    margin-left: 10rpx;
  }
  div:nth-child(3) {
    width: 1px;
    height: 22rpx;
    background: #d9d9d9;
    margin: 0 10rpx;
  }
}
.dramaBox {
  margin: 40rpx 30rpx 0 30rpx;
  width: calc(100vw - 60rpx);
  background: #f5f6f8;
  border-radius: 6px;
  position: relative;
  &-cover {
    width: 96rpx;
    height: 128rpx;
    border-radius: 6px;
  }
  &-title {
    position: absolute;
    left: 108rpx;
    top: 24rpx;
    @include text-bold(28rpx, #2e323e);
  }
  &-dictBox {
    position: absolute;
    left: 108rpx;
    bottom: 22rpx;
    @include hor;
    align-items: center;
    @include text-normal(24rpx, #959aa5);
    &-timer {
      margin-left: 10rpx;
    }
    &-line {
      width: 1px;
      height: 22rpx;
      background: #d9d9d9;
      margin: 0 10rpx;
    }
  }
  .wantPlay {
    position: absolute;
    top: 26rpx;
    right: 18rpx;
    width: 120rpx;
    height: 36rpx;
  }
  &-sellType {
    position: absolute;
    left: 0rpx;
    top: 0rpx;
    width: 60rpx;
    height: 32rpx;
  }
}
.dmBox {
  margin: 18rpx 30rpx 0 30rpx;
  width: 148px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e9ebef;
  position: relative;
  &-cover {
    width: 96rpx;
    height: 96rpx;
    border-radius: 6px;
  }
  &-nickName {
    position: absolute;
    left: 108rpx;
    top: 12rpx;
    @include text-middle(26rpx, #2e323e);
    @include text-overflow-line(1);
  }
  &-status {
    position: absolute;
    left: 108rpx;
    bottom: 12rpx;
    @include text-normal(22rpx, #ffa557);
  }
  &-status::before {
    content: "本次体验：";
    color: #959aa5;
  }
  &-tag {
    position: absolute;
    left: 6rpx;
    top: 6rpx;
    width: 32rpx;
    height: 32rpx;
  }
}
.popBox {
  height: 24vh;
  .menu {
    position: absolute;
    left: 32rpx;
    top: 120rpx;
    width: 100rpx;
    @include ver;
    align-items: center;
    image {
      width: 100rpx;
      height: 100rpx;
    }
    &-title {
      margin-top: 16rpx;
      @include text-normal(24rpx, #959aa5);
      text-align: center;
      width: 100%;
    }
    button {
      background: unset !important;
      @include abs-center;
    }
    button::after {
      border: none !important;
    }
  }
  .menu:nth-child(2) {
    left: 172rpx;
  }
  .menu:nth-child(3) {
    left: 312rpx;
  }
  .menu:nth-child(4) {
    left: 452rpx;
  }
}
</style>