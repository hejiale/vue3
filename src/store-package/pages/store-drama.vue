<template>
  <div class="container">
    <div class="container-fixed"></div>
    <swiper class="container-swiperBox" vertical>
      <swiper-item class="container-swiperBox-recommendBox">
        <div
          class="navigationBar"
          :style="{ 'margin-top': menuReact.top + 'px' }"
        >
          <image
            :src="filters.icon('transparentBack')"
            class="navigationBar-backBox"
            @click="onBack"
          ></image>
          <div class="navigationBar-titleBox">
            <div class="navigationBar-titleBox-title">
              门店剧本 ({{
                storeInfo.storeRecommendDramaList
                  ? storeInfo.storeRecommendDramaList.length
                  : 0
              }})
            </div>
            <div class="navigationBar-titleBox-storeName">
              {{ storeInfo.storeName }}
            </div>
          </div>
        </div>
        <div
          class="container-swiperBox-recommendBox-bgBox"
          v-if="storeInfo.storeRecommendDramaList"
        >
          <image
            mode="aspectFill"
            :src="storeInfo.storeRecommendDramaList[showCurrent].dramaCover"
          ></image>
          <image class="container-swiperBox-recommendBox-bgBox-cover"></image>
        </div>
        <swiper
          class="container-swiperBox-recommendBox-listBox"
          previous-margin="30px"
          next-margin="15px"
          :current="showCurrent"
          @change="onChangeDramaCurrent"
          v-if="storeInfo.storeRecommendDramaList"
        >
          <swiper-item
            v-for="drama in storeInfo.storeRecommendDramaList"
            :key="drama.id"
          >
            <div class="container-swiperBox-recommendBox-listBox-item">
              <image :src="drama.dramaCover" mode="aspectFill"></image>
              <image
                class="container-swiperBox-recommendBox-listBox-item-shadow"
              ></image>
              <image
                :src="filters.icon('recommend-tag')"
                class="container-swiperBox-recommendBox-listBox-item-tag"
              ></image>
              <div
                class="container-swiperBox-recommendBox-listBox-item-dramaBox"
              >
                <div
                  class="container-swiperBox-recommendBox-listBox-item-dramaBox-nameBox"
                >
                  <image
                    class="container-swiperBox-recommendBox-listBox-item-dramaBox-nameBox-sellType"
                    :src="filters.icon(drama.sellType)"
                    v-if="showSellType(drama.sellType)"
                  ></image>
                  <span
                    class="container-swiperBox-recommendBox-listBox-item-dramaBox-nameBox-dramaName"
                    >{{ drama.dramaName }}</span
                  >
                </div>
                <span
                  class="container-swiperBox-recommendBox-listBox-item-dramaBox-dictValue"
                  >{{ filters.doCalculateDramaDicts(drama.dicts) }}</span
                >
                <span
                  class="container-swiperBox-recommendBox-listBox-item-dramaBox-people"
                  >{{ drama.maleGamerNum }}男{{ drama.femaleGamerNum }}女
                </span>
                <span
                  class="container-swiperBox-recommendBox-listBox-item-dramaBox-price"
                  >¥{{ drama.sellPrice / 100 }}/位</span
                >
              </div>
            </div>
          </swiper-item>
        </swiper>
        <div
          class="container-swiperBox-recommendBox-descBox"
          v-if="storeInfo.storeRecommendDramaList"
        >
          <span class="container-swiperBox-recommendBox-descBox-title"
            >剧本简介</span
          >
          <div class="container-swiperBox-recommendBox-descBox-arrow">
            查看详情<image :src="filters.icon('right-arrow')"></image>
          </div>
          <span class="container-swiperBox-recommendBox-descBox-description">{{
            storeInfo.storeRecommendDramaList[showCurrent].contentStr
          }}</span>
        </div>
        <image
          :src="filters.icon('icon_load_more')"
          class="container-swiperBox-recommendBox-loadMore"
        ></image>
      </swiper-item>
      <swiper-item class="container-swiperBox-dramaListBox">
        <div
          class="navigationBar"
          :style="{ 'padding-top': menuReact.top + 'px', background: '#fff' }"
        >
          <image
            :src="filters.icon('store-back')"
            class="navigationBar-backBox"
            @click="onBack"
          ></image>
          <div class="navigationBar-titleBox">
            <div class="navigationBar-titleBox-title dark">
              门店剧本 ({{
                storeInfo.storeRecommendDramaList
                  ? storeInfo.storeRecommendDramaList.length
                  : 0
              }})
            </div>
            <div class="navigationBar-titleBox-storeName lightDark">
              {{ storeInfo.storeName }}
            </div>
          </div>
        </div>
        <div
          class="container-swiperBox-dramaListBox-topBox"
          :style="{ top: `${menuReact.top + 36.8}px` }"
        >
          <jy-searchBar v-model="searchValue" width="91.46vw"></jy-searchBar>
          <div class="container-swiperBox-dramaListBox-topBox-filterBox">
            <div class="container-swiperBox-dramaListBox-topBox-filterBox-item">
              <span
                class="container-swiperBox-dramaListBox-topBox-filterBox-item-title"
                >题材：</span
              >
              <scroll-view
                scroll-x
                class="container-swiperBox-dramaListBox-topBox-filterBox-item-scrolls"
              >
                <div
                  class="container-swiperBox-dramaListBox-topBox-filterBox-item-scrolls-item"
                  :class="{active: dictParama === dic.id}"
                  v-for="dic in dicts"
                  :key="dic.id"
                  @click="onSelectDict(dic.id)"
                >
                  <span
                    class="container-swiperBox-dramaListBox-topBox-filterBox-item-scrolls-item-title"
                    :class="{acticeLabel: dictParama === dic.id}"
                    >{{ dic.dictValue }}</span
                  >
                </div>
              </scroll-view>
            </div>
            <div class="container-swiperBox-dramaListBox-topBox-filterBox-item">
              <span
                class="container-swiperBox-dramaListBox-topBox-filterBox-item-title"
                >人数：</span
              >
              <scroll-view
                scroll-x
                class="container-swiperBox-dramaListBox-topBox-filterBox-item-scrolls"
              >
                <div
                  class="container-swiperBox-dramaListBox-topBox-filterBox-item-scrolls-item"
                  :class="{active: peopleParama === v}"
                  v-for="v in peoples"
                  :key="v"
                  @click="onSelectPeople(v)"
                >
                  <span
                    class="container-swiperBox-dramaListBox-topBox-filterBox-item-scrolls-item-title"
                    :class="{acticeLabel: peopleParama === v}"
                    >{{ v }}</span
                  >
                </div>
              </scroll-view>
            </div>
          </div>
        </div>
        <scroll-view class="drama-list" scroll-y @scrolltolower="onLoadMore" refresher-enabled @refresherrefresh="onPull" :refresher-triggered="isPull">
          <div
            class="drama-list-item"
            v-for="drama in dramaList"
            :key="drama.id"
          >
            <div class="drama-list-item-cover">
              <image :src="drama.dramaCover" mode="aspectFill" />
              <image
                :src="filters.icon(drama.sellType)"
                class="drama-list-item-cover-sellType"
              />
            </div>
            <div class="drama-list-item-info">
              <span class="drama-list-item-info-dramaName">{{
                drama.dramaName
              }}</span>
              <span class="drama-list-item-info-dictValue">{{
                filters.doCalculateDramaDicts(drama.dramaThemes)
              }}</span>
              <span class="drama-list-item-info-people"
                >{{ drama.maleGamerNum }}男{{ drama.femaleGamerNum }}女{{
                  drama.gameTime
                }}小时</span
              >
              <span class="drama-list-item-info-content">{{
                drama.content
              }}</span>
              <span class="drama-list-item-info-price"
                >¥{{ drama.dramaPrice / 100 }}/位</span
              >
            </div>
          </div>
          <jy-noMore v-if="endLoad && dramaList.length"></jy-noMore>
          <jy-noData v-if="!dramaList.length" title="暂无剧本" bgUrl="empty-drama"></jy-noData>
        </scroll-view>
      </swiper-item>
    </swiper>
  </div>
