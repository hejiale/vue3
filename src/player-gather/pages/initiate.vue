<template>
  <div class="container">
    <div class="container-fixBg"></div>
    <jy-navigationBar>
      <template v-slot:content>
        <div class="topBar">
          <image
            :src="filters.icon('icon_gather_back')"
            class="topBar-back"
            @click="onBack"
          ></image>
          <span class="topBar-title">发起组局</span>
        </div>
      </template>
      <template v-slot:view>
        <div class="cell mt18" @click="onShowStore">
          <image :src="filters.icon('gather-select-store')" class="cell-tag" />
          <span class="cell-title">{{ currentStore.storeName ||  '选择店铺'}}</span>
          <image :src="filters.icon('gather-right-arrow')" class="cell-arrow" />
        </div>
        <div class="cell mt15" @click="onSelectDrama" :style="gatherProduct.dramaItem ? 'height: 270rpx;':''">
          <image :src="filters.icon('gather-select-drama')" class="cell-tag" />
          <span class="cell-title">选择剧本</span>
          <image :src="filters.icon('gather-right-arrow')" class="cell-arrow" />
          <div class="cell-dramaInfo" v-if="gatherProduct.dramaItem">
            <image :src="gatherProduct.dramaItem.dramaCover" class="cell-dramaInfo-cover" mode="aspectFill"/>
            <image :src="filters.icon(gatherProduct.dramaItem.sellType)" class="cell-dramaInfo-sellType"/>
            <span class="cell-dramaInfo-title">{{ gatherProduct.dramaItem.dramaName }}</span>
            <div class="cell-dramaInfo-dictBox">
              <div class="cell-dramaInfo-dictBox-val mr6" v-for="val in gatherProduct.dramaItem.dicts" :key="val.id">{{ val.dictValue }}</div>
            </div>
          </div>
        </div>
        <div class="cell mt15" @click="showPicker = true">
          <image :src="filters.icon('gather-select-date')" class="cell-tag" />
          <span class="cell-title">选择时间</span>
          <span class="cell-moreValue">{{ formatDate }}</span>
          <image :src="filters.icon('gather-right-arrow')" class="cell-arrow" />
        </div>
        <div class="cell mt15">
          <image :src="filters.icon('gather-select-price')" class="cell-tag" />
          <span class="cell-title">价格</span>
          <span class="cell-value" v-if="gatherProduct.dramaItem">¥{{ gatherProduct.currentPrice / 100 }}</span>
          <span class="cell-placeholder" v-else>待定</span>
        </div>
        <div class="remarkBox mt15 ml15">
          <textarea
            placeholder="(选填)可以描述一下想和怎样的队友一起玩，或者其他特殊说明~"
            placeholder-class="placeholder"
            class="remark"
            v-model="content"
            maxlength="100"
          ></textarea>
          <span class="remarkBox-count">{{ content.length }}</span>
          <div class="remarkBox-deleteBox" @click="onDeleteRemark">
            <image :src="filters.icon('remark-delete')" class="remarkBox-deleteBox-tag"/>
            <span class="ml2">清空</span>
          </div>
        </div>
      </template>
    </jy-navigationBar>
    <div class="bottomBox" v-if="canSubmit" @click="onPayOrder">发布组局</div>
    <div class="un-bottomBox" v-else>发布组局</div>
    <!-- 选择店铺 -->
    <u-popup :show="showStore" @close="onCloseStore" :round="32" :safeAreaInsetBottom="false">
      <div class="popStoreBox">
        <div class="popStoreBox-title mt15">选择店铺</div>
        <div class="popStoreBox-bar">
          <div class="popStoreBox-bar-cityBox ml16 pr16" @click="onGoCity">
            <span>{{ cityName }}</span>
            <image :src="filters.icon('down-arrow')" class="popStoreBox-bar-cityBox-tag ml4"/>
          </div>
          <jy-searchBar width="568rpx" customHeight="72rpx" borderRadius="16rpx" textAlign="left" v-model="storeKeyword"></jy-searchBar>
        </div>
        <scroll-view class="popStoreBox-listBox" scroll-y @scrolltolower="onLoadMore" v-if="storeList.length">
          <div class="popStoreBox-listBox-item mb8" v-for="store in storeList" :key="store.id" @click="onSelectStore(store)">
            <image :src="filters.processLogoImage(store)" mode="aspectFill" class="popStoreBox-listBox-item-avatar"/>
            <div class="popStoreBox-listBox-item-info ml8">
              <span class="popStoreBox-listBox-item-info-name">{{ store.storeName }}</span>
              <span class="popStoreBox-listBox-item-info-distance mt4">距你{{ filters.metersTransferThousand(store.distance) }}</span>
              <span class="popStoreBox-listBox-item-info-address mt4">{{ store.address }}</span>
            </div>
            <image :src="filters.icon('pop-select')" class="popStoreBox-listBox-item-rightBox" v-if="selectStore.id === store.id"/>
            <image :src="filters.icon('pop-unSelect')" class="popStoreBox-listBox-item-rightBox" v-else/>
          </div>
          <jy-noMore/>
        </scroll-view>
        <jy-noData title="暂无门店～" bgUrl="empty-store" v-else/>
        <div class="popStoreBox-bottom" @click="onSureStore">
          <image :src="filters.icon('pop-sure-select')" class="popStoreBox-bottom-sure"/>
        </div>
      </div>
    </u-popup>
    <!-- 选择时间 -->
    <up-datetime-picker
			ref="datetimePickerRef"
			:show="showPicker"
      v-model="pickerDate"
			mode="datetime"
			:formatter="formatter"
      :minDate="minDate"
      :maxDate="maxDate"
      :filter="filter"
      @cancel="showPicker = false"
      @confirm="showPicker = false"
    ></up-datetime-picker>
  </div>
