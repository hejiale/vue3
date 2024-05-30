<template>
  <div
    class="filterDateBox"
  >
    <div class="filterDateBox-dateBox" v-if="dateList.length">
      <div class="filterDateBox-dateBox-allBox">
        <div class="filterDateBox-dateBox-allBox-all" @click.stop="onChangeDate('')">
          <span class="filterDateBox-dateBox-allBox-all-title" :class="activeTitle('')">全部</span>
          <span class="filterDateBox-dateBox-allBox-all-value" :class="activeValue('')"
            >{{ totalGatherCount }}场</span
          >
        </div>
        <image
          :src="filters.icon('space-line')"
          class="filterDateBox-dateBox-allBox-space"
        ></image>
      </div>
      <scroll-view class="filterDateBox-dateBox-scrollBox" scroll-x>
        <div
          class="filterDateBox-dateBox-scrollBox-item"
          v-for="v in showDateList"
          :key="v.id"
          @click.stop="onChangeDate(v.date)"
        >
          <span class="filterDateBox-dateBox-scrollBox-item-title" :class="activeTitle(v.date)">{{
            filters.getWeek(v.date)
          }}</span>
          <span class="filterDateBox-dateBox-scrollBox-item-value" :class="activeValue(v.date)">{{
            dayjs(v.date).format("MM.DD")
          }}</span>
        </div>
      </scroll-view>
    </div>
    <div class="filterDateBox-sortBox">
      <div class="filterDateBox-sortBox-left">
        <div
          class="filterDateBox-sortBox-left-menu pl17"
          :class="{active: sortType === 0}"
          @click.stop="onChangeSortType(0)"
        >
          {{ filterParama.districtName }}<image :src="arrowImg(0)"></image>
        </div>
        <div
          class="filterDateBox-sortBox-left-menu pl22"
          :class="{active: sortType === 1}"
          @click.stop="onChangeSortType(1)"
        >
          筛选<image :src="arrowImg(1)"></image>
        </div>
      </div>
      <div class="filterDateBox-sortBox-right">
        <div
          class="filterDateBox-sortBox-right-menu pr16"
          :class="{active: sortType === 2}"
          @click.stop="onChangeSortType(2)"
        >
        {{ enums.OrderByType.getName(filterParama.orderBy) }}<image :src="arrowImg(2)"></image>
        </div>
      </div>
    </div>
    <div class="filterDateBox-countBox">
      <image :src="filters.icon('gather-count-tag')"></image>
      <div class="filterDateBox-countBox-title">{{ gatheringToday }}场</div>
    </div>
    <u-picker :show="sortType === 0" :columns="columns" keyName="regionName" @close="sortType = -1" @cancel="sortType = -1" @confirm="onConfirmDistrict" closeOnClickOverlay></u-picker>
    <div class="popParamFilterBox" v-if="sortType === 1">
      <div class="popParamFilterBox-cover" @click.stop="onCloseFilter"></div>
      <div class="popParamFilterBox-content">
        <div class="popParamFilterBox-content-scrollBox">
          <div class="popParamFilterBox-content-scrollBox-typeBox">
            <div class="popParamFilterBox-content-scrollBox-typeBox-title">
              时间
            </div>
            <div
              class="popParamFilterBox-content-scrollBox-typeBox-content flex"
            >
              <div
                class="popParamFilterBox-content-scrollBox-typeBox-content-item"
                :class="{active: temporaryParama.timeType == time.value}"
                v-for="time in enums.TimeType.list"
                :key="time.label"
                @click=onChangeParama(time.value,0)
              >
                <span
                  class="popParamFilterBox-content-scrollBox-typeBox-content-item-label"
                  :class="{activeSpan:temporaryParama.timeType == time.value}"
                  >{{ time.label }}</span
                >
                <span
                  class="popParamFilterBox-content-scrollBox-typeBox-content-item-value"
                  :class="{activeSpan: temporaryParama.timeType == time.value}"
                  >{{ time.time }}</span
                >
              </div>
            </div>
          </div>
          <div class="popParamFilterBox-content-scrollBox-typeBox">
            <div class="popParamFilterBox-content-scrollBox-typeBox-title">
              想玩的本
            </div>
            <div class="popParamFilterBox-content-scrollBox-typeBox-content">
              <div
                class="popParamFilterBox-content-scrollBox-typeBox-content-item"
                :class="{active: temporaryParama.playStatus === playStatus.value}"
                v-for="playStatus in enums.PlayStatus.list"
                :key="playStatus.label"
                @click=onChangeParama(playStatus.value,1)
              >
                <span
                  class="popParamFilterBox-content-scrollBox-typeBox-content-item-label"
                  :class="{activeSpan: temporaryParama.playStatus === playStatus.value}"
                  >{{ playStatus.label }}</span
                >
              </div>
            </div>
          </div>
          <div class="popParamFilterBox-content-scrollBox-typeBox">
            <div class="popParamFilterBox-content-scrollBox-typeBox-title">
              发售方式
            </div>
            <div class="popParamFilterBox-content-scrollBox-typeBox-content">
              <div
                class="popParamFilterBox-content-scrollBox-typeBox-content-item"
                :class="{active: temporaryParama.sellType === sellType.value}"
                v-for="sellType in enums.CustomSellType.list"
                :key="sellType.label"
                @click=onChangeParama(sellType.value,2)
              >
                <span
                  class="popParamFilterBox-content-scrollBox-typeBox-content-item-label"
                  :class="{activeSpan: temporaryParama.sellType === sellType.value}"
                  >{{ sellType.label }}</span
                >
              </div>
            </div>
          </div>
          <div class="popParamFilterBox-content-scrollBox-typeBox">
            <div class="popParamFilterBox-content-scrollBox-typeBox-title">
              类型
            </div>
            <div class="popParamFilterBox-content-scrollBox-typeBox-content">
              <div
                class="popParamFilterBox-content-scrollBox-typeBox-content-item"
                :class="{active: selectDict(v.id)}"
                @click=onChangeParama(v.id,3)
                v-for="v in dicts"
                :key="v.id"
              >
                <span
                  class="popParamFilterBox-content-scrollBox-typeBox-content-item-label"
                  :class="{activeSpan: selectDict(v.id)}"
                  >{{ v.dictValue }}</span
                >
              </div>
            </div>
          </div>
        </div>
        <div class="popParamFilterBox-content-bottomBox">
          <div class="popParamFilterBox-content-bottomBox-left ml16">清空</div>
          <div class="popParamFilterBox-content-bottomBox-right ml10" @click.stop="onSureFilter">
            (145个本)
          </div>
        </div>
      </div>
    </div>
    <div class="popPropertyBox" v-if="sortType === 2">
      <div class="popPropertyBox-cover" @click.stop="sortType = -1"></div>
      <div class="popPropertyBox-content">
        <div
          class="popPropertyBox-content-item"
          :class="{active: filterParama.orderBy === v.value}"
          v-for="v in enums.OrderByType.list"
          :key="v.value"
          @click=onChangeParama(v.value,4)
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
const {
  bus,
  api,
  enums,
  gatherApi,
  useUser,
  getColor,
  requestAuthorize,
  filters,
  dayjs,
  menuButtonRect,
} = useInstance();

