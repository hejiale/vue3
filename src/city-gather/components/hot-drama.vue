<template>
  <filterDrama @changeFilter="onChangeDramaSort"></filterDrama>
  <scroll-view
    scroll-y
    class="scrollBox"
    @scrolltolower="onLoadMore"
    refresher-enabled
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
    <jy-dramaWrapper :recommendList="pageList" v-if="pageList.length"></jy-dramaWrapper>
    <jy-noMore v-if="pageList.length === total && total > 0"></jy-noMore>
    <u-gap height="120"></u-gap>
  </scroll-view>
  <jy-noData
    bgUrl="empty-drama"
    title="暂无热本推荐"
    v-if="!loading && !pageList.length"
  ></jy-noData>
</template>
<script setup lang="ts">
import filterDrama from "./filter-drama.vue";
const { bus, gatherApi } = useInstance();

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
    default: "",
  },
  activeIndex: {
    type: Number,
    default: 0
  }
});

let loading = ref(true);

let pageNo = ref(1);

let total = ref(0);

let cityId = ref(0);

let isPull = ref(false);

//筛选参数
let dramaSortParama: any = reactive({});

let pageList: Array<any> = reactive([]);

onMounted(()=>{
  //监听切换城市
  bus.on('refresh-city',()=>{
    if(props.activeIndex === 2){
      cityId.value = uni.getStorageSync("city-info").id;
      onPull();
    }
  })
})

//监听
watch(() => props.activeIndex, () => {
  if(props.activeIndex === 2){
    cityId.value = uni.getStorageSync("city-info").id;
    onPull();
  }
});

watch(
  () => props.searchWord,
  () => {
    if(props.activeIndex === 2){
      pageNo.value = 1;
      queryHotDrama();
    }
  }
);

function onPull() {
  isPull.value = true;
  pageNo.value = 1;
  queryHotDrama();
}

function onLoadMore() {
  if (pageList.length === total.value) return;

  pageNo.value++;
  queryHotDrama();
}

function onChangeDramaSort(parama:any) {
  dramaSortParama = parama;

  pageNo.value = 1;
  queryHotDrama();
}

//查询热玩剧本
async function queryHotDrama() {
  let res:any = await gatherApi.getDramaGatherPage({
    cityId: cityId.value, //城市Id
    pageNo: pageNo.value,
    pageSize: 20,
    type: 1, //查询类型
    dictIds: dramaSortParama.dict ? [dramaSortParama.dict] : null,
    maxGamerNum: dramaSortParama.people
      ? dramaSortParama.people.maxGamerNum
      : null, //最大玩家
    minGamerNum: dramaSortParama.people
      ? dramaSortParama.people.minGamerNum
      : null, //最小玩家
    dramaNameKeyword: props.searchWord, //关键词
  });
  if(pageNo.value === 1){
    pageList.splice(0);
  }
  if (res.records.length) {
    pageList.push(...res.records);
  }
  total.value = res.total;
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
  top: 214rpx;
  overflow-y: scroll;
  &-empty {
    margin-left: 50%;
    transform: translateX(-50%);
    margin-top: 246rpx;
    width: 300rpx;
    height: 300rpx;
  }
}
</style>