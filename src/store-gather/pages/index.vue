<template>
  <div class="container">
    <div class="container-cover"></div>
    <div class="container-bg"></div>
    <jy-navigationBar>
      <template v-slot:content>
        <div class="topBar" @click="onBack">
          <image :src="filters.icon('store-back')" class="topBar-back"></image>
          <span class="topBar-title">组局</span>
        </div>
      </template>
      <template v-slot:view>
        <div class="filterDateBox">
          <div class="filterDateBox-dateBox" v-if="dateList.length">
            <div class="filterDateBox-dateBox-allBox" @click="onChangeDate('')">
              <div class="filterDateBox-dateBox-allBox-all">
                <span class="filterDateBox-dateBox-allBox-all-title" :class="{activeTitle: activeDate === ''}">全部</span>
                <span class="filterDateBox-dateBox-allBox-all-value" :class="{activeValue: activeDate === ''}">{{ dateList[0].sum }}场</span>
              </div>
              <image
                :src="filters.icon('space-line')"
                class="filterDateBox-dateBox-allBox-space"
              ></image>
            </div>
            <scroll-view class="filterDateBox-dateBox-scrollBox" id="weekBox" scroll-x :scroll-left="scrollViewLeft">
              <div
                class="filterDateBox-dateBox-scrollBox-item"
                v-for="(v, index) in showDateList"
                :key="v.id"
                :id="'the-' + index"
                @click="onChangeDate(v.date)"
              >
                <span class="filterDateBox-dateBox-scrollBox-item-title" :class="{activeTitle: activeDate === v.date}">{{
                  filters.getWeek(v.date)
                }}</span>
                <span class="filterDateBox-dateBox-scrollBox-item-value" :class="{activeValue: activeDate === v.date}">{{
                  dayjs(v.date).format("MM.DD")
                }}</span>
              </div>
            </scroll-view>
          </div>
        </div>
        <div class="container-content">
          <div class="container-content-cover"></div>
          <div class="container-content-menuBar">
            <div
              v-for="menu in menus"
              :key="menu"
              class="container-content-menuBar-menu"
              :class="{ active: activeMenu === menu }"
              @click="onChangeMenu(menu)"
            >
              {{ menu }}
            </div>
          </div>
          <div class="container-content-title">按玩本时间排序</div>
          <swiper class="container-content-swiperBox" @change="onChangeSwiper" :current="current">
            <swiper-item v-for="index in menus" :key="index">
              <scroll-view scroll-y class="container-content-listBox">
                <u-skeleton
                  rows="30"
                  :loading="loading"
                  animate
                  :rowsHeight="['145px','145px','145px']"
                ></u-skeleton>
                <gathering
                  :gatherList="showList"
                  v-if="showList.length"
                ></gathering>
                <jy-noMore :isImage="true" v-if="showList.length > 0"></jy-noMore>
                <jy-noData customUrl="icon-empty-gather" customSize="300rpx" v-else></jy-noData>
              </scroll-view>
            </swiper-item>
          </swiper>
        </div>
        <div class="container-bottom">
          <image :src="filters.icon('icon-gather-phone')" class="container-bottom-phone"></image>
          <div class="container-bottom-notice">生成组局公告</div>
          <div class="container-bottom-book" @click="onGoGather">发起组局</div>
        </div>
      </template>
    </jy-navigationBar>
    <u-popup :show="showModel" @close="showModel = false" :round="22" :safeAreaInsetBottom="false" mode="center">
      <modelView title="是否锁车"></modelView>
    </u-popup>
  </div>
</template>
<script lang="ts" setup>
import gathering from "../components/gatherList.vue";
import modelView from "../components/modelView.vue";
const { useUser, filters, dayjs, gatherApi, useStore, bus } = useInstance();

let userInfo:any = reactive({});

let storeInfo:any = reactive({});

let current = ref(0);

let loading = ref(true);

let activeDate = ref('');

let dateList: Array<any> = reactive([]);

let activeMenu = ref("全部");

let menus = ref(["全部", "拼场中", "拼场成功", "拼场失败"]);

let gatheringList = reactive([]);

let scrollViewLeft = ref(0);

let showModel = ref(false);

const showDateList = computed(() => {
  return dateList.splice(1, dateList.length);
});

/**
 * 筛选不同类型的组局列表 
 */
const showList = computed(() => {
  if(current.value === 1){
    return gatheringList.filter((v:any) => v.gatherStatus == "GATHERING");
  }else if(current.value === 2){
    return gatheringList.filter((v:any) => v.gatherStatus == "SUCCESS");
  }else if(current.value === 3){
    return gatheringList.filter((v:any) => v.gatherStatus == "FAIL");
  }else{
    return gatheringList;
  }
})

onLoad(()=>{
  //监听筛选展开
  bus.on("reload-gather", _=> {
    getGatheringList();
  });

  bus.on('changeLockStatus', _=>{
    showModel.value = true;
  })
})


onShow(async() => {
  // await useStore.setStoreId(4);
  Object.assign(userInfo, await useUser.getUserInfo());
  Object.assign(storeInfo, useStore.storeInfo);

  await queryGatheringDate();
  await getGatheringList();
});

function onBack(){
  uni.navigateBack();
}

function onGoGather(){
  uni.navigateTo({url: './goGather'})
}

/**
 * 切换日期
 * @param date 
 */
