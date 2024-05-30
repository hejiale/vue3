<template>
  <div class="myPageContainer">
    <!--  吸顶的头部  -->
    <div class="myPageContainer-head" v-if="scrollTop > 170">
      <div class="myPageContainer-head-box" :style="headStyle">
        <image class="myPageContainer-head-box-avatar" :src="user.avatar"/>
        <div class="myPageContainer-head-box-nickName">{{user.nickName}}</div>
        <image class="myPageContainer-head-box-left-image" :src="filters.icon('setting')" @click="switchToSetting"/>
        <image class="myPageContainer-head-box-right-image" :src="filters.icon('customerService')"/>
      </div>
    </div>

    <!--  导航按钮  -->
    <div class="myPageContainer-top-icon" :style="topStyle">
      <image class="myPageContainer-top-icon-image" :src="filters.icon('setting')" @click="switchToSetting"/>
      <image class="myPageContainer-top-icon-image" :src="filters.icon('customerService')"/>
    </div>

    <div class="myPageContainer-bg">
      <!-- 渐变遮罩作为一个实际的元素 -->
      <div class="myPageContainer-bg-gradient-mask" :style="backgroundColorCode"></div>
      <image class="myPageContainer-bg-background-image" :src="user.personalBackground || filters.icon('defaultBackground')" mode="aspectFill"/>
    </div>

    <!--  用户主体  -->
    <div class="myPageContainer-user">
      <!--   头像 昵称 ID   -->
      <div class="myPageContainer-user-info">
        <image class="myPageContainer-user-info-avatar" :src="user.avatar"/>
        <span class="myPageContainer-user-info-nickName">{{user.nickName}}</span>
        <span class="myPageContainer-user-info-id">ID: {{user.juyouId}}</span>
      </div>
      <!--   个性签名   -->
      <div class="myPageContainer-user-sign">
        {{user.personSign || "留下您的个性签名，让大家了解和关注你"}}
        <image class="myPageContainer-user-sign-edit" :src="user.personSign || filters.icon('edit')" @click="switchToEditDesc"/>
      </div>
      <!--   IP   -->
      <div class="myPageContainer-user-ip">
        <image class="myPageContainer-user-ip-gender" :src="gender"/>
        <span class="myPageContainer-user-ip-text">IP属地: {{user.regionName || "未知"}}</span>
      </div>
      <!--   粉丝 点赞 关注 编辑  -->
      <div class="myPageContainer-user-about">
        <div class="myPageContainer-user-about-left">
          <div class="myPageContainer-user-about-left-fans">
            <span class="myPageContainer-user-about-left-fans-number" >{{userInfo.fansNum || 0}}</span>
            <span class="myPageContainer-user-about-left-fans-text">粉丝</span>
          </div>
          <div class="myPageContainer-user-about-left-like">
            <span class="myPageContainer-user-about-left-like-number">{{userInfo.sumPraiseCount || 0}}</span>
            <span class="myPageContainer-user-about-left-like-text">获赞</span>
          </div>
          <div class="myPageContainer-user-about-left-follow">
            <span class="myPageContainer-user-about-left-follow-number">{{userInfo.followerNum || 0}}</span>
            <span class="myPageContainer-user-about-left-follow-text">关注</span>
          </div>
        </div>
        <div class="myPageContainer-user-about-edit" @click="switchToMyProfile">
          <image class="myPageContainer-user-about-edit-image" :src="filters.icon('edit-profile')"/>
        </div>
      </div>
      <!--  订单 店铺-->
      <div class="myPageContainer-user-middle">
        <div v-if="!storeOwner" class="myPageContainer-user-middle-order" @click="switchToOrder">
          <image class="myPageContainer-user-middle-order-image" :src="filters.icon('order')"/>
          <span class="myPageContainer-user-middle-order-text" >我的订单</span>
          <span class="myPageContainer-user-middle-order-detail-text" >查看订单</span>
          <image class="myPageContainer-user-middle-order-detail-image" :src="filters.icon('right-arrow-gray')"/>
        </div>
        <div v-if="storeOwner" class="myPageContainer-user-middle-halfOrder" @click="switchToOrder">
          <image class="myPageContainer-user-middle-halfOrder-icon" :src="filters.icon('order')"/>
          <image class="myPageContainer-user-middle-halfOrder-right" :src="filters.icon('right-arrow')"/>
          <span class="myPageContainer-user-middle-halfOrder-topText" >我的订单</span>
          <span class="myPageContainer-user-middle-halfOrder-bottomText" >查看订单</span>
        </div>
        <div v-if="storeOwner" class="myPageContainer-user-middle-halfStore" @click="openStore">
          <image class="myPageContainer-user-middle-halfStore-icon" :src="filters.icon('icon-store-white')"/>
          <image class="myPageContainer-user-middle-halfStore-right" :src="filters.icon('right-arrow')"/>
          <span class="myPageContainer-user-middle-halfOrder-topText">我的店铺</span>
          <span class="myPageContainer-user-middle-halfOrder-bottomText">进入店铺</span>
        </div>
      </div>
      <!--  下拉选项  -->
      <div class="myPageContainer-user-tab">
        <div v-for="item in tabs" :key="item.index">
          <div @click="onChangeTab(item.index)" class="myPageContainer-user-tab-value" :class="tab === item.index ? 'myPageContainer-user-tab-activeValue' : '' " >{{item.value}}</div>
          <div :class="tab === item.index ? 'myPageContainer-user-tab-activeLine' : '' "></div>
        </div>
      </div>
      <!--  主页  -->
      <div class="myPageContainer-user-bottom" style="background: #F2F2F2;" v-if="tab === 0">
        <myHome :myPlayInfo="myPlayInfo" :myDailyLifeList="myDailyLifeList"/>
        <jy-noMore />
        <u-gap height="80" bgColor="#FFFFFF"/>
      </div>
      <!--  剧评  -->
      <div class="myPageContainer-user-bottom" style="background: #F2F2F2;" v-if="tab === 1">
        <u-skeleton
            rows="50"
            title
            loading
            :animate="true"
            :rowsWidth="['100%', '100%', '100%']"
            :rowsHeight="['308rpx', '308rpx', '308rpx']"
            class="skeleton"
            v-if="!evaluateList.length && !evaluateEmpty"
        ></u-skeleton>
        <jy-evaluate :evaluates="evaluateList"/>
        <jy-noMore v-if="isBottom && evaluateList.length"/>
        <u-gap v-if="isBottom" height="80" bgColor="#FFFFFF"/>
        <jy-noData v-if="evaluateEmpty"  subTitle="暂时还没有发布过评价～"></jy-noData>
      </div>
      <!--  动态  -->
      <div class="myPageContainer-user-bottom" style="background: #FFFFFF;" v-if="tab === 2">
        <u-skeleton
            rows="50"
            title
            loading
            :animate="true"
            :rowsWidth="['100%', '100%', '100%']"
            :rowsHeight="['308rpx', '308rpx', '308rpx']"
            class="skeleton"
            v-if="!dynamicList.length && !dynamicEmpty"
        ></u-skeleton>
        <jy-dynamic :dynamics="dynamicList"/>
        <jy-noMore v-if="isBottom && dynamicList.length"/>
        <u-gap v-if="isBottom" height="80" bgColor="#FFFFFF"/>
        <jy-noData v-if="dynamicEmpty" subTitle="咦~ 去编辑自己的第一条动态吧~"/>
      </div>
      <!--  收藏  -->
      <div class="myPageContainer-user-bottom" style="background: #F2F2F2;" v-if="tab === 3">
        <u-skeleton
            rows="50"
            title
            loading
            :animate="true"
            :rowsWidth="['100%', '100%', '100%']"
            :rowsHeight="['308rpx', '308rpx', '308rpx']"
            class="skeleton"
            v-if="!collectList.length && !collectEmpty"
        ></u-skeleton>
        <jy-storeCollect :collects="collectList"/>
        <jy-noMore v-if="isBottom && collectList.length"/>
        <u-gap v-if="isBottom" height="80" bgColor="#FFFFFF"/>
        <jy-noData v-if="collectEmpty" subTitle="咦~ 还没有收藏任何店铺哦~"/>
      </div>


    </div>
    <!--  店铺选择弹出框  -->
    <u-popup :show="show" :round="24" mode="bottom" @close="closeStore">
      <pop :stores="storeList"/>
    </u-popup>
    <div class="footBar">
      <jy-tabBar class="footBar" :activeTab="activeUrl"/>
    </div>
  </div>