</template>
<script lang="ts" setup>
const {
  getDate,
  useUser,
  filters,
  dayjs,
  gatherApi,
  useStore,
  storeApi,
  menuButtonRect,
} = useInstance();

let userInfo:any = reactive({});

let gatherProduct:any = reactive({});

let currentStore:any = reactive({});

let showPicker = ref(false);

let pickerDate = ref(Date.now());

let minDate = ref();

let maxDate = ref();

let showStore = ref(false);

let storeList:Array<any> = reactive([]);

let storePageNo = ref(1);

let storeKeyword = ref('');

const datetimePickerRef = ref();

let selectStore:any = reactive({id: -1});

let content = ref('');

let cityName = ref();

/**
 * 格式化日期picker
 * @param type 
 * @param value 
 */
const formatter = (type:string, value:string) => {
  if (type === 'year') {
    return `${value}年`;
  }
  if (type === 'month') {
    return `${value}月`;
  }
  if (type === 'day') {
    return `${value}日`;
  }
  if (type === "hour") {
    return `${value}时`;
  }
  if (type === "minute") {
    return `${value}分`;
  }
  return value;
};

const canSubmit = computed(()=>{
  return currentStore.id && gatherProduct.dramaItem;
})

const formatDate = computed(()=>{
  return `${dayjs(pickerDate.value).format('MM月DD日')} ${filters.getWeek(pickerDate.value)} ${dayjs(pickerDate.value).format('HH:mm')}`
})

//监听
watch(
  storeKeyword,
  () => {
    if(storeKeyword.value.length){
      storePageNo.value = 1;
      queryStoreList();
    }
  },
  { immediate: true }
)

onLoad(async ()=>{
  Object.assign(userInfo, await useUser.getUserInfo());
  onDoCurrentDate();
})

onShow(()=>{
  if(uni.getStorageSync('gatherProduct')){
    Object.assign(gatherProduct, uni.getStorageSync('gatherProduct'));
    uni.removeStorageSync('gatherProduct');
  }
  cityName.value = uni.getStorageSync('city-info').name;
})

function onSelectDrama() {
  if(!currentStore.id){
    return uni.showToast({title: '请先选择店铺!', icon: 'none'})
  }
  uni.navigateTo({ url: `./selectDrama?storeId=${currentStore.id}` });
}

function onBack(){
  uni.navigateBack();
}

async function onShowStore(){
  await queryStoreList();
  showStore.value = true;
}

//关闭店铺弹框 
function onCloseStore(){
  showStore.value = false;
  Object.assign(selectStore, {id: -1});
  storeKeyword.value = '';
}

function onSelectStore(store:any){
  if(selectStore.id === store.id){
    Object.assign(selectStore, {id: -1});
  }else{
    Object.assign(selectStore, store);
  }
}