</template>
<script lang="ts" setup>
const { api, storeApi, filters, menuButtonRect } = useInstance();

//店铺信息
let storeInfo: any = reactive({});

let menuReact: any = reactive({});

let searchValue = ref();

let dicts: Array<any> = reactive([]);

let peoples = ref(["全部", "≤4人", "5人", "6人", "7人", "8人", "≥9人"]);

let dictParama = ref(-1);

let peopleParama = ref("全部");

let isPull = ref(true);

let pageNo = ref(1);

let dramaList: Array<any> = reactive([]);

//当前展示剧本
let showCurrent = ref(0);

let dramaTotal = ref(0);

onLoad(async () => {
  Object.assign(storeInfo, JSON.parse(uni.getStorageSync("store-detail")));
  uni.removeStorageSync('store-detail');

  let res = await menuButtonRect();
  Object.assign(menuReact, res);

  await getDicts();
  await queryDramaList();
});

//加载完了
const endLoad = computed(() => {
  return dramaList.length === dramaTotal.value;
})

const showSellType = computed(() => (v: string) => {
  return v === 'REAL_SCENE' || v === 'EXCLUSIVE' || v === 'LIMITED';
})

//返回
function onBack() {
  uni.navigateBack();
}

//监听
watch(
  searchValue,
  () => {
    pageNo.value = 1;
    queryDramaList();
  },
  { immediate: true }
)


