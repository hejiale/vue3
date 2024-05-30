<template>
  <jy-navigationBar :barHeight= "42" background= #FFFFFF position="relative">
    <template v-slot:content>
      <div class="topBar">
        <!-- 返回 -->
        <image class="topBar-back" :src="filters.icon('store-back')" @click="onBack"/>
        <!-- 搜索框 -->
        <div class="topBar-search">
          <image class="topBar-search-icon" :src="filters.icon('icon-search')"/>
          <image class="topBar-search-text" :src="filters.icon('saas-search')"/>
        </div>
      </div>
    </template>
    <template v-slot:view>
      <div class="wrapper">
        <!-- 开本记录 -->
        <div class="history">
          <image :src="filters.icon('saas-history')"/>
        </div>
        <!-- 弹窗 -->
        <div class="popup" v-if="showPopup">
          <image :src="filters.icon('saas-popup')"/>
          <image class="popup-cover" :src="playingInfo.dramaItem.dramaCover" mode="aspectFill"></image>
          <div class="popup-info">
            <div class="popup-info-top">
              <span class="popup-info-top-title">{{ playingInfo.dramaItem.dramaName }}</span>
              <!-- <span class="popup-info-top-role">(自己)</span> -->
            </div>
            <div class="popup-info-bottom">
              <span class="popup-info-bottom-status">进行中</span>
              <!-- <span class="popup-info-bottom-divider"></span>
              <span class="popup-info-bottom-participant" v-for="idx in 6" :key="idx"></span> -->
            </div>
          </div>
          <div class="popup-view">
            <span class="popup-view-text">查看</span>
          </div>
          <!-- <image class="popup-close" :src="filters.icon('saas-icon-close')" @click="closePopup"/> -->
        </div>
        <!-- 剧本选择 -->
        <scroll-view class="scrollBox" scroll-y="true" enable-flex="true" @scrolltolower=fetchDramaList :style="{ 'height': showPopup ? 'calc(100% - 92rpx - 146rpx - 16rpx )' : 'calc(100% - 92rpx - 16rpx )' }">
            <div class="drama" v-for="(item, idx) in dramaList" :key="idx" @click="switchToDramaDetail(item.dramaId, item.id)" :style="{ 'margin-left': idx % 3 === 0 ? '0rpx' : '16rpx' }">
              <!-- 封面 -->
              <div class="drama-cover">
                <image class="drama-cover-tag" :src="filters.icon(item.sellType)"/>
                <image class="drama-cover-img" :src="item.dramaCover"  mode="aspectFill"/>
              </div>
              <!-- 剧本名称 -->
              <div class="drama-title">{{ item.productName }}</div>
              <!-- 价格 -->
              <div class="drama-price">
                {{ Number.isFinite(item.currentPrice) && item.currentPrice != 0 ? `￥${ item.currentPrice / 100 }/场` : '免费' }}
              </div>
              <!-- 标签 -->
              <span class="drama-tag" v-if="!item.isDiscount">再开{{ item.activeLastCount }}场可1折</span>
              <image class="drama-discountTag" :src="filters.icon('isDiscount')" v-if="item.isDiscount"/>
            </div>
          <div class="bottom" v-if="isReachBottom">
            <image class="bottom-bottomOut" :src="filters.icon('saas-bottom-out')"/>
          </div>
        </scroll-view>
      </div>
    </template>
  </jy-navigationBar>
</template>

<script setup lang="ts">
const { filters, sassApi, useStore, useUser } = useInstance();

let showPopup = ref(true); //控制弹窗显示
let dramaList: any[] = reactive([]); //剧本列表
let pageNo: number = 1; //当前请求页数
let pageSize: number = 18; //每页显示数目
let isReachBottom = ref(false); //控制弹窗显示
let isFetching = false; //用于fetchDramaList节流
let userInfo:any = reactive({});
let playingInfo:any = reactive({});