</template>


<script setup lang="ts">
import myHome from "./components/myHome.vue"
import pop from "./components/pop.vue"
import {systemInfo} from "@/utils"


const {api, myApi, dayjs, filters, getColor, menuButtonRect, useUser} = useInstance();

/*用于激活FootTab*/
let activeUrl = '/pages/my/my'
//设备信息
let phoneSystem: any = reactive({});

let show = ref(false)
let backgroundColor = ref<string>('');
let backgroundColorCode = computed(() => `background: linear-gradient(180deg, rgba(${backgroundColor.value},0.8) 0%, rgba(${backgroundColor.value}) 100%`);
let gender = computed(() => user.sex === 'FEMALE' ? filters.icon('female') : filters.icon('male'))
let storeOwner = ref(false);

let topStyle = ref('')
let headStyle = ref('')

/*用户信息*/
let user = reactive({
  'juyouId' : '',
  'avatar' : '',
  'personalBackground': '',
  'nickName' : '',
  'sex' : '',
  'personSign' : '',
  'regionName' : '',
})

let userInfo = reactive({
  'fansNum' : '',
  'followerNum' : '',
  'sumPraiseCount' : '',
})
// let tabs = ref(['主页','剧评','动态','赞过','收藏',]);
let tabs = reactive([{
  'index' : 0,
  'value' : '主页'
},{
  'index' : 1,
  'value' : '剧评'
},{
  'index' : 2,
  'value' : '动态'
},{
  'index' : 3,
  'value' : '收藏'
}]);
// tab栏
let tab = ref(0);
let pageSize = ref(4);
let pageNo = ref(1);
// 触底次数
let reachBottom = ref(1)
// 数据是否结束
let isBottom = ref(false)
// 首页 参数
let myPlayInfo = reactive({
  'wantPlayDramaNum' : '',
  'playedDramaNum' : '',
  'wantPlayStoreNum' : '',
  'playedStoreNum' : '',
})
// 店铺列表
let storeList:Array<any> = reactive([]);
// 主页列表
let myDailyLifeList:any = reactive({});
// 剧评列表
let evaluateEmpty = ref(false)
let evaluateList:Array<any> = reactive([]);
// 动态列表
let dynamicEmpty = ref(false)
let dynamicList:Array<any> = reactive([]);
// 收藏列表
let collectEmpty = ref(false)
let collectList:Array<any> = reactive([]);




