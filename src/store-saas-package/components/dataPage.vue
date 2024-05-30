<template>
  <!--  开本组局横幅  -->
  <div class="banner">
    <image class="banner-item" @click="switchToOnlineGame" :src="filters.icon('saas-purchase')" :style="{ left: 0 }"/>
    <image class="banner-item" :src="filters.icon('saas-gather')" :style="{ right: 0 }" @click="onGoGather"/>
  </div>
  <!--  店铺优惠券  -->
  <div class="coupon" @click="switchToCoupon">
    <image class="coupon-icon" :src="filters.icon('store-coupon')"/>
    <div class="coupon-text">店铺优惠券</div>
    <div class="coupon-count">
      <span class="coupon-count-note">1张</span>
      <image class="coupon-count-arrow" :src="filters.icon('sass_right_arrow')"/>
    </div>
  </div>
  <!--  店铺数据  -->
  <div class="data">
    <div class="data-title">
      <image class="data-title-icon" :src="filters.icon('saas-store-data')"/>
      <span class="data-title-text">店铺数据</span>
    </div>
    <div class="data-box">
      <div class="data-box-item" v-for="(text,index) in textList" :key="text">
        <div class="data-box-item-note">{{ text }}</div>
        <div class="data-box-item-data">{{ dataList[index] }}</div>
      </div>
    </div>
  </div>
  <!--  精选剧本  -->
  <div class="drama">
    <div class="drama-title">
      <div class="drama-title-text">精选剧本</div>
      <div class="drama-title-tag">{{ dramaList.length }}</div>
    </div>
    <div class="drama-nav">
      <span>剧本库中长按剧本设置</span>
      <u-icon name="arrow-right" size="12" top="1"></u-icon>
    </div>
    <div class="drama-scrollBox">
      <u-scroll-list :indicator="false">
        <div v-for="(item,idx) in dramaList" :key="idx">
          <div class="drama-scrollBox-item">
            <image class="drama-scrollBox-item-img" :src="item.dramaCover" mode="aspectFill"/>
            <span class="drama-scrollBox-item-text">{{item.dramaName}}</span>
            <image class="drama-scrollBox-item-tag" :src="filters.icon(item.sellType)"/>
          </div>
        </div>
      </u-scroll-list>
    </div>
  </div>
  <!--  票房本  -->
  <div class="drama">
    <div class="drama-title">
      <div class="drama-title-text">票房本</div>
      <div class="drama-title-tag">{{ dramaList.length }}</div>
    </div>
    <div class="drama-nav">
      <span>前去申领</span>
      <u-icon name="arrow-right" size="12" top="1"></u-icon>
    </div>
    <div class="drama-scrollBox">
      <u-scroll-list :indicator="false">
        <div v-for="(item,idx) in dramaList" :key="idx">
          <div class="drama-scrollBox-item">
            <image class="drama-scrollBox-item-img" :src="item.dramaCover" mode="aspectFill"/>
            <span class="drama-scrollBox-item-text">{{item.dramaName}}</span>
            <image class="drama-scrollBox-item-tag" :src="filters.icon(item.sellType)"/>
          </div>
        </div>
      </u-scroll-list>
    </div>
  </div>
  <!--  全部剧本  -->
  <div class="drama">
    <div class="drama-title">
      <div class="drama-title-text">全部剧本</div>
      <div class="drama-title-tag">{{ dramaList.length }}</div>
    </div>
    <div class="drama-nav">
      <span>前去查看</span>
      <u-icon name="arrow-right" size="12" top="1"></u-icon>
    </div>
    <div class="drama-scrollBox">
      <u-scroll-list :indicator="false">
        <div v-for="(item,idx) in dramaList" :key="idx">
          <div class="drama-scrollBox-item">
            <image class="drama-scrollBox-item-img" :src="item.dramaCover" mode="aspectFill"/>
            <span class="drama-scrollBox-item-text">{{item.dramaName}}</span>
            <image class="drama-scrollBox-item-tag" :src="filters.icon(item.sellType)"/>
          </div>
        </div>
      </u-scroll-list>
    </div>
  </div>
</template>

<script setup lang="ts">

const { filters, sassApi, useStore, homeApi } = useInstance();

let textList = [ "今日营收(元)", "本月营收(元)", "本年营收(元)", "今日开本数(次)", "本月开本数(次)", "本年开本数(次)", "今日组局数(场)", "本月组局数(场)", "本年组局数(场)" ];
let dataList = reactive([0,0,0,0,0,0,0,0,0]);
let storeInfo = reactive( {});
let dramaList: Array<any> = reactive([]); //精选剧本列表

