<template>
  <div class="container">
    <div class="container-fixed"></div>
    <image class="container-cover" :src="filters.icon('goGather-bg')"></image>
    <jy-navigationBar>
      <template v-slot:content>
        <div class="topBar">
          <image
            :src="filters.icon('icon_gather_back')"
            class="topBar-back"
            @click="onBack"
          ></image>
          <jy-searchBar width="384rpx" bgColor="#fff" customHeight="64rpx" borderRadius="32rpx" v-model="keyword"></jy-searchBar>
        </div>
      </template>
      <template v-slot:view>
        <div class="container-total"><div class="container-total-space"></div>共计 {{ total }} 套剧本<div class="container-total-space"></div></div>
        <scroll-view class="container-listBox" scroll-y @scrolltolower="onLoadMore" v-if="dramaList.length">
            <div class="container-listBox-drama" v-for="drama in dramaList" :key="drama.id" @click="onSelectDrama(drama)">
                <image :src="drama.dramaItem.dramaCover" class="container-listBox-drama-cover" mode="aspectFill"/>
                <div class="container-listBox-drama-info">
                    <span class="container-listBox-drama-info-title">{{ drama.dramaItem.dramaName }}</span>
                    <span class="container-listBox-drama-info-price mt2">¥{{ drama.currentPrice / 100 }}</span>
                    <div class="container-listBox-drama-info-choose mt8">选择</div>
                </div>
            </div>
            <jy-noMore v-if="total > 0 && total === dramaList.length"></jy-noMore>
        </scroll-view>
        <jy-noData title="暂无剧本～" bgUrl="empty-drama" v-else/>
      </template>
    </jy-navigationBar>
  </div>
</template>
<script lang="ts" setup>
const {
  gatherApi,
  useUser,
  getColor,
  requestAuthorize,
  filters,
  enums,
  menuButtonRect,
} = useInstance();

let storeId = ref();

let pageNo = ref(1);

let keyword = ref();

let total = ref();

let dramaList:Array<any> = reactive([]);

//监听
watch(
  keyword,
  () => {
    if(!storeId.value)return;
    
    pageNo.value = 1;
    queryDramaList();
  },
  { immediate: true }
)

onLoad((option:any)=>{
  storeId.value = option.storeId;
  queryDramaList();
})

function onBack() {
  uni.navigateBack();
}

function onLoadMore(){
    if(total.value === dramaList.length)return;

    pageNo.value++;
    queryDramaList();
}

function onSelectDrama(drama:any){
  uni.setStorageSync('gatherProduct', drama);
  uni.navigateBack();
}

/**
 * 查询剧本列表
 */
async function queryDramaList() {
  if(pageNo.value === 1) dramaList.splice(0);

  let res:any = await gatherApi.getStoreProductPage({
    pageNo: pageNo.value,
    pageSize: 20,
    productKeyword: keyword.value,
    productType: 'GATHERING_PRODUCT',
    storeId: storeId.value,
  });

  total.value = res.total;
  dramaList.push(...res.records);
}
</script>
<style lang="scss" scoped>
.container {
  &-fixed {
    @include fixed-center;
    background: #f4f5f6;
  }
  &-cover {
    position: fixed;
    left: 0px;
    right: 0px;
    top: 0px;
    height: 756rpx;
  }
  &-total{
    width: 750rpx;
    height: 110rpx;
    @include text-bold(22rpx, #999999);
    @include hor-center-center;
    &-space{
        width: 20rpx;
        height: 2rpx;
        background: #999;
        margin: 0px 16rpx;
    }
  }
  &-listBox{
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    top: 110rpx;
    &-drama{
        display: inline-flex;
        width: 330rpx;
        height: 176rpx;
        background: #FFFFFF;
        border-radius: 24rpx;
        margin: 0px 0rpx 30rpx 30rpx; 
        align-items: center;
        padding: 20rpx;
        box-sizing: border-box;
        &-cover{
            width: 100rpx;
            height: 136rpx;
            border-radius: 12rpx;
        }
        &-info{
            @include ver;
            margin-left: 20rpx;
            flex: 1;
            &-title{
                @include text-bold(24rpx, #1A1A1A);
                @include text-overflow-line(1);
            }
            &-price{
                @include text-normal(24rpx, #1A1A1A);
            }
            &-choose{
                width: 170rpx;
                height: 48rpx;
                background: #14C9C9;
                border-radius: 12rpx 12rpx 12rpx 12rpx;
                @include text-bold(24rpx, #fff);
                @include hor-center-center;
            }
        }
    }
  }
}
.topBar {
  @include hor-center;
  height: 100%;
  &-back {
    width: 64rpx;
    height: 64rpx;
    padding-left: 30rpx;
    margin-right: 34rpx;
  }
}
</style>