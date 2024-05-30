<template>
  <filterDate
    :cityId="cityId"
    :totalGatherCount="totalGatherCount"
    :gatheringToday="gatheringToday"
    @changeSort="onChangeSort"
  ></filterDate>
  <scroll-view
    scroll-y
    class="scrollBox"
    refresher-enabled
    @refresherabort="onLoadMore"
    @refresherrefresh="onPull"
    :refresher-triggered="isPull"
  >
    <u-skeleton
      rows="30"
      title
      :loading="loading"
      animate
      :rowsWidth="['100%', '100%', '100%']"
      :rowsHeight="['308rpx', '308rpx', '308rpx']"
      class="skeleton"
    ></u-skeleton>
    <!-- 组局 -->
    <jy-gatheringList :gatherList="pageList" v-if="pageList.length"></jy-gatheringList>
    <jy-noMore v-if="pageList.length === total && total > 0"></jy-noMore>
    <u-gap height="120"></u-gap>
  </scroll-view>
  <image :src="filters.icon('icon-empty-gather')" class="emptyImg" v-if="!pageList.length && !loading"></image>
</template>
<script setup lang="ts">
import filterDate from "./filter-date.vue";
const { bus, gatherApi, filters } = useInstance();

const props = defineProps({
  menuRect: {
    type: Object,
    default: {},
  },
  userInfo: {
    type: Object,
    default: {},
  },
  searchWord: {
    type: String,
    default: ''
  },
  activeIndex: {
    type: Number,
    default: 0
  },
  isPull: {
    type: Boolean,
    default: false
  }
});

let loading = ref(true);

let pageNo = ref(0);

let total = ref(0);

//组局筛选参数
let gatherSortParama: any = reactive({});

let totalGatherCount = ref(0);

let gatheringToday = ref(0);

let pageList: Array<any> = reactive([]);

let isPull = ref(false);

let cityId = ref(0);

onMounted(()=>{
  //监听切换城市
  bus.on('refresh-city',()=>{
    if(props.activeIndex === 0){
      cityId.value = uni.getStorageSync("city-info").id;
      onPull();
    }
  })
  
  //监听刷新组局
  bus.on('refresh-gather',()=>{
    onPull();
  })
})

//监听
watch(() => props.activeIndex, () => {
  if(props.activeIndex === 0){
    cityId.value = uni.getStorageSync("city-info").id;
    onPull();
  }
});

watch(
  () => props.searchWord,
  () => {
    if(props.activeIndex === 0){
      pageNo.value = 1;
      queryGatherList();
    }
  }
);

function onPull(){
  isPull.value = true;
  pageNo.value = 1;
  queryGatherList();
}

function onLoadMore() {
  if (pageList.length === total.value) return;

  pageNo.value++;
  queryGatherList();
}

//切换筛选
async function onChangeSort(parama: any) {
  gatherSortParama = parama;

  pageNo.value = 1;
  queryGatherList();
}

//查询组局列表
async function queryGatherList() {
  let res: any = await gatherApi.getCityGatheringPage({
    date: gatherSortParama.date,
    pageNo: pageNo.value,
    pageSize: 20,
    cityId: cityId.value,
    userLatitude: uni.getStorageSync("latitude"), //用户-经度
    userLongitude: uni.getStorageSync("longitude"), //	用户-纬度
    operatorType: "USER",
    keyWord: props.searchWord, //模糊查询
    districtId: gatherSortParama.districtId, //区域Id
    timeType: gatherSortParama.timeType, //筛选时间日期
    playStatus: gatherSortParama.playStatus === 0 ? 1 : null, //筛选想玩的剧本
    playNotStatus: gatherSortParama.playStatus,
    sellType: gatherSortParama.sellType, //筛选发售方式
    dictIdsList: gatherSortParama.dicts && gatherSortParama.dicts.length ? gatherSortParama.dicts: null, //筛选类型
    orderBy: gatherSortParama.orderBy,
    userId: props.userInfo.id,
  });
  if (pageNo.value === 1) pageList.splice(0);

  totalGatherCount.value = res.gatheringCountNum;
  gatheringToday.value = res.gatheringCountToday;

  if (res.list.records.length) {
    pageList.push(...res.list.records);
  }
  // total.value = res.total;
  loading.value = false;
  isPull.value = false;
}
</script>
<style lang="scss" scoped>
.scrollBox {
  position: fixed;
  left: 0px;
  right: 0px;
  bottom: 0px;
  overflow-y: scroll;
  top: 276rpx;
  &-empty {
    margin-left: 50%;
    transform: translateX(-50%);
    margin-top: 246rpx;
    width: 300rpx;
    height: 300rpx;
  }
}
.emptyImg{
  margin-top: 30vh;
  margin-left: 50%;
  transform: translateX(-50%);
  width: 300rpx;
  height: 300rpx;
}
</style>