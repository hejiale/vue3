<template>
  <div class="recommendBox">
    <!-- 头部banner -->
    <div class="recommendBox-bannerBox">
      <image
        :src="serviceDynamicField.bkUrl"
        class="recommendBox-bannerBox-bg"
        mode="aspectFill"
      />
      <image
        :src="serviceDynamicField.actUrl"
        class="recommendBox-bannerBox-act"
        mode="aspectFill"
      />
      <swiper
        class="recommendBox-bannerBox-swiperBox"
        autoplay
        :style="swiperTop"
        circular
      >
        <swiper-item v-for="banner in indexBanner" :key="banner.id">
          <image
            :src="banner.activityImg"
            class="recommendBox-bannerBox-swiperBox-swiperImg"
            mode="aspectFill"
          ></image>
        </swiper-item>
      </swiper>
      <!-- 弹幕 -->
      <barrage :promotionList="promotionList"></barrage>
    </div>
    <!-- 我的组局 -->
    <div class="recommendBox-myGatherBox" v-if="myGatherList.length">
      <div class="recommendBox-myGatherBox-leftBox">
        <image class="coverGray" :style="curGatherBgColor"/>
        <div class="recommendBox-myGatherBox-leftBox-titleBox" @click.stop="onGoCityGather(0)">
          <span class="title">我的组局</span>
          <div class="countBox">
            {{ gatheringList.total }}场拼场中
            <u-icon name="arrow-right" size="12" color="#fff" top="1"></u-icon>
          </div>
        </div>
        <swiper class="recommendBox-myGatherBox-leftBox-swiperBox" vertical @change="onChangeGather" autoplay :interval="4000">
          <swiper-item v-for="gather in myGatherList" :key="gather.id" @click="onGatherDetail(gather.id)">
            <div class="swiper-gatherBox">
              <div class="swiper-gatherBox-gatherInfo">
                <div class="swiper-gatherBox-gatherInfo-store">
                  <image :src="filters.icon('icon-store-white')" class="swiper-gatherBox-gatherInfo-store-tag"/>
                  <span>{{ filters.metersTransferThousand(gather.distance) }}</span>
                  <div class="line"></div>
                  <span class="storeName">{{ gather.storeName }}</span>
                </div>
                <div class="swiper-gatherBox-gatherInfo-store">
                  <image :src="filters.icon('icon-date-white')" class="swiper-gatherBox-gatherInfo-store-tag"/>
                  <span>{{ openStartGatherDate(gather) }}</span>
                </div>
                <div class="swiper-gatherBox-gatherInfo-membersBox">
                  <div class="swiper-gatherBox-gatherInfo-membersBox-avatars">
                    <div class="swiper-gatherBox-gatherInfo-membersBox-avatars-avatarBox" v-for="(member,idx) in moreGatherMembers(gather)" :key="member.id" :style="avatarStyle(idx)">
                      <image :src="filters.processLogo(member.avatar)" />
                    </div>
                  </div>
                  <div class="swiper-gatherBox-gatherInfo-membersBox-percentBox" :class="{successStatus: gatherFullStyle(gather)}" :style="avatarWidth(gather)"></div>
                  <div class="swiper-gatherBox-gatherInfo-membersBox-wait">{{ filters.doCalculateNeedCount(gather) }}</div>
                </div>
                <div class="swiper-gatherBox-gatherInfo-openTime">{{ filters.calculateEndTime(gather.gameStartTime) }}</div>
              </div>
              <div class="swiper-gatherBox-dramaInfo">
                <image :src="gather.dramaItem.dramaCover" mode="aspectFill" class="swiper-gatherBox-dramaInfo-dramaCover"/>
                <span class="swiper-gatherBox-dramaInfo-dramaName">{{ gather.dramaItem.dramaName }}</span>
                <span class="swiper-gatherBox-dramaInfo-dictValue">{{ filters.doCalculateDramaDicts(gather.dramaItem.dicts) }}</span>
              </div>
            </div>
          </swiper-item>
        </swiper>
      </div>
      <div class="recommendBox-myGatherBox-rightBox">
        <div class="recommendBox-myGatherBox-rightBox-titleBox" @click.stop="onGoCityGather(0)">
          <span>同城组局</span>
          <div class="arrow">
            <div class="recommendBox-myGatherBox-rightBox-titleBox-tagCountBox">
            {{ gatheringList.total }}场拼场中
            </div>
            <u-icon size="12" color="#FE3A29" top="1" name="arrow-right"></u-icon>
          </div>
        </div>
        <swiper class="recommendBox-myGatherBox-rightBox-swiper" circular vertical :interval="4000" autoplay>
          <swiper-item
          v-for="gatherObj in gatheringList.records"
          :key="gatherObj.id"
          @click="onGatherDetail(gatherObj.id)"
          >
          <div class="recommendBox-myGatherBox-rightBox-swiper-gatherInfo">
            <div class="dramaInfo">
              <image :src="filters.processImage(gatherObj.dramaItem.dramaCover, 160)" class="dramaInfo-dramaCover" mode="aspectFill"/>
              <div class="dramaInfo-dramaName">{{ gatherObj.dramaItem.dramaName }}</div>
              <div class="dramaInfo-dict">{{ filters.doCalculateDramaDicts(gatherObj.dramaItem.dicts) }}</div>
              <div class="dramaInfo-price">¥{{ gatherObj.dramaItem.originPrice / 100 }}/位</div>
            </div>
            <div class="gatherSubInfo">
              <div class="gatherSubInfo-store">
                  <image :src="filters.icon('icon-store')" class="gatherSubInfo-store-tag"/>
                  <span>{{ filters.metersTransferThousand(gatherObj.distance) }}</span>
                  <div class="line"></div>
                  <span class="storeName">{{ gatherObj.storeName }}</span>
                </div>
                <div class="gatherSubInfo-store mt6">
                  <image :src="filters.icon('icon-date')" class="gatherSubInfo-store-tag"/>
                  <span>{{ openStartGatherDate(gatherObj) }}</span>
                </div>
                <div class="gatherSubInfo-store mt6">
                  <image :src="filters.icon('icon-people')" class="gatherSubInfo-store-tag"/>
                  <div class="gatherSubInfo-store-membersBox">
                    <div class="gatherSubInfo-store-membersBox-avatars">
                      <div class="gatherSubInfo-store-membersBox-avatars-avatarBox" :style="avatarStyle(idx)" v-for="(member,idx) in moreRightGatherMembers(gatherObj)" :key="member.id">
                        <image :src="filters.processLogo(member.avatar)" />
                        <div class="gatherSubInfo-store-membersBox-avatars-avatarBox-cover" v-if="idx === 4">
                          <image :src="filters.icon('icon-more')"/>
                        </div>
                      </div>
                    </div>
                    <div class="gatherSubInfo-store-membersBox-wait">{{ filters.gatherNeedCount(gatherObj) }}</div>
                    <span class="gatherSubInfo-store-membersBox-percent" v-if="gatherObj.gatherSuccessState">{{ gatherObj.gatherSuccessState }}</span>
                  </div>
                </div>
            </div>
          </div>
          </swiper-item>
        </swiper>
      </div>
    </div>
    <!-- 组局列表 -->
    <div class="recommendBox-gatheringBox" v-else>
      <div class="recommendBox-gatheringBox-titleBox" @click.stop="onGoCityGather(0)">
        <span>同城组局</span>
        <div class="recommendBox-gatheringBox-titleBox-tagCountBox">
          {{ gatheringList.total }}场拼场中
        </div>
        <div class="recommendBox-gatheringBox-titleBox-rightArrowBox">
          <span>全部{{ gatheringList.total }}</span>
          <u-icon name="arrow-right" size="12" top="1"></u-icon>
        </div>
      </div>
      <swiper class="recommendBox-gatheringBox-swiperBox" circular vertical autoplay :interval="2000" v-if="gatheringList.records && gatheringList.records.length">
        <swiper-item
          v-for="gatherObj in gatheringList.records"
          :key="gatherObj.id"
          class="swiperItem"
          @click="onGatherDetail(gatherObj.id)"
        >
          <div class="recommendBox-gatheringBox-swiperBox-gatheringBox">
            <image
              :src="filters.processImage(gatherObj.dramaItem.dramaCover, 160)"
              class="dramaCover"
              mode="aspectFill"
            ></image>
            <div class="gatherInfoBox">
              <div class="gatherInfoBox-dramaName">
                {{ gatherObj.dramaItem.dramaName }}
              </div>
              <div class="gatherInfoBox-memberBox">
                <image
                  :src="filters.processLogo(member.avatar)"
                  v-for="(member,idx) in memberList(gatherObj)"
                  :key="member.userId"
                  class="gatherInfoBox-memberBox-avatar"
                  :style="idx > 0 ? 'margin-left: -10px' : ''"
                />
                <span class="gatherInfoBox-memberBox-hasIn" :class="{ml6: gatherObj.gatheringMemberItemList.length}">{{ hasInGatheringCount(gatherObj) }}人已上车</span>
                <span class="gatherInfoBox-memberBox-noIn">{{ filters.doCalculateNeedCount(gatherObj) }}</span>
              </div>
              <div class="gatherInfoBox-openDate">
                开局：{{ openGatherDate(gatherObj) }}
              </div>
              <div class="gatherInfoBox-price">
                价格：¥{{ gatherObj.dramaItem.originPrice / 100 }}/位
              </div>
              <div
                class="gatherInfoBox-percent"
                v-if="gatherObj.gatherSuccessState"
              >
                {{ gatherObj.gatherSuccessState }}
              </div>
            </div>
          </div>
        </swiper-item>
      </swiper>
      <div class="recommendBox-gatheringBox-noData" v-else>
        <span class="recommendBox-gatheringBox-noData-title">当前城市暂时没有组局～</span>
        <div class="recommendBox-gatheringBox-noData-button">发起组局</div>
      </div>
    </div>
    <!-- 热销剧本列表 -->
    <div class="recommendBox-dramaListBox">
      <div class="recommendBox-dramaListBox-titleBox" @click.stop="onGoCityGather(2)">
        <span>热本推荐</span>
        <div class="recommendBox-dramaListBox-titleBox-rightArrowBox">
          <span>全部</span>
          <u-icon name="arrow-right" size="12" top="1"></u-icon>
        </div>
      </div>
      <u-scroll-list indicator indicatorColor="#D2D2D2" indicatorActiveColor="#36E4BB">
        <div class="recommendBox-dramaListBox-scrollBox-item" v-for="drama in hotDramaList" :key="drama.id" @click.stop="onGoDramaDetail(drama.id)">
          <image :src="drama.dramaCover" class="cover" mode="aspectFill"/>
          <span class="name">{{ drama.dramaName }}</span>
        </div>
      </u-scroll-list>
    </div>
    <!-- 附近门店列表 -->
    <div class="recommendBox-storeBox">
      <div class="recommendBox-storeBox-titleBox" @click.stop="onGoCityGather(1)">
        <span>附近的门店</span>
        <div class="recommendBox-storeBox-titleBox-rightArrowBox">
          <span>全部</span>
          <u-icon name="arrow-right" size="12" top="1"></u-icon>
        </div>
      </div>
      <u-scroll-list indicator indicatorColor="#D2D2D2" indicatorActiveColor="#36E4BB">
        <div class="recommendBox-storeBox-scrollBox-item" v-for="store in nearbyStoreList" :key="store.storeId">
          <image :src="filters.processLogo(store.storeLogo)" class="store-cover" mode="aspectFill"/>
          <span class="name">{{ store.storeName  }}</span>
          <span class="store-distance">{{ store.districtName }} {{ store.distance }}km</span>
        </div>
      </u-scroll-list>
    </div>
    <!-- 动态列表 -->
    <div class="recommendBox-dynamicListBox">
      <div class="recommendBox-dynamicListBox-top" @click.stop="onGoDynamic">
        <span class="recommendBox-dynamicListBox-top-title">剧圈动态</span>
        <div class="recommendBox-dynamicListBox-top-rightArrowBox">
          <span class="recommendBox-dynamicListBox-top-rightArrowBox-all">全部</span>
          <u-icon name="arrow-right" size="12" top="1"></u-icon>
        </div>
      </div>
      <div class="recommendBox-dynamicListBox-list">
        <div class="recommendBox-dynamicListBox-list-item" v-for="(dynamic,idx) in dynamicList" :key="dynamic.id" :style="waterFlowStyle(idx)">
          <subRank v-if="dynamic.id === -1" :rankingList="rankingList"></subRank>
          <dynamic v-else :dynamic="dynamic"></dynamic>
        </div>
      </div>
    </div>
  </div>
