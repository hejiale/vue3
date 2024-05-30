<template>
  <div class="container">
    <jy-navigationBar>
      <template v-slot:content>
        <div class="topBar" @click="onBack">
          <image :src="filters.icon('store-back')" class="topBar-back"></image>
          <span class="topBar-title">修改{{ navigationBarName }}</span>
        </div>
      </template>
    </jy-navigationBar>
    <div class="contentBox">
      <div class="contentBox-inputBox">
        <div class="contentBox-inputBox-title" v-if="editType !== 'storeDesc'">
          {{ navigationBarName }}
        </div>
        <textarea
          v-if="editType === 'storeDesc'"
          v-model="inputValue"
          maxlength="50"
          placeholder="请输入简介"
        ></textarea>
        <input
          v-model="inputValue"
          maxlength="20"
          class="contentBox-inputBox-area"
          :placeholder="'请输入您的' + navigationBarName"
          placeholder-class="placeholderClass"
          :type="editType === 'storePhone' ? 'number':'text'"
          v-else
        />
        <div class="contentBox-inputBox-numBox">{{ inputValue.length }}/20</div>
      </div>
    </div>
    <div class="bottomBox" @click="onSubmit">
      <image
        :src="filters.icon('immediately_submit_active')"
        class="bottomBox-submit"
        v-if="inputValue.length"
      ></image>
      <image
        :src="filters.icon('immediately_submit')"
        class="bottomBox-submit"
        v-else
      ></image>
    </div>
  </div>
</template>
<script lang="ts" setup>
const {
  sassApi,
  useUser,
  getColor,
  requestAuthorize,
  filters,
  enums,
  menuButtonRect,
} = useInstance();

let editType = ref("");

let navigationBarName = ref("");

let inputValue = ref("");

onLoad((option: any) => {
  editType.value = option.type;
  inputValue.value = option.value;
  navigationBarName.value = enums.EditStoreType.getName(option.type);
});

function onBack() {
  uni.navigateBack();
}

function onSubmit(){
  if(inputValue.value.length){
    uni.setStorageSync('changeValue', {type: editType.value, value: inputValue.value});
    uni.navigateBack();
  }
}
</script>
<style>
.placeholderClass {
  font-size: 30rpx;
  color: #959aa5;
  font-weight: 400;
}
</style>
<style lang="scss" scoped>
.topBar {
  @include hor-center;
  height: 100%;
  &-back {
    width: 32rpx;
    height: 32rpx;
    padding-left: 32rpx;
  }
  &-title {
    position: absolute;
    left: 0px;
    @include text-normal(26rpx, #2e323e);
    width: 100%;
    text-align: center;
  }
}
.contentBox {
  margin-top: 11.2vh;
  border-top: 2rpx solid #e4e4e5;
  height: 50vh;
  width: 100vw;
  &-inputBox {
    margin: 28rpx 32rpx;
    border-bottom: 2rpx solid #e4e4e5;
    position: relative;
    &-title {
      @include text-normal(26rpx, #2e323e);
    }
    &-area {
      padding: 36rpx 0px 32rpx 0px;
    }
    &-numBox {
      position: absolute;
      right: 0px;
      bottom: -20px;
      @include text-normal(24rpx, #959aa5);
    }
  }
}
.bottomBox {
  position: fixed;
  left: 0px;
  right: 0px;
  bottom: 0px;
  height: 188rpx;
  background: #ffffff;
  border-top: 2rpx solid #eeeeee;
  &-submit {
    width: 702rpx;
    height: 88rpx;
    margin: 16rpx 0px 0px 24rpx;
  }
}
</style>