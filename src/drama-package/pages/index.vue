<template>
  <div class="container" :style="backgroundColorCode" v-if="drama">
    <div class="fixedBg" :style="backgroundColorCode"></div>
    <jy-navigationBar>
      <template v-slot:content>
        <image class="navigationImg" :src="filters.icon('backAndForward')" @click="handleClick"></image>
      </template>
    </jy-navigationBar>

    <div class="container-head" :class="{fadeOut:  pageView.fadeOut}" :style="titleColorCode" v-if="pageView.showTitle">

      <div class="container-head-row">
        <image class="navigationImg" :style="pageView.headStyle" :src="filters.icon('backAndForward')" @click="handleClick"></image>
        <image class="container-head-row-cover" :style="pageView.headStyle" :src="drama.dramaCover" mode="aspectFill"/>
        <div class="container-head-row-column" :style="pageView.headStyle">
          <div class="container-head-row-column-name">
            {{drama.dramaName}}
          </div>
          <div class="container-head-row-column-rating">
            {{drama.juyouScoreAvg}}
            <div class="container-head-row-column-rating-text">
              分
            </div>
          </div>
        </div>
      </div>
    </div>


    <div class="background">
      <image
          class="drama-background fadeIn"
          v-if="drama.backgroundUrl"
          :src="drama.backgroundUrl" mode="aspectFill">
      </image>
      <div class="gradient-mask" :style="backgroundColorCode"/>
    </div>
    <div class="container-flex-column">
      <div class="drama-box">
        <div class="drama-box-cover" :style="dramaCoverBackground(drama.sellType)">
          <image class="drama-box-cover-img" :src="drama.dramaCover" mode="aspectFill"/>
          <image class="drama-box-cover-img-sellType" :src="sellType(drama.sellType)"/>
        </div>
        <div class="drama-box-right">
          <div class="drama-box-right-name">{{ drama.dramaName }}</div>
          <div class="drama-box-right-message">
            <image class="drama-box-right-message-quotation" :src="filters.icon('left-quotation')"
                   style="margin-right: 4rpx"/>
            {{ dayjs(drama.publishDate).format("YYYY.MM.DD") }} {{sellTypeTitle(drama.sellType)}}发行
            <image class="drama-box-right-message-quotation" :src="filters.icon('right-quotation')"
                   style="margin-left: 4rpx"/>
          </div>
          <div class="drama-box-right-rank">
            <div v-for="(type,idx) in drama.rankTypes" :key="idx">
              <image class="drama-box-right-rank-item" v-if="type==='HOT_RANK'" :src="filters.icon('hot-rank')"/>
              <div class="drama-box-right-rank-item" v-else-if="type==='PRAISE_RANK'"
                   style='background: rgba(118,176,252,0.89)'>口碑榜</div>
              <div class="drama-box-right-rank-item" v-else-if="type==='GATHER_SUM_RANK'" style='background: #23d03a'>人气总榜</div>
              <div class="drama-box-right-rank-item" v-else-if="type==='FOCUS_RANK'" style='background: #ff53a8'>期待榜</div>
            </div>
          </div>
          <div class="drama-box-right-theme">
            <div v-for="theme in drama.dramaThemeList" :key="theme.id" class="drama-box-right-theme-item">
              {{ theme.dictValue }}
            </div>
          </div>
          <div class="drama-box-right-prop">
            <div class="drama-box-right-prop-item">{{drama.maleGamerNum}}男{{drama.femaleGamerNum}}女</div>
            <div class="drama-box-right-prop-item">{{drama.gameTime}}小时</div>
            <div class="drama-box-right-prop-item">{{enums.EXCEED_Type.getName(drama.dramaAgeAppropriate)}}</div>
          </div>
          <div class="drama-box-right-play">
            <div class="drama-box-right-play-wantPlay" :class="{ 'pulse': pageView.isAnimating }" v-if="!drama.playStatus" @click="changeWantPlayStatus">
              <image class="drama-box-right-play-img" :src="filters.icon('heart')"></image>
              我想玩
            </div>
            <div class="drama-box-right-play-wantPlay" :class="{ 'pulse': pageView.isAnimating }" style="color: #FEC635; background: rgba(255, 255, 255, 0.1)" v-if="drama.playStatus==='WANT_PLAY'" @click="changeWantPlayStatus">
              <image class="drama-box-right-play-img"  :src="filters.icon('heart-active')"></image>
              我想玩
            </div>

            <div class="drama-box-right-play-played" v-if="!drama.playStatus || drama.playStatus==='WANT_PLAY'">
              <image class="drama-box-right-play-img" :src="filters.icon('star')"></image>
              我玩过
            </div>

            <div class="drama-box-right-play-played-box" v-if="drama.playStatus==='HAS_PLAY' && !drama.dramaEvaluateType">
              <image class="drama-box-right-play-played-box-noEvaluate" :src="filters.icon('gradient-comment-box')" />
              <image class="drama-box-right-play-played-box-noEvaluate-avatar" :src="user.avatar" @click="showCustomModal"/>
              <div class="drama-box-right-play-played-box-noEvaluate-text" >暂无评价，去评价</div>
              <image class="drama-box-right-play-played-box-noEvaluate-icon" :src="filters.icon('right-arrow')" />
            </div>

            <div class="drama-box-right-play-played-box" v-if="drama.playStatus==='HAS_PLAY' && drama.dramaEvaluateType">
              <image class="drama-box-right-play-played-box-noEvaluate" :src="filters.icon('gradient-comment-box')" />
              <image class="drama-box-right-play-played-box-noEvaluate-avatar" :src="user.avatar"/>
              <div class="drama-box-right-play-played-box-evaluate-text1" >已评价: </div>
              <div class="drama-box-right-play-played-box-evaluate-text2" >{{enums.EVALUATE_Type.getName(drama.dramaEvaluateType)}} </div>
              <div class="drama-box-right-play-played-box-evaluate-line" />
              <div class="drama-box-right-play-played-box-evaluate-text1" >分享 </div>
              <image class="drama-box-right-play-played-box-evaluate-icon" :src="filters.icon('right-arrow')" />
            </div>


          </div>
        </div>
      </div>

      <image class="open-murder" v-if="drama.isBoxOffice" :src="filters.icon('open-murder')"/>

      <div class="rating">
        <div class="rating-left">
          <div class="rating-left-one">
            剧游评分
            <image class="rating-left-one-img" :src="dramaTitleLevel(drama.dramaTitle)"></image>
          </div>
          <div class="rating-left-two">
            {{drama.juyouScoreAvg}}
          </div>
          <div class="rating-left-three">
            {{drama.dramaEvaluateCount}} 人评价 <span class="rating-left-three-go">></span>
          </div>
        </div>
        <div class="rating-right">
          <div class="rating-right-one">
            {{drama.wantPlayCount}} 人想玩 {{drama.hasPlayCount}} 人玩过
          </div>
          <div class="rating-right-two" v-for="theme in drama.dictAndScores" :key="theme.id">
            <div class="rating-right-two-row">
              <div class="rating-right-two-row-title">{{theme.dictValue}}</div>
              <u-line-progress class="rating-right-two-row-line" height="8rpx" :percentage=theme.score*10 :showText=false inactiveColor="rgba(255, 255, 255, 0.1)" activeColor="rgba(255, 255, 255, 0.2)"></u-line-progress>
              <div class="rating-right-two-row-null"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="author">
        <div class="author-one">
          <div class="author-one-left">
            作者与简介
          </div>
          <div class="author-one-right" @click="doHiddenText">
            {{pageView.hiddenText?'展开':'收起'}}
            <image class="author-one-right-icon" :src="filters.icon('right-arrow-gray')"/>
          </div>
        </div>
        <div class="author-two">
          <div class="author-two-item" v-for="author in drama.authorItems" :key="author.id">
            <image class="author-two-item-author" :src="filters.icon('author')"/>
            作者:  {{author.authorName}}
            <image class="author-two-item-go" :src="filters.icon('right-arrow-gray')"/>
          </div>
        </div>
        <div class="author-three" :class="pageView.hiddenText?'overFlow-line':''" v-html="drama.content"/>
      </div>

      <div class="role" v-if="drama.dramaRoleList && drama.dramaRoleList.length > 0">
        <div class="role-title">
          <div class="role-title-left">
            剧本角色
          </div>
          <div class="role-title-right">
            全部{{drama.dramaRoleList.length}}
            <image class="role-title-right-icon" :src="filters.icon('right-arrow-gray')"/>
          </div>
        </div>
        <div class="role-list">
          <div class="role-list-item" v-for="role in drama.dramaRoleList" :key="role.id">
            <image class="role-list-item-img" :src="role.roleUrl" mode="aspectFill"></image>
            <div class="role-list-item-name">{{sliceText(role.roleName)}}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottomTitle bottomTitle-top bottomTitle-bg" :style="[titleColorCode,pageView.bottomTitleTop]">
      <div class="bottomTitle">
        <div class="bottomTitle-item" v-for="(item,index) in bottomTitle" :key="item.index" @click="pageView.bottomTitleActive=index">
          <div class="bottomTitle-item-column">
            <div class="bottomTitle-item-column-row">
              <div :class="pageView.bottomTitleActive===index?'bottomTitle-item-column-row-name-active':'bottomTitle-item-column-row-name'">{{item.name}}</div>
              <div :class="pageView.bottomTitleActive===index?'bottomTitle-item-column-row-count-active':'bottomTitle-item-column-row-count'">{{item.count>0?item.count:''}}</div>
            </div>
            <div :class="pageView.bottomTitleActive===index?'bottomTitle-item-line':''"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottomContent">
      <div v-if="pageView.bottomTitleActive===0">
        <dramaGathering :dramaId="dramaId" :userId="user.id"/>
      </div>
      <div v-else-if="pageView.bottomTitleActive===1">
        <dramaEvaluate :dramaId="dramaId" :userId="user.id"/>
      </div>
      <div v-else-if="pageView.bottomTitleActive===2">
        <dramaStore :dramaId="dramaId" :userId="user.id"/>
      </div>
      <div v-else-if="pageView.bottomTitleActive===3">
        <dramaDynamic :dramaId="dramaId" :userId="user.id"/>
      </div>
      <div v-else-if="pageView.bottomTitleActive===4">
        <jy-dramaRecommend :dramaId="dramaId" :userId="user.id"/>
      </div>
    </div>

  </div>


