<template>
  <div class="dynamic">
    <div class="empty"/>
    <jy-dynamic :dynamics="dynamicList"></jy-dynamic>
  </div>
</template>
<script setup lang="ts">
const {api, myApi,homeApi , dayjs, filters, getColor, menuButtonRect} = useInstance();

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

let dynamicList:Array<any> = reactive([]);
let pageSize = ref(6);
let pageNo = ref(1);


onMounted(async () => {
  await queryDynamics();
});


async function queryDynamics(){
  if (pageNo.value === 1) {
    dynamicList.splice(0);
  }
  let data: any = await myApi.getDramaDynamics({
    userId: props.userId,
    dramaId: props.dramaId,
    pageNo: pageNo.value,
    pageSize: pageSize.value,
    lat: uni.getStorageSync('latitude'),
    lon: uni.getStorageSync('longitude'),
    queryType: "SELF"
  });
  if (data.records && data.records.length) {
    dynamicList.push(...data.records);
  }
}

//触底加载更多
onReachBottom(async () => {
  pageNo.value++;
  await queryDynamics();
});


</script>
<style lang="scss" scoped>
.dynamic{
}

.empty{
  height: 20rpx;
  width: 100vw;
}
</style>