</template>   
<script setup lang="ts">
import dynamic from './dynamic.vue';
import subRank from './subRank.vue';
import barrage from './barrage.vue';
const { menuButtonRect, filters, dayjs, aliGetColor, systemInfo } = useInstance();
/**
 * 右顶部胶囊按钮react
 */
let menuRect: any = reactive({});

let system:any = reactive({});

let curGatherBgColor = ref('');

const props = defineProps({
  /**
   * 中部banner
   */
  promotionList: {
    type: Array<any>,
    default: () => [],
  },
  /**
   * 组局列表
   */
  gatheringList: {
    type: Object,
    default: () => {},
  },
  /**
   * 热销剧本
   */
  hotDramaList: {
    type: Array<any>,
    default: () => [],
  },
  /**
   * 我的组局列表
   */
  myGatherList: {
    type: Array<any>,
    default: () => [],
  },
  /**
   * 附近门店列表
   */
  nearbyStoreList: {
    type: Array<any>,
    default: () => [],
  },
  /**
   * 动态列表
   */
   dynamicList: {
    type: Array<any>,
    default: () => [],
  },
  /**
   * 排行榜列表
   */
   rankingList: {
    type: Array<any>,
    default: () => []
  }
});

onMounted(async () => {
  let res = await menuButtonRect();
  Object.assign(menuRect, res);
  res = await systemInfo();
  Object.assign(system, res);
});

