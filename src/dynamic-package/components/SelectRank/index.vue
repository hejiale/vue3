<template>
  <div class="popRankBox">
    <div class="popRankBox-title">选择排行榜</div>
    <scroll-view scroll-y class="popRankBox-listBox">
      <div
        v-for="(v, idx) in 4"
        :key="v"
        class="popRankBox-listBox-item"
        :style="idx % 2 === 0 ? 'margin-right: 18rpx;' : ''"
        @click="onSelect(idx)"
      >
        <image
          :src="filters.icon(imageIcon(idx))"
          class="popRankBox-listBox-item-cover"
        ></image>
        <div
          class="popRankBox-listBox-item-text"
          :class="
            index < 3
              ? index === 0
                ? 'first'
                : index === 1
                ? 'second'
                : 'third'
              : ''
          "
          v-for="(rank, index) in list(idx)"
          :key="rank.id"
        >
          {{ index + 1 }} {{ rank.dramaName }}
        </div>
        <div class="popRankBox-listBox-item-text">……</div>
        <image
          :src="
            filters.icon(selectIndex === idx ? 'pop-select' : 'pop-unSelect')
          "
          class="popRankBox-listBox-item-select"
        ></image>
      </div>
    </scroll-view>
    <div class="popRankBox-sureBox" @click="onSureSelect">
      <image
        :src="filters.icon('pop-sure-select')"
        class="popRankBox-sureBox-select"
        v-if="selectIndex !== -1"
      />
      <image
        :src="filters.icon('pop-sure-unSelect')"
        class="popRankBox-sureBox-select"
        v-else
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
const { storeApi, filters, enums } = useInstance();

const emits = defineEmits(["getRank"]);
defineExpose({ refresh });

let rankingListFirst: Array<any> = reactive([]);
let rankingListSecond: Array<any> = reactive([]);
let rankingListThird: Array<any> = reactive([]);
let rankingListFourth: Array<any> = reactive([]);
let selectIndex = ref(-1);

function refresh() {
  fetchRankingLists();
}

const imageIcon = computed(() => (index: number) => {
  if (index === 0) {
    return "icon-30days";
  } else if (index === 1) {
    return "icon-renqi";
  } else if (index === 2) {
    return "icon-koubei";
  }
  return "icon-qidai";
});

const list = computed(() => (index: number) => {
  if (index === 0) {
    return rankingListFirst;
  } else if (index === 1) {
    return rankingListSecond;
  } else if (index === 2) {
    return rankingListThird;
  }
  return rankingListFourth;
});

//关联排行榜
async function fetchRankingLists() {
  rankingListFirst.splice(0);
  rankingListSecond.splice(0);
  rankingListThird.splice(0);
  rankingListFourth.splice(0);

  const requests = [
    storeApi.rankingList({ rankType: "HOT_RANK" }),
    storeApi.rankingList({ rankType: "PRAISE_RANK" }),
    storeApi.rankingList({ rankType: "GATHER_SUM_RANK" }),
    storeApi.rankingList({ rankType: "FOCUS_RANK" }),
  ];

  const [data1, data2, data3, data4] = await Promise.all(requests);

  rankingListFirst.push(...data1);
  rankingListSecond.push(...data2);
  rankingListThird.push(...data3);
  rankingListFourth.push(...data4);
}

function onSelect(idx) {
  if (selectIndex.value === idx) {
    selectIndex.value = -1;
  } else {
    selectIndex.value = idx;
  }
}

function onSureSelect() {
  let arr = [
    { name: "30天热榜", type: "HOT_RANK" },
    { name: "人气总榜", type: "GATHER_SUM_RANK" },
    { name: "口碑榜", type: "PRAISE_RANK" },
    { name: "期待榜", type: "FOCUS_RANK" },
  ];
  if (selectIndex.value !== -1) {
    emits("getRank", arr[selectIndex.value]);
  }
}
</script>
<style lang="scss" scoped>
.popRankBox {
  margin-top: 30rpx;
  height: 78vh;
  border-radius: 32rpx;
  background: #fafafa;
  &-title {
    @include text-middle(32rpx, #000);
    text-align: center;
  }
  &-listBox {
    position: fixed;
    left: 24rpx;
    right: 24rpx;
    top: 28vh;
    bottom: 0px;
    padding-bottom: 11vh;
    box-sizing: border-box;
    &-item {
      width: calc((100vw - 56rpx) / 2);
      border-radius: 12rpx;
      background: #fff;
      display: inline-flex;
      margin-bottom: 16rpx;
      flex-direction: column;
      padding-bottom: 14rpx;
      position: relative;
      &-cover {
        width: 100%;
        height: 212rpx;
        padding-bottom: 14rpx;
      }
      &-text {
        margin-left: 18rpx;
        @include text-middle(24rpx, #2e323e);
        @include text-overflow-line(1);
        width: 80%;
        margin-bottom: 4rpx;
      }
      .first {
        color: #f83131;
      }
      .second {
        color: #ff7a00;
      }
      .third {
        color: #d27e1b;
      }
      &-select {
        position: absolute;
        top: 20rpx;
        right: 20rpx;
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