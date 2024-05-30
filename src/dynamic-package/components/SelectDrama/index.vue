<template>
  <div class="popDramaBox">
    <div class="popDramaBox-title">关联剧本 ({{ dramaTotal }})</div>
    <div class="popDramaBox-searchBox">
      <input
        v-model="searchValue"
        @focus="onFocus"
        @input="onFocus"
        @blur="onSearch"
      />
      <div class="popDramaBox-searchBox-placeholderBox" v-if="!isFocus">
        <image :src="filters.icon('icon-search')" />
        <span class="popDramaBox-searchBox-placeholderBox-title">输入关键词搜索</span>
      </div>
    </div>
    <div class="popDramaBox-filterBox">
      <div class="popDramaBox-filterBox-item">
        <span class="popDramaBox-filterBox-item-title">题材：</span>
        <scroll-view scroll-x class="popDramaBox-filterBox-item-scrolls">
          <div
            class="popDramaBox-filterBox-item-scrolls-item"
            :class="{ active: dictParama.id == dic.id }"
            v-for="dic in dicts"
            :key="dic.id"
            @click="onSelectDict(dic.id)"
          >
            {{ dic.dictValue }}
          </div>
        </scroll-view>
      </div>
      <div class="popDramaBox-filterBox-item">
        <span class="popDramaBox-filterBox-item-title">人数：</span>
        <scroll-view scroll-x class="popDramaBox-filterBox-item-scrolls">
          <div
            class="popDramaBox-filterBox-item-scrolls-item"
            :class="{ active: peopleParama === v }"
            v-for="v in peoples"
            :key="v"
            @click="onSelectPeople(v)"
          >
            {{ v }}
          </div>
        </scroll-view>
      </div>
    </div>
    <scroll-view
      class="popDramaBox-listBox"
      scroll-y
      @scrolltolower="onLoadMore"
      v-if="dramaList.length"
    >
      <div
        class="popDramaBox-listBox-item"
        v-for="drama in dramaList"
        :key="drama.id"
        @click.stop="onChooseDrama(drama)"
      >
        <div class="popDramaBox-listBox-item-cover">
          <image :src="drama.dramaCover" mode="aspectFill" />
          <image
            :src="filters.icon(drama.sellType)"
            class="popDramaBox-listBox-item-cover-sellType"
          />
        </div>
        <div class="popDramaBox-listBox-item-info">
          <span class="popDramaBox-listBox-item-info-name">{{drama.dramaName }}</span>
          <span class="popDramaBox-listBox-item-info-dictValue">{{filters.doCalculateDramaDicts(drama.dicts) }}</span>
          <span class="popDramaBox-listBox-item-info-game">{{ drama.maleGamerNum }}男{{ drama.femaleGamerNum }}女{{ drama.gameTime }}小时</span>
        </div>
        <image :src="filters.icon('pop-select')" class="popDramaBox-listBox-item-status" v-if="selectDrama.id === drama.id"/>
        <image :src="filters.icon('pop-unSelect')" class="popDramaBox-listBox-item-status" v-else/>
      </div>
    </scroll-view>
    <jy-noData
      v-if="!dramaList.length"
      bgUrl="empty-drama"
      title="暂无剧本～"
    ></jy-noData>
    <div class="popDramaBox-sureBox" @click="onSureSelect">
      <image :src="filters.icon('pop-sure-select')" class="popDramaBox-sureBox-select" v-if="selectDrama"/>
      <image :src="filters.icon('pop-sure-unSelect')" class="popDramaBox-sureBox-select" v-else/>
    </div>
  </div>
</template>
<script setup lang="ts">
const { api, filters } = useInstance();

let pageNo = ref(1);
let searchValue = ref("");
let dicts: Array<any> = reactive([]);
let peoples = ref(["全部", "≤4人", "5人", "6人", "7人", "8人", "≥9人"]);
let dictParama: any = reactive({ id: -1 });
let peopleParama = ref("全部");
let dramaList: Array<any> = reactive([]);
let selectDrama: any = reactive({});
let dramaTotal = ref(0);
let isFocus = ref(false);

const emits = defineEmits(['getDrama'])
defineExpose({refresh})

onMounted(async () => {
  await getDicts();
});

//加载更多
function onLoadMore() {
  if (dramaTotal.value === dramaList.length) return;

  pageNo.value++;
  queryDramaList();
}

function onChooseDrama(v: any) {
  if (selectDrama.id === v.id) {
    Object.assign(selectDrama, { id: -1 });
  } else {
    Object.assign(selectDrama, v);
  }
}

//输入搜索框处理
function onFocus() {
  isFocus.value = true;
}
function onSearch() {
  if (!searchValue.value) {
    isFocus.value = false;
  }
  pageNo.value = 1;
  queryDramaList();
}

