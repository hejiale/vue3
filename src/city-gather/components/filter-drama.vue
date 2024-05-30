<template>
  <div
    class="filterDramaBox"
  >
    <div class="filterDramaBox-item pt24">
      <span class="filterDramaBox-item-title">题材：</span>
      <scroll-view scroll-x class="filterDramaBox-item-scrolls">
        <div
          class="filterDramaBox-item-scrolls-item"
          :class="{active: filterParama.dict === dic.id}"
          v-for="dic in dicts"
          :key="dic.id"
          @click="onSelectDict(dic.id)"
        >
          <span
            class="filterDramaBox-item-scrolls-item-title"
            :class="{acticeLabel: filterParama.dict === dic.id}"
            >{{ dic.dictValue }}</span
          >
        </div>
      </scroll-view>
    </div>
    <div class="filterDramaBox-item">
      <span class="filterDramaBox-item-title">人数：</span>
      <scroll-view scroll-x class="filterDramaBox-item-scrolls">
        <div
          class="filterDramaBox-item-scrolls-item"
          :class="{active: filterParama.people.name === v.name}"
          v-for="v in peoples"
          :key="v.name"
          @click="onSelectPeople(v)"
        >
          <span
            class="filterDramaBox-item-scrolls-item-title"
            :class="{acticeLabel: filterParama.people.name === v.name}"
            >{{ v.name }}</span
          >
        </div>
      </scroll-view>
    </div>
  </div>
</template>
<script setup lang="ts">
const { api, filters, menuButtonRect } = useInstance();

const emits = defineEmits(["changeFilter"]);

let menuRect: any = reactive({});

let peoples:Array<any> = reactive([
  { name: "全部", maxGamerNum: null, minGamerNum: null },
  { name: "≤4人", maxGamerNum: 4, minGamerNum: 0 },
  { name: "5人", maxGamerNum: 5, minGamerNum: 5 },
  { name: "6人", maxGamerNum: 6, minGamerNum: 6 },
  { name: "7人", maxGamerNum: 7, minGamerNum: 7 },
  { name: "8人", maxGamerNum: 8, minGamerNum: 8 },
  { name: "≥9人", maxGamerNum: 0, minGamerNum: 9 },
]);

let dicts: Array<any> = reactive([]);

let filterParama: any = reactive({
  dict: null,
  people: {name: "全部",maxGamerNum: null, minGamerNum: null}
});

onMounted(async () => {
  let res = await menuButtonRect();
  Object.assign(menuRect, res);

  queryDicts();
});

async function queryDicts() {
  let arr: any = [];

  let data: any = await api.queryDictParama({
    dictType: "DRAMA",
  });

  data.map((v: any) => {
    if (v.dictType === "DRAMA") {
      arr = v.dictList;
    }
  });
  arr.unshift({ dictValue: "全部", id: null });

  Object.assign(dicts, arr);
}

//选择剧本题材
function onSelectDict(v: number) {
  if (filterParama.dict === v) {
    filterParama.dict = -1;
  } else {
    filterParama.dict = v;
  }
  emits("changeFilter", filterParama);
}

//选择人数
function onSelectPeople(v: any) {
  if (filterParama.people === v) {
    filterParama.people = {name: "全部",maxGamerNum: null, minGamerNum: null};
  } else {
    filterParama.people = v;
  }
  emits("changeFilter", filterParama);
}
</script>
<style lang="scss" scoped>
.filterDramaBox {
  position: fixed;
  left: 0px;
  right: 0px;
  top: 0px;
  z-index: 1;
  background: #fff;
  height: 220rpx;
  border-top: 1px solid #e9ebef;
  &-item {
    @include hor;
    align-items: center;
    margin-bottom: 20rpx;
    &-title {
      @include text-normal(26rpx, #2e323e);
      width: 80rpx;
      padding-left: 58rpx;
    }
    &-scrolls {
      white-space: nowrap;
      width: 80vw;
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
</style>