const props = defineProps({
  cityId: {
    type: Number,
    default: 0
  },
  totalGatherCount: {
    type: Number,
    default: 0
  },
  gatheringToday: {
    type: Number,
    default: 0
  }
})

const emits = defineEmits(['changeSort']);

let menuRect: any = reactive({});

let dateList: Array<any> = reactive([]);

let sortType = ref(-1);

let dicts: Array<any> = reactive([]);

//临时数据，用于弹出框筛选
let temporaryParama:any = reactive({
  timeType: null,
  playStatus: null,
  sellType: null,
  dicts: []
});

let filterParama: any = reactive({
  date: '',
  orderBy: 1,
  districtName: '全城',
  districtId: null,
  timeType: null,
  playStatus: null,
  sellType: null,
  dicts: []
});

let columns: Array<any> = reactive([]);

//监听
watch(
  sortType,
  () => {
    if(sortType.value === 1){
      Object.assign(temporaryParama, JSON.parse(JSON.stringify(filterParama)));
    }else{
      clearTemp();
    }
    bus.emit('showFilter', sortType.value !== -1 ? true: false);
  },
  { immediate: true }
)

onMounted(async () => {
  let res = await menuButtonRect();
  Object.assign(menuRect, res);

  queryDateList();
  queryDicts();
});

