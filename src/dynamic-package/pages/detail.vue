<template>
  <div class="container" v-if="evaluateDetail.userItem">
    <jy-navigationBar position="absolute">
      <template v-slot:content>
        <div class="topBar">
          <image
            :src="filters.icon('store-back')"
            class="topBar-back"
            @click="onBack"
          ></image>
        </div>
      </template>
    </jy-navigationBar>
    <div class="titleBox">
      <div class="titleBox-left">
        <image
          :src="evaluateDetail.userItem.avatar"
          mode="aspectFill"
          class="titleBox-left-avatar"
        />
        <div class="titleBox-left-info">
          <span>{{ evaluateDetail.userItem.nickName || "" }}</span>
        </div>
      </div>
      <div class="titleBox-right">
        <div v-if="userInfo.id !== evaluateDetail.userItem.id" @click="onFocus">  
          <div class="titleBox-right-focus" v-if="evaluateDetail.isFocus">
            +关注
          </div>
          <div class="titleBox-right-hasFocus" v-else>已关注</div>
        </div>
        <image
          :src="filters.icon('icon-more-gray')"
          class="titleBox-right-more"
          @click="showPop = true" 
        ></image>
      </div>
    </div>
    <div class="imageListBox">
      <swiper class="imageListBox-swiper">
        <swiper-item v-for="(url,idx) in evaluateDetail.fileList" :key="url">
          <image :src="url" mode="aspectFill" @click="onPreview(idx)"></image>
        </swiper-item>
      </swiper>
    </div>
    <div class="dramaBox" v-if="evaluateDetail.dramaItem">
      <image
        :src="evaluateDetail.dramaItem.dramaCover"
        class="dramaBox-cover"
        mode="aspectFill"
      ></image>
      <span class="dramaBox-title">{{
        evaluateDetail.dramaItem.dramaName
      }}</span>
      <u-icon name="arrow-right" color="#DDDDDD" size="16px" />
      <image
        :src="filters.icon(evaluateDetail.dramaItem.sellType)"
        class="dramaBox-sellType"
      ></image>
    </div>
    <div class="content">{{ evaluateDetail.content }}</div>
    <div class="date">{{ evaluateDetail.createdTime }}</div>
    <div class="space"></div>
    <div class="commentTitle">评论</div>
    <div class="commentList" v-if="commentList.length > 0">
      <div v-for="item in commentList" :key="item.id" class="commentList-item">
        <image :src="item.avatar" class="commentList-item-avatar"></image>
        <div class="commentList-item-info">
          <span class="commentList-item-info-title">{{ item.nickName }}</span>
          <span class="commentList-item-info-content">{{ item.content }}</span>
          <span class="commentList-item-info-date">{{ item.commentDate }}</span>
        </div>
        <image :src="filters.icon('icon-unLike')" class="commentList-item-love"></image>
        <!-- <span class="commentList-item-count">{{ item. }}</span> -->
      </div>
    </div>
    <div class="empty-comment" v-else>
      <span class="empty-comment-title">还没有人评论哦</span>
      <span class="empty-comment-note">快成为第一个坐沙发的小可爱吧</span>
    </div>
    <div class="space"></div>
    <div class="bottomBox">
      <div class="bottomBox-commentBox" @click="isInput = true">
        <!-- <image :src="filters.icon('')"></image> -->
        展开说说吧...
      </div>
      <div class="bottomBox-comment">
        <image :src="filters.icon('dynamic-like')"></image>
        点赞
      </div>
      <div class="bottomBox-collect">
        <image :src="filters.icon('dynamic-share')"></image>
        收藏
      </div>
      <div class="bottomBox-like">
        <image :src="filters.icon('dynamic-comment')"></image>
        评论
      </div>
    </div>
    <div class="popCommentBox" v-if="isInput">
      <div class="coverBox" @click="isInput = false"></div>
      <div class="popCommentBox-content" :style="expand">
        <div class="popCommentBox-content-commentBox">
          <textarea
            placeholder="请输入..."
            auto-focus
            auto-height
            v-model="comment"
          ></textarea>
        </div>
        <div
          class="popCommentBox-content-send"
          :class="{ active: comment.length > 0 }"
          @click="onSaveComment"
        >
          发送
        </div>
      </div>
    </div>
    <u-popup :show="showPop" @close="showPop = false" @open="showPop = true">
      <div class="popBox">
        <div
          class="menu"
          v-if="userInfo.id === evaluateDetail.userItem.id"
          @click="onEdit"
        >
          <image :src="filters.icon('icon-store-edit')" />
          <span class="menu-title">编辑</span>
        </div>
      </div>
    </u-popup>
  </div>