onLoad(async () => {
  let userInfo = await useUser.getUserInfo(true);
  Object.assign(user, userInfo)
  if(user.personalBackground === ""){
    backgroundColor.value = await getColor(filters.icon('defaultBackground')) as string;
  }else{
    backgroundColor.value = await getColor(user.personalBackground) as string;
  }

  let menuRect:any = await menuButtonRect();
  topStyle.value = `top : ${menuRect.top}px`
  headStyle.value = `margin-top : ${menuRect.top}px`
  Object.assign(phoneSystem, await systemInfo())
  // 查询用户店铺 和 打本信息
  queryStores();
  // 剧游时光
  queryHome();

});


async function queryStores(){
  storeList.splice(0);

  let user:any = await useUser.getUserInfo();
  let remoteInfo:any = await myApi.getHomePageRoleDetail({
    userId: user.id,
    lat: uni.getStorageSync('latitude'),
    lon: uni.getStorageSync('longitude'),
  });
  if(remoteInfo.userStoreGroups !== null && remoteInfo.userStoreGroups.length > 0){
    storeOwner.value = true;
    remoteInfo.userStoreGroups.map((v:any)=>{
      v.storeList.map((store:any)=>{
        storeList.push(store);
      })
    })
  }
  userInfo.fansNum = remoteInfo.focusInfo.fansNum;
  userInfo.followerNum = remoteInfo.focusInfo.followerNum;
  userInfo.sumPraiseCount = remoteInfo.sumPraiseCount;


  myPlayInfo.wantPlayDramaNum = remoteInfo.wantPlayDramaNum
  myPlayInfo.playedDramaNum = remoteInfo.playedDramaNum
  myPlayInfo.wantPlayStoreNum = remoteInfo.wantPlayStoreNum
  myPlayInfo.playedStoreNum = remoteInfo.playedStoreNum
}