</template>

<script setup lang="ts">
import dramaEvaluate from "@/drama-package/pages/dramaEvaluate.vue";
import dramaStore from "@/drama-package/pages/dramaStore.vue";
import dramaGathering from "@/drama-package/pages/dramaGathering.vue";
import dramaDynamic from "@/drama-package/pages/dramaDynamic.vue";
const {api,storeApi, dayjs, getColor, filters, menuButtonRect,enums, useUser} = useInstance();



interface Drama {
  dramaId?: string;
  playStatus?: string;
  backgroundUrl?: string;
  sellType?: string;
  dramaCover?: any;
  dramaName?: string;
  publishDate?: string;
  rankTypes?: string[];
  dramaThemeList?: Array<any>;
  maleGamerNum?: number;
  femaleGamerNum?: number;
  gameTime?: number;
  dramaAgeAppropriate?: string;
  isBoxOffice?: boolean;
  juyouScoreAvg?: number;
  dramaEvaluateCount?: number;
  dramaTitle?: string;
  dramaEvaluateType?: string;
  wantPlayCount?:number;
  hasPlayCount?:number;
  dictAndScores?: Array<any>;
  authorItems?: Array<any>;
  content?: string;
  dramaRoleList?: Array<any>;
}

interface User {
  id?: number;
  avatar?: any;
}