const showDateList = computed(() => {
  return dateList.splice(1, dateList.length);
});

const arrowImg = computed(() => (type:any) => {
  return filters.icon(sortType.value === type ? "up-arrow" : "down-arrow");
});

const activeTitle = computed(()=>(date:any)=>{
  return {'activeTitle': filterParama.date === date };
})

const activeValue = computed(()=>(date:any)=>{
  return {'activeValue': filterParama.date === date };
})

const selectDict = computed(()=>(dictId:any)=>{
  return temporaryParama.dicts.findIndex((v:any)=>v === dictId) !== -1;
})

async function queryDateList() {
  let res = await gatherApi.getUserGatheringOverviewByDate({});
  Object.assign(dateList, res);
}

//切换筛选项
function onChangeSortType(type:any) {
  if (sortType.value === type) {
    sortType.value = -1;
  } else {
    sortType.value = type;
  }
  queryRegion();
}

//切换组局时间
function onChangeDate(date:any){
  filterParama.date = date;
  
  emits('changeSort', filterParama)
}

//选择地区
function onConfirmDistrict(v:any){
  sortType.value = -1;

  filterParama.districtId = columns[0][v.indexs[0]].id;
  filterParama.districtName = columns[0][v.indexs[0]].regionName;

  emits('changeSort', filterParama)
}

//切换筛选项
function onChangeParama(value:any, type:any){
  if(type === 0){
    if(temporaryParama.timeType === value){
      temporaryParama.timeType = null;
    }else{
      temporaryParama.timeType = value;
    }
  }else if(type === 1){
    if(temporaryParama.playStatus === value){
      temporaryParama.playStatus = null;
    }else{
      temporaryParama.playStatus = value;
    }
  }else if(type === 2){
    if(temporaryParama.sellType === value){
      temporaryParama.sellType = null;
    }else{
      temporaryParama.sellType = value;
    }
  }else if(type === 3){
    //处理多选类型
    let idx = temporaryParama.dicts.findIndex((v:any)=>v === value);

    if(idx !== -1){
      temporaryParama.dicts.splice(idx, 1);
    }else{
      temporaryParama.dicts.push(value);
    }
  }else if(type === 4){
    if(filterParama.orderBy == value){
      filterParama.orderBy = 1;
    }else{
      filterParama.orderBy = value;
    }
    
    emits('changeSort', filterParama);
    sortType.value = -1;
  }
}

//确认筛选
function onSureFilter(){
  filterParama = JSON.parse(JSON.stringify(temporaryParama))
  
  emits('changeSort', filterParama)

  sortType.value = -1;
}

function onCloseFilter(){
  sortType.value = -1;
}

function clearTemp(){
  Object.assign(temporaryParama, {
    date: '',
    timeType: null,
    playStatus: null,
    sellType: null,
    dicts: [],
    orderBy: null,
    districtName: '全城',
    districtId: null
  });
}

//查询题材
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