//中部banner
const serviceDynamicField = computed(() => {
  if (!props.promotionList.length) return {};

  return JSON.parse(
    props.promotionList[1].activityPromotionList[0].serviceDynamicField
  );
});

//头部banner
const indexBanner = computed(() => {
  if (!props.promotionList.length) return {};

  return props.promotionList[0].activityPromotionList;
});

//swiper 距顶部距离
const swiperTop = computed(() => {
  return `top: ${menuRect.top + menuRect.height + 10}px;`;
});

//已上车人数
const hasInGatheringCount = computed(() => (gatheringInfo: any) => {
  return gatheringInfo.botMaleGamerNum + gatheringInfo.botFemaleGamerNum + gatheringInfo.realMaleGamerNum + gatheringInfo.realFemaleGamerNum;
});

//开局时间
const openGatherDate = computed(() => (gatheringInfo: any) => {
  if (!gatheringInfo) return "";
  return `${filters.formatGameTime(gatheringInfo.gameStartTime,gatheringInfo.gameEndTime)} ${filters.getWeek(gatheringInfo.gameDate)} ${dayjs(gatheringInfo.gameDate).format("MM.DD")}`;
});

//开局开始时间
const openStartGatherDate = computed(() => (gatheringInfo: any) => {
  if (!gatheringInfo) return "";
  return `${dayjs(gatheringInfo.gameStartTime).format('HH:mm')} ${filters.getWeek(gatheringInfo.gameDate)} ${dayjs(gatheringInfo.gameDate).format("MM.DD")}`;
});