/*剧本id*/
let dramaId = ref();
/*剧本数据*/
const drama:Drama = reactive({});
/*用户数据*/
let user:User = reactive({})

/*页面控制视图参数*/
let pageView = reactive({
  /*改变想玩状态的动画效果*/
  isAnimating:false,
  /*下滑到视图高度是否淡入标题行*/
  showTitle:false,
  /*上滑到视图高度是否淡出标题行*/
  fadeOut:false,
  /*背景颜色*/
  backgroundColor:'',
  /*是否隐藏多行文本*/
  hiddenText:true,
  /*标题行样式*/
  headStyle:'',
  /*标题栏头部样式*/
  bottomTitleTop:'',
  /*底部标题栏激活状态*/
  bottomTitleActive:0,
  /*页面滚动高度*/
  scrollTop:0
})

/*底部标题栏*/
let bottomTitle = reactive([
  {"index":0,"name":"组局","count":0},
  {"index":1,"name":"剧评","count":0},
  {"index":2,"name":"店铺","count":0},
  {"index":3,"name":"动态","count":0},
  {"index":4,"name":"推荐","count":10},
])


/*背景色渐变计算属性*/
let backgroundColorCode = computed(() => {
  if (pageView.backgroundColor === '#0c0c0c') {
    return {
      background: pageView.backgroundColor
    };
  } else {
    return {
      background: `linear-gradient(180deg, rgba(${pageView.backgroundColor},0.8) 0%, rgba(${pageView.backgroundColor}, 1) 100%)`
    };
  }
});

