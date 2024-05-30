<template>
  <div>
    <div class="fixedBg"></div>
    <jy-navigationBar
      :barHeight="42"
      :bgImage="navigationBarBg"
      :background="showColor"
    >
      <template v-slot:content>
        <menuBar
          :cityName="cityName"
          @changeTab="onChangeTab"
          :current="activeMenu"
        ></menuBar>
      </template>
    </jy-navigationBar>
    <swiper class="swiperBox" @change="onChangeSwiper" :current="swiperCurrent">
      <swiper-item>
        <!-- 推荐 -->
        <scroll-view
          scroll-y
          class="swiperBox-scrollBox"
          @scrolltolower="onLoadMore"
          refresher-enabled
          @refresherrefresh="onPull"
         :refresher-triggered="isPull"
        >
          <recommend
            :promotionList="promotionList"
            :gatheringList="gatheringList"
            :hotDramaList="hotDramaList"
            :myGatherList="myGatherList"
            :nearbyStoreList="nearbyStoreList"
            :dynamicList="dynamicList"
            :rankingList="rankingList"
          ></recommend>
        </scroll-view>
      </swiper-item>
      <swiper-item>
        <!-- 排行榜 -->
        <scroll-view
          scroll-y
          class="swiperBox-scrollBox"
          @scrolltolower="onLoadMore"
          refresher-enabled
          @refresherrefresh="onPull"
         :refresher-triggered="isPull"
        >
          <rank
            :hotRankList="hotRankList"
            :bgColor="rankBgColor"
            @changeTab="onChangeRankTab"
          ></rank>
        </scroll-view>
      </swiper-item>
      <swiper-item>
        <div class="evaluateBox-tabBox" @click.stop="onChangeEvaluateType">
          <div class="evaluateBox-tabBox-item" :class="{active: isHotEvaluate}">热门剧评</div>
          <div class="evaluateBox-tabBox-item" :class="{active: !isHotEvaluate}">最新剧评</div>
        </div>
        <!-- 剧评 -->
        <scroll-view
          scroll-y
          class="swiperBox-evaluateScroll"

          @scrolltolower="onLoadMore"
          refresher-enabled
          @refresherrefresh="onPull"
         :refresher-triggered="isPull"
        >
          <jy-evaluate
            :evaluateList="evaluateList"
          ></jy-evaluate>
        </scroll-view>
      </swiper-item>
    </swiper>
    <jy-tabBar :activeTab="activeUrl"></jy-tabBar>
  </div>
</template>

<script setup lang="ts">
import recommend from "./components/recommend.vue";
import menuBar from "./components/menuBar.vue";
import rank from "./components/rank.vue";
const { useUser, homeApi, getColor, requestAuthorize } = useInstance();

let cityName = ref('')

// 用于激活FootTab
let activeUrl = "/pages/index/index";

let activeMenu = ref("推荐");

let pageNo = ref(1);

let noData = ref(false);

let isHotEvaluate = ref(true);

let bgColor = ref("");

let rankBgColor = ref("");

let swiperCurrent = ref(0);

let loading = ref(true);

let isPull = ref(false);

//用户信息
const userInfo: any = reactive({});

//组局信息
let gatheringList: Array<any> = reactive([]);

//热销剧本信息
let hotDramaList: Array<any> = reactive([]);

//中部banner
let promotionList: Array<any> = reactive([]);

//附近店铺列表
let nearbyStoreList: Array<any> = reactive([]);

//动态列表
let dynamicList: Array<any> = reactive([]);

//我的组局列表
let myGatherList: Array<any> = reactive([]);

//排行榜列表
let rankingList: Array<any> = reactive([]);

//热门排行榜榜单列表
let hotRankList: Array<any> = reactive([]);

//剧评列表
let evaluateList: Array<any> = reactive([]);

let rankType = ref('HOT_RANK');

let isHot = ref(true)

//导航栏背景图片
const navigationBarBg = computed(() => {
  if (!promotionList.length) return null;

  if (activeMenu.value === "推荐") {
    return JSON.parse(
      promotionList[1].activityPromotionList[0].serviceDynamicField
    ).actBotUrl;
  }
  return null;
});