//处理组局人数过多得情况
const memberList = computed(() => (gatheringInfo: any) => {
  if (gatheringInfo.gatheringMemberItemList && gatheringInfo.gatheringMemberItemList.length > 6) {
    return gatheringInfo.gatheringMemberItemList.splice(0, 6);
  }
  return gatheringInfo.gatheringMemberItemList;
})

//处理组局头像style
const avatarStyle = computed(() => (idx: number) => {
  return `margin-left: ${idx === 0 ? '0px':'-34rpx'}`
})

//处理我的组局左侧组局人数过多得问题，超过10个的情况
const moreGatherMembers = computed(() => (gatheringInfo: any) => {
  if(gatheringInfo.gatheringMemberItemList.length > 10){
    return gatheringInfo.gatheringMemberItemList.splice(0, 10);
  }
  return gatheringInfo.gatheringMemberItemList;
})

//处理我的组局右侧组局人数过多得问题，超过5个的情况
const moreRightGatherMembers = computed(() => (gatheringInfo: any) => {
  if(gatheringInfo.gatheringMemberItemList.length > 5){
    return gatheringInfo.gatheringMemberItemList.splice(0, 5);
  }
  return gatheringInfo.gatheringMemberItemList;
})

//处理组局人数的宽度
const avatarWidth = computed(() => (gatheringInfo: any) => {
  if(!gatheringInfo)return '';

  let width = system.screenWidth * 0.3733;
  let percent = (gatheringInfo.botMaleGamerNum + gatheringInfo.botFemaleGamerNum + gatheringInfo.realMaleGamerNum + gatheringInfo.realFemaleGamerNum) / (gatheringInfo.maleLimitNum + gatheringInfo.femaleLimitNum);
  return `width: ${width * percent}px`;
})