</template>
<script setup lang="ts">
const { api, storeApi, filters, useUser, enums, dayjs } = useInstance();
/**
 * 评价详情信息
 */
let evaluateId: any = ref();
let evaluateDetail: any = reactive({});
let userInfo: any = reactive({});
let showPop = ref(false);
let isInput = ref(false);
let keyboardHeight = ref(0);
let commentList: any = reactive([]);
let comment = ref("");
let pageNo = ref(1);
let totalNo = ref(0);

onLoad(async (options: any) => {
  evaluateId.value = options.id;

  uni.onKeyboardHeightChange((res) => {
    keyboardHeight.value = res.height;
  });
});

onShow(async (options) => {
  if(uni.getStorageSync('isPrview')){
    uni.removeStorageSync('isPrview');
    return;
  }

  pageNo.value = 1;
  let res = await useUser.getUserInfo();
  Object.assign(userInfo, res);

  await queryEvaluateDetail();
  await queryCommentPage();
});


//触底加载更多
onReachBottom(async () => {
  if(totalNo.value === commentList.length)return;

  pageNo.value++;
  await queryCommentPage();
});

const images = computed(() => {
  if (!evaluateDetail.attachments) return [];
  return evaluateDetail.attachments.map((v: any) => v.fileUrl);
});

const expand = computed(() => {
  return `padding-bottom: ${
    keyboardHeight.value > 0 ? keyboardHeight.value : 20
  }px`;
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

function onPreview(current:any){
  uni.setStorageSync('isPrview', true);

  let sources:any = [];
  evaluateDetail.fileList.map((v:any) => {
    sources.push({
      url: v,
      type: "image"
    });
  });

  uni.previewMedia({
    current,
    sources
  })
}

//刷新用户信息
async function onRefreshUserInfo() {
  let res = await useUser.getUserInfo(true);
  Object.assign(userInfo, res);
}
//查询评价详情
async function queryEvaluateDetail() {
  try {
    let res: any = await api.dynamicDetail({
      id: evaluateId.value,
      userId: userInfo.id,
    });
    Object.assign(evaluateDetail, res);
  } catch (e) {}
}
//查询评论列表
async function queryCommentPage() {
  try {
    if (pageNo.value === 1) commentList.splice(0);

    let res: any = await api.queryDynamicCommentPage({
      pageNo: pageNo.value,
      pageSize: 10,
      userDynamicId: evaluateId.value,
      userId: userInfo.id,
    });
    if (res.records.length > 0) {
      commentList.push(...res.records);
    }
    totalNo.value = res.total;
  } catch (e) {}
}
//保存评论
async function onSaveComment() {
  await api.addUserDynamicComment({
    content: comment.value,
    userDynamicId: evaluateId.value,
    userId: userInfo.id,
  });
  isInput.value = false;
  comment.value = '';

  await queryCommentPage();
}

function onEdit(){
  showPop.value = false;
  
  uni.navigateTo({
    url: `./edit?id=${evaluateId.value}`
  })
}

async function onFocus(){
  await storeApi.updateUserFocus({
    flag: evaluateDetail.isFocus ? false : true,
    focusUserId:evaluateDetail.userItem.id,
    userId: userInfo.id,
  })
  await queryEvaluateDetail();
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
  margin-left: 32rpx;
  margin-top: 192rpx;
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
        @include text-middle(32rpx, #111);
        @include text-overflow-line(1);
      }
      &-tag {
        width: 116rpx;
        height: 26rpx;
        margin-top: 4rpx;
      }
    }
    &-avatar {
      width: 70rpx;
      height: 70rpx;
      border-radius: 64rpx;
    }
  }
  &-right {
    @include hor;
    align-items: center;
    position: relative;
    &-focus {
      margin-right: 32rpx;
      width: 106rpx;
      height: 50rpx;
      background: #c3fd52;
      border-radius: 25rpx;
      @include text-bold(24rpx, #1a1a1a);
      @include hor-center-center;
      line-height: 50rpx;
    }
    &-hasFocus {
      margin-right: 32rpx;
      width: 106rpx;
      height: 50rpx;
      background: #d6d6d6;
      border-radius: 25rpx;
      @include text-bold(24rpx, #fff);
      @include hor-center-center;
      line-height: 50rpx;
    }
    &-more {
      padding: 20rpx 30rpx 20rpx 0px;
      width: 40rpx;
      height: 8rpx;
    }
  }
}
.imageListBox {
  margin-top: 20rpx;
  margin-left: 10rpx;
  width: 730rpx;
  height: 1006rpx;
  border-radius: 28rpx;
  overflow: hidden;
  &-swiper {
    width: 100%;
    height: 100%;
  }
}
.dramaBox {
  margin-top: 18rpx;
  margin-left: 20rpx;
  width: 710rpx;
  background: #f8f8f8;
  border-radius: 24rpx;
  padding: 12rpx;
  box-sizing: border-box;
  position: relative;
  @include hor-center;
  &-cover {
    width: 94rpx;
    height: 94rpx;
    border-radius: 20rpx;
  }
  &-title {
    margin-left: 14rpx;
    @include text-middle(28rpx, #000);
    display: flex;
    flex: 1;
  }
  &-sellType {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 60rpx;
    height: 32rpx;
  }
}
.content {
  @include text-normal(30rpx, #333);
  margin: 36rpx 34rpx 0px 32rpx;
}
.date {
  margin: 40rpx 0px 0px 32rpx;
  @include text-normal(22rpx, #bababa);
}
.space {
  margin-top: 46rpx;
  width: 100vw;
  height: 2rpx;
  background: #f5f5f5;
}
.commentTitle {
  margin: 24rpx 0px 0px 44rpx;
  @include text-normal(30rpx, #111);
}
.commentList {
  margin: 44rpx 0rpx 0px 30rpx;
  @include ver;
  padding-bottom: 10vh;
  &-item {
    @include hor;
    padding-bottom: 60rpx;
    position: relative;
    &-avatar {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
    }
    &-info {
      @include ver;
      margin-left: 18rpx;
      &-title {
        @include text-middle(30rpx, #959aa5);
      }
      &-content {
        margin-top: 14rpx;
        @include text-normal(30rpx, #2e323e);
        max-width: 70vw;
        @include text-overflow-line(5);
      }
      &-date {
        @include text-normal(24rpx, #959aa5);
        margin-top: 10rpx;
      }
    }
    &-love{
        position: absolute;
        right: 0px;
        top: 0px;
        width: 28rpx;
        height: 28rpx;
        padding: 10rpx 32rpx 6rpx 32rpx;
    }
  }
}
.empty-comment {
  @include ver-center;
  justify-content: center;
  height: 30vh;
  &-title {
    @include text-normal(24rpx, #000);
  }
  &-note {
    margin-top: 14rpx;
    @include text-normal(24rpx, #999);
  }
}

.bottomBox {
  position: fixed;
  left: 0px;
  right: 0px;
  bottom: 0px;
  // height: 152rpx;
  padding-bottom: 76rpx;
  z-index: 2;
  background: #fff;
  @include hor;
  align-items: flex-start;
  border-top: 2rpx solid #ebebeb;
  &-commentBox {
    margin-top: 10rpx;
    margin-left: 28rpx;
    width: 262rpx;
    height: 66rpx;
    background: #f8f8f8;
    border-radius: 46rpx;
    margin-right: 30rpx;
    @include text-normal(28rpx, #bdbdbd);
    @include hor-center-center;
    image {
      width: 28rpx;
      height: 28rpx;
    }
  }
  &-comment,
  &-collect,
  &-like {
    @include hor-center;
    @include text-normal(28rpx, #666);
    margin-top: 18rpx;
    image {
      width: 44rpx;
      height: 44rpx;
      margin-right: 10rpx;
    }
  }
  &-comment,
  &-collect {
    margin-right: 40rpx;
  }
}
.popCommentBox {
  @include fixed-center;
  z-index: 10;
  .coverBox {
    @include fixed-center;
    z-index: 1;
    background: rgba($color: #000000, $alpha: 0.5);
  }
  &-content {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: #fff;
    z-index: 1;
    border-radius: 24rpx 24rpx 0px 0px;
    @include hor-center;
    &-commentBox {
      margin: 20rpx 0px 0px 20rpx;
      width: 77vw;
      min-height: 10vh;
      border-radius: 16rpx;
      background: #f8f8f8;
      padding: 20rpx;
      box-sizing: border-box;
      @include text-normal(30rpx, #444444);
      textarea{
        width: 100% !important;
      }
    }
    &-send {
      width: 52px;
      height: 32px;
      background: #bcbfc5;
      border-radius: 32rpx;
      margin-left: 28rpx;
      @include text-normal(28rpx, #fff);
      @include hor-center-center;
    }
    .active {
      background: #36e4bb;
    }
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