//查询对应区
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
  z-index: 10;
  &-dateBox {
    border-top: 2rpx solid #e9ebef;
    border-bottom: 2rpx solid #e9ebef;
    height: 112rpx;
    position: relative;
    @include hor-center;
    background: #fff;
    &-allBox {
      padding-left: 32rpx;
      @include hor-center;
      &-all {
        @include ver-center;
        &-title {
          @include text-middle(26rpx, #5f6572);
        }
        &-value {
          @include text-normal(24rpx, #959aa5);
        }
      }
      &-space {
        padding: 0px 20rpx;
        width: 12rpx;
        height: 84rpx;
      }
    }
    &-scrollBox {
      white-space: nowrap;
      width: 80vw;
      &-item {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        margin-right: 66rpx;
        transform: translateY(-4rpx);
        &-title {
          @include text-middle(26rpx, #5f6572);
        }
        &-value {
          @include text-normal(24rpx, #959aa5);
        }
      }
    }
    .activeTitle{
          @include text-middle(26rpx, #111);
        }
        .activeValue{
          @include text-normal(26rpx, #2E323E);
        }
  }
  &-sortBox {
    @include hor-between-center;
    height: 88rpx;
    background: #fff;
    &-left,
    &-right {
      @include hor-center;
      &-menu {
        @include text-middle(26rpx, #5f6572);
        image {
          width: 12rpx;
          height: 6rpx;
        }
      }
      .active {
        color: #36e4bb;
      }
    }
  }
  &-countBox {
    margin: 0px 30rpx;
    height: 76rpx;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 1%, #ffffff 25%);
    border-radius: 0px 0px 24rpx 24rpx;
    @include hor-center;
    image {
      padding-left: 24rpx;
      width: 28rpx;
      height: 28rpx;
      transform: translateY(2rpx);
    }
    &-title {
      @include text-middle(26rpx, #36e4bb);
      margin-left: 8rpx;
    }
    &-title::before {
      content: "当前日期条件下有";
      color: #2e323e;
    }
    &-title::after {
      content: "组局拼场中";
      color: #2e323e;
    }
  }
}
.popParamFilterBox {
  position: fixed;
  left: 0px;
  right: 0px;
  bottom: 0px;
  top: 200rpx;
  &-cover{
    @include abs-center;
    background: rgba($color: #000000, $alpha: 0.4);
  }
  &-content {
    height: 50vh;
    background: #ffff;
    position: relative;
    &-scrollBox {
      position: absolute;
      left: 0px;
      right: 0px;
      top: 0px;
      bottom: 10vh;
      overflow-y: scroll;
      &-typeBox {
        @include ver;
        padding: 26rpx 0px 0px 32rpx;
        &-title {
          @include text-normal(28rpx, #5f6572);
        }
        &-content {
          margin-top: 28rpx;
          &-item {
            width: 156rpx;
            height: 100rpx;
            background: #f5f6f8;
            border-radius: 3px;
            margin: 0px 20rpx 20rpx 0px;
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            &-label {
              @include text-normal(26rpx, #2e323e);
            }
            &-value {
              @include text-normal(24rpx, #959aa5);
            }
          }
          .active {
            border: 1px solid #36e4bb;
            background: #f1fffc;
          }
          .activeSpan {
            color: #36e4bb;
          }
        }
        .flex {
          @include hor-center;
        }
      }
    }
    &-bottomBox {
      position: absolute;
      bottom: 28rpx;
      @include hor-center;
      &-left {
        width: 44vw;
        height: 80rpx;
        background: #ffffff;
        border-radius: 20px;
        border: 1px solid #959aa5;
        @include text-middle(32rpx, #5f6572);
        @include hor-center-center;
        box-sizing: border-box;
      }
      &-right {
        width: 44vw;
        height: 80rpx;
        background: #36e4bb;
        border-radius: 20px;
        @include text-normal(26rpx, #111);
        @include hor-center-center;
      }
      &-right::before {
        content: "确定";
        font-size: 32rpx;
        font-weight: 500;
      }
    }
  }
}
.popPropertyBox {
  position: fixed;
  left: 0px;
  right: 0px;
  bottom: 0px;
  top: 200rpx;
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