//瀑布流样式
const waterFlowStyle = computed(() => (idx: number) => {
  return `margin-right: ${idx % 2 === 0 ? '9px':'0px'}; margin-top: ${(idx > 0 && idx % 2 === 0) ? '-45px':'0px'}`;
})

//是否组满人的情况
const gatherFullStyle = computed(() => (gatheringInfo: any) => {
  return gatheringInfo.realMaleGamerNum + gatheringInfo.realFemaleGamerNum + gatheringInfo.botMaleGamerNum + gatheringInfo.botFemaleGamerNum === gatheringInfo.maleLimitNum + gatheringInfo.femaleLimitNum;
})

//监听
watch(
  props.hotDramaList,
  () => {
    if(props.hotDramaList.length){
      getColor(0);
    }
  },
  { immediate: true }
)

function onGoCityGather(type: number){
  uni.navigateTo({
    url:`/city-gather/pages/index?type=${type}`
  })
}

//处理我的组局swiper滚动
async function onChangeGather(e: any){
  getColor(e.detail.current);
}

//取色
async function getColor(current:number) {
  let res = await aliGetColor(props.hotDramaList[current].dramaCover);
  curGatherBgColor.value = `background: linear-gradient(180deg, rgb(${res}) 0%, rgba(${res},0) 100%)`
}

//跳转 
function onGoDynamic(){
  uni.navigateTo({
    url: `/dynamic-package/pages/index`
  })
}

function onGoDramaDetail(dramaId: any) {
  uni.navigateTo({url: '/drama-package/pages/index?dramaId=' + dramaId})
}

function onGatherDetail(id:any){
  uni.navigateTo({url: `/player-gather/pages/detail?id=${id}`})
}