/*标题颜色计算属性*/
let titleColorCode = computed(() => {
    return {
      background: `rgba(${pageView.backgroundColor})`
    };
});




onPageScroll((e) => {
  pageView.scrollTop = e.scrollTop;
  controlShowTitle();
})


/*控制标题的可见性以及淡入淡出效果*/
function controlShowTitle() {
  let thisShowTitle = pageView.scrollTop > 170;
  // last值为false current值为true  说明是向下滚动 淡入效果
  if (!pageView.showTitle && thisShowTitle) {
    pageView.showTitle = true;
    // last值为true current值为false  说明是向上滚动 淡出效果
  }else if (pageView.showTitle && !thisShowTitle) {
    pageView.fadeOut = true;
    setTimeout(() => {
      pageView.showTitle = false;
      pageView.fadeOut = false;
    }, 1000);
  }
}

onLoad(async (param:any) => {
  dramaId.value = param.dramaId;
  let userInfo = await useUser.getUserInfo(true);
  Object.assign(user, userInfo)
  await dramaDetail();

  /*动态给组件高度*/
  let menuRect:any = await menuButtonRect();
  pageView.headStyle = `margin-top : ${menuRect.top}px`
  pageView.bottomTitleTop = `top : ${menuRect.top + menuRect.height + 7}px` ;
});


/*点击左上角角标*/
const handleClick = (event: any) => {
  const systemInfo = uni.getSystemInfoSync();
  const clickedX = event.detail.x * (750 / systemInfo.windowWidth);

  if (clickedX < 176 / 2) {
    console.log("点击了左半边");
    uni.navigateBack();
  } else {
    console.log("点击了右半边");
  }
};

/*剧本详情数据展示*/
const dramaDetail = async () => {
  const res:any = await api.dramaDetail({userId: user.id, dramaId: dramaId.value});
  Object.assign(drama, res);
  bottomTitle[0].count = res.dramaGatheringCount;
  bottomTitle[1].count = res.dramaEvaluateCount;
  bottomTitle[2].count = res.dramaStoreCount;
  bottomTitle[3].count = res.dramaDynamicCount;
  res.dramaGatheringCount;
  if(!drama.backgroundUrl){
    pageView.backgroundColor = "#0c0c0c";
  }else{
    pageView.backgroundColor = await getColor(drama.backgroundUrl) as string;
  }
};

/*获取title icon*/
function dramaTitleLevel(dramaTitle: any) {
  if(dramaTitle==="满分神作") return filters.icon('dramaLevel1');
  else if(dramaTitle==="剧游必玩") return filters.icon('dramaLevel2');
  else if(dramaTitle==="优质剧作") return filters.icon('dramaLevel3');
  else if(dramaTitle==="值得一试") return filters.icon('dramaLevel4');
  else if(dramaTitle==="水平在线") return filters.icon('dramaLevel5');
}

/*发售类型判断*/
function sellType(sellType:any) {
  if (sellType==='LIMITED') return filters.icon('LIMITED');
  else if (sellType==='EXCLUSIVE') return filters.icon('EXCLUSIVE');
  else if (sellType==='REAL_SCENE') return filters.icon('REAL_SCENE');
}

function dramaCoverBackground(sellType:any) {
  if (sellType==='LIMITED') return {
    background: `linear-gradient(90deg, rgba(235, 202, 108, 1), rgba(249, 223, 148, 1))`
  };
  else if (sellType==='EXCLUSIVE') return {
    background: `linear-gradient(90deg, rgba(254, 93, 54, 1), rgba(248, 144, 84, 1))`
  };
  else if (sellType==='REAL_SCENE') return {
    background: `linear-gradient(90deg, rgba(67, 151, 246, 1), rgba(83, 182, 247, 1))`
  };
  return {
    background: `linear-gradient(90deg, rgba(161, 161, 161, 1), rgba(115, 115, 115, 1))`
  };
}

function sellTypeTitle(sellType:any) {
  if (sellType==='LIMITED') return '城限';
  else if (sellType==='EXCLUSIVE') return '独家';
  else if (sellType==='REAL_SCENE') return '实景';
  return '';
}