function onChangeDate(date:any){
  current.value = 0;
  loading.value = true;
  activeDate.value = date;
  
  getGatheringList();
}

/**
 * 切换状态菜单
 * @param menu 
 */
function onChangeMenu(menu:any){
  current.value = menus.value.findIndex(v=>v === menu);
  activeMenu.value = menu;
}

function onChangeSwiper(e:any){
  current.value = e.detail.current;
  activeMenu.value = menus.value[e.detail.current];
}

/**
 * 查询组局日期列表
 */
async function queryGatheringDate() {
  let res:any = await gatherApi.getStoreGatheringOverviewByDate({ storeId: storeInfo.id });

  let dateIndex = res.findIndex((v:any)=> dayjs(new Date()).format('YYYY-MM-DD') === v.date);

  if(dateIndex !== -1){
    activeDate.value = res[dateIndex].date;
    //跳转到指定日期
    scrollViewLeft.value = (dateIndex - 1) * 64;
  }

  Object.assign(dateList, res);
}

/**
 * 查询组局列表
 */
async function getGatheringList() {
  gatheringList.splice(0);

  let res = await gatherApi.getGatheringList({
    date: activeDate.value,
    operatorType: "STORE",
    storeId: storeInfo.id,
  });
  loading.value = false;
  Object.assign(gatheringList, res);
}
</script>
<style lang="scss" scoped>
.container {
  &-cover {
    @include fixed-center;
    background: #f5f9fb;
  }
  &-bg {
    width: 100vw;
    height: 320rpx;
    background: linear-gradient( 180deg, #9EFFC8 0%, rgba(219,249,232,0) 100%);
    opacity: 0.7;
  }
  &-title {
    position: fixed;
    left: 40rpx;
    top: 212rpx;
    @include text-normal(26rpx, #959aa5);
  }
  .filterDateBox {
    margin-top: 54rpx;
    &-dateBox {
      height: 112rpx;
      position: relative;
      @include hor-center;
      &-allBox {
        padding-left: 32rpx;
        @include hor-center;
        &-all {
          @include ver-center;
          width: 100rpx;
          &-title {
            @include text-middle(26rpx, #5f6572);
          }
          &-value {
            @include text-normal(24rpx, #959aa5);
          }
        }
        &-space {
          padding: 0px 20rpx;
          width: 12rpx;
          height: 84rpx;
        }
      }
      &-scrollBox {
        white-space: nowrap;
        width: 80vw;
        &-item {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          margin-right: 66rpx;
          transform: translateY(-4rpx);
          &-title {
            @include text-middle(26rpx, #5f6572);
          }
          &-value {
            @include text-normal(24rpx, #959aa5);
          }
        }
      }
      .activeTitle {
        @include text-middle(26rpx, #2E323E);
      }
      .activeValue {
        @include text-normal(24rpx, #2E323E);
      }
    }
  }
  &-content {
    position: fixed;
    left: 0px;
    right: 0px;
    top: 320rpx;
    bottom: 182rpx;
    border-radius: 32rpx 32rpx 0rpx 0rpx;
    padding: 36rpx 30rpx 0px 30rpx;
    box-sizing: border-box;
    &-cover{
      position: absolute;
      left: 0px;
      right: 0px;
      top: 0px;
      height: 292rpx;
      background: linear-gradient( 180deg, #FFFFFF 49%, rgba(255,255,255,0) 100%);
      border-radius: 32rpx 32rpx 0rpx 0rpx;
      z-index: -1;
    }
    &-title{
      margin-top: 28rpx;
      @include text-normal(24rpx, #999);
    }
    &-menuBar {
      @include hor;
      &-menu {
        @include text-middle(30rpx, #959aa5);
        margin-right: 38rpx;
      }
      .active {
        @include text-bold(34rpx, #2e323e);
        position: relative;
        &::before {
          content: "";
          width: 12rpx;
          height: 4rpx;
          background: #2e323e;
          position: absolute;
          bottom: -8rpx;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 12rpx;
        }
      }
    }
    &-swiperBox{
      height: calc(100% - 114rpx);
      margin-top: 10rpx;
    }
    &-listBox {
      height: 100%;
    }
  }
  &-bottom {
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 182rpx;
    background: #ffffff;
    z-index: 1;
    &-phone{
      position: absolute;
      left: 30rpx;
      top: 30rpx;
      width: 96rpx;
      height: 96rpx;
    }
    &-notice{
      position: absolute;
      left: 156rpx;
      top: 30rpx;
      width: 268rpx;
      height: 96rpx;
      border-radius: 24rpx;
      border: 2rpx solid #EBEBEB;
      @include text-bold(28rpx, #2E323E);
      @include hor-center-center;
    }
    &-book{
      position: absolute;
      right: 30rpx;
      top: 30rpx;
      width: 266rpx;
      height: 96rpx;
      background: #2E323E;
      border-radius: 24rpx;
      @include text-bold(28rpx, #fff);
      @include hor-center-center;
    }
  }
}

.topBar {
  @include hor-center;
  height: 100%;
  &-back {
    width: 32rpx;
    height: 32rpx;
    padding: 24rpx 32rpx 24rpx 32rpx;
  }
  &-title {
    position: absolute;
    left: 0px;
    @include text-normal(26rpx, #2e323e);
    width: 100%;
    text-align: center;
  }
}
</style>