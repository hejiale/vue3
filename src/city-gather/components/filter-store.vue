<template>
  <div
    class="filterDateBox"
  >
    <div class="filterDateBox-sortBox">
      <div class="filterDateBox-sortBox-menu pl17" @click.stop="onChangeSortType(0)" :class="{'activeMenu' : sortType === 0 }">
        {{ filterParama.districtName }}<image :src="arrowImg(0)"></image>
      </div>
      <div class="filterDateBox-sortBox-menu pl22" @click.stop="onChangeSortType(1)" :class="{'activeMenu': sortType === 1 }">
        {{ enums.OrderByType.getName(filterParama.orderBy) }}<image :src="arrowImg(1)"></image>
      </div>
      <div
        class="filterDateBox-sortBox-playBox ml22"
        :class="{active: filterParama.beforeThere}"
        @click.stop="onChangeBeforeThere"
      >
        之前去过
      </div>
      <div
        class="filterDateBox-sortBox-playBox ml10"
        :class="{active: filterParama.wantPlay}"
        @click.stop="onChangeWantPlay"
      >
        有我想玩
      </div>
    </div>
    <u-picker :show="sortType === 0" :columns="columns" keyName="regionName" @close="sortType = -1" @cancel="sortType = -1" @confirm="onConfirmDistrict" closeOnClickOverlay></u-picker>
    <div class="popPropertyBox" v-if="sortType === 1">
      <div class="popPropertyBox-cover" @click.stop="sortType = -1"></div>
      <div class="popPropertyBox-content">
        <div
          class="popPropertyBox-content-item"
          :class="{'active': filterParama.orderBy === v.value }"
          v-for="v in enums.OrderByType.list"
          :key="v.value"
          @click.stop=onChangeOrderby(v.value)
        >
          <image
            :src="filters.icon('icon-hasSelect')"
            v-if="filterParama.orderBy === v.value"
          ></image>
          <image v-else></image>
          {{ v.label }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const { bus, gatherApi, filters, menuButtonRect, enums, api } = useInstance();

const props = defineProps({
  cityId: {
    type: Number,
    default: 0
  }
})

const emits = defineEmits(['changeSort']);

let menuRect: any = reactive({});

let sortType = ref(-1);

let columns: Array<any> = reactive([]);

const arrowImg = computed(() => (type:any) => {
  return filters.icon(sortType.value === type ? "up-arrow" : "down-arrow");
});

let filterParama: any = reactive({
  orderBy: 1,
  districtName: '全城',
  districtId: null,
  beforeThere: false,
  wantPlay: false
});

//监听
watch(
  sortType,
  () => {
    bus.emit('showFilter', sortType.value !== -1 ? true: false);
  },
  { immediate: true }
)

onMounted(async () => {
  let res = await menuButtonRect();
  Object.assign(menuRect, res);
});

function onChangeBeforeThere(tag:any) {
  filterParama.beforeThere = !filterParama.beforeThere;
  emits('changeSort', filterParama)
}

function onChangeWantPlay(){
  filterParama.wantPlay = !filterParama.wantPlay;
  emits('changeSort', filterParama)
}

function onChangeSortType(type:any) {
  if (sortType.value === type) {
    sortType.value = -1;
  } else {
    sortType.value = type;
  }
  queryRegion();
}

function onChangeOrderby(value:any){
  if(filterParama.orderBy == value){
    filterParama.orderBy = 1;
  }else{
    filterParama.orderBy = value;
  }
  
  emits('changeSort', filterParama);
  sortType.value = -1;
}

//选择地区
function onConfirmDistrict(v:any){
  sortType.value = -1;

  filterParama.districtId = columns[0][v.indexs[0]].id;
  filterParama.districtName = columns[0][v.indexs[0]].regionName;

  emits('changeSort', filterParama)
}

async function queryRegion() {
  let res:any = await api.getRegion({
    id: props.cityId,
    regionType: "3",
  });
  let first = {
    id: null,
    regionName: "全城",
  };
  res.unshift(first);

  Object.assign(columns, [res]);
}
</script>
<style lang="scss" scoped>
.filterDateBox {
  position: fixed;
  left: 0px;
  right: 0px;
  top: 0px;
  z-index: 1;
  border-top: 1px solid #E9EBEF;
  &-sortBox {
    @include hor-center;
    height: 88rpx;
    background: #fff;
    &-menu {
      @include text-middle(26rpx, #5f6572);
      image {
        width: 12rpx;
        height: 6rpx;
      }
    }
    .activeMenu {
      color: #36e4bb;
    }
    &-playBox {
      padding: 8rpx 16rpx;
      background: #ffffff;
      border-radius: 16px;
      border: 1px solid #e9ebef;
      @include text-middle(24rpx, #5f6572);
    }
    .active {
      border: 1px solid #36e4bb;
      background: #f1fffc;
      color: #36e4bb;
    }
  }
}
.popPropertyBox {
  position: fixed;
  left: 0px;
  right: 0px;
  bottom: 0px;
  top: 88rpx;
  &-cover{
    @include abs-center;
    background: rgba($color: #000000, $alpha: 0.4);
  }
  &-content {
    padding-top: 4rpx;
    background: #ffff;
    position: relative;
    &-item {
      @include text-normal(28rpx, #2e323e);
      padding: 18rpx 0;
      margin-left: 30rpx;
      border-bottom: 1px solid #e9ebef;
      @include hor-center;
      image {
        width: 28rpx;
        height: 28rpx;
        margin-right: 8rpx;
      }
    }
    .active {
      color: #36e4bb;
    }
  }
}
</style>