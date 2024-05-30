<template>
  <div class="area">

    <div class="area-top">
      <image class="area-top-leftArrow" :src="filters.icon('leftArrow')" @click="back"/>
      <div class="area-top-search">
        <u-search placeholder="搜索商品名称" v-model="search" :show-action="false" height="68rpx" bgColor="#E8E8E8"
                  @change="searchChange"></u-search>
      </div>

      <div class="area-content-title">
        <div class="area-content-title-item" v-for="item in statusList" :key="item.index"
             @click="clickTitle(item.index)"
             :class="{ 'area-content-title-item-active heartBeat': item.index === activeIndex }">
          {{ item.status }}
          <div class="area-content-title-item-active-line" v-if="item.index === activeIndex"/>
        </div>
      </div>


      <swiper class="area-content" @change="X_change" :current="activeIndex">
        <swiper-item v-for="item in statusList" :key="item.index">
          <u-skeleton
              rows="3"
              title
              :loading = "loading" :animate="true"
              :rowsWidth="['100%', '100%', '100%']"
              :rowsHeight="['308rpx', '308rpx', '308rpx']"
              class="skeleton"
          ></u-skeleton>
          <scroll-view scroll-y class="area-content-scroll" @scrolltolower="reachBottom">
            <div class="area-content-scroll-item" v-for="pageItem in pageList" :style="pageItem.orderStatus==='NOT_PAY'?'height:398rpx':''">
              <div class="area-content-scroll-item-top">
                <div class="area-content-scroll-item-top-left">
                  <image class="area-content-scroll-item-top-left-icon" :src="filters.icon('store_icon')"/>
                  <div class="area-content-scroll-item-top-left-storeName">
                    {{ sliceText(pageItem.storeName) }}
                  </div>
                </div>
                <div class="area-content-scroll-item-top-right">
                  <div class="area-content-scroll-item-top-right-orderStatus">
                    {{ orderStatusName(pageItem.orderStatus) }}
                  </div>
                  <div class="area-content-scroll-item-top-right-lastPayTime" v-if="showTimeCountDown(pageItem)">
                    <span>剩余</span>
                    <u-count-down :time="timeCountDown(pageItem.createdTime)" format="HH:mm"></u-count-down>
                  </div>
                </div>
              </div>
              <image class="area-content-scroll-item-drama-image" :src="pageItem.productImage" mode="aspectFill"></image>
              <div class="area-content-scroll-item-drama-name">{{sliceText(pageItem.productName)}}</div>
              <div class="area-content-scroll-item-top-right-lastPayTime" :style="positionBox(148,186)">时间: {{orderCreateTime(pageItem.createdTime)}}</div>
              <div class="area-content-scroll-item-top-right-lastPayTime" :style="positionBox(196,186)">价格: {{pageItem.orderAmount/100}}</div>
              <div class="area-content-scroll-item-drama-pay" v-if="showTimeCountDown(pageItem)">
                <div class="area-content-scroll-item-drama-pay-text" v-if="showTimeCountDown(pageItem)">
                  付款
                </div>
              </div>
            </div>
            <div class="block"/>
          </scroll-view>
        </swiper-item>
      </swiper>

    </div>
  </div>


</template>

<script setup lang="ts">
const {api,filters,dayjs,useUser} = useInstance();

/*搜索框文本*/
let search = ref('');
/*当前激活的索引*/
let activeIndex = ref(0);
/*分页字段*/
let pageNo = ref(1);
let pageSize = ref(5);
let pageList: any = reactive([]);
/*用户信息*/
const userInfo = reactive({});
let loading = ref(true);

function positionBox(top:number,left:number) {
  return `position: absolute; top: ${top}rpx; left: ${left}rpx;`;
}

function orderCreateTime(createTime:string) {
    return `${dayjs(createTime).format("YYYY-MM-DD")} ${filters.getWeek(createTime)} ${dayjs(createTime).format("HH:mm")}`;
}

function back() {
  uni.navigateBack();
}

function orderStatusName(status: any) {
  switch (status) {
    case 'NOT_PAY':
      return '待付款';
    case 'PAYED':
      return '已付款';
    case 'USED':
      return '已完成';
    case 'REVERSE':
      return '已退款';
    case 'CLOSE':
      return '已关闭';
    case 'SETTLEMENT':
      return '已结算';
    default:
      return '未知状态';
  }
}

function showTimeCountDown(pageItem: any){
  return timeCountDown(pageItem.createdTime) > 0 && pageItem.orderStatus==='NOT_PAY';
}

function timeCountDown(time: any){
  const createdTime = new Date(time).getTime();
  const fifteenMinutes = 15 * 60 * 1000;
  const shouldTime = createdTime + fifteenMinutes;

  const currentTime = Date.now();
  return  shouldTime - currentTime;
}

function sliceText(str: string): string {
  if (str.length > 10) {
    return str.substring(0, 10) + '...';
  } else {
    return str;
  }
}


onShow(async () => {
  let user = await useUser.getUserInfo(true);
  Object.assign(userInfo, user);
  await getOrderList();
});


/*状态标题*/
const statusList = reactive([
  {
    index: 0,
    status: '全部',
    type: null,
  }, {
    index: 1,
    status: '待付款',
    type: "NOT_PAY",
  }, {
    index: 2,
    status: '已付款',
    type: "PAYED",
  }, {
    index: 3,
    status: '已完成',
    type: "USED",
  }, {
    index: 4,
    status: '已退款',
    type: "REVERSE",
  }
])


