<template>
  <div class="container">
    <div class="item-box">
      <div class="item-box-item" v-for="data in dataList" :key="data.id">
        <image class="item-box-item-cover" :src="data.storeDoorstep" mode="aspectFill"/>
        <div class="item-box-item-right">
          <div class="item-box-item-right-name">{{sliceText(data.storeName)}}</div>

          <div  class="item-box-item-right-score-between">
            <span class="item-box-item-right-score">
              <span class="item-box-item-right-score-first">
                {{formatScore(data.evaluateItem.comprehensiveScore)}}
              </span>
              <span class="item-box-item-right-score-two">
                分
              </span>
              <span class="item-box-item-right-score-three ml6">
                {{data.explosiveCount}}
              </span>
            </span>

            <span class="item-box-item-right-score-four">
                {{data.districtName}}
              <span class="item-box-item-right-score-line">|</span>
                {{filters.metersTransferThousand(data.distance) }}
            </span>
          </div>

          <div class="item-box-item-right-gathering" v-if="data.gatheringCount && data.gatheringCount>0">
            <image class="item-box-item-right-gathering-icon" :src="filters.icon('gathering-icon')"></image>
            <span class="item-box-item-right-gathering-text">{{data.gatheringCount}}场剧本组局进行中</span>
            <image class="item-box-item-right-gathering-go" :src="filters.icon('right-arrow-yellow')" mode="aspectFill"></image>
          </div>

          <div class="item-box-item-right-gathering-block" v-else/>

          <div class="item-box-item-right-end">
            ¥{{data.storeDramaPrice/100}}/位
            <div class="item-box-item-right-end-box" v-if="data.evaluateItem.recentTo">
              <div class="item-box-item-right-end-box-text">{{data.evaluateItem.recentTo}}人近期去过</div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div class="end">没有更多了哦～</div>
    <div class="empty"/>
  </div>
</template>
<script setup lang="ts">
const {api, myApi,storeApi , dayjs, filters, getColor, menuButtonRect} = useInstance();

const props = defineProps({
  dramaId: {
    type: String,
    default: 0,
  },
  userId: {
    type: Number,
    default: 0,
  },
})


let pageSize = ref(6);
let pageNo = ref(1);
let dataList:any = reactive([]);


onMounted(async () => {
  await loadDramaDetailStoreData();
});

function sliceText(str: string): string {
  if (str.length > 10) {
    return str.substring(0, 10) + '...';
  } else {
    return str;
  }
}


async function loadDramaDetailStoreData() {
  try {
    if (pageNo.value === 1) {
      dataList.splice(0);
    }

    let data = await storeApi.queryDramaDetailStore({
      dramaId: props.dramaId,
      lat: uni.getStorageSync('latitude'),
      lon: uni.getStorageSync('longitude'),
      pageNo: pageNo.value,
      pageSize: pageSize.value,
    });

    if (data.records && data.records.length) {
      dataList.push(...data.records);
    }
  } catch (e) {
    console.error(e);
  }
}

function formatScore(score:string) {
  // 检查score是否存在，如果不存在，返回 "0.0"
  if (score === null || score === undefined) return "0.0";

  // 转换为数字
  const num = Number(score);
  if (isNaN(num)) return score; // 如果不是有效数字，返回原始值

  // 如果是整数，添加 ".0"
  if (num % 1 === 0) return `${num}.0`;

  // 否则返回原始数值
  return num;
}


//触底加载更多
onReachBottom(async () => {
  pageNo.value++;
  await loadDramaDetailStoreData();
});


</script>
<style lang="scss" scoped>
.item{
  width: 100vw;
  &-box {
    @include ver;
    background: #FAFAFA;
    &-item {
      @include hor;
      width: 702rpx;
      height: 240rpx;
      background: #FFFFFF;
      border-radius: 18rpx 18rpx 18rpx 18rpx;
      margin-top: 20rpx;
      margin-left: 24rpx;
      &-cover{
        @include react(180rpx);
        border-radius: 12rpx 12rpx 12rpx 12rpx;
        margin: 30rpx 24rpx;
      }
      &-right{
        @include ver;
        align-items: flex-start;
        width: 498rpx;
        &-name{
          @include text-custom(500,32rpx,#2E323E);
          line-height: 38rpx;
          margin-top: 32rpx;
          margin-bottom: 6rpx;
        }
        &-score{
          &-between{
            @include hor;
            width: 498rpx;
            align-items: center;
            justify-content: space-between;
          }
          &-first{
            @include text-custom(600,26rpx,#FF6300);
          }
          &-two{
            @include text-custom(400,24rpx,#FF6300);
          }
          &-three{
            @include text-custom(400,24rpx,#5F6572);
          }
          &-three::before{
            content: '人气值';
            margin-right: 6rpx;
          }
          &-four{
            @include text-custom(400,24rpx,#5F6572);
            margin-right: 24rpx;
          }
          &-line{
            @include text-custom(400,24rpx,#5F6572);
            margin-right: 10rpx;
            margin-left: 12rpx;
          }
        }
        &-gathering{
          height: 40rpx;
          background: #FFEFE5;
          display: flex;
          align-items: center;
          margin-top: 12rpx;
          margin-left: 20rpx;
          border-radius: 8rpx 8rpx 8rpx 8rpx;
          &-text{
            margin-left: 8rpx;
            @include text-custom(400,22rpx,#FE7100);
            line-height: 26rpx;
          }
          &-icon{
            width: 42rpx;
            height: 40rpx;
            margin-left: -20rpx;
          }
          &-go{
            width: 12rpx;
            height: 20rpx;
            margin-left: 6rpx;
            margin-right: 8rpx;
          }
          &-block{
            height: 40rpx;
          }
        }
        &-end{
          @include hor-center-center;
          @include text-custom(400,24rpx,#5F6572);
          line-height: 28rpx;
          margin-top: 6rpx;
          &-box{
            @include hor-center-center;
            height: 32rpx;
            background: #FFFFFF;
            border-radius: 8rpx 8rpx 8rpx 8rpx;
            border: 1rpx solid #B2B2B2;
            margin-left: 8rpx;
            &-text{
              @include text-custom(400,22rpx,#5F6572);
              line-height: 26rpx;
              margin-left: 8rpx;
              margin-right: 8rpx;
            }
          }
        }
      }

    }
  }
}

.end{
  @include text-custom(400,24rpx,#959AA5);
  line-height: 28rpx;
  margin-top: 88rpx;
  margin-left: 286rpx;
}

.empty{
  height: 60rpx;
}

</style>