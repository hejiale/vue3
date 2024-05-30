<template>
  <div>
    <jy-navigationBar>
      <template v-slot:content>
        <div class="topBar">
          <image
            :src="filters.icon('store-top-back')"
            class="topBar-back"
          ></image>
          <div class="topBar-item" @click="onBack"></div>
          <div class="topBar-item"></div>
        </div>
      </template>
    </jy-navigationBar>
    <div v-if="storeInfo.id">
      <swiper
      class="swiperBannerBox"
      :current="current"
      @change="onChangeCurrent"
      @click.stop="onGoAlbum"
      v-if="storeInfo.imageList.length"
    >
      <swiper-item v-for="v in storeInfo.imageList" :key="v.id">
        <div class="swiperBannerBox-item">
          <image
            :src="v.fileUrl"
            class="swiperBannerBox-item-cover"
            mode="aspectFill"
            v-if="isImage(v.fileUrl)"
          />
          <video
            :src="v.fileUrl"
            :controls="false"
            autoplay
            loop
            :enable-progress-gesture="false"
            v-else
          ></video>
        </div>
      </swiper-item>
      </swiper>
      <div class="swiperBannerBox" @click="onGoAlbum" v-else>
        <div class="swiperBannerBox-item">
          <image
            :src="storeInfo.storeDoorstep || storeInfo.storeLogo"
            class="swiperBannerBox-item-cover"
            mode="aspectFill"
          />
        </div>
      </div>
      <div class="numBox" v-if="storeInfo.imageList.length" @click="onGoAlbum">
        <image :src="filters.icon('store-banner-tag')" class="numBox-tag" />
        <span class="numBox-title"
          >{{ current + 1 }}/{{ storeInfo.imageList.length }}</span
        >
      </div>
      <view class="scrollBox">
        <div class="scrollBox-content">
          <div class="scrollBox-content-infoBox">
            <image
              :src="storeInfo.storeLogo"
              class="scrollBox-content-infoBox-cover"
              mode="aspectFill"
            />
            <div class="scrollBox-content-infoBox-right">
              <div class="scrollBox-content-infoBox-right-title">
                {{ storeInfo.storeName }}
              </div>
              <div class="scrollBox-content-infoBox-right-addressBox" @click.stop="onLocation">
                <span class="scrollBox-content-infoBox-right-addressBox-address">{{ storeInfo.storeAddress }}</span>
                <div class="scrollBox-content-infoBox-right-addressBox-line"></div>
                <span class="scrollBox-content-infoBox-right-addressBox-distance">{{ filters.metersTransferThousand(storeInfo.distance) }}</span>
                <image :src="filters.icon('right-arrow-gray')"></image>
              </div>
            </div>
          </div>
          <div class="scrollBox-content-addressBox">
            <div
              class="scrollBox-content-addressBox-rateBox"
              v-if="storeInfo.evaluateItem.comprehensiveScore"
            >
              <image
                :src="filters.icon('store-star')"
                class="scrollBox-content-addressBox-rateBox-star"
              />
              <span class="scrollBox-content-addressBox-rateBox-rate">{{
                storeInfo.evaluateItem.comprehensiveScore
              }}</span>
              <div class="scrollBox-content-addressBox-rateBox-rate-environment">
                {{ storeInfo.evaluateItem.environmentScore }}
              </div>
              <div class="scrollBox-content-addressBox-rateBox-rate-service">
                {{ storeInfo.evaluateItem.serviceScore }}
              </div>
              <div class="scrollBox-content-addressBox-rateBox-rate-dm">
                {{ storeInfo.evaluateItem.dmScore }}
              </div>
            </div>
            <div class="scrollBox-content-addressBox-noneScore" v-else>
              暂无评分
            </div>
            <div
              class="scrollBox-content-addressBox-wantBox"
              v-if="storeInfo.wangCount || storeInfo.explosiveCount"
            >
              <div
                class="scrollBox-content-addressBox-wantBox-item mr4"
                v-if="storeInfo.wangCount"
              >
                {{ storeInfo.wangCount }}人想去
              </div>
              <div
                class="scrollBox-content-addressBox-wantBox-item"
                v-if="storeInfo.explosiveCount"
              >
                {{ storeInfo.explosiveCount }}人气值
              </div>
            </div>
            <div class="scrollBox-content-addressBox-wechat" @click="onWechat">
              <image :src="filters.icon('store-wechat')" />
            </div>
            <div class="scrollBox-content-addressBox-iphone" @click="onPhone">
              <image :src="filters.icon('store-phone')" />
            </div>
          </div>
          <div
            class="scrollBox-content-introduceBox"
            :class="{overflowLine: !isOpen}"
          >
            <span v-html="storeInfo.storeDescription || ''"></span>
            <div
              class="scrollBox-content-introduceBox-openBox"
              v-if="storeInfo.storeDescription.length > 30"
              @click="onFold"
            >
              {{ isOpen ? "收起" : "...展开" }}
            </div>
          </div>
          <div class="scrollBox-content-cell" v-if="storeInfo.storeDMItemList.length">
            <div class="scrollBox-content-cell-tabBar" @click="onGoMore('dm')">
              <div
                class="scrollBox-content-cell-tabBar-item"
              >
                主持人
              </div>
              <div class="scrollBox-content-cell-tabBar-moreBox">
                更多<image :src="filters.icon('right-arrow-gray')"></image>
              </div>
            </div>
            <u-scroll-list indicator indicatorColor="#D2D2D2" indicatorActiveColor="#0C0C0C">
              <div
                class="swiperDM-box-item"
                v-for="(v) in storeInfo.storeDMItemList"
                :key="v.id"
              >
                <div class="swiperDM-box-item-coverBox">
                  <image :src="v.avatar" class="cover" mode="aspectFill" />
                  <div class="scoreBox">{{ evaluateScore(v.evaluate) }}</div>
                </div>
                <div class="nickNmeBox">
                  <span class="nickNmeBox-title">{{ v.userName || "" }}</span>
                  <image :src="filters.icon('light-male')" v-if="v.sex === 'MALE'"></image>
                  <image :src="filters.icon('light-female')" v-else></image>
                </div>
                <span class="count">带本134场</span>
              </div>
            </u-scroll-list>
          </div>
          <div class="scrollBox-content-cell" v-if="storeInfo.storeRecommendDramaList.length">
            <div class="scrollBox-content-cell-tabBar" @click.stop="onGoMore('drama')">
              <div class="scrollBox-content-cell-tabBar-item">
                本店剧本
              </div>
              <div
                class="scrollBox-content-cell-tabBar-moreBox"
              >
                更多<image :src="filters.icon('right-arrow-gray')"></image>
              </div>
            </div>
            <u-scroll-list indicator indicatorColor="#D2D2D2" indicatorActiveColor="#0C0C0C">
              <div
                class="swiperDrama-box-item"
                v-for="(v) in storeInfo.storeRecommendDramaList"
                :key="v.id"
                @click="onGoDramaDetail(v.id)"
              >
                <div class="swiperDrama-box-item-coverBox">
                  <image :src="v.dramaCover" class="cover" mode="aspectFill" />
                  <div class="scoreBox">
                    {{ v.evaluate || 0 }}
                  </div>
                  <image
                    :src="filters.icon(v.sellType)"
                    v-if="v.sellType"
                    class="swiperDrama-box-item-coverBox-sellType"
                  />
                  <div class="shadowBox"></div>
                </div>
                <div class="title">
                  {{ v.dramaName }}
                </div>
              </div>
            </u-scroll-list>
          </div>
          <div class="scrollBox-content-tabBar">
            <div class="scrollBox-content-tabBar-item" @click="onChangeTab(0)">
              <div class="value" :class="{activeStatus: tab === 0}">
                正在组局
              </div>
              <div class="line" :class="{active: tab === 0}"></div>
              <div
                class="tag"
                :class="{activeStatus: tab === 0}"
                v-if="gatherTotal > 0"
              >
                {{ gatherTotal }}
              </div>
            </div>
            <div class="scrollBox-content-tabBar-item" @click="onChangeTab(1)">
              <div class="value" :class="{activeStatus: tab === 1}">
                评价
              </div>
              <div class="line" :class="{active: tab === 1}"></div>
              <div
                class="tag"
                :class="{activeStatus: tab === 1}"
                v-if="evaluateTotal > 0"
              >
                {{ evaluateTotal }}
              </div>
            </div>
          </div>
          <div class="listBox" v-if="tab === 0">
            <jy-gatheringList
              :gatherList="gatheringList"
            ></jy-gatheringList>
            <jy-noMore v-if="endLoad && gatheringList.length"></jy-noMore>
            <jy-noData v-if="!gatheringList.length" bgUrl="empty-gather" subTitle="当前城市暂时没有组局～" button="发起组局" @on-click="onGoGather"></jy-noData>
          </div>
          <div class="listBox" v-if="tab === 1">
            <evaluateBox
              :parama="v"
              v-for="v in evaluateList"
              :key="v.id"
              @on-evaluate="onGoEvaluateDetail"
              @activeUser="onActiveUser"
            ></evaluateBox>
            <jy-noMore v-if="endLoad && evaluateList.length"></jy-noMore>
            <jy-noData v-if="!evaluateList.length" bgUrl="empty-evaluate" title="暂无剧评" subTitle="暂时还没有发布过评价～"></jy-noData>
          </div>
        </div>
      </view>
      <div class="bottomBox" :class="isScroll ? 'menuMove' : 'menuMoveEnd'">
        <div class="bottomBox-menu" @click="onCollect">
          <image
            :src="filters.icon('store-collect-select')"
            v-if="storeInfo.hasCollect"
            class="bottomBox-menu-icon"
          />
          <image :src="filters.icon('store-collect')" v-else  class="bottomBox-menu-icon"/>
          <span class="bottomBox-menu-title">{{
            storeInfo.hasCollect ? "已收藏" : "收藏"
          }}</span>
        </div>
        <div class="bottomBox-menu" @click="onWantPlay">
          <image
            :src="filters.icon('store-wantPlay-select')"
            v-if="storeInfo.hasWantRecord"
            class="bottomBox-menu-icon"
          />
          <image :src="filters.icon('store-wantPlay')"  class="bottomBox-menu-icon" v-else />
          <span class="bottomBox-menu-title">{{
            storeInfo.hasWantRecord ? "已想去" : "想去"
          }}</span>
        </div>
        <div class="bottomBox-menu">
          <image :src="filters.icon('store-game')" class="bottomBox-menu-icon"/>
          <image :src="filters.icon('store-game-text')" class="bottomBox-menu-tag"></image>
        </div>
        <div class="bottomBox-menu" @click="onGoEvaluate">
          <image :src="filters.icon('store-evaluate')"  class="bottomBox-menu-icon"/>
          <span class="bottomBox-menu-title">{{
            storeInfo.evaluateItem.hasComment ? "已评价" : "写评价"
          }}</span>
        </div>
        <div class="bottomBox-menu" @click="onGoGather">
          <image :src="filters.icon('store-gather')"  class="bottomBox-menu-icon"/>
          <span class="bottomBox-menu-title">发起组局</span>
        </div>
      </div>
    </div>
    <u-skeleton
      rows="50"
      title
      loading
      :animate="true"
      :rowsWidth="['100%', '100%', '100%']"
      :rowsHeight="['308rpx', '308rpx', '308rpx']"
      class="skeleton"
      v-else
    ></u-skeleton>
    <div class="topBox" v-if="showTop">
      <div
        class="topBox-backBox"
        :style="{ 'top': `${menuRect.top}px`, 'height': `${menuRect.height}px` }"
        @click.stop="onBack"
      >
        <image
          :src="filters.icon('store-back')"
          class="topBox-backBox-back"
        />
        <span class="topBox-backBox-title">{{ storeInfo.storeName }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import evaluateBox from '../components/evaluateList.vue';
const {
  api,
  storeApi,
  useUser,
  filters,
  judgeMediaType,
  menuButtonRect,
  systemInfo
} = useInstance();

let current = ref(0);
let tab = ref(0);
let showTop = ref(false);
//胶囊react
let menuRect: any = reactive({});
//设备信息
let phoneSystem: any = reactive({});
let isOpen = ref(false);
//底部菜单栏显示标志位
let isScroll = ref(false);
let timer: any = reactive({});
const userInfo: any = reactive({});
//店铺信息
let storeInfo: any = reactive({});
//组局信息
let gatheringList: Array<any> = reactive([]);
//剧评信息
let evaluateList: Array<any> = reactive([]);
let gameNum = ref("");
let confirming = ref(false);
let pageNo = ref(1);
let gatherTotal = ref(0);
let evaluateTotal = ref(0);
//重复点击标志位
let canDo = ref(false);

onLoad(async (options: any) => {
  let res = await menuButtonRect();
  Object.assign(menuRect, res);

  res = await systemInfo();
  Object.assign(phoneSystem, res);

  await queryUserInfo();

  if (options.storeId) {
    await queryStoreDetail(options.storeId);
  }
  // //分享海报过来
  // if(options.scene){
  //   await queryStoreDetail(options.scene);
  // }
  // //查询组局
  await queryGatheringList();
});

onShow(async () => {});

//触底加载更多
onReachBottom(async () => {
  pageNo.value++;

  if (tab.value === 0) {
    queryGatheringList();
  } else {
    queryEvaluateList();
  }
});

//上啦滚动事件
onPageScroll((e:any) =>  {
  showTop.value = e.scrollTop > 100;
  isScroll.value = true;

  //监听滚动结束
  clearTimeout(timer);

  timer = setTimeout(() => {
    isScroll.value = false;
  }, 500);
})

//加载完了
const endLoad = computed(() => {
  return (tab.value === 0 && gatheringList.length === gatherTotal.value) || (tab.value === 1 && evaluateList.length === evaluateTotal.value);
})

//判断是否图片格式
const isImage = computed(() => (file: any) => {
  if (file) {
    if (judgeMediaType(file) === "image") {
      return true;
    }
    return false;
  }
  return false;
});

//评价得分
const evaluateScore = computed(() => (score: number) => {
  if (!score) return 0;
  return score.toFixed(1);
});

//返回
function onBack() {
  if (getCurrentPages().length === 1) {
    uni.switchTab({
      url: "/pages/index/index",
    });
  } else {
    uni.navigateBack();
  }
}

//切换banner
function onChangeCurrent(event: any) {
  current.value = event.detail.current;
}

//切换组局剧评栏
function onChangeTab(v: any) {
  //滚动到吸顶的位置
  uni.pageScrollTo({
    scrollTop: phoneSystem.windowHeight * 0.832
  })
  tab.value = v;
  pageNo.value = 1;

  if (v === 0) {
    queryGatheringList();
  } else {
    queryEvaluateList();
  }
}

//激活用户
function onActiveUser() {}

//展开店铺介绍
function onFold() {
  isOpen.value = !isOpen.value;
}
//请求店铺详情
async function queryStoreDetail(storeId: any) {
  try {
    let data: any = await storeApi.getStoreHome({
      storeId,
      userId: userInfo.id,
      lon: "120.63132",
      lat: "31.30227",
    });
    //图片视频排序
    if (data.imageList.length) {
      let arr: Array<any> = [];
      const videos: any = data.imageList.filter(
        (v:any) => judgeMediaType(v.fileUrl) !== "image"
      );
      const images: any = data.imageList.filter(
        (v:any) => judgeMediaType(v.fileUrl) === "image"
      );
      arr.push(...videos, ...images);

      data.imageList = arr;
    }
    
    Object.assign(storeInfo, data);
    evaluateTotal.value = data.evaluateItem.evaluateCount;
  } catch (e) {
    console.log(e);
  }
}
//获取用户信息
async function queryUserInfo() {
  let res = await useUser.getUserInfo();
  Object.assign(userInfo, res);
}

//定位
function onLocation() {
  uni.openLocation({
    longitude: storeInfo.longitude,
    latitude: storeInfo.latitude,
    address: storeInfo.storeAddress, //xxx
    success: (res) => {
      console.log(res);
    },
    fail: (err) => {
      console.log(err);
    },
  });
}

//打电话
async function onPhone() {
  uni.makePhoneCall({
    phoneNumber: storeInfo.telephone,
  });
}

//复制微信
function onWechat() {
  uni.setClipboardData({
    data: storeInfo.wxNumber,
    success() {
      uni.showToast({
        title: "微信号复制成功",
      });
    },
    fail(e) {
      console.log(e);
    },
  });
}

//去相册
function onGoAlbum() {
  uni.setStorageSync("store-detail", JSON.stringify(storeInfo));
  uni.navigateTo({ url: "./album" });
}

//查询组局列表
async function queryGatheringList() {
  if (pageNo.value === 1) {
    gatheringList.splice(0);
  }

  try {
    let data:any = await storeApi.getGatheringList({
      pageNo: pageNo.value,
      pageSize: 10,
      cityId: uni.getStorageSync('city-info').id,
      storeId: storeInfo.id,
      lon: uni.getStorageSync('longitude'),
      lat: uni.getStorageSync('latitude'),
    });
    
    if (data.records.length) {
      gatheringList.push(...data.records);
    }
    gatherTotal.value = data.total;
  } catch (e) {}
}

//查询店铺评价列表
async function queryEvaluateList() {
  if (pageNo.value === 1) {
    evaluateList.splice(0)
  }

  try {
    let data:any = await storeApi.evaluatePageList({
      pageNo: pageNo.value,
      pageSize: 10,
      storeId: storeInfo.id,
      userId: userInfo.id,
    });
    
    if (data.records.length) {
      evaluateList.push(...data.records);
    }
    evaluateTotal.value = data.total;
  
  } catch (e) {}
}

//收藏
async function onCollect() {
  if (canDo.value) return;
  canDo.value = true;

  try {
    await storeApi.storePlayFocus({
      playStatus: "COLLECT",
      status: storeInfo.hasCollect ? "DISABLE" : "ENABLE",
      storeId: storeInfo.id,
      userId: userInfo.id,
    });
    storeInfo.hasCollect = storeInfo.hasCollect ? false : true;
    canDo.value = false;
  } catch (e) {
    canDo.value = false;
  }
}

//想去
async function onWantPlay() {
  if (canDo.value) return;
  canDo.value = true;

  try {
    await storeApi.storePlayFocus({
      playStatus: "WANT_PLAY",
      status: storeInfo.hasWantRecord ? "DISABLE" : "ENABLE",
      storeId: storeInfo.id,
      userId: userInfo.id,
    });
    storeInfo.hasWantRecord = storeInfo.hasWantRecord ? false : true;
    canDo.value = false;
  } catch (e) {
    canDo.value = false;
  }
}

//发起组局
function onGoGather() {
  
}

//发起评价
function onGoEvaluate() {
  uni.setStorageSync('store-info', storeInfo);
  
  if (storeInfo.evaluateItem.hasComment) {
    uni.navigateTo({
      url: `./evaluate-edit?id=${storeInfo.evaluateItem.hasComment}`,
    });
  } else {
    uni.navigateTo({
      url: "./evaluate-edit",
    });
  }
}

//查看评价详情
function onGoEvaluateDetail(id: any) {
  uni.navigateTo({
    url: `./evaluateDetail?id=${id}`,
  });
}

//更多DM或剧本
function onGoMore(type: string) {
  uni.setStorageSync("store-detail", JSON.stringify(storeInfo));

  if (type === "dm") {
    uni.navigateTo({
      url: `./store-dm`,
    });
  } else {
    uni.navigateTo({
      url: `./store-drama`,
    });
  }
}

//剧本详情
function onGoDramaDetail(id: any) {}

</script>
<style lang="scss" scoped>
.scrollBox {
  position: relative;
  &-content {
    border-radius: 20px;
    background: #fafafa;
    margin-top: 23vh;
    z-index: 1;
    &-infoBox {
      @include hor;
      padding-top: 48rpx;
      margin-left: 40rpx;
      &-cover {
        width: 100rpx;
        height: 100rpx;
        border-radius: 6px;
        border: 1px solid #dfdfdf;
      }
      &-right {
        @include ver;
        margin-left: 24rpx;
        &-title {
          width: 74vw;
          @include text-bold(38rpx, #2e323e);
          @include text-overflow-line(1);
        }
        &-addressBox{
          margin-top: 8rpx;
          @include hor-center;
          &-address{
            @include text-normal(26rpx, #959AA5);
            max-width: 60%;
            @include text-overflow-line(1);
          }
          &-line{
            margin: 0 8rpx;
            width: 2rpx;
            height: 24rpx;
            background: #E8E8E8;
          }
          &-distance{
            @include text-normal(26rpx, #959AA5);
            margin-right: 8rpx;
          }
          image{
            width: 16rpx;
            height: 16rpx;
          }
        }
      }
    }
    &-addressBox {
      margin: 9px 0 0 40rpx;
      width: 93.2vw;
      position: relative;
      &-rateBox {
        @include hor;
        align-items: baseline;
        margin-top: 5px;
        &-star {
          width: 8px;
          height: 8px;
        }
        &-rate {
          margin-left: 2px;
          margin-right: 16rpx;
          color: #ff6300;
          font-size: 34rpx;
          font-family: OPPOSans-Heavy, OPPOSans;
          color: #ff6300;
          line-height: 40rpx;
          &-environment {
            color: #ff6300;
            font-size: 11px;
            margin-right: 6px;
          }
          &-environment::before {
            content: "环境: ";
            color: #5f6572;
          }
          &-service {
            color: #ff6300;
            font-size: 11px;
            margin-right: 6px;
          }
          &-service::before {
            content: "服务: ";
            color: #5f6572;
          }
          &-dm {
            color: #ff6300;
            font-size: 11px;
            margin-right: 6px;
          }
          &-dm::before {
            content: "DM: ";
            color: #5f6572;
          }
        }
      }
      &-wantBox {
        @include hor;
        align-items: center;
        margin-top: 12rpx;
        &-item {
          color: #5f6572;
          line-height: 14px;
          background: #f5f5f5;
          border-radius: 8px;
          padding: 8rpx 16rpx;
          border-radius: 8px;
          @include text-normal(20rpx, #2e323e);
        }
      }
      &-wechat,
      &-iphone {
        @include ver;
        align-items: center;
        position: absolute;
        right: 24rpx;
        top: 0px;
        image {
          width: 48rpx;
          height: 80rpx;
        }
      }
      &-iphone {
        right: 148rpx;
      }
    }
    &-cell {
      margin: 18rpx 24rpx 0px 24rpx;
      padding: 24rpx;
      background: #ffffff;
      border-radius: 32rpx;
      &-tabBar {
        @include hor-between-center;
        align-items: center;
        position: relative;
        padding-bottom: 18rpx;
        &-item {
          @include ver;
          align-items: center;
          position: relative;
          @include text-bold(28rpx, #2e323e);
        }
        &-moreBox {
          @include hor-center;
          @include text-normal(24rpx, #959aa5);
          image {
            width: 16rpx;
            height: 16rpx;
          }
        }
      }
      .swiperDM-box {
        white-space: nowrap;
        padding-top: 24rpx;
        &-item {
          display: inline-flex;
          flex-direction: column;
          margin-right: 10rpx;
          width: 156rpx;
          &-coverBox {
            position: relative;
            overflow: hidden;
            border-radius: 6px;
            width: 156rpx;
            height: 156rpx;
            @include hor-center-center;
            box-sizing: border-box;
            .cover {
              @include abs-center;
            }
            .shadow {
              @include abs-center;
              background: rgba(24, 24, 24, 0.53);
              backdrop-filter: blur(4px);
              z-index: 1;
            }
            .scoreBox {
              position: absolute;
              bottom: 0rpx;
              right: 0rpx;
              display: flex;
              padding: 0 8rpx;
              height: 30rpx;
              background: rgba($color: #000000, $alpha: 0.6);
              font-size: 20rpx;
              font-family: OPPOSans, OPPOSans;
              font-weight: 800;
              color: #ffffff;
              border-top-left-radius: 12rpx;
              border-bottom-right-radius: 12rpx;
            }
            .scoreBox::after {
              content: "分";
              @include text-normal(20rpx, #fff);
            }
          }
          .nickNmeBox {
            @include hor-center;
            margin-top: 8rpx;
            &-title{
              @include text-overflow-line(1);
              max-width: 70%;
              white-space: normal;
              @include text-bold(24rpx, #2e323e);
            }
            image{
              margin-left: 16rpx;
              width: 24rpx;
              height: 24rpx;
            }
          }
          .count{
            @include text-normal(22rpx, #999);
          }
        }
      }
      .swiperDrama-box {
        padding-top: 24rpx;
        white-space: nowrap;
        &-item {
          display: inline-flex;
          flex-direction: column;
          margin-right: 10rpx;
          width: 156rpx;
          &-coverBox {
            position: relative;
            overflow: hidden;
            border-radius: 6px;
            width: 156rpx;
            height: 228rpx;
            @include hor-center-center;
            .cover {
              @include abs-center;
            }
            .shadow {
              @include abs-center;
              background: rgba(24, 24, 24, 0.53);
              backdrop-filter: blur(4px);
              z-index: 1;
            }
            .scoreBox {
              position: absolute;
              bottom: 8rpx;
              left: 8rpx;
              display: flex;
              z-index: 1;
              font-size: 22rpx;
              font-family: OPPOSans, OPPOSans;
              font-weight: 800;
              color: #ffffff;
            }
            .scoreBox::after {
              content: "分";
              @include text-normal(22rpx, #fff);
            }
            &-sellType {
              position: absolute;
              right: 8rpx;
              top: 8rpx;
              width: 60rpx;
              height: 32rpx;
            }
            .shadowBox {
              position: absolute;
              left: 0px;
              bottom: 0px;
              width: 100%;
              height: 48rpx;
              background: linear-gradient(
                360deg,
                rgba(0, 0, 0, 0.8) 0%,
                rgba(9, 9, 9, 0) 100%
              );
            }
          }
          .title {
            @include text-middle(24rpx, #2e323e);
            margin-top: 16rpx;
            @include text-overflow-line(1);
            width: 90%;
            white-space: normal;
          }
        }
      }
    }
    &-tabBar {
      padding: 46rpx 24rpx 16rpx 46rpx;
      @include hor;
      align-items: center;
      position: sticky;
      top: 11vh;
      background: #fafafa;
      z-index: 1;
      &-item {
        @include ver;
        align-items: center;
        position: relative;
        margin-right: 64rpx;
        .value {
          @include text-normal(30rpx, #959aa5);
          line-height: 36rpx;
          position: relative;
        }
        .line {
          margin-top: 6rpx;
          width: 32rpx;
          height: 6rpx;
          background: #fff;
          border-radius: 2px;
        }
        .active {
          background: #36e4bb;
        }
        .activeStatus {
          color: #2e323e !important;
          font-size: 32rpx;
          font-family: PingFang SC-Medium, PingFang SC !important;
          font-weight: 500 !important;
        }
        .tag {
          position: absolute;
          left: 100%;
          top: -10rpx;
          @include text-middle(18rpx, #959aa5);
        }
      }
    }
    &-introduceBox {
      padding-top: 24rpx;
      margin: 0 24rpx;
      @include text-normal(30rpx, #5F6572);
      word-break: break-all;
      position: relative;
      &-openBox {
        position: absolute;
        right: 0;
        bottom: 0;
        @include text-normal(28rpx, #2E323E);
        background: #fff;
        line-height: 32rpx;
        height: 42rpx;
        display: flex;
      }
    }
    .overflowLine {
      @include text-overflow-line(1);
    }
  }
}
.numBox {
  position: absolute;
  right: 16px;
  top: 19.7vh;
  padding: 0px 5px;
  height: 19px;
  min-width: 40px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 11px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  @include hor-center-center;
  align-items: center;
  &-tag {
    width: 13px;
    height: 13px;
  }
  &-title {
    margin-left: 3px;
    @include text-bold(20rpx, #fff);
  }
}
.swiperBannerBox {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 33.13vh;
  &-item {
    width: 100%;
    height: 100%;
    position: relative;
    @include hor-center-center;
    &-cover {
      @include abs-center;
    }
    image:nth-child(2) {
      width: 36px;
      height: 36px;
      z-index: 1;
    }
    video {
      width: 100%;
      height: 100%;
    }
  }
}
.scroll-views {
  width: 126rpx;
  height: 8rpx;
  background: rgba($color: #d2d2d2, $alpha: 0.5);
  border-radius: 12rpx;
  margin-top: 20rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  .scroll-box {
    width: 38rpx;
    height: 8rpx;
    background: #0c0c0c;
    border-radius: 12rpx;
  }
}
.bottomBox {
  position: fixed;
  left: 42rpx;
  right: 42rpx;
  bottom: 4.18vh;
  height: 112rpx;
  background: rgba(46, 50, 62, 0.8);
  border-radius: 28px;
  @include hor-center-center;
  z-index: 101;
  backdrop-filter: blur(9px);
  &-menu {
    margin-right: 40rpx;
    @include ver;
    align-items: center;
    &-icon {
      width: 82rpx;
      height: 44rpx;
    }
    &-title {
      margin-top: 4rpx;
      @include text-normal(20rpx, #fff);
      height: 28rpx;
    }
    &-tag{
      margin-top: 4rpx;
      width: 62rpx;
      height: 28rpx;
    }
  }
}
.listBox {
  // padding-top: 24rpx;
  min-height: 80vh;
}
.topBox {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 11vh;
  background: #fff;
  z-index: 100;
  &-backBox {
    position: absolute;
    left: 24rpx;
    width: 60vw;
    @include hor;
    align-items: center;
    &-back {
      width: 36rpx;
      height: 36rpx;
    }
    &-title {
      @include text-bold(32rpx, #2e323e);
      margin-left: 24rpx;
      @include text-overflow-line(1);
      width: 90%;
    }
  }
}
.menuMove {
  transform: translateY(100px);
  transition: 0.4s;
}
.menuMoveEnd {
  transform: translateY(0px);
  transition: 0.4s;
}
.topBar{
  padding-left: 24rpx;
  width: 176rpx;
  height: 64rpx;
  position: relative;
  @include hor-center;
  image{
    @include abs-center;
    width: 176rpx;
    height: 64rpx;
    z-index: -1;
  }
  &-item{
    display: 1;
    flex: 1;
    height: 100%;
  }

}
</style>