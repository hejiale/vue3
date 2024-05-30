<template>
  <div class="container">
    <div class="fixedBg"></div>
    <jy-navigationBar background="#fff" :barHeight="42">
      <template v-slot:content>
        <div class="topBox" @click="onBack">
          <div class="topBox-close">关闭</div>
          <div class="topBox-title">选择城市</div>
        </div>
      </template>
      <template v-slot:view>
        <div class="container-searchBox">
          <div class="container-searchBox-placeholderBox" v-if="!isFocus">
            <image
              :src="filters.icon('icon-search')"
              class="container-searchBox-placeholderBox-tag"
            ></image>
            <span class="container-searchBox-placeholderBox-title"
              >输入关键词搜索</span
            >
          </div>
          <input
            v-model="keyword"
            @input="onSearch"
            @blur="onBlur"
            @focus="onFocus"
          />
        </div>
        <div v-if="keyword.length" class="container-searchListBox">
          <div
            class="container-searchListBox-item"
            v-for="city in searchCityList"
            :key="city.id"
            @click.stop="onChooseCity(city, 3)"
          >
            {{ city.name }}
          </div>
        </div>
        <scroll-view
          scroll-y
          class="scrollBox"
          :scroll-into-view="LetterId"
          v-else
        >
          <div class="container-cityBox">
            <span class="container-cityBox-title">定位城市</span>
            <div class="container-cityBox-listBox">
              <div
                class="container-cityBox-listBox-item"
                @click.stop="onChooseCity(locationCity, 0)"
              >
                {{ locationCity.city }}
              </div>
            </div>
          </div>
          <div class="container-cityBox">
            <span class="container-cityBox-title">历史访问城市</span>
            <div class="container-cityBox-listBox">
              <div
                class="container-cityBox-listBox-item"
                v-for="city in historyCity"
                :key="city.regionId"
                @click.stop="onChooseCity(city, 1)"
              >
                {{ spliceWords(city.regionName) }}
              </div>
            </div>
          </div>
          <div class="container-cityBox" id="hot">
            <span class="container-cityBox-title">热门城市</span>
            <div class="container-cityBox-listBox">
              <div
                class="container-cityBox-listBox-item"
                v-for="city in hotCity"
                :key="city.id"
                @click.stop="onChooseCity(city, 2)"
              >
                {{ spliceWords(city.value) }}
              </div>
            </div>
          </div>
          <div class="container-cityList">
            <div
              class="container-cityList-anchor"
              v-for="item in cityList"
              :key="item.id"
            >
              <div class="container-cityList-anchor-title" :id="item.initial">
                {{ item.initial }}
              </div>
              <div
                class="container-cityList-anchor-item"
                v-for="cell in item.list"
                :key="cell.id"
                @click.stop="onChooseCity(cell, 3)"
              >
                {{ cell.name }}
              </div>
            </div>
          </div>
        </scroll-view>
        <div class="fixRightBox" v-if="!keyword.length">
          <div
            class="fixRightBox-item"
            v-for="char in charList"
            :key="char"
            @click.stop="onJumpChar(char)"
          >
            {{ char }}
          </div>
        </div>
        <jy-noData
          v-if="keyword.length && !searchCityList.length"
          bgUrl="empty-store"
          subTitle="未查询到该城市！ "
        ></jy-noData>
      </template>
    </jy-navigationBar>
  </div>
</template>
<script setup lang="ts">
const {
  homeApi,
  bus,
  useUser,
  getColor,
  filters,
  menuButtonRect,
  api,
  requestAuthorize,
} = useInstance();

//胶囊react
let menuRect: any = reactive({});

let charList: Array<any> = reactive([]);

let cityList: Array<any> = reactive([]);

let userInfo: any = reactive({});

let locationCity: any = reactive({});

let hotCity: Array<any> = reactive([]);

let historyCity: Array<any> = reactive([]);

let isFocus = ref(false);

let keyword = ref("");

let LetterId = ref("");

//选择的城市
// let chooseCity: any = reactive({});

let searchCityList: Array<any> = reactive([]);

onLoad(async () => {
  // Object.assign(chooseCity, uni.getStorageSync('city-info'));
  //授权定位
  await requestAuthorize();

  let res = await menuButtonRect();
  Object.assign(menuRect, res);

  res = await useUser.getUserInfo();
  Object.assign(userInfo, res);

  queryHotCity();
  getqueryHistoryRegionList();
  regionResolver();
  getRegionByLetter();
});

//截取字段
const spliceWords = computed(()=>(word:string)=>{
  if(word.length > 4){
    return word.substring(0, 4);
  }
  return word;
})

