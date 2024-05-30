<template>
  <div class="gathering">
    <div class="title">
      <image :src="filters.icon('gather-count-tag')"></image>
      <div class="title-text">
        该剧本有
        <div class="title-text-count"> {{totalGatherCount}}场 </div>
        正在组局
      </div>
    </div>

    <jy-gatheringList :gatherList="gatherList"></jy-gatheringList>
    <div class="end">没有更多了哦～</div>
  </div>

</template>
<script setup lang="ts">
const {api, myApi,gatherApi , dayjs, filters, getColor, menuButtonRect} = useInstance();

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

let gatherList: Array<any> = reactive([]);
let totalGatherCount = ref(0);
let cityId = ref(0);
let pageSize = ref(6);
let pageNo = ref(1);


onMounted(async () => {
  cityId.value = uni.getStorageSync("city-info").id;
  await queryGatherList();
});


//查询组局列表
async function queryGatherList() {
  if (pageNo.value === 1) {
    gatherList.splice(0);
  }

  let res = await gatherApi.getCityGatheringPage({
    pageNo: pageNo.value,
    pageSize: pageSize.value,
    userLatitude: uni.getStorageSync("latitude"), //用户-经度
    userLongitude: uni.getStorageSync("longitude"), //	用户-纬度
    userId: props.userId,
    dramaId: props.dramaId,
  });

  totalGatherCount.value = res.gatheringCountToday;

  if (res.cityGatheringVo.records) {
    gatherList.push(...res.cityGatheringVo.records);
  }
}

//触底加载更多
onReachBottom(async () => {
  pageNo.value++;
  await queryGatherList();
});


</script>
<style lang="scss" scoped>
.title{
  width: 702rpx;
  height: 76rpx;
  background: linear-gradient(180deg, rgba(255,255,255,0) 1%, #FFFFFF 25%);
  margin-left: 24rpx;
  border-radius: 0px 0px 24rpx 24rpx;
  @include hor-center;
  image {
    padding-left: 24rpx;
    width: 28rpx;
    height: 28rpx;
    transform: translateY(2rpx);
  }
  &-text{
    @include text-custom(500,26rpx,#2E323E);
    line-height: 30rpx;
    margin-left: 8rpx;
    &-count{
      @include text-custom(500,26rpx,#36E4BB);
      display: inline;
    }
  }
}
.gathering{
  @include ver;
  background: #FAFAFA;
}
.end{
  @include text-custom(400,24rpx,#959AA5);
  line-height: 28rpx;
  margin-top: 60rpx;
  margin-left: 286rpx;
  margin-bottom: 50rpx;
}
</style>