function onSureStore(){
  Object.assign(currentStore, selectStore);
  onCloseStore();
}

function onDeleteRemark(){
  content.value = '';
}

function onLoadMore(){
  storePageNo.value++;
  queryStoreList();
}

function onGoCity(){
  onCloseStore();
  uni.navigateTo({url: '/city-package/pages/index'});
}

//发起拼车
function onPayOrder(){
  uni.setStorageSync('gather-initiate', {...gatherProduct, gatheringId: gatherProduct.id, dicts: gatherProduct.dramaItem.dramaThemeList, maleLimitNum: gatherProduct.dramaItem.maleGamerNum, femaleLimitNum: gatherProduct.dramaItem.femaleGamerNum, ...currentStore, gameStartTime: dayjs(pickerDate.value).format('YYYY-MM-DD HH:mm:00'), content: content.value, dramaCoverImg: gatherProduct.dramaItem.dramaCover});
  uni.navigateTo({url: './payOrder'});
}

/**
 * 筛选日期picker选项
 * @param type 
 * @param options 
 */
function filter(type:string, options:any) {
  if (type === "minute") {
    return options.filter(
      (option:any) =>
        option === "00" ||
        option === "10" ||
        option === "20" ||
        option === "30" ||
        option === "40" ||
        option === "50"
    );
  }
  return options;
}

/**
 * 处理日期picker的最大最小日期
 */
function onDoCurrentDate() {
  let hour = new Date().setHours(new Date().getHours() + 1);
  let addHour = new Date(hour).setMinutes(new Date().getMinutes());
  let minute = new Date(addHour).getMinutes();

  if (minute > 0 && minute <= 10) {
    minute = 10;
  } else if (minute > 10 && minute <= 20) {
    minute = 20;
  } else if (minute > 20 && minute <= 30) {
    minute = 30;
  } else if (minute > 30 && minute <= 40) {
    minute = 40;
  } else if (minute > 40 && minute <= 50) {
    minute = 50;
  } else if (minute === 0 || minute > 50) {
    minute = 0;
    addHour = new Date().setHours(new Date().getHours() + 2);
  } else {
    minute = 0;
    addHour = new Date().setHours(new Date().getHours() + 1);
  }
  minDate.value = pickerDate.value = new Date(addHour).setMinutes(minute);
  maxDate.value = new Date(getDate(-13)).getTime();
}

