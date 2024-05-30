<template>
  <div class="searchBox" :class="textAlign" :style="{ 'width': width, 'background': bgColor, 'height': customHeight, 'border-radius': borderRadius }">
    <input
      class="searchBox-input"
      v-model="searchValue"
      @focus="onFocus"
      @input="onFocus"
      @blur="onSearch"
      :style="{'text-align': textAlign}"
    />
    <div class="searchBox-placeholderBox" v-if="!isFocus">
      <image :src="filters.icon('icon-search')" />
      <span class="placeholder">输入关键词搜索</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
const { filters, bus } = useInstance();

const props = defineProps({
  modelValue:{
    type: String,
    default: "",
  },
  /**
   * 自定义搜索框宽度  
   */
  width: {
    type: String,
    default: "",
  },
  bgColor: {
    type: String,
    default: "#f5f6f8",
  },
  customHeight: {
    type: String,
    default: '60rpx'
  },
  borderRadius: {
    type: String,
    default: '30rpx'
  },
  textAlign: {
    type: String,
    default: 'center'
  }
});

const emits = defineEmits(['update:modelValue']);

let searchValue = ref();

let isFocus = ref(false);

onMounted(()=>{
  bus.on('on-change-tab',()=>{
    searchValue.value = "";
    emits("update:modelValue", "");
    isFocus.value = false;
  })
})

//监听
watch(
  props,
  () => {
    searchValue.value = props.modelValue;
    if (!searchValue.value) {
      isFocus.value = false;
    }
  },
  { immediate: true }
)

function onFocus() {
  isFocus.value = true;
}

function onSearch() {
  if (!searchValue.value) {
    isFocus.value = false;
  }

  emits("update:modelValue", searchValue.value);
}
</script>
<style lang="scss" scoped>
.searchBox {
  position: relative;
  @include hor-center;
  padding: 40rpx;
  box-sizing: border-box;
  &-placeholderBox {
    position: absolute;
    image {
      width: 40rpx;
      height: 40rpx;
    }
    .placeholder {
      @include text-normal(28rpx, #768198);
    }
  }
  &-input {
    width: 100%;
    @include text-normal(26rpx, #222);
  }
}
.center{
  @include hor-center-center;
}
</style>