//主页剧游时光
async function queryHome(){
  let homePageData:any = await api.homePage({});
  Object.assign(myDailyLifeList, homePageData);
}


// 剧本评论
async function queryEvaluates(){
  if (pageNo.value === 1) {
    evaluateList.splice(0);
  }
  let user:any = await useUser.getUserInfo();
  let remoteEvaluates:any = await myApi.getDramaEvaluate({
    userId: user.id,
    publishUserId: user.id,
    pageNo: pageNo.value,
    pageSize: pageSize.value,
  });
  if(remoteEvaluates.total === 0){
    evaluateEmpty.value = true;
  }
  if(remoteEvaluates && remoteEvaluates.records.length){
    evaluateList.push(...remoteEvaluates.records)
  }
  if (remoteEvaluates.records.length === pageSize.value){
    pageNo.value++
  }
  if(remoteEvaluates.total === evaluateList.length){
    isBottom.value = true;
  }
}

// 动态
async function queryDynamics(){
  if (pageNo.value === 1) {
    dynamicList.splice(0);
  }
  let user:any = await useUser.getUserInfo();
  let remoteDynamics: any = await myApi.getDramaDynamics({
    userId: user.id,
    publishUserId: user.id,
    pageNo: pageNo.value,
    pageSize: pageSize.value,
    lat: uni.getStorageSync('latitude'),
    lon: uni.getStorageSync('longitude'),
    queryType: "SELF"
  });
  if(remoteDynamics.total === 0){
    dynamicEmpty.value = true;
  }
  if (remoteDynamics && remoteDynamics.records.length) {
    dynamicList.push(...remoteDynamics.records);
  }
  if (remoteDynamics.records.length === pageSize.value){
    pageNo.value++
  }
  if(remoteDynamics.total === dynamicList.length){
    isBottom.value = true;
  }
}

// 店铺收藏
async function queryCollects(){
  if (pageNo.value === 1) {
    collectList.splice(0);
  }
  let user:any = await useUser.getUserInfo();
  let remoteCollects: any = await myApi.getStoreCollects({
    userId: user.id,
    pageNo: pageNo.value,
    pageSize: pageSize.value,
    lat: uni.getStorageSync('latitude'),
    lon: uni.getStorageSync('longitude'),
    isCollect:true,
    playStatus:"COLLECT"
  });
  if(remoteCollects.total === 0){
    collectEmpty.value = true;
  }
  if (remoteCollects && remoteCollects.records.length) {
    collectList.push(...remoteCollects.records);
  }
  if (remoteCollects.records.length === pageSize.value){
    pageNo.value++
  }
  if(remoteCollects.total === collectList.length){
    isBottom.value = true;
  }
}