onMounted(async () => {
  Object.assign(storeInfo, useStore.storeInfo);  // 获取店铺信息
  let res = await sassApi.queryStoreBi({ "id" : storeInfo.id }); // 获取店铺数据
  dataList[0] = res.todayRevenue;
  dataList[1] = res.monthToDateRevenue;
  dataList[2] = res.yearToDateRevenue;
  dataList[3] = res.todayBooksOpened;
  dataList[4] = res.monthToDateBooksOpened;
  dataList[5] = res.yearToDateBooksOpened;
  dataList[6] = res.todayGamesOrganized;
  dataList[7] = res.monthToDateGamesOrganized;
  dataList[8] = res.yearToDateGamesOrganized;

  await queryRecommendDrama();
});

//跳转组局页面
function onGoGather(){
  uni.navigateTo({url: '/store-gather/pages/index'})
}

/*跳转到开本页面*/
const switchToOnlineGame = (() => {
  let isThrottled = false;

  return () => {
    if (!isThrottled) {
      uni.navigateTo({ url: '/store-saas-package/pages/dramaSelect' });

      isThrottled = true;
      setTimeout(() => {
        isThrottled = false;
      }, 1000); // 设置节流时间间隔（以毫秒为单位）
    }
  };
})();

/*跳转到优惠券页面*/
const switchToCoupon = (() => {
  let isThrottled = false;

  return () => {
    if (!isThrottled) {
      uni.navigateTo({ url: '/store-saas-package/pages/storeCoupon' });

      isThrottled = true;
      setTimeout(() => {
        isThrottled = false;
      }, 1000); // 设置节流时间间隔（以毫秒为单位）
    }
  };
})();

/*查询推荐剧本列表*/
async function queryRecommendDrama() {
  let res = await homeApi.queryHotDrama({});
  Object.assign(dramaList, res);
}
</script>

<style scoped lang="scss">
.banner {
  position: relative;
  width: 710rpx;
  height: 176rpx;
  margin-top: 16rpx;

  &-item {
    position: absolute;
    width: 376rpx;
    height: 176rpx;
    height: 176rpx;
  }
}

.coupon {
  position: relative;
  width: 710rpx;
  height: 116rpx;
  margin-top: 16rpx;
  background: #FFFFFF;
  border-radius: 24rpx;

  &-icon {
    position: absolute;
    top: 26rpx;
    left: 24rpx;
    width: 64rpx;
    height: 64rpx;
  }

  &-text {
    position: absolute;
    top: 42rpx;
    left: 104rpx;
    @include text-custom(400,24rpx,#070E1D);
  }

  &-count {
    position: absolute;
    right: 10rpx;
    height: 116rpx;
    width: 80rpx;
    @include hor-center;

    &-note {
      margin-right: 5rpx;
      @include text-custom(400,26rpx,#5F6572);
    }

    &-arrow {
      width: 20rpx;
      height: 20rpx;
    }
  }
}

.data {
  width: 710rpx;
  height: 616rpx;
  margin-top: 40rpx;

  &-title {
    height: 64rpx;
    @include hor-center;

    &-icon {
      width: 60rpx;
      height: 60rpx;
    }

    &-text {
      margin-left: 6rpx;
      @include text-custom(500, 32rpx, #030A19);
    }
  }

  &-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    height: 566rpx;
    margin-top: 16rpx;

    &-item {
      width: 222rpx;
      height: 164rpx;
      border: 2rpx solid #EDEDED;
      margin-bottom: 10rpx;
      background: #FFFFFF;
      border-radius: 20rpx;
      flex: 0 0 calc(33.33% - 10rpx);

      &-note {
        margin-left: 24rpx;
        margin-top: 28rpx;
        @include text-custom(400, 26rpx, #5F6572);
      }

      &-data {
        margin-left: 24rpx;
        margin-top: 32rpx;
        @include text-custom(800, 34rpx, #030A19);
      }
    }
  }
}

.drama {
  position: relative;
  width: 710rpx;
  height: 354rpx;
  margin-top: 24rpx;
  background: #ffffff;
  border-radius: 20rpx;

  &-title {
    position: absolute;
    left: 24rpx;
    top: 28rpx;
    @include hor;

    &-text {
      @include text-custom(600,32rpx,#2E323E);
    }

    &-tag {
      margin-left: 8rpx;
      @include text-custom(600,24rpx,#959AA5);
    }
  }

  &-nav {
    position: absolute;
    top: 30rpx;
    right: 20rpx;
    @include hor;
    @include text-custom(400,24rpx,#959AA5);
  }

  &-scrollBox {
    position: absolute;
    bottom: 20rpx;
    width: 100%;
    height: 238rpx;

    &-item {
      position: relative;
      margin-left: 12rpx;
      width: 144rpx;
      height: 238rpx;

      &-img {
        width: 144rpx;
        height: 192rpx;
        border-radius: 8rpx;
      }

      &-text {
        margin-top: 12rpx;
        @include text-custom(500,24rpx,#2E323E);
        @include text-overflow-line(1);
      }

      &-tag {
        position: absolute;
        top: 0;
        right: 0;
        width: 50rpx;
        height: 28rpx;
      }
    }
  }
}
</style>