const showColor = computed(()=>{
  if(activeMenu.value === '排行榜'){
    return rankBgColor.value;
  }
  return bgColor.value;
})

watch(
  activeMenu,
  ()=> {
    changePage();
  }
)

onLoad(async () => {
  //授权定位
  await requestAuthorize();
  cityName.value = uni.getStorageSync('city-info').name;
  //附近门店
  await queryNearbyList();
  //banner
  await queryPromotionList();
  //推荐剧本
  await queryRecommendDrama();
  //动态列表
  await queryDynamicList();
  //排行榜
  await rankingListOne();
});

onShow(async () => {
  //刷新定位
  cityName.value = uni.getStorageSync('city-info').name;
  //用户信息
  await queryUserInfo();
  //查询组局
  await queryGatheringList();
  await queryMyGather();
  loading.value = false;
});

//切换热门剧评 和 最新剧评
function onChangeEvaluateType(){
  isHotEvaluate.value = !isHotEvaluate.value;
  changeEvaluateMenu();
}

async function onPull(){
  if(isPull.value)return;
  isPull.value = true;

  if(swiperCurrent.value === 0){
    pageNo.value = 1;
    queryNearbyList();
    queryRecommendDrama();
    queryPromotionList();
    queryGatheringList();
    queryDynamicList();
  }else if(swiperCurrent.value === 1){
    queryHotRankingList();
  }else if(swiperCurrent.value === 2){
    loading.value = true;
    pageNo.value = 1;
    noData.value = false;
    await queryEvaluateList();
  }
}

//加载更多
function onLoadMore() {
  if (noData.value) {
    if (activeMenu.value === "推荐") {
      //剔除掉空的那个
      let contactArr: Array<any> = JSON.parse(JSON.stringify(dynamicList));

      if (contactArr.findIndex((v) => v.id === -1) !== -1) {
        contactArr.splice(1, 1);
      }
      //循环加入数据
      dynamicList.push(...contactArr);
    }
  } else {
    if (activeMenu.value === "推荐") {
      pageNo.value++;
      queryDynamicList();
    } else if (activeMenu.value === "剧评") {
      pageNo.value++;
      queryEvaluateList();
    }
  }
}

//切换swiper
async function onChangeSwiper(event: any) {
  swiperCurrent.value = event.detail.current;
  activeMenu.value = event.detail.current === 0 ? "推荐": event.detail.current === 1 ? "排行榜": "剧评";
}

//切换tabBar
async function onChangeTab(e: string) {
  swiperCurrent.value = e === "推荐" ? 0 : e === "排行榜" ? 1 : 2;
  activeMenu.value = e;
}

async function changePage() {
  if (activeMenu.value === "排行榜") {
    if(!hotRankList.length){
      loading.value = true;
      await queryHotRankingList();
    }
  }else if (activeMenu.value === "剧评") {
    bgColor.value = "#fff";

    if(!evaluateList.length){
      loading.value = true;
      pageNo.value = 1;
      noData.value = false;
      await queryEvaluateList();
    }
  }
}

//切换排行榜榜单
async function onChangeRankTab(e: string) {
  if (e === "30天热榜") {
    rankType.value = 'HOT_RANK';
    await queryHotRankingList();
  } else if (e === "人气总榜") {
    rankType.value = 'GATHER_SUM_RANK';
    await queryHotRankingList();
  } else if (e === "口碑榜") {
    rankType.value = 'PRAISE_RANK';
    await queryHotRankingList();
  } else if (e === "期待榜") {
    rankType.value = 'FOCUS_RANK';
    await queryHotRankingList();
  }
}

//切换剧评菜单
async function changeEvaluateMenu() {
  noData.value = false;
  pageNo.value = 1;
  await queryEvaluateList();
}