function onChangeTab(v:number){
  pageNo.value = 1;
  reachBottom.value = 1;
  tab.value = v;
  isBottom.value = false;
  if(v === 0){

  }else if(v === 1){
    queryEvaluates();
  }else if(v === 2){
    queryDynamics();
  }else if(v === 3){
    queryCollects()
  }
  uni.pageScrollTo({
    scrollTop: phoneSystem.windowHeight * 0.37
  })
}


onReachBottom(async()=> {
  if(reachBottom.value + 1 === pageNo.value){
    if(tab.value === 0){

    }else if(tab.value === 1){
      queryEvaluates();
      reachBottom.value++;
    }else if(tab.value === 2){
      queryDynamics();
      reachBottom.value++;
    }else if(tab.value === 3){
      queryCollects();
      reachBottom.value++;
    }
  }
})

function switchToSetting(){
  uni.navigateTo({url: '/my-package/pages/setting'})
}
function switchToMyProfile(){
  uni.navigateTo({url: '/my-package/pages/myProfile'})
}
function switchToOrder(){
  uni.navigateTo({url: '/my-package/pages/myOrder'})
}
function switchToEditDesc(){
  uni.navigateTo({url: '/my-package/pages/editUserDesc'})
}

function openStore(){
  show.value = true;
}
function closeStore(){
  show.value = false;
}


let scrollTop = ref(0);
onPageScroll((e) => {
  scrollTop.value = e.scrollTop;
})