/*弹出框*/
function showCustomModal() {
  uni.showModal({
    content: "是否确认取消“已玩过”？",
    showCancel: true,
    cancelText: "暂不",
    confirmText: "确认取消",
    success: (res) => {
      if (res.confirm) {
        console.log("用户点击确认取消");
        storeApi.cancelUserDramaPlayMP({
          dramaId: dramaId.value,
          userId: user.id,
        });
        dramaDetail();
      } else if (res.cancel) {
        console.log("用户点击暂不");
      }
    },
  });
}

/*改变想玩状态*/
function changeWantPlayStatus() {
  pageView.isAnimating = true;

  let playStatus = "WANT_PLAY";
  if (!drama.playStatus) {
    storeApi.updateUserDramaPlayMP({
      dramaId: dramaId.value,
      playStatus:playStatus,
      userId: user.id,
    });
  } else {
    storeApi.cancelUserDramaPlayMP({
      dramaId: dramaId.value,
      userId: user.id,
    });
    playStatus = "";
  }
  drama.playStatus = playStatus;
  setTimeout(() => {
    pageView.isAnimating = false;
  }, 1000);
}

/*隐藏多行文本状态变更*/
function doHiddenText() {
  pageView.hiddenText = !pageView.hiddenText;
}

/*文字截取*/
function sliceText(str: string): string {
  if (str.length > 7) {
    return str.substring(0, 7) + '...';
  } else {
    return str;
  }
}
</script>


<style scoped lang="scss">

.container{
  width: 100vw;
  position: relative;
  &-flex-column{
    display: flex;
    flex-direction: column;
  }
}

.background{
  width: 100vw;
  height: 420rpx;
  position: absolute;
  top: 0;
}

.gradient-mask{
}

.navigationImg {
  width: 176rpx;
  height: 64rpx;
  margin-left: 24rpx;
}

.fadeIn{
  animation: fadeIn;
  animation-duration: 4s;
}

.fadeOut{
  animation: fadeOut !important;
  animation-duration: 1s !important;
}

.flipInY{
  animation: heartBeat;
  animation-duration: 1s;
}

.pulse{
  animation: pulse;
  animation-duration: 1s;
}


.drama-background {
  width: 100vw;
  height: 420rpx;
}

.black-background {
  background-color: black;
  width: 100vw;
  height: 420rpx;
}