/*首页轮播图列表*/
async function queryPromotionList() {
  try {
    let res = await homeApi.promotionList({
      sceneEnum: "MINE_PROGRAM",
      typeEnum: ["PAGE_INDEX_BANNER", "PAGE_MIDDLE_BANNER"],
    });
    Object.assign(promotionList, res);
    loading.value = false;
  } catch (e) {}
}
/*查询组局列表*/
async function queryGatheringList() {
  try {
    let res = await homeApi.getCityGatheringInfo({
      cityId: uni.getStorageSync('city-info').id,
      userId: userInfo.id,
      lat: uni.getStorageSync('latitude'),
      lon: uni.getStorageSync('longitude'),
      pageNo: 1,
      pageSize: 20,
    });
    Object.assign(gatheringList, res);
  } catch (e) {}
}
/*查询用户信息*/
async function queryUserInfo() {
  let res = await useUser.getUserInfo();
  Object.assign(userInfo, res);
}
/*查询推荐剧本列表*/
async function queryRecommendDrama() {
  let res = await homeApi.queryHotDrama({});
  Object.assign(hotDramaList, res);
}
/*查询我的组局*/
async function queryMyGather() {
  let res: any = await homeApi.playerGatheredGamePage({
    cityId: uni.getStorageSync('city-info').id,
    userId: userInfo.id,
    lat: uni.getStorageSync('latitude'),
    lon: uni.getStorageSync('longitude'),
    pageNo: 1,
    pageSize: 20,
  });
  Object.assign(myGatherList, res.records);
}
/*查询附近门店列表*/
async function queryNearbyList() {
  let res: any = await homeApi.getStoreNearbyList({
    latitude: uni.getStorageSync('latitude'),
    longitude: uni.getStorageSync('longitude'),
    pageNo: 1,
    pageSize: 20,
  });
  Object.assign(nearbyStoreList, res.records);
}
/*查询动态列表*/
async function queryDynamicList() {
  let res: any = await homeApi.homePageDynamic({
    pageNo: pageNo.value,
    pageSize: 20,
  });
  if (pageNo.value === 1) {
    dynamicList.splice(0);
  }
  if (res.records.length) {
    if (pageNo.value === 1) {
      let arr = res.records
        .slice(0, 1)
        .concat({ id: -1 }, res.records.slice(1));
      Object.assign(dynamicList, arr);
    } else {
      dynamicList.push(...res.records);
    }
  } else {
    noData.value = true;
  }
  isPull.value = false;
}
//查询榜单
async function rankingListOne() {
  let data = await homeApi.rankingList({
    rankType: "HOT_RANK",
  });
  Object.assign(rankingList, data);
}
//查询剧评列表
async function queryEvaluateList() {
  try {
    let res: any = await homeApi.recommendEvaluate({
      pageNo: pageNo.value,
      pageSize: 10,
      userId: userInfo.id,
      pageIndexType: isHotEvaluate.value ? 1 : 2,
    });
    if (pageNo.value === 1) {
      evaluateList.splice(0);
    }
    res.records.map((v: any) => {
      v["isInfo"] = false;
    });
    if (res.records.length) {
      evaluateList.push(...res.records);
    } else {
      noData.value = true;
    }
    loading.value = false;
    setTimeout(()=>{
      isPull.value = false;
    },100)
  } catch (e) {
    console.log(e);
  }
}
//查询排行榜榜单列表
async function queryHotRankingList() {
  let res: any = await homeApi.rankingList({ rankType: rankType.value });

  hotRankList.splice(0);

  Object.assign(hotRankList, res);

  res = await getColor(res[0].dramaCover, false);
  rankBgColor.value = res;

  loading.value = false;
  isPull.value = false;
}

</script>
<style lang="scss" scoped>
.swiperBox {
  width: 100vw;
  height: 100vh;
  &-scrollBox {
    height: 100vh;
  }
  &-evaluateScroll{
    margin-top: 17vh;
    height: 83vh;
  }
}
.evaluateBox-tabBox {
    position: fixed;
    left: 0px;
    top: 10vh;
    @include hor-center;
    padding-top: 2vh;
    padding-bottom: 20rpx;
    right: 0px;
    background: #fff;
    z-index: 1;
    &-item {
      margin-left: 24rpx;
      width: 160rpx;
      height: 64rpx;
      background: #f5f6f8;
      border-radius: 16rpx;
      border: 1px solid #f0f0f1;
      @include text-normal(28rpx, #5f6572);
      @include hor-center-center;
    }
    .active {
      background: #2e323e;
      font-weight: 600;
      color: #ffffff;
    }
  }
</style>