</script>
<style lang="scss" scoped>
.myPageContainer {
  height: 100vh;
  background: #f2f2f2;
  position: relative;
  &-head{
    height: 180rpx;
    width: 100vw;
    background: #F2F2F2;
    position: fixed;
    z-index: 10;
    &-box{
      height: 56rpx;
      width: 80vw;
      @include hor-center;
      &-avatar{
        width: 65rpx;
        height: 65rpx;
        border-radius: 70rpx;
        margin-left: 20rpx;
        border: 4rpx solid #FFFFFF;
        box-sizing: border-box;
      }
      &-nickName{
        margin-left: 12rpx;
        overflow-x: scroll;
        white-space: nowrap;
        width: 290rpx;
        @include text-custom(500, 32rpx, #2E323E)
      }
      &-left-image{
        margin-left: 40rpx;
        width: 56rpx;
        height: 56rpx;
      }
      &-right-image{
        margin-left: 20rpx;
        width: 56rpx;
        height: 56rpx;
      }
    }
  }
  &-top{
    &-icon{
      position: absolute;
      left: 385rpx;
      height: 56rpx;
      z-index: 1;
      &-image{
        margin-left: 28rpx;
        width: 56rpx;
        height: 56rpx;
      }
    }
  }
  &-bg {
    background: #D9D9D9;
    width: 100vw;
    height: 982rpx;
    position: relative;
    &-background-image {
      width: 100%;
      height: 100%;
    }
    // 梯度遮罩
    &-gradient-mask {
      width: 100vw;
      height: 982rpx;
      content: '';
      position: absolute;
      inset: 0;
    }
  }
  &-user{
    z-index: 1;
    width: 100vw;
    position: absolute;
    top: 236rpx;
    &-info{
      width: 90vw;
      height: 124rpx;
      margin-left: 32rpx;
      &-avatar{
        width: 124rpx;
        height: 124rpx;
        border-radius: 50%;
        border: 4rpx solid #FFFFFF;
        box-sizing: border-box;
      }
      &-nickName{
        @include text-custom(500, 42rpx, #FFFFFF);
        position: absolute;
        margin-top: 8rpx;
        margin-left: 24rpx;
      }
      &-id{
        @include text-custom(400, 24rpx, rgba(255,255,255,0.6));
        position: absolute;
        top: 75rpx;
        margin-left: 24rpx;
      }
    }
    &-sign{
      @include text-custom(400, 28rpx, rgba(255,255,255,0.6));
      width: 90vw;
      margin-left: 32rpx;
      margin-top: 20rpx;
      &-edit{
        height: 36rpx;
        width: 36rpx;
      }
    }
    &-ip{
      width: 90vw;
      margin-left: 32rpx;
      margin-top: 18rpx;
      &-gender{
        height: 32rpx;
        width: 32rpx;
      }
      &-text{
        @include text-custom(400, 28rpx, rgba(255,255,255,0.6));
        padding-left: 18rpx;
      }
    }
    &-about{
      height: 74rpx;
      width: 90vw;
      margin-left: 32rpx;
      margin-top: 34rpx;
      @include hor-between-center;
      &-left{
        height: 74rpx;
        width: 60vw;
        @include hor-center;
        &-fans, &-like, &-follow{
          width: 18vw;
          @include ver;
          &-number{
            @include text-custom(500, 30rpx, #FFFFFF);
          }
          &-text{
            @include text-custom(400, 28rpx, rgba(255,255,255,0.6));
          }
        }
      }
      &-edit{
        height: 74rpx;
        width: 158rpx;
        &-image{
          height: 74rpx;
          width: 158rpx;
        }
      }
    }
    &-middle{
      height: 122rpx;
      width: 90vw;
      margin-left: 28rpx;
      margin-top: 36rpx;
      @include hor-between-center;
      &-order{
        height: 122rpx;
        width: 90vw;
        background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%);
        border-radius: 24rpx;
        border: 1rpx solid rgba(255,255,255,0.2);
        @include hor-center;
        &-image{
          height: 40rpx;
          width: 40rpx;
          margin-left: 20rpx;
        }
        &-text{
          margin-left: 8rpx;
          @include text-custom(400, 32rpx, #FFFFFF);
        }
        &-detail{
          &-text{
            margin-left: 330rpx;
            @include text-custom(400, 24rpx, rgba(255,255,255,0.6));
          }
          &-image{
            height: 20rpx;
            width: 20rpx;
            margin-left: 10rpx;
          }
        }
      }
      &-halfOrder, &-halfStore{
        width: 43vw;
        height: 122rpx;
        background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%);
        border-radius: 24rpx;
        border: 1rpx solid rgba(255,255,255,0.2);
        position: relative;
        &-icon{
          width: 36rpx;
          height: 36rpx;
          position: absolute;
          top: 22rpx;
          left: 20rpx;
        }
        &-topText{
          @include text-custom(400, 28rpx, #FFFFFF);
          position: absolute;
          top: 20rpx;
          left: 62rpx;
        }
        &-bottomText{
          @include text-custom(400, 24rpx,  rgba(255,255,255,0.6));
          position: absolute;
          top: 70rpx;
          left: 22rpx;
        }
        &-right{
          width: 20rpx;
          height: 20rpx;
          position: absolute;
          top: 44rpx;
          left: 280rpx;
        }
      }
    }
    &-tab{
      width: 100vw;
      background: #FFFFFF;
      height: 100rpx;
      margin-top: 34rpx;
      border-radius:  42rpx 42rpx 0 0 ;
      @include hor;
      align-items: center;
      position: sticky;
      top: 180rpx;
      z-index: 10;
      &-value{
        margin-left: 38rpx;
        @include text-custom(500, 30rpx, #999999);
        line-height: 36rpx;
        position: relative;
      }
      &-activeValue{
        @include text-custom(500, 34rpx, #2E323E);
        line-height: 40rpx;
      }
      &-activeLine{
        margin-top: 10rpx;
        margin-left: 65rpx;
        width: 12rpx;
        height: 4rpx;
        background: #2E323E;
        border-radius: 12px;
      }
    }
    &-bottom{
      min-height: 85vh;
      //padding-top: 20rpx;
    }
  }
}



.footBar{
  position: absolute;
  z-index: 10;
}


</style>