//查询可组局店铺列表
async function queryStoreList(){
  if(storePageNo.value === 1)storeList.splice(0);

  let res:any = await gatherApi.storePage({
    cityId: uni.getStorageSync('city-info').id,
    storeNameKeyword: storeKeyword.value,
    pageNo: storePageNo.value,
    pageSize: 20,
    lon: uni.getStorageSync("longitude"),
    lat: uni.getStorageSync("latitude"),
    userId: userInfo.id,
    productType: 'GATHERING_PRODUCT',
    dramaId: gatherProduct.dramaItem ? gatherProduct.dramaItem.id: null
  })
  storeList.push(...res.records);
} 
</script>
<style>
.placeholder {
  font-family: PingFang SC, PingFang SC;
  font-size: 28rpx !important;
  color: #bbbbbb !important;
}
</style>
<style lang="scss" scoped>
.container {
  &-fixBg {
    @include fixed-center;
    background: #f5f5f5;
  }
  .cell {
    margin-left: 30rpx;
    width: 690rpx;
    height: 104rpx;
    background: #ffffff;
    border-radius: 24rpx;
    position: relative;
    @include hor-center;
    &-tag {
      position: absolute;
      top: 32rpx;
      left: 30rpx;
      width: 40rpx;
      height: 40rpx;
    }
    &-arrow {
      position: absolute;
      top: 32rpx;
      right: 30rpx;
      width: 26rpx;
      height: 28rpx;
    }
    &-title {
      position: absolute;
      top: 32rpx;
      left: 90rpx;
      @include text-bold(26rpx, #1a1a1a);
      @include text-overflow-line(1);
      max-width: 60%;
    }
    &-value {
      position: absolute;
      top: 32rpx;
      right: 30rpx;
      @include text-middle(26rpx, #999);
    }
    &-moreValue {
      position: absolute;
      top: 32rpx;
      right: 88rpx;
      @include text-middle(26rpx, #999);
    }
    &-placeholder{
      position: absolute;
      top: 32rpx;
      right: 30rpx;
      @include text-middle(26rpx, #BBB);
    }
    &-dramaInfo{
      position: absolute;
      left: 30rpx;
      right: 30rpx;
      bottom: 30rpx;
      top: 104rpx;
      &-cover{
        width: 100rpx;
        height: 136rpx;
        border-radius: 12rpx;
      }
      &-sellType{
        position: absolute;
        left: 8rpx;
        top: 8rpx;
        width: 56rpx;
        height: 32rpx;
      }
      &-title{
        @include text-middle(28rpx, #1A1A1A);
        position: absolute;
        left: 120rpx;
        top: 18rpx;
      }
      &-dictBox{
        position: absolute;
        left: 120rpx;
        right: 0px;
        bottom: 16rpx;
        white-space: nowrap;
        overflow-x: scroll;
        @include hor-center;
        &-val{
          padding: 0px 10rpx;
          line-height: 32rpx;
          background: #F4F5F6;
          border-radius: 16rpx;
          @include text-normal(20rpx, #999);
        }
      }
    }
  }
  .remarkBox {
    width: 690rpx;
    height: 288rpx;
    background: #ffffff;
    border-radius: 24rpx;
    padding: 30rpx;
    box-sizing: border-box;
    position: relative;
    .remark{
      color: #999;
      height: 180rpx;
    }
    &-count {
      @include text-middle(22rpx, #1a1a1a);
      position: absolute;
      right: 30rpx;
      bottom: 30rpx;
      &::after {
        content: "/100";
        color: #999999;
      }
    }
    &-deleteBox{
      position: absolute;
      left: 30rpx;
      bottom: 30rpx;
      @include hor-center;
      @include text-middle(22rpx, #A3A3A3);
      z-index: 1;
      &-tag{
        width: 32rpx;
        height: 32rpx;
      }
    }
  }
}
.topBar {
  @include hor-center;
  &-back {
    width: 64rpx;
    height: 64rpx;
    margin-left: 30rpx;
  }
  &-title {
    position: absolute;
    @include text-bold(32rpx, #000);
    left: 50%;
    transform: translateX(-50%);
  }
}
.un-bottomBox, .bottomBox {
  position: fixed;
  left: 30rpx;
  bottom: 62rpx;
  width: 690rpx;
  height: 96rpx;
  border-radius: 32rpx;
  @include text-bold(32rpx, #fff);
  @include hor-center-center;
}
.bottomBox{
  background: #14C9C9;
}
.un-bottomBox{
  background: rgba(20, 201, 201, 0.5);
}
.popStoreBox{
  height: 1322rpx;
  background: #FAFAFA;
  border-radius: 32rpx;
  position: relative;
  &-title{
    @include text-middle(32rpx, #2E323E);
    width: 100%;
    text-align: center;
  }
  &-bar{
    @include hor-center;
    margin-top: 38rpx;
    &-cityBox{
      @include text-middle(30rpx, #2E323E);
      &-tag{
        width: 16rpx;
        height: 10rpx;
      }
    }
  }
  &-listBox{
    @include ver;
    align-items: center;
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 182rpx;
    top: 224rpx;
    overflow-y: scroll;
    &-item{
      width: 702rpx;
      height: 162rpx;
      background: #FFFFFF;
      border-radius: 12rpx;
      padding: 24rpx;
      box-sizing: border-box;
      @include hor-center;
      position: relative;
      &-avatar{
        width: 112rpx;
        height: 112rpx;
        border-radius: 12rpx;
      }
      &-info{
        @include ver;
        width: calc(100% - 128rpx);
        &-name{
          @include text-middle(28rpx, #2E323E);
          @include text-overflow-line(1);
          width: 80%;
        }
        &-address, &-distance{
          @include text-normal(24rpx, #959AA5);
          @include text-overflow-line(1);
        }
      }
      &-rightBox{
        position: absolute;
        right: 24rpx;
        width: 48rpx;
        height: 48rpx;
      }
    }

  }
  &-bottom{
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 182rpx;
    background: #fff;
    @include hor-center-center;
    &-sure{
      width: 702rpx;
      height: 88rpx;
    }
  }
}
</style>