function onBack() {
  uni.navigateBack();
}
//查询城市列表
async function getRegionByLetter() {
  let res: any = await api.getRegionByLetter({
    id: null,
    regionType: null,
    keyword: null,
  });

  if (res.length) {
    Object.assign(cityList, res);
    res = res.map((v: any) => v.initial);
    res.unshift("定位热门");
    Object.assign(charList, res);
  } else {
    cityList.splice(0);
    charList.splice(0);
  }
}
//搜索城市
async function querySearchCity() {
  searchCityList.splice(0);

  let res: any = await api.getRegionByLetter({
    id: null,
    regionType: null,
    keyword: keyword.value,
  });

  if(res.length){
    res.map((v:any)=>{
      v.list.map((city:any)=>{
        searchCityList.push(city);
      })
    })
  }
}

// 查询历史城市
async function getqueryHistoryRegionList() {
  try {
    let res = await api.getqueryHistoryRegionList({
      appUserId: userInfo.id,
    });
    Object.assign(historyCity, res);
  } catch (e) {}
}
//定位城市
async function regionResolver() {
  try {
    let data = await api.regionResolver({
      latitude: "31.30227",
      longitude: "120.63132",
      userId: userInfo.id,
      dataSource: "SAAS_MP",
    });
    Object.assign(locationCity, data);
  } catch (e) {}
}
// 查询热门城市
async function queryHotCity() {
  try {
    let res = await api.getHotCity({});
    Object.assign(hotCity, res);
  } catch (e) {}
}
function onChooseCity(city: any, type: any) {
  //刷新定位标志位
  let cityInfo = uni.getStorageSync("city-info") || {};
  if (type === 0) {
    cityInfo.id = city.cityId;
    cityInfo.name = city.city;
    saveHistory(city.cityId);
  } else if (type === 1) {
    cityInfo.id = city.regionId;
    cityInfo.name = city.regionName;
    saveHistory(city.regionId);
  } else if (type === 2) {
    cityInfo.id = city.code;
    cityInfo.name = city.value;
    saveHistory(city.code);
  } else {
    cityInfo.id = city.id;
    cityInfo.name = city.name;
    saveHistory(city.id);
  }

  uni.setStorageSync("city-info", cityInfo);
  bus.emit("refresh-city");

  uni.navigateBack();
}
//处理搜索框
function onFocus() {
  if (!keyword.value.length) {
    isFocus.value = true;
  }
}
function onBlur() {
  if (!keyword.value.length) {
    isFocus.value = false;
  }
}
function onSearch() {
    querySearchCity();
}
function onJumpChar(char: any) {
  if (char === "定位热门") {
    LetterId.value = "hot";
  } else {
    LetterId.value = char;
  }
}
async function saveHistory(regionId: any) {
  await api.saveCommonRegion({
    appUserId: userInfo.id,
    regionId: regionId,
  });
}
</script>
<style lang="scss" scoped>
.container {
  &-searchBox {
    margin: 34rpx 30rpx 0px 30rpx;
    height: 60rpx;
    background: #ffffff;
    border-radius: 15px;
    @include hor-center-center;
    position: relative;
    &-placeholderBox {
      &-tag {
        width: 32rpx;
        height: 32rpx;
      }
      &-title {
        @include text-normal(26rpx, #959aa5);
      }
    }
    input {
      @include abs-center;
      text-align: center;
      font-size: 26rpx;
    }
  }
  .scrollBox {
    height: 100vh;
  }
  &-cityBox {
    padding: 20rpx 0px 0px 30rpx;
    @include ver;
    &-title {
      @include text-normal(22rpx, #9f9fa0);
    }
    &-listBox {
      margin-top: 24rpx;
      &-item {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        background: #fff;
        @include text-normal(26rpx, #959aa5);
        width: 27vw;
        margin: 0px 18rpx 18rpx 0px;
        box-sizing: border-box;
        padding: 14rpx 0px;
      }
      .active {
        border: 1px solid #36e4bb;
        color: #36e4bb;
      }
    }
  }
  &-cityList {
    margin-top: 30rpx;
    &-anchor {
      &-title {
        padding: 10rpx 0px 10rpx 32rpx;
        width: 100%;
        background: #f5f6f8;
        @include text-normal(24rpx, #2e323e);
        position: sticky;
        top: 0px;
      }
      &-item {
        padding: 30rpx 0px 30rpx 32rpx;
        border-bottom: 1px solid #e9ebef;
        @include text-normal(26rpx, #2e323e);
        background: #fff;
      }
    }
  }
  &-searchListBox {
    @include ver;
    &-item {
      padding: 30rpx 0px;
      margin-left: 32rpx;
      border-bottom: 1px solid #e9ebef;
      @include text-normal(26rpx, #2e323e);
    }
  }
}
.topBox {
  @include hor;
  align-items: center;
  height: 64rpx;
  position: relative;
  &-close {
    padding-left: 24rpx;
    @include text-normal(32rpx, #2e323e);
  }
  &-title {
    @include text-normal(34rpx, #2e323e);
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
}
.fixRightBox {
  position: fixed;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  @include ver;
  align-items: center;
  &-item {
    @include text-middle(22rpx, #118aff);
    padding: 2rpx 14rpx;
    width: 60rpx;
    text-align: center;
  }
}
</style>