onMounted(async () => {
  await useStore.setStoreId(10);
  Object.assign(userInfo, await useUser.getUserInfo());

  await queryIsPlaying();
  fetchDramaList();
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

/*关闭弹窗*/
function closePopup() {
  showPopup.value = false;
}

/*跳转到剧本详情页面*/
const switchToDramaDetail = (() => {
  let isThrottled = false;

  return (dramaId:any, productId:any) => {
    if (!isThrottled) {
      uni.navigateTo({ url: `/store-saas-package/pages/dramaDetail?dramaId=${dramaId}&productId=${productId}`});

      isThrottled = true;
      setTimeout(() => {
        isThrottled = false;
      }, 1000); // 设置节流时间间隔（以毫秒为单位）
    }
  };
})();

//获取剧本数据
async function fetchDramaList() {
  if (!isReachBottom.value && !isFetching) {
    isFetching = true;

    try {
      let res: any = await sassApi.getAuthorizedBoxProductList({
        "isPutOn": true,
        "orderby": "",
        "pageNo": pageNo,
        "pageSize": pageSize,
        "productName": "",
        "storeId": useStore.storeId
      });

      res.records.forEach((record:any) => {
        dramaList.push(record);
      });
      pageNo++;
      if (res.records.length < pageSize) {
        isReachBottom.value = true;
      }
    } catch (error) {
      // Handle error
    } finally {
      isFetching = false;
    }
  }
}

async function queryIsPlaying() {
  try {
    let data:any = await sassApi.getStoreCurrentGame({
      storeId: useStore.storeId,
    })

    let index = data.findIndex((it:any)=>it.murderMysteryOnlineRecord.dmId === userInfo.id);

    if(index !== -1){
      Object.assign(playingInfo, data[index]);
      showPopup.value = true;
    }else{
      Object.assign(playingInfo, {});
      showPopup.value = false;
    }
  } catch (e) {}
}
</script>

<style scoped lang="scss">
.topBar {
  position: relative;
  height: 64rpx;
  @include hor-center;

  &-back {
    width: 32rpx;
    height: 32rpx;
    margin-left: 32rpx;
  }
  
  &-search {
    width: 430rpx;
    height: 64rpx;
    border: 2rpx solid #2E323E;
    margin-left: 32rpx;
    border-radius: 20rpx;
    @include hor-center;

    &-icon {
      width: 32rpx;
      height: 32rpx;
      margin-left: 20rpx;
    }

    &-text {
      width: 168rpx;
      height: 40rpx;
      margin-left: 8rpx;
    }
  }
}

.wrapper {
  height: 100%;
  @include ver-center;
}

.history {
  width: 686rpx;
  height: 92rpx;
}

.popup {
  position: relative;
  width: 702rpx;
  height: 146rpx;
  overflow: hidden;

  &-cover {
    position: absolute;
    left: 24rpx;
    top: 34rpx;
    width: 72rpx;
    height: 96rpx;
    border: 2rpx solid #D9D9D9;
    border-radius: 6rpx;
  }

  &-info {
    position: absolute;
    left: 112rpx;
    top: 42rpx;
    height: 80rpx;
    font-size: 0; //消除span间的空格

    &-top {
      &-title {
        @include text-custom(600, 28rpx, #2E323E);
      }

      &-role {
        margin-left: 12rpx;
        @include text-custom(600, 28rpx, #5F6572);
      }
    }

    &-bottom {
      margin-top: 4rpx;
      @include hor-center;

      &-status {
        @include text-custom(600, 26rpx, #959AA5);
      }

      &-divider {
        display: inline-block;
        width: 1rpx;
        height: 20rpx;
        margin: 0 12rpx 0 14rpx;
        background: #DADADA;
      }

      &-participant {
        display: inline-block;
        margin-left: 4rpx;
        background: rgb(255, 185, 31);
        @include circle(28rpx);
      }
    }
  }

  &-view {
    position: absolute;
    top: 60rpx;
    right: 48rpx;
    width: 130rpx;
    height: 50rpx;
    background: #F4F3F4;
    border-radius: 28rpx;
    @include ver-center-center;

    &-text {
      @include text-custom(600,26rpx,#2E323E);
    }
  }

  &-view:active {
    background: rgba(0, 0, 0, 0.1);
  }

  &-close {
    position: absolute;
    top: 24rpx;
    right: 16rpx;
    @include circle(32rpx);
  }

  &-close:active {
    background: rgba(0, 0, 0, 0.1);
  }
}

.scrollBox {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-top: 16rpx;
  width: 686rpx;
}

.drama {
  width: 218rpx;
  height: 432rpx;
  margin-bottom: 32rpx;

  &-cover {
    position: relative;
    width: 218rpx;
    height: 290rpx;
    background: #9b9b9b;
    border-radius: 16rpx;

    &-tag {
      position: absolute;
      top: 0;
      right: 0;
      width: 60rpx;
      height: 32rpx;
      border-radius: 0 12rpx 0 12rpx;
    }

    &-img {
      border-radius: 16rpx;
    }
  }

  &-title {
    margin-top: 18rpx;
    @include text-custom(500,28rpx,#2E323E);
    @include text-overflow-line(1);
  }

  &-price {
    margin-top: 6rpx;
    @include text-custom(500,24rpx,#EB5353);
  }

  &-tag {
    padding: 4rpx 16rpx;
    margin-top: 8rpx;
    background: #F5F5F5;
    border-radius: 18rpx;
    @include text-custom(400,22rpx,#959AA5);
  }

  &-discountTag {
    width: 128rpx;
    height: 36rpx;
    margin-top: 8rpx;
  }
}

.bottom {
  width: 100%;
  @include ver-center;

  &-bottomOut {
    width: 178rpx;
    height: 48rpx;
    padding-bottom: 30rpx;
  }
}
</style>