</script>
<style lang="scss" scoped>
.recommendBox {
  position: relative;
  padding-bottom: calc((env(safe-area-inset-bottom) + 100rpx));
  &-bannerBox {
    position: relative;
    width: 100vw;
    height: 38.54vh;
    &-bg {
      @include abs-center;
    }
    &-act {
      position: absolute;
      left: 0px;
      right: 0px;
      bottom: 0px;
      height: 27.2vh;
      z-index: 1;
    }
    &-swiperBox {
      position: absolute;
      left: 0px;
      right: 0px;
      height: 176rpx;
      z-index: 2;
      &-swiperImg {
        margin-left: 24rpx;
        border-radius: 24rpx;
        height: 100%;
        width: calc(100vw - 48rpx);
      }
    }
  }
  &-gatheringBox {
    margin: 0px 24rpx;
    background: linear-gradient(180deg, #ffe9e8 0%, #ffffff 34%);
    border-radius: 10px;
    border: 1px solid #ffffff;
    padding: 18rpx;
    box-sizing: content-box;
    &-titleBox {
      @include hor-center;
      position: relative;
      span {
        @include text-middle(30rpx, #2e323e);
      }
      &-tagCountBox {
        @include hor-center-center;
        padding: 2rpx 8rpx;
        margin-left: 10rpx;
        background: linear-gradient(95deg, #ff7a00 0%, #fd2e2e 100%);
        border-radius: 0 16rpx 16rpx 16rpx;
        box-shadow: 0rpx 4rpx 6rpx 0rpx rgba(248, 104, 63, 0.34);
        background-size: 100% 100%;
        @include text-middle(20rpx, #fff);
      }
      &-rightArrowBox {
        position: absolute;
        right: 0px;
        @include text-normal(24rpx, #969ba6);
        @include hor-center;
      }
    }
    &-swiperBox {
      height: 186rpx;
      margin-top: 18rpx;
      .swiperItem{
        height: 186rpx;
      }
      &-gatheringBox {
        @include hor;
        .dramaCover {
          width: 132rpx;
          height: 176rpx;
          border-radius: 12rpx;
          border: 2rpx solid #d4d4d4;
        }
        .gatherInfoBox {
          margin-left: 20rpx;
          position: relative;
          @include ver;
          flex: 1;
          &-dramaName {
            @include text-bold(34rpx, #2e323e);
            line-height: 40rpx;
            width: 60%;
            @include text-overflow-line(1);
          }
          &-openDate,
          &-price {
            @include text-normal(26rpx, #5f6572);
            line-height: 30rpx;
            margin-top: 12rpx;
          }
          &-memberBox {
            @include hor;
            align-items: center;
            margin-top: 12rpx;
            &-avatar {
              @include circle(32rpx);
              border: 2rpx solid #ffffff;
              margin-left: 0px;
            }
            &-hasIn {
              @include text-normal(24rpx, #5f6572);
              line-height: 28rpx;
            }
            &-noIn {
              margin-left: 8rpx;
              @include text-normal(24rpx, #ff7a00);
              line-height: 28rpx;
            }
          }
          &-percent {
            position: absolute;
            right: 0px;
            top: 0px;
            @include text-normal(24rpx, #fd2e2e);
          }
          &-percent::before {
            content: "拼成率";
            color: #333;
          }
        }
      }
    }
    &-noData{
      @include ver-center;
      padding: 66rpx 0px 54rpx 0px;
      &-title{
        @include text-normal(26rpx, #5F6572);
      }
      &-button{
        margin-top: 16rpx;
        padding: 12rpx 24rpx;
        background: #2E323E;
        border-radius: 22px;
        @include text-bold(24rpx, #fff);
      }
    }
  }
  &-myGatherBox{
    margin: 0px 24rpx;
    @include hor;
    &-leftBox{
      @include ver;
      flex: 1;
      background: #1f1f1f;
      border-radius: 20rpx;
      padding: 18rpx;
      box-sizing: content-box;
      position: relative;
      overflow: hidden;
      height: 360rpx;
      .coverGray{
        @include abs-center;
      }
      &-titleBox{
        position: absolute;
        left: 18rpx;
        right: 18rpx;
        top: 18rpx;
        @include hor-between-center;
        .title{
          @include text-bold(28rpx, #fff);
        }
        .countBox{
          @include hor-center;
          @include text-normal(22rpx, #fff);
          opacity: .6;
        }
      }
      &-swiperBox{
        position: absolute;
        left: 18rpx;
        top: 76rpx;
        right: 18rpx;
        height: 82%;
        .swiper-gatherBox{
          @include ver;
          &-gatherInfo{
            height: 200rpx;
            background: linear-gradient(134deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
            border-radius: 12rpx;
            &-store{
              @include hor-center;
              @include text-normal(24rpx, #fff);
              padding: 14rpx 14rpx 0 14rpx;
              &-tag{
                @include react(30rpx);
                margin-right: 8rpx;
              }
              .line{
                width: 2rpx;
                height: 22rpx;
                background: #FFFFFF;
                opacity: 0.4;
                margin: 0px 8rpx;
              }
              .storeName{
                width: 55%;
                @include text-overflow-line(1);
              }
            }
            &-membersBox{
              margin: 12rpx;
              height: 46rpx;
              position: relative;
              border-radius: 45px;
              overflow: hidden;
              background: url('@/static/image/home/gather-percent-bg.png');
              background-size: 100% 100%;
              background-repeat: no-repeat;
              &-percentBox{
                position: absolute;
                left: 0px;
                height: 100%;
                background: linear-gradient(270deg, #F4883A 0%, rgba(187,95,44,0.8) 100%);
                border-radius: 45px;
                border: 1px solid #F4883A;
                z-index: 1;
                min-width: 60rpx;
              }
              .successStatus{
                background: linear-gradient(270deg, #36E467 0%, rgba(23,134,54,0.8) 100%);
                border: 1px solid #36E467;
              }
              &-avatars{
                position: absolute;
                left: 10rpx;
                @include hor-center;
                &-avatarBox{
                  @include circle(40rpx);
                  border: 1px solid #fff;
                  overflow: hidden;
                }
              }
              &-wait{
                @include text-normal(22rpx, #fff);
                text-align: right;
                width: 85%;
                line-height: 46rpx;
                @include abs-center;
                z-index: 2;
              }
            }
            &-openTime{
              @include text-bold(22rpx, #F4883A);
              text-align: center;
            }
            &-openTime::before{
              content: '距离开场时间还剩';
              font-size: 20rpx;
              color: #FFFFFF;
            }
          }
          &-dramaInfo{
            margin-top: 12rpx;
            height: 96rpx;
            background: #FFFFFF;
            border-radius: 12rpx;
            position: relative;
            @include hor-center;
            &-dramaCover{
              width: 72rpx;
              height: 100%;
              border-radius: 12rpx;
            }
            &-dramaName{
             @include text-bold(24rpx, #2E323E);
             @include text-overflow-line(1);
             max-width: 60%;
             left: 86rpx;
             position: absolute;
             top: 16rpx;
            }
            &-dictValue{
              position: absolute;
              left: 86rpx;
              bottom: 16rpx;
              @include text-normal(20rpx, rgba(46, 50, 62, 0.6));
              @include text-overflow-line(1);
              max-width: 60%;
            }
          }
        }
      }
    }
    &-rightBox{
      @include ver;
      flex: 1;
      margin-left: 18rpx;
      background: linear-gradient(180deg, #FFE9E8 0%, #FFFFFF 34%);
      border-radius: 20rpx;
      border: 1px solid #FFFFFF;
      padding: 10rpx 10rpx 0px 10rpx;
      box-sizing: content-box;
      &-titleBox {
        @include hor-between-center;
        position: relative;
        margin-left: 8rpx;
        span {
          @include text-middle(30rpx, #2e323e);
        }
        .arrow{
          @include hor-center;
          margin-right: 8rpx;
        }
        &-tagCountBox {
          @include hor-center-center;
          padding: 2rpx 8rpx;
          background: linear-gradient(95deg, #ff7a00 0%, #fd2e2e 100%);
          border-radius: 0 16rpx 16rpx 16rpx;
          box-shadow: 0rpx 4rpx 6rpx 0rpx rgba(248, 104, 63, 0.34);
          background-size: 100% 100%;
          @include text-middle(20rpx, #fff);
        }
      }
      &-swiper{
        @include ver;
        margin-top: 18rpx;
        height: 312rpx;
        &-gatherInfo{
          @include ver;
          .dramaInfo{
            @include hor;
            position: relative;
            // width: 100%;
            &-dramaCover{
              width: 96rpx;
              height: 128rpx;
              border-radius: 12rpx;
              margin-left: 8rpx;
            }
            &-dramaName{
              position: absolute;
              left: 114rpx;
              top: 0px;
              @include text-bold(28rpx, #2E323E);
              @include text-overflow-line(1);
              width: 50%;
              height: 34rpx;
            }
            &-dict{
              position: absolute;
              left: 114rpx;
              top: 52rpx;
              @include text-normal(24rpx, #959AA5);
              @include text-overflow-line(1);
            }
            &-price{
              position: absolute;
              left: 114rpx;
              top: 92rpx;
              @include text-normal(24rpx, #959AA5);
              @include text-overflow-line(1);
            }
          }
          .gatherSubInfo{
            margin-top: 12rpx;
            background: #F5F6F8;
            border-radius: 12rpx;
            padding: 18rpx 12rpx;
            &-store{
              @include hor-center;
              @include text-normal(24rpx, #5F6572);
              position: relative;
              &-tag{
                @include react(30rpx);
                margin-right: 8rpx;
              }
              .line{
                width: 2rpx;
                height: 22rpx;
                background: #5F6572;
                opacity: 0.4;
                margin: 0px 8rpx;
              }
              .storeName{
                width: 55%;
                @include text-overflow-line(1);
              }
              &-membersBox{
                position: relative;
                @include hor-center;
                width: 86%;
                &-avatars{
                  @include hor-center;
                  margin-right: 8rpx;
                  &-avatarBox{
                    border: 1px solid #fff;
                    @include circle(40rpx);
                    overflow: hidden;
                    position: relative;
                    &-cover{
                      @include abs-center;
                      background: rgba($color: #000000, $alpha: .6);
                      @include hor-center-center;
                      image{
                        width: 16rpx;
                        height: 16rpx;
                      }
                    }
                  }
                }
                &-wait{
                  @include text-normal(22rpx, #5F6572);
                } 
                &-percent {
                  @include text-normal(22rpx, #fd2e2e);
                  position: absolute;
                  right: 0px;
                }
                &-percent::before {
                  content: "拼成率";
                  color: #333;
                }
              }
            }
          }
        }
      }
    }
  }
  &-dramaListBox, &-storeBox{
    margin: 18rpx 24rpx 0px 24rpx;
    background: #FFFFFF;
    border-radius: 20rpx;
    padding: 18rpx 18rpx 20rpx 18rpx;
    box-sizing: content-box;
    &-titleBox {
      @include hor-center;
      position: relative;
      span {
        @include text-middle(30rpx, #2e323e);
      }
      &-rightArrowBox {
        position: absolute;
        right: 0px;
        @include text-normal(24rpx, #969ba6);
        @include hor-center;
      }
    }
    &-scrollBox{
      &-item{
        display: inline-flex;
        flex-direction: column;
        width: 156rpx;
        margin: 18rpx 12rpx 0px 0px;
        .cover{
          width: 156rpx;
          height: 208rpx;
          border-radius: 12rpx;
        }
        .store-cover{ 
          @include react(156rpx);
          border-radius: 24rpx;
        }
        .name{
          @include text-middle(24rpx, #2E323E);
          line-height: 28rpx;
          margin-top: 16rpx;
          @include text-overflow-line(1);
          width: 90%;
        }
        .store-distance{
          margin-top: 4rpx;
          @include text-normal(22rpx, #5F6572);
        }
      }
    }
  }
  &-dynamicListBox{
    &-top{
      // position: sticky;
      // top: 10.2vh;
      // z-index: 1;
      padding: 44rpx 0px 24rpx 24rpx;
      background: #F5F6F8;
      @include hor-between-center;
      &-title{
        @include text-middle(30rpx, #2E323E);
      }
      &-rightArrowBox{
        margin-right: 30rpx;
        @include hor-center;
        &-all{
          @include text-normal(24rpx, #969AA4);
        }
      }
    }
    &-list{
      display: flex;
      flex-wrap: wrap;
      padding: 0px 24rpx;
      &-item{
        display: inline-block;
        margin: 0px 18rpx 18rpx 0px;
      }
    }
  }
}
</style>