/*获得订单列表*/
async function getOrderList() {
  if (pageNo.value === 1) {
    loading.value = true;
    pageList.length = 0;
  }
  let res = await api.orderList({
    orderStatus: statusList[activeIndex.value].type,
    pageNo: pageNo.value,
    pageSize: pageSize.value,
    userId: userInfo.id,
    productName: search.value,
    productType: 'GATHERING_PRODUCT'
  });
  res.records.forEach(record => pageList.push(record));

  console.log(res.total===0)
  if (res.total===0){
    // 延迟关loading
    setTimeout(() => {
      loading.value = false;
    }, 1000);
  }else {
    loading.value = false;
  }
}

/*触底分页操作*/
function reachBottom() {
  pageNo.value = pageNo.value + 1;
  getOrderList();
}

/*标题点击切换status事件*/
async function clickTitle(index: any) {
  activeIndex.value = index;
}

/*搜索框触达事件*/
async function searchChange(searchText: any) {
  search.value = searchText;
  await getOrderList();
}

/*左右滚轮切换事件*/
async function X_change(event: any) {
  let index = event.target.current;
  activeIndex.value = index;
  pageNo.value = 1;
  await getOrderList();
}

</script>

<style scoped lang="scss">
:deep(.u-count-down__text){
  font-size: 30rpx !important;
  font-weight: 400 !important;
  color: #959AA5 !important;
  line-height: 35rpx !important;
}

.skeleton{
  position: absolute;
  top: 500rpx;
  left: 0;
}

.heartBeat {
  animation: heartBeat;
  animation-duration: 1s;
}

.slideOutUp{
  animation: slideOutUp;
  animation-duration: 1s;
}

.block {
  width: 100vw;
  height: 50rpx;
}

.area {
  background: #F4F5F6;
  width: 100vw;
  height: 100vh;

  &-top {
    width: 100vw;
    height: 174rpx;
    position: relative;
    display: flex;

    &-leftArrow {
      position: absolute;
      bottom: 0;
      width: 68rpx;
      height: 68rpx;
      left: 18rpx;
    }

    &-search {
      position: absolute;
      bottom: -1rpx;
      left: 110rpx;
      width: 394rpx;
    }
  }

  &-content {
    position: absolute;
    top: 288rpx;

    width: 100vw;
    height: 1338rpx;

    &-title {
      position: absolute;
      top: 215rpx;
      width: 100vw;

      display: flex;

      font-size: 30rpx;
      font-weight: 400;
      color: #959AA5;
      line-height: 35rpx;

      &-item {
        margin-right: 50rpx;
        display: flex;
        flex-direction: column;
        align-items: center;

        &-active {
          font-size: 36rpx;
          font-weight: 600;
          color: #2E323E;
          line-height: 42rpx;

          &-line {
            width: 12rpx;
            height: 4rpx;
            background: #2E323E;
            border-radius: 12rpx 12rpx 12rpx 12rpx;
          }
        }

        &:first-child {
          margin-left: 24rpx;
        }
      }
    }

    &-scroll {
      width: 100vw;
      height: 1338rpx;
      display: flex;
      flex-direction: column;

      &-item {
        margin-left: 12rpx;
        margin-top: 18rpx;
        width: 726rpx;
        height: 308rpx;
        background: #FFFFFF;
        border-radius: 24rpx 24rpx 24rpx 24rpx;
        position: relative;

        &-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: absolute;
          top: 32rpx;
          width: 726rpx;
          height: 44rpx;

          &-left{
            display: flex;
            align-items: center;
            &-icon {
              width: 40rpx;
              height: 40rpx;
              margin-left: 24rpx;
              margin-right: 8rpx;
            }

            &-storeName {
              font-size: 30rpx;
              font-weight: 600;
              color: #2E323E;
              line-height: 35rpx;
            }
          }

          &-right {
            display: flex;
            margin-right: 24rpx;
            &-orderStatus {
              font-size: 30rpx;
              font-weight: 400;
              color: #FF7A00;
              line-height: 35rpx;
              margin-right: 12rpx;
            }
            &-lastPayTime{
              display: flex;
              font-size: 30rpx;
              font-weight: 400;
              color: #959AA5;
              line-height: 35rpx;
            }
          }
        }
        &-drama{
          &-image{
            width: 138rpx;
            height: 184rpx;
            border-radius: 12rpx 12rpx 12rpx 12rpx;
            position: absolute;
            left: 24rpx;
            top: 100rpx;
          }
          &-name{
            font-size: 30rpx;
            font-weight: 600;
            color: #2E323E;
            line-height: 35rpx;
            position: absolute;
            left: 186rpx;
            top: 100rpx;
          }
          &-pay{
            position: absolute;
            bottom: 20rpx;
            right: 24rpx;
            width: 176rpx;
            height: 70rpx;
            border-radius: 70rpx 70rpx 70rpx 70rpx;
            opacity: 1;
            border: 2rpx solid #F4883A;
            display: flex;
            justify-content: center;
            align-items: center;
            &-text{
              font-size: 28rpx;
              font-weight: 400;
              color: #F4883A;
              line-height: 44rpx;
            }
          }
        }
      }
    }
  }
}


</style>
