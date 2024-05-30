<template>
  <filterStore :cityId="cityId" @changeSort="onChangeStoreSort"></filterStore>
  <scroll-view
    scroll-y
    class="scrollBox"
    refresher-enabled
    @scrolltolower="onLoadMore"
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

    <!-- 优选门店 -->
    <jy-storeCollect
      :collects="pageList"
      :cityId="cityId"
      @changeSort="onChangeStoreSort"
    ></jy-storeCollect>
    <jy-noMore v-if="pageList.length === total && total > 0"></jy-noMore>
    <u-gap height="120"></u-gap>
  </scroll-view>
  <jy-noData
    v-if="!pageList.length && !loading"
    bgUrl="empty-store"
    title="暂无优选门店～"
    top="24vh"
  ></jy-noData>
</template>
<script setup lang="ts">
import filterStore from "./filter-store.vue";
const { bus, myApi } = useInstance();

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

let isPull = ref(false);

let cityId = ref(0);

//门店筛选参数
let storeSortParma: any = reactive({});

let pageList: Array<any> = reactive([]);

onMounted(()=>{
  //监听切换城市
  bus.on('refresh-city',()=>{
    if(props.activeIndex === 1){
      cityId.value = uni.getStorageSync("city-info").id;
      onPull();
    }
  })
})

//监听
watch(() => props.activeIndex, () => {
  if(props.activeIndex === 1){
    cityId.value = uni.getStorageSync("city-info").id;
    onPull();
  }
});

watch(
  () => props.searchWord,
  () => {
    if(props.activeIndex === 1){
      pageNo.value = 1;
      getConditionStore();
    }
  }
);

function onPull(){
  isPull.value = true;
  pageNo.value = 1;
  getConditionStore();
}


function onLoadMore() {
  if (pageList.length === total.value) return;

  pageNo.value++;
  getConditionStore();
}

function onChangeStoreSort(parama: any) {
  storeSortParma = parama;

  pageNo.value = 1;
  getConditionStore();
}

//查询优选门店列表
async function getConditionStore() {
  let res: any = await myApi.getStoreCollects({
    lon: uni.getStorageSync("longitude"),
    lat: uni.getStorageSync("latitude"),
    pageNo: pageNo.value,
    pageSize: 20,
    cityId: cityId.value,
    beforeThere: storeSortParma.beforeThere,
    wantPlay: storeSortParma.wantPlay,
    userId: props.userInfo.id,
    districtId: storeSortParma.districtId,
    sortType: storeSortParma.orderBy, //综合排序
    storeNameKeyword: props.searchWord, //关键词
  });
  if (pageNo.value === 1) pageList.splice(0);
  
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
  top: 82rpx;
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