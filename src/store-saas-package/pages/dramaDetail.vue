<template>
  <image class="fixedBg" :src="bgImg" mode="aspectFill" />
  <div class="mask" :style="bgColorCode"></div>
  <jy-navigationBar :barHeight="0" :background="showColor" position="sticky">
    <template v-slot:content>
      <div class="topbar">
        <image
          :src="filters.icon('dark-round-back')"
          class="topbar-back"
          @click="onBack"
        />
        <span class="topbar-text" v-show="showColor === 'white'">开本详情</span>
      </div>
    </template>
  </jy-navigationBar>
  <div class="wrapper">
    <!-- 封面 -->
    <div class="cover">
      <book3d
        class="cover-book"
        v-if="bgImg"
        :width="240"
        :height="320"
        :depth="30"
        :cover="bgImg"
      />
    </div>
    <!-- 剧本信息 -->
    <div class="info">
      <div class="info-title">
        <span class="info-title-text">{{ dramaInfo.dramaName }}</span>
        <image
          class="info-title-tag"
          :src="filters.icon('isDiscount')"
          v-if="dramaInfo.isDiscount"
        />
      </div>
      <div class="info-content">
        <image class="info-content-icon" :src="filters.icon('icon-member')" />
        <span class="info-content-text"
          >{{ dramaInfo.maleGamerNum }}男{{ dramaInfo.femaleGamerNum }}女</span
        >
        <image class="info-content-icon" :src="filters.icon('icon-time')" />
        <span class="info-content-text">{{ dramaInfo.gameTime }}小时</span>
        <image class="info-content-icon" :src="filters.icon('icon-age')" />
        <span class="info-content-text">适龄{{ age }}</span>
      </div>
      <div class="info-content">
        <span class="info-content-text">{{ theme }}</span>
      </div>
    </div>
    <!-- 剧本角色 -->
    <div class="character" v-if="showCharacter">
      <div class="character-title">剧本角色</div>
      <scroll-view class="character-roleBox" scroll-x="true" enable-flex="true">
        <div
          class="character-roleBox-role"
          v-for="(item, idx) in dramaInfo.dramaRoleList"
          :key="idx"
        >
          <image
            class="character-roleBox-role-img"
            :src="item.roleUrl"
            mode="aspectFill"
          />
          <div class="character-roleBox-role-name">{{ item.roleName }}</div>
        </div>
      </scroll-view>
    </div>
    <!-- 剧本简介 -->
    <div class="introduction">
      <div class="introduction-text">简介</div>
      <div class="introduction-author">作者： {{ author }}</div>
      <div class="introduction-author">发行：{{ publisher }}</div>
      <div class="introduction-detail" v-html="dramaInfo.content"></div>
      <div class="introduction-safe"></div>
    </div>
  </div>
  <!--  弹出框  -->
  <u-popup :show="show" :round="24" mode="bottom" @close="closePopup">
    <popup :dramaId="dramaInfo.dramaId" :price="dramaInfo.currentPrice" @pay="onPay"></popup>
  </u-popup>
  <!-- 底部按键 -->
  <div class="tabbar">
    <div class="tabbar-btn" @click="switchToOnlineGame">
      <span>{{
        Number.isFinite(dramaInfo.currentPrice) && dramaInfo.currentPrice != 0
          ? `￥${dramaInfo.currentPrice / 100}/场`
          : "免费"
      }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import book3d from "../components/book-3d.vue";
import popup from "../components/popup.vue";
const { filters, useUser, sassApi, useStore, getColor, doPay, orderPay } = useInstance();

let storeInfo: any = reactive({}); //门店信息
let dramaInfo: any = reactive({}); //剧本信息
let bgImg = ref();
let bgColor = ref("");
let bgColorCode = computed(
  () =>
    `background: linear-gradient(180deg, rgba(${bgColor.value}, 0.8) 0%, rgba(${bgColor.value}) 100%)`
);
let showCharacter = ref(false);
let showColor = ref("");
let age = ref("");
let theme = ref("");
let author = ref("");
let publisher = ref("");
let show = ref(false);
let userInfo: any = reactive({});
let noPayInfo: any = reactive({});

onLoad(async (props: any) => {
  /*获取用户详情*/
  Object.assign(userInfo, await useUser.getUserInfo());
  await queryDramaDetail(props.dramaId, props.productId);
});

onPageScroll((e) => {
  if (e.scrollTop > 50) {
    showColor.value = "white";
  } else {
    showColor.value = "";
  }
});

async function handleDramaDetail() {
  /*获取背景图片*/
  bgImg.value = dramaInfo.dramaCover;
  bgColor.value = (await getColor(bgImg.value)) as string;
  if (dramaInfo.dramaRoleList.length > 0) showCharacter.value = true;
  /*处理剧本适龄*/
  switch (dramaInfo.dramaAgeAppropriate) {
    case "EXCEED_8":
      age.value = "8+";
      break;
    case "EXCEED_12":
      age.value = "12+";
      break;
    case "EXCEED_16":
      age.value = "16+";
      break;
    case "EXCEED_18":
      age.value = "18+";
      break;
    default:
      age.value = "";
  }

  /*处理剧本主题*/
  let themeList = [];
  for (let item of dramaInfo.dramaThemeList) themeList.push(item.dictValue);
  theme.value = themeList.join("/");

  /*处理作者*/
  let authorList = [];
  for (let item of dramaInfo.authorItems) authorList.push(item.authorName);
  author.value = authorList.join("/");

  /*处理发行者*/
  let publisherList = [];
  for (let item of dramaInfo.publisherItems)
    publisherList.push(item.publisherName);
  publisher.value = publisherList.join("/");
}

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

function closePopup() {
  show.value = false;
}

/*跳转到剧本详情页面*/
const switchToOnlineGame = (() => {
  let isThrottled = false;

  return () => {
    if (!isThrottled) {
      if(noPayInfo[0].orderStatus === 'NOT_PAY'){
        orderPay(noPayInfo[0].id, userInfo.id).then(_=>{

        })
      }else{
        if (dramaInfo.currentPrice > 0) {
          show.value = true;
        } else {
          onPay(null);
        }
      }
    
      isThrottled = true;
      setTimeout(() => {
        isThrottled = false;
      }, 1000); // 设置节流时间间隔（以毫秒为单位）
    }
  };
})();

async function checkProductOrder(){
  let res:any = await sassApi.checkProductOrder({
    productId: dramaInfo.productId,
    storeId: useStore.storeId,
    productType: 'BOX_OFFICE_PRODUCT',
    userId: userInfo.id,
  })
  Object.assign(noPayInfo, res.orderInfo);
}

//支付
function onPay(coupon:any) {
  doPay(
    userInfo.id,
    dramaInfo.currentPrice,
    dramaInfo.productType,
    dramaInfo.productName,
    dramaInfo.productId,
    "STORE_USER",
    "USER",
    1,
    null,
    useStore.storeId,
    coupon,
    null,
    null
  ).then((orderId: any) => {
    uni.navigateTo({ url: `/onlineGame-dm-package/pages/index?dramaId=${dramaInfo.dramaId}`})
  }).catch(e=>{
    checkProductOrder();
  })
}

async function queryDramaDetail(dramaId:any, productId:any) {
  /*获取剧本详情*/
  let res: any = await sassApi.getDramaDetail({
    id: dramaId,
    productId,
    storeId: useStore.storeId,
  });
  Object.assign(dramaInfo, res);
  handleDramaDetail();
  await checkProductOrder();
}
</script>

<style scoped lang="scss">
.fixedBg {
  width: 100vw;
  height: 100vh;
}

.mask {
  z-index: -1;
  position: fixed;
  width: 100vw;
  height: 100vh;
  content: "";
  inset: 0;
  backdrop-filter: blur(10rpx);
}

.topbar {
  height: 64rpx;

  &-back {
    width: 64rpx;
    height: 64rpx;
    margin-left: 32rpx;
  }
  &-text {
    margin-left: 25%;
  }
}

.wrapper {
  overflow: hidden;
  @include ver-center;
}

.cover {
  position: relative;
  width: 100%;
  height: 394rpx;

  &-book {
    position: absolute;
    left: 35%;
  }
}

.info {
  width: 686rpx;
  height: 158rpx;

  &-title {
    margin-bottom: 24rpx;

    &-text {
      margin-bottom: 24rpx;
      vertical-align: middle;
      @include text-custom(600, 32rpx, #ffffff);
    }

    &-tag {
      width: 128rpx;
      height: 36rpx;
      margin-left: 12rpx;
      vertical-align: middle;
    }
  }

  &-content {
    &-text {
      margin-right: 16rpx;
      vertical-align: middle;
      @include text-custom(400, 28rpx, rgba(255, 255, 255, 0.6));
    }

    &-icon {
      width: 28rpx;
      height: 28rpx;
      margin-right: 8rpx;
      vertical-align: middle;
    }
  }
}

.character {
  width: 686rpx;
  height: 228rpx;
  margin-top: 32rpx;

  &-title {
    margin-left: -12rpx;
    @include text-custom(500, 32rpx, #ffffff);
  }

  &-roleBox {
    width: 686rpx;
    height: 168rpx;
    @include hor;

    &-role {
      margin: 16rpx 68rpx 0 0;
      width: 140rpx;
      height: 168rpx;
      @include ver-center;

      &-img {
        margin: 0 auto;
        border: 2rpx solid rgba(245, 245, 245, 0.3);
        @include circle(110rpx);
      }

      &-name {
        text-align: center;
        @include text-overflow-line($line: 1);
        @include text-custom(400, 28rpx, #ffffff);
      }
    }
  }
}

.introduction {
  width: 686rpx;
  margin-top: 72rpx;

  &-text {
    margin-left: -12rpx;
    @include text-custom(500, 32rpx, #ffffff);
  }

  &-author {
    margin-top: 20rpx;
    @include text-overflow-line($line: 1);
    @include text-custom(400, 28rpx, rgba(255, 255, 255, 0.6));
  }

  &-detail {
    margin-top: 12rpx;
    @include text-custom(400, 28rpx, #ffffff);
  }

  &-safe {
    width: 100%;
    height: 168rpx;
  }
}

.tabbar {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 168rpx;
  background: #ffffff;
  box-shadow: 0rpx -2rpx 20rpx 0rpx rgba(0, 0, 0, 0.07);

  &-btn {
    width: 670rpx;
    height: 88rpx;
    padding: 0;
    border: 2rpx solid #d9d9d9;
    margin: 24rpx auto 0 auto;
    background: #1d202a;
    border-radius: 24rpx;
    text-align: center;
    line-height: 88rpx;
    @include text-custom(500, 28rpx, #ffffff);

    &:active {
      background: rgba(0, 0, 0, 0.7);
    }
  }
}
</style>