function onPull(){
  isPull.value = true;
  pageNo.value = 1;
  queryDramaList();
}


//加载更多
function onLoadMore() {
  if (dramaTotal.value === dramaList.length) return;

  pageNo.value++;
  queryDramaList();
}

//选择剧本题材
function onSelectDict(v: number) {
  if (dictParama.value === v) {
    dictParama.value = -1;
  } else {
    dictParama.value = v;
  }
  pageNo.value = 1;
  queryDramaList();
}

//选择人数
function onSelectPeople(v: any) {
  if (peopleParama.value === v) {
    peopleParama.value = "全部";
  } else {
    peopleParama.value = v;
  }
  pageNo.value = 1;
  queryDramaList();
}

//切换推荐剧本
function onChangeDramaCurrent(event: any) {
  showCurrent.value = event.detail.current;
}

//查询剧本字典选项
async function getDicts() {
  try {
    let arr = [];
    let data: any = await api.queryDictParama({
      dictType: "DRAMA",
    });
    data.map((v: any) => {
      if (v.dictType === "DRAMA") {
        arr = v.dictList;
      }
    });
    arr.unshift({ dictValue: "全部", id: -1 });

    Object.assign(dicts, arr);
  } catch (e) {}
}

async function queryDramaList() {
  let minGamerNum, maxGamerNum;
  switch (peopleParama.value) {
    case "≤4人":
      minGamerNum = 4;
      maxGamerNum = 0;
      break;
    case "5人":
      minGamerNum = 5;
      maxGamerNum = 5;
      break;
    case "6人":
      minGamerNum = 6;
      maxGamerNum = 6;
      break;
    case "7人":
      minGamerNum = 7;
      maxGamerNum = 7;
      break;
    case "8人":
      minGamerNum = 8;
      maxGamerNum = 8;
      break;
    case "≥9人":
      minGamerNum = null;
      maxGamerNum = 9;
      break;
    default:
      minGamerNum = null;
      maxGamerNum = null;
      break;
  }
  try {
    let data: any = await storeApi.queryStoreDramaPage({
      pageNo: pageNo.value,
      pageSize: 10,
      storeId: storeInfo.id,
      dramaThemeIdList: dictParama.value != -1 ? [dictParama.value] : null,
      minGamerNum,
      maxGamerNum,
      dramaName: searchValue.value,
    });
    if (pageNo.value === 1) dramaList.splice(0);

    if (data.records.length) {
      dramaList.push(...data.records);
    }
    dramaTotal.value = data.total;
    isPull.value = false;
  } catch (e) {}
}
</script>
<style lang="scss" scoped>
.container {
  overflow: hidden;
  &-fixed {
    @include fixed-center;
    background: #fafafa;
  }
  &-swiperBox {
    width: 100vw;
    height: 100vh;
    &-recommendBox {
      position: relative;
      &-bgBox {
        position: absolute;
        left: 0px;
        right: 0px;
        top: 0px;
        height: 100vh;
        z-index: -1;
        &-cover {
          @include abs-center;
          background: rgba($color: #000000, $alpha: 0.6);
          z-index: 1;
          backdrop-filter: blur(12px);
        }
      }
      &-listBox {
        margin-top: 60rpx;
        width: 100vw;
        height: 60.3vh;
        &-item {
          width: 84vw;
          height: 100%;
          border-radius: 20px;
          border: 1px solid #bcbcbc;
          overflow: hidden;
          position: relative;
          &-shadow {
            position: absolute;
            left: 0px;
            right: 0px;
            bottom: 0px;
            height: 23vh;
            background: linear-gradient(
              180deg,
              rgba(0, 0, 0, 0) 0%,
              rgba(0, 0, 0, 0.9) 80%
            );
          }
          &-tag {
            position: absolute;
            left: 0px;
            top: 0px;
            width: 136rpx;
            height: 52rpx;
          }
          &-dramaBox {
            position: absolute;
            left: 0px;
            right: 0px;
            bottom: 0px;
            height: 15vh;
            &-nameBox {
              @include hor-center;
              position: absolute;
              left: 40rpx;
              bottom: 196rpx;
              &-sellType {
                width: 60rpx;
                height: 32rpx;
                margin-right: 10rpx;
              }
              &-dramaName {
                @include text-bold(40rpx, #fff);
                @include text-overflow-line(1);
              }
            }
            &-dictValue,
            &-people {
              position: absolute;
              left: 40rpx;
              bottom: 136rpx;
              @include text-normal(28rpx, rgba(#fff, 0.6));
            }
            &-people {
              bottom: 88rpx;
            }
            &-price {
              position: absolute;
              left: 40rpx;
              bottom: 40rpx;
              @include text-bold(28rpx, rgba(#fff, 0.8));
            }
          }
        }
      }
      &-descBox {
        position: absolute;
        bottom: 146rpx;
        left: 50%;
        transform: translateX(-50%);
        width: 92vw;
        height: 13.2vh;
        background: rgba($color: #000000, $alpha: 0.4);
        border-radius: 24rpx;
        &-title {
          position: absolute;
          left: 32rpx;
          top: 32rpx;
          @include text-middle(30rpx, #fff);
        }
        &-arrow {
          position: absolute;
          top: 38rpx;
          right: 36rpx;
          @include hor-center;
          @include text-normal(24rpx, #fff);
          image {
            width: 24rpx;
            height: 24rpx;
          }
        }
        &-description {
          position: absolute;
          left: 32rpx;
          top: 94rpx;
          right: 32rpx;
          height: 84rpx;
          @include text-normal(24prx, rgba(#fff, 0.8));
          @include text-overflow-line(2);
        }
      }
      &-loadMore {
        position: absolute;
        bottom: 68rpx;
        width: 230rpx;
        height: 34rpx;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    &-dramaListBox {
      height: 100vh;
      &-topBox {
        position: fixed;
        background: #fff;
        :deep(.searchBox) {
          margin: 20rpx 32rpx 0px 32rpx;
        }
        &-filterBox {
          @include ver;
          padding: 50rpx 0;
          padding-left: 40rpx;
          &-item {
            @include hor;
            align-items: center;
            margin-bottom: 20rpx;
            &-title {
              @include text-normal(26rpx, #2e323e);
              width: 80rpx;
            }
            &-scrolls {
              white-space: nowrap;
              width: 85vw;
              &-item {
                display: inline-flex;
                padding: 8rpx 28rpx;
                background: unset;
                border-radius: 12px;
                &-title {
                  @include text-normal(26rpx, #2e323e);
                }
              }
              .active {
                background: rgba($color: #36e4bb, $alpha: 0.1);
              }
              .acticeLabel {
                @include text-middle(26rpx, #36e4bb);
              }
            }
          }
        }
      }
      .drama-list {
        position: fixed;
        left: 0px;
        right: 0px;
        top: 30vh;
        height: 71vh;
        &-item {
          margin-top: 20rpx;
          margin-left: 24rpx;
          width: 93.6vw;
          background: #ffffff;
          border-radius: 6px;
          @include hor;
          position: relative;
          &-cover {
            width: 168rpx;
            height: 224rpx;
            border-radius: 6px;
            margin: 24rpx;
            position: relative;
            overflow: hidden;
            &-sellType {
              position: absolute;
              right: 8rpx;
              top: 8rpx;
              width: 60rpx;
              height: 32rpx;
            }
          }
          &-info {
            margin-left: 18rpx;
            margin-top: 30rpx;
            @include ver;
            width: 60%;
            &-dramaName {
              @include text-bold(32rpx, #2e323e);
              @include text-overflow-line(1);
            }
            &-dictValue {
              @include text-normal(24rpx, #5f6572);
              margin-top: 14rpx;
            }
            &-people {
              margin-top: 10rpx;
              @include text-normal(24rpx, #5f6572);
            }
            &-content {
              @include text-overflow-line(1);
              @include text-normal(24rpx, #5f6572);
              margin-top: 6rpx;
            }
            &-price {
              @include text-normal(26rpx, #5f6572);
              margin-top: 6rpx;
            }
          }
        }
      }
    }
  }
}
.navigationBar {
  @include hor-center;
  position: relative;
  &-backBox {
    position: absolute;
    left: 24rpx;
    width: 36rpx;
    height: 36rpx;
    z-index: 1;
  }
  &-titleBox {
    margin-left: 50%;
    transform: translateX(-50%);
    @include ver;
    align-items: center;
    &-title {
      @include text-normal(32rpx, #fff);
    }
    &-storeName {
      @include text-normal(24rpx, rgba(#fff, 0.6));
      @include text-overflow-line(1);
    }
  }
  .dark {
    color: #2e323e;
  }
  .lightDark {
    color: #959aa5;
  }
}
</style>