<template>
  <u--textarea v-model="text" placeholder="这是一个还没有写自我介绍的小可爱" count height="440rpx"></u--textarea>
  <image class="button" :src="commitIcon" :class="{ 'pulse': isAnimating }" @click="click"></image>
</template>

<script setup lang="ts">
const {api,filters} = useInstance();
let text = ref('')
let isAnimating = ref(false);
let commitIcon = computed(() => text.value.length  ? filters.icon("commitButton") : filters.icon("commitBlockButton"));
let userId = ref('')


watch(commitIcon, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    isAnimating.value = true;
    console.log('isAnimating', isAnimating.value);
    setTimeout(() => {
      isAnimating.value = false;
    }, 1000);
  }
});

onLoad(async (param:any) => {
  let desc = param.desc;
  userId.value = param.userId;
  if (desc) {
    text.value = desc
  }
})

async function click() {
  let id = userId.value;
  if (id) {
    try {
      await api.saveAppUserEditInfo({
        id: id,
        personSign: text.value
      })
      uni.navigateBack();
    } catch (e) {
    }
  }
}
</script>


<style scoped lang="scss">
.button{
  width: 702rpx;
  height: 88rpx;
  position: fixed;
  bottom: 78rpx;
  left: 24rpx;
}

.pulse{
  animation: pulse;
  animation-duration: 1s;
}

</style>