.drama-box {
  margin-top: 340rpx;
  width: 100vw;
  height: 304rpx;

  &-cover {
    width: 228rpx;
    height: 304rpx;
    border-radius: 24rpx;
    position: absolute;
    left: 24rpx;
    @include hor-center-center;
    &-img {
      width: 224rpx;
      height: 300rpx;
      border-radius: 24rpx;
      &-sellType{
        width: 60rpx;
        height: 34rpx;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 2;
      }
    }
  }

  &-right {
    position: absolute;
    left: 276rpx;
    display: flex;
    flex-direction: column;

    &-name {
      font-size: 40rpx;
      font-weight: 600;
      color: #FFFFFF;
      line-height: 47rpx;
      overflow-x: scroll;
      white-space: nowrap;
      width: 418rpx;
    }

    &-message {
      @include text-custom(400, 20rpx, #FFE39C);
      @include hor;
      align-items: center;
      line-height: 23rpx;
      margin-top: 4rpx;

      &-quotation {
        width: 12rpx;
        height: 8rpx;
      }
    }

    &-rank {
      height: 32rpx;
      width: 474rpx;
      @include hor;
      margin-top: 32rpx;
      margin-bottom: 8rpx;

      &-item {
        width: 128rpx;
        height: 32rpx;
        margin-right: 12rpx;
        z-index: 1;
        border-radius: 8rpx 8rpx 8rpx 8rpx;
        @include hor-center-center;
      }
    }
    &-theme{
      width: 474rpx;
      height: 34rpx;
      @include hor;
      margin-bottom: 4rpx;
      &-item{
        margin-right: 12rpx;
        @include text-custom(400, 24rpx, rgba(255, 255, 255, 0.6));
        line-height: 28rpx;
      }
    }
    &-prop{
      width: 474rpx;
      height: 34rpx;
      @include hor;
      &-item{
        margin-right: 8rpx;
        @include text-custom(400, 24rpx, rgba(255, 255, 255, 0.6));
        line-height: 28rpx;
      }
    }
    &-play{
      width: 474rpx;
      height: 60rpx;
      @include hor;
      margin-top: 24rpx;
      &-wantPlay{
        width:210rpx;
        height: 60rpx;
        border-radius: 16rpx 16rpx 16rpx 16rpx;
        background: rgba(255, 255, 255, 0.3);
        @include hor-center-center;
        @include text-custom(400, 26rpx, #FFFFFF);
        line-height: 30rpx;
      }
      &-played{
        width:210rpx;
        height: 60rpx;
        border-radius: 16rpx 16rpx 16rpx 16rpx;
        background: rgba(255, 255, 255, 0.3);
        @include hor-center-center;
        @include text-custom(400, 26rpx, #FFFFFF);
        line-height: 30rpx;
        margin-left: 20rpx;
        &-box{
          @include hor;
          align-items: center;
          &-noEvaluate{
            width: 450rpx;
            height: 60rpx;
            position: absolute;
            &-avatar{
              @include circle(56rpx);
              margin-left: 2rpx;
              margin-right: 22rpx;
              z-index: 1;
            }
            &-text{
              @include text-custom(400, 24rpx, #FFFFFF);
              line-height: 28rpx;
            }
            &-icon{
              height: 20rpx;
              width: 16rpx;
              margin-left: 8rpx;
            }
          }
          &-evaluate{
            &-text1{
              @include text-custom(400, 24rpx, rgba(255, 255, 255, 0.8));
              line-height: 28rpx;
            }
            &-text2{
              @include text-custom(400, 24rpx, #FFFFFF);
              line-height: 28rpx;
              margin-left: 18rpx;
            }
            &-line{
              width: 2rpx;
              height: 22rpx;
              background: rgba(255, 255, 255, 0.2);
              border-radius: 0;
              margin-left: 20rpx;
              margin-right: 20rpx;
            }
            &-icon{
              height: 20rpx;
              width: 16rpx;
              margin-left: 8rpx;
            }
          }
        }
      }
      &-img{
        @include react(36rpx);
        margin-right: 6rpx;
      }
    }
  }
}

.open-murder{
  width: 702rpx;
  height: 66rpx;
  margin-top: 40rpx;
  margin-left: 24rpx;
}

.rating{
  width: 702rpx;
  height: 192rpx;
  background: #262626;
  border-radius: 16rpx 16rpx 16rpx 16rpx;
  margin-top: 20rpx;
  margin-left: 24rpx;
  @include hor;
  &-left{
    width: 280rpx;
    height: 192rpx;
    @include ver;
    &-one{
      @include hor-center;
      margin-top: 20rpx;
      margin-left: 24rpx;
      margin-bottom: 18rpx;
      @include text-custom(600, 24rpx, #FFFFFF);
      line-height: 34rpx;
      &-img{
        width: 130rpx;
        height: 34rpx;
        margin-left: 14rpx;
      }
    }
    &-two{
      @include hor-center;
      justify-content: center;
      @include text-custom(800, 52rpx, #FEC635);
      font-family: OPPOSans, OPPOSans;
      margin-bottom: 10rpx;
      line-height: 61rpx;
    }
    &-three{
      @include hor-center;
      @include text-custom(400, 20rpx, rgba(255, 255, 255, 0.4));
      justify-content: center;
      line-height: 18rpx;
      &-icon{
        width: 14rpx;
        height: 18rpx;
      }
      &-go{
        width: 14rpx;
        height: 18rpx;
        margin-left: 5rpx;
      }
    }
  }
  &-right{
    width: 422rpx;
    height: 192rpx;
    @include ver;
    /*background: #F4F5F6;*/
    &-one{
      @include text-custom(400, 22rpx, rgba(255, 255, 255, 0.6));
      line-height: 26rpx;
      margin-left: 50rpx;
      margin-top: 22rpx;
      margin-bottom: 28rpx;
    }
    &-two{
      @include text-custom(500, 20rpx, rgba(255, 255, 255, 0.6));
      line-height: 23rpx;
      margin-bottom: 10rpx;
      &-row{
        @include hor-center-center;
        &-title{
          margin-right: 8rpx;
        }
        &-null{
          width: 72rpx;
        }
        &-line{

        }
      }
    }
  }
}
.author{
  width: 702rpx;
  /*
  background: #8f8e8e;
  */
  margin-top: 48rpx;
  margin-left: 24rpx;
  margin-bottom: 40rpx;
  &-one{
    width: 702rpx;
    @include hor-center;
    justify-content: space-between;
    margin-bottom: 24rpx;
    &-left{
      @include text-custom(500, 34rpx, #FFFFFF);
      line-height: 40rpx;
    }
    &-right{
      @include text-custom(400, 24rpx, rgba(255, 255, 255, 0.4));
      line-height: 28rpx;
      &-icon{
        width: 20rpx;
        height: 16rpx;
      }
    }
  }
  &-two{
    @include hor;
    overflow-x: scroll;
    white-space: nowrap;
    width: 700rpx;
    margin-bottom: 24rpx;
    &-item{
      @include hor-center;
      height: 46rpx;
      background: rgba(255,255,255,0.1);
      border-radius: 42rpx 42rpx 42rpx 42rpx;
      border: 2rpx solid;
      @include text-custom(400, 24rpx, rgba(255, 255, 255, 0.8));
      line-height: 28rpx;
      margin-right: 20rpx;
      &-author{
        @include react(34rpx);
        margin-left: 12rpx;
        margin-right: 12rpx;
      }
      &-go{
        @include react(12rpx);
        margin-left: 12rpx;
        margin-right: 14rpx;
      }
    }
  }
  &-three{
    @include text-custom(400, 30rpx, #FFFFFF);
    line-height: 35rpx;
  }
}

.role{
  margin-left: 24rpx;
  height: 368rpx;
  &-title{
    @include hor-center;
    justify-content: space-between;
    margin-bottom: 24rpx;
    &-left{
      @include text-custom(500, 34rpx, #FFFFFF);
      line-height: 40rpx;
    }
    &-right{
      @include hor-center;
      @include text-custom(500, 24rpx, rgba(255, 255, 255, 0.6));
      line-height: 28rpx;
      &-icon{
        width: 15rpx;
        height: 20rpx;
        margin-right: 24rpx;
        margin-left: 10rpx;

      }
    }
  }
  &-list{
    @include hor-center;
    overflow-x: scroll;
    white-space: nowrap;
    width: 726rpx;
    &-item{
      @include ver-center;
      margin-right: 16rpx;
      &-img{
        border-radius: 12rpx 12rpx 12rpx 12rpx;
        width: 162rpx;
        height: 216rpx;
      }
      &-name{
        @include text-custom(500, 26rpx, rgba(255, 255, 255, 0.8));
        @include hor-center-center;
        line-height: 30rpx;
        margin-top: 24rpx;
      }
    }
  }
}

.bottomTitle{
  width: 100vw;
  height: 110rpx;
  background: #FFFFFF;
  border-radius: 42rpx 42rpx 0 0;
  @include hor;
  justify-content: space-around;
  &-top{
    position: sticky;
    z-index:10
  }
  &-bg{
    border-radius: 0 0 0 0;
  }
  &-item{
    margin-top: 34rpx;
    &-column{
      @include ver-center-center;
      &-row{
        @include hor;
        &-name{
          @include text-custom(400, 30rpx, #959AA5);
          line-height: 35rpx;
          &-active{
            @include text-custom(500, 32rpx, #2E323E);
            line-height: 35rpx;
          }
        }
        &-count{
          @include text-custom(500, 18rpx, #959AA5);
          &-active{
            @include text-custom(500, 20rpx, #2E323E);
          }
        }
      }
    }
    &-line{
      width: 32rpx;
      height: 6rpx;
      background: #36E4BB;
      border-radius: 3rpx 3rpx 3rpx 3rpx;
      margin-top: 6rpx;
    }
  }
}

.bottomContent{
  min-height: 100vh;
  background: #FAFAFA;
}

.overFlow-line{
  @include text-overflow-line;
}

.container-head{
  height: 178rpx;
  width: 100vw;
  position: fixed;
  z-index: 10;
  animation: fadeIn;
  animation-duration: 2s;
  &-row{
    @include hor;
    &-cover{
      width: 48rpx;
      height: 64rpx;
      margin-left: 16rpx;
      margin-right: 18rpx;
    }
    &-column{
      @include ver;
      height: 64rpx;
      justify-content: space-between;
      &-name{
        @include text-custom(400, 28rpx, #FFFFFF);
      }
      &-rating{
        @include hor-center;
        @include text-custom(800, 26rpx, #FEC635);
        font-family: OPPOSans, OPPOSans;
        line-height: 30rpx;
        &-text{
          @include text-custom(400, 24rpx, #FFFFFF);
          line-height: 28rpx;
          margin-left: 4rpx;
        }
      }
    }
  }
}

</style>