function onSelectPeople(v: any) {
  if (peopleParama.value === v) {
    peopleParama.value = "全部";
  } else {
    peopleParama.value = v;
  }
  pageNo.value = 1;
  queryDramaList();
}
function onSelectDict(v: any) {
  if (dictParama.id == v) {
    dictParama = { id: -1 };
  } else {
    dictParama = {id: v};
  }
  pageNo.value = 1;
  queryDramaList();
}
async function getDicts() {
  try {
    let data: any = await api.queryDictParama({
      dictType: "DRAMA",
    });
    data.map((v: any) => {
      if (v.dictType === "DRAMA") {
        dicts = v.dictList;
      }
    });
    dicts.unshift({ dictValue: "全部", id: -1 });
  } catch (e) {}
}

function onSureSelect() {
    if (selectDrama) {
      emits('getDrama', JSON.parse(JSON.stringify(selectDrama)));
      pageNo.value = 1;
      peopleParama.value = '全部';
      searchValue.value = '';
      Object.assign(selectDrama, {id: -1});
    }
}

async function refresh(){
  pageNo.value = 1;
  peopleParama.value = '全部';
  searchValue.value = '';
  Object.assign(selectDrama, {id: -1});
  await queryDramaList();
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
    let data: any = await api.dramaGatherPage({
      type: 1,
      pageNo: pageNo.value,
      pageSize: 10,
      dictIds: dictParama.id !== -1 ? [dictParama.id] : null,
      minGamerNum,
      maxGamerNum,
      dramaNameKeyword: searchValue.value,
    });
    if (pageNo.value === 1) dramaList.splice(0);

    if (data.records.length) {
      dramaList.push(...data.records);
    }
    dramaTotal.value = data.total;
  } catch (e) {}
}
</script>
<style lang="scss" scoped>
.popDramaBox {
  margin-top: 30rpx;
  height: 78vh;
  border-radius: 32rpx;
  &-title {
    @include text-middle(32rpx, #000);
    text-align: center;
  }
  &-subTitle {
    margin-top: 4rpx;
    @include text-normal(24rpx, rgba($color: #444, $alpha: 0.4));
    text-align: center;
    width: 80%;
    margin-left: 10%;
  }
  &-searchBox {
    margin-left: 32rpx;
    margin-top: 38rpx;
    width: calc(100vw - 64rpx);
    height: 60rpx;
    background: #f5f6f8;
    border-radius: 30rpx;
    @include hor-center-center;
    position: relative;
    &-placeholderBox {
      image {
        width: 32rpx;
        height: 32rpx;
      }
      &-title {
        @include text-normal(26rpx, #959aa5);
      }
    }
    input {
      position: absolute;
      left: 40rpx;
      right: 40rpx;
      text-align: center;
    }
  }
  &-filterBox {
    @include ver;
    padding: 50rpx 0;
    &-item {
      @include hor;
      align-items: center;
      margin-bottom: 20rpx;
      white-space: nowrap;
      &-title{
        @include text-normal(26rpx, #2E323E);
        padding-left: 40rpx;
      }
      &-scrolls {
        white-space: nowrap;
        width: 85vw;
        &-item {
          display: inline-flex;
          padding: 8rpx 28rpx;
          background: unset;
          border-radius: 12px;
          @include text-normal(26rpx, #2e323e);
        }
        .active {
          background: rgba($color: #36e4bb, $alpha: 0.1);
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: #36e4bb;
        }
      }
    }
  }
  &-listBox {
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 11.1vh;
    top: 45vh;
    background: #fafafa;
    padding: 0 24rpx;
    &-item {
      margin-top: 20rpx;
      width: 93.6vw;
      background: #ffffff;
      border-radius: 6px;
      @include hor;
      position: relative;
      &-cover {
        width: 108rpx;
        height: 144rpx;
        border-radius: 6px;
        margin: 24rpx;
        overflow: hidden;
        position: relative;
        &-sellType {
          position: absolute;
          right: 0rpx;
          top: 0rpx;
          width: 60rpx;
          height: 32rpx;
        }
      }
      &-info {
        margin-left: 18rpx;
        margin-top: 30rpx;
        @include ver;
        width: 60%;
        &-name {
          @include text-bold(32rpx, #2e323e);
          @include text-overflow-line(1);
        }
        &-dictValue {
          margin-top: 14rpx;
          @include text-normal(24rpx, #959aa5);
        }
        &-game {
          margin-top: 10rpx;
          @include text-normal(24rpx, #959aa5);
          line-height: 28rpx;
        }
      }
      &-status {
        position: absolute;
        right: 24rpx;
        top: 50%;
        transform: translateY(-50%);
        width: 40rpx;
        height: 40rpx;
      }
    }
  }
  &-sureBox {
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 11vh;
    background: #fff;
    @include hor-center-center;
    &-select {
      width: 91.46vw;
      height: 80rpx;
    }
  }
}
</style>