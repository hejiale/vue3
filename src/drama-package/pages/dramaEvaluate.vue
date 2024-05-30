<template>
  <div class="bg">
    <div class="empty" v-if="!evaluateList">
      <image class="empty-icon" :src="filters.icon('noEvaluate')"></image>
      <div class="empty-one">还没有人评论哦</div>
      <div class="empty-two">来发布第一个评论吧～</div>
      <div class="empty-bottom">发布评价</div>
    </div>

    <div class="title">剧本热评</div>
    <div class="status-line">
      <div v-for="(status,index) in statusList" :key="index">
        <div class="status-line-item" :class="{'status-line-item-active': status.active==1}" @click="chooseStatus(status.index)">
          <div class="status-line-item-text">
            {{ status.text}}
            <div class="status-line-item-text-count" v-if="status.index!==0">{{doStatusCount(status.index)}}</div>
          </div>
        </div>
      </div>
    </div>
    <jy-evaluate class="evaluate" :evaluateList="evaluateList"/>
  </div>


</template>
<script setup lang="ts">
const {api, myApi, homeApi, dayjs, filters, getColor, menuButtonRect} = useInstance();

const props = defineProps({
  dramaId: {
    type: String,
    default: 0,
  },
  userId: {
    type: Number,
    default: 0,
  },
})

let evaluateList: Array<any> = reactive([]);
let statusList = reactive([
  {index:0 ,text: "全部", active: 1},
  {index:1 ,text: "推荐", active: 0},
  {index:2 ,text: "一般", active: 0}
]);
let pageSize = ref(6);
let pageNo = ref(1);

let recommendCount = ref(0);
let soSoCount = ref(0);

onMounted(async () => {
  await queryEvaluateListCount();
  await queryEvaluateList();
});

function doStatusCount(index:number){
  let count = 0;
  if(index === 1){
    count =  recommendCount.value;
  }else if(index === 2){
    count =  soSoCount.value;
  }
  return "("+count+")";
}

function chooseStatus(index:number) {
  statusList.forEach((v) => {
    v.active = 0;
  });

  statusList[index].active = 1;

  pageNo.value = 1;
  queryEvaluateListCount();
  queryEvaluateList();
}

async function queryEvaluateListCount() {
  let res: any = await homeApi.dramaDetailEvaluateCount({
    pageNo: 0,
    pageSize: 1,
    userId: props.userId,
    dramaId: Number(props.dramaId),
  });
  recommendCount.value = res.filter((item: { dramaEvaluateType: string; }) => item.dramaEvaluateType === "RECOMMEND").map((item: { count: any; }) => item.count)[0] || 0;
  soSoCount.value = res.filter((item: { dramaEvaluateType: string; }) => item.dramaEvaluateType === "SO_SO").map((item: { count: any; }) => item.count)[0] || 0;
}

//查询剧评列表
async function queryEvaluateList() {
  try {
    let dramaEvaluateType = null;
    if (statusList[1].active === 1) {
      dramaEvaluateType = 'RECOMMEND';
    } else if (statusList[2].active === 1) {
      dramaEvaluateType = 'SO_SO';
    }

    if (pageNo.value === 1) {
      evaluateList.splice(0);
    }

    let res: any = await homeApi.dramaDetailEvaluate({
      pageNo: pageNo.value,
      pageSize: 10,
      userId: props.userId,
      dramaId: Number(props.dramaId),
      dramaEvaluateType: dramaEvaluateType,
    });
    res.records.map((v: any) => {
      v["isInfo"] = false;
    });
    if (res.records.length) {
      evaluateList.push(...res.records);
    }
  } catch (e) {
    console.log(e);
  }
}

//触底加载更多
onReachBottom(async () => {
  pageNo.value++;
  await queryEvaluateList();
});


</script>
<style lang="scss" scoped>
.bg {
  background: #FFFFFF;
  min-height: 100vh;
}

.title {
  @include text-custom(550, 30rpx, #2E323E);
  line-height: 35rpx;
  margin-left: 18rpx;
  margin-bottom: 30rpx;
}

.status-line {
  width: calc(100vw - 18rpx) ;
  height: 70rpx;
  display: flex;
  margin-bottom: 12rpx;
  margin-left: 18rpx;
  position: sticky;
  top: 280rpx;
  z-index: 3;
  background: #FEFEFE;
  &-item {
    height: 54rpx;
    border-radius: 112rpx 112rpx 112rpx 112rpx;
    border: 1rpx solid #D8DADE;
    min-width: 108rpx;
    box-sizing: border-box;
    @include hor-center-center;
    margin-right: 18rpx;
    &-text {
      @include text-custom(500, 24rpx, #2E323E);
      display: flex;
      &-count{
        @include text-custom(500, 24rpx, #959AA5);
        line-height: 28rpx;
        margin-left: 6rpx;
      }
    }

    &-active {
      border: 1rpx solid #36E4BB;
      background: #F1FFFC;
    }
  }

}

.empty {
  @include ver-center;

  &-icon {
    @include react(108rpx);
    margin-top: 208rpx;
    margin-bottom: 14rpx;
  }

  &-one {
    @include text-custom(400, 24rpx, #2E323E);
    line-height: 28rpx;
    margin-bottom: 14rpx;
  }

  &-two {
    @include text-custom(400, 26rpx, #959AA5);
    line-height: 30rpx;
    margin-bottom: 52rpx;
  }

  &-bottom {
    width: 306rpx;
    height: 80rpx;
    background: #2E323E;
    border-radius: 16rpx 16rpx 16rpx 16rpx;

    @include text-custom(600, 28rpx, #FFFFFF);
    line-height: 33rpx;

    @include hor-center-center;
  }
}
</style>