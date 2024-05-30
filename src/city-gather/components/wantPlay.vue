<template>
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
    <jy-dramaWrapper :recommendList="pageList" v-if="pageList.length"></jy-dramaWrapper>
    <jy-noMore v-if="pageList.length === total && total > 0"></jy-noMore>
    <u-gap height="120"></u-gap>
  </scroll-view>
  <jy-noData
    bgUrl="empty-drama"
    title="暂无剧本"
    subTitle="你还没有收集想玩的剧本"
    button="发现剧本"
    v-if="!pageList.length && !loading"
  ></jy-noData>
</template>
<script setup lang="ts">
const { bus, gatherApi } = useInstance();

const props = defineProps({
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
    default: 0,
  },
});

let loading = ref(true);

let isPull = ref(false);

let pageNo = ref(1);

let total = ref(0);

let cityId = ref(0);

let pageList: Array<any> = reactive([]);

onMounted(()=>{
  //监听切换城市
  bus.on('refresh-city',()=>{
    if(props.activeIndex === 3){
      cityId.value = uni.getStorageSync("city-info").id;
      onPull();
    }
  })
})

//监听
watch(
  () => props.activeIndex,
  () => {
    if(props.activeIndex === 3){
      cityId.value = uni.getStorageSync("city-info").id;
      onPull();
    }
  }
);

watch(
  () => props.searchWord,
  () => {
    if(props.activeIndex === 3){
      pageNo.value = 1;
      queryDramaList();
    }
  }
);

function onPull() {
  isPull.value = true;
  pageNo.value = 1;
  queryDramaList();
}

function onLoadMore() {
  if (pageList.length === total.value) return;

  pageNo.value++;
  queryDramaList();
}

//查询想玩剧本
async function queryDramaList() {
  let res: any = await gatherApi.getDramaGatherPage({
    cityId: cityId.value, //城市Id
    pageNo: pageNo.value,
    pageSize: 20,
    type: 2, //查询类型
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
  top: 0px;
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