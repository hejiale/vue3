<template>
  <div>
    <jy-dramaWrapper :recommendList = recommendList />
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

let recommendList:Array<any> = reactive([]);
let pageSize = ref(6);
let pageNo = ref(1);


onMounted(async () => {
  await getDramaDetailRecommend();
});

async function getDramaDetailRecommend() {
  try {
    if (pageNo.value === 1) {
      recommendList.splice(0);
    }
    let data:any = await homeApi.getDramaDetailRecommend({
      cityId: uni.getStorageSync('city-info').id,
      id: props.dramaId,
    });
    if (data && data.length > 0) {
      recommendList.push(...data);
    }
  } catch (e) {
    console.error(e);
  }
}


</script>
<style lang="scss" scoped>

</style>