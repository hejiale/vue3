<template>
  <div class="container">
    <jy-navigationBar :barHeight="42">
      <template v-slot:content>
        <div class="topBar">
          <up-icon name="arrow-left" color="#000" size="22" @click="onBack"></up-icon>
          <span class="topBar-title">个人进件</span>
        </div>
      </template>
    </jy-navigationBar>
    <image :src="filters.icon('sass-bg')" class="container-cover"></image>
    <div class="container-bg"></div>
    <scroll-view scroll-y class="container-scrollBox">
      <div class="container-title">个人信息（建议与店主一致）</div>
      <div class="container-content">
        <div class="cell">
          <span class="cell-title">商户名称</span>
          <div class="cell-rightBox">
            <input
              type="text"
              v-model="merchantName"
              placeholder="请输入您的店铺名称"
              placeholder-class="placeholderClass"
            />
            <image
              :src="filters.icon('sass_right_arrow')"
              class="cell-rightBox-arrow ml4"
            ></image>
          </div>
        </div>
        <div class="container-content-note bottomLine">
          个体工商户传营业执照的名称（营业执照上名称是***或者无的，
          传营业者姓名），个人用户传姓名
        </div>
        <div class="cell bottomLine pd40">
          <span class="cell-title">联系方式</span>
          <div class="cell-rightBox">
            <input
              type="number"
              v-model="merchantPhone"
              placeholder="请输入您的联系方式"
              placeholder-class="placeholderClass"
            />
            <image
              :src="filters.icon('sass_right_arrow')"
              class="cell-rightBox-arrow ml4"
            ></image>
          </div>
        </div>
        <div class="cell bottomLine pd40">
          <span class="cell-title">身份证</span>
          <div class="cell-rightBox">
            <input
              type="idcard"
              v-model="identityNumber"
              placeholder="请输入您的身份证号"
              placeholder-class="placeholderClass"
            />
            <image
              :src="filters.icon('sass_right_arrow')"
              class="cell-rightBox-arrow ml4"
            ></image>
          </div>
        </div>
        <div class="cell pd40" :class="{ bottomLine: !isLongTerm }">
          <span class="cell-title">身份证是否为长期</span>
          <div class="cell-rightBox">
            <up-switch v-model="isLongTerm" activeColor="#59DB99"></up-switch>
          </div>
        </div>
        <div class="cell pd40" v-if="!isLongTerm">
          <span class="cell-title">身份证有效时长</span>
          <div class="cell-rightBox">
            <input
              type="text"
              placeholder="请选择有效期"
              placeholder-class="placeholderClass"
              disabled
              v-model="identityExpire"
              @click="showPicker = true"
            />
            <image
              :src="filters.icon('sass_right_arrow')"
              class="cell-rightBox-arrow ml4"
            ></image>
          </div>
        </div>
        <div class="container-content-idCardBox">
          <image
            :src="identityFront || filters.icon('ID-card-pre')"
            mode="widthFix"
            class="mr10"
            @click="onUploadPre"
          ></image>
          <image
            :src="identityBack || filters.icon('ID-card-back')"
            mode="widthFix"
            @click="onUploadBack"
          ></image>
        </div>
      </div>
      <div class="container-tip">
        银行信息（银行开户人需与个人信息一致，不可填写企业银行卡）
      </div>
      <div class="container-bankBox">
        <div class="cell pd40 bottomLine">
          <span class="cell-title">银行卡号</span>
          <div class="cell-rightBox">
            <input
              type="number"
              v-model="bankNo"
              placeholder="请输入银行卡号"
              placeholder-class="placeholderClass"
            />
            <image
              :src="filters.icon('sass_right_arrow')"
              class="cell-rightBox-arrow ml4"
            ></image>
          </div>
        </div>
        <div class="cell pd40">
          <span class="cell-title">银行预留手机号</span>
          <div class="cell-rightBox">
            <input
              type="number"
              v-model="bankPhone"
              placeholder="请输入预留手机号"
              placeholder-class="placeholderClass"
            />
            <image
              :src="filters.icon('sass_right_arrow')"
              class="cell-rightBox-arrow ml4"
            ></image>
          </div>
        </div>
      </div>
      <div style="height: 200rpx"></div>
    </scroll-view>
    <div class="container-bottom">
      <div class="container-bottom-button" v-if="canSubmit" @click="onSubmit">确认提交</div>
      <div class="container-bottom-disableButton" v-else>确认提交</div>
    </div>
    <!-- 选择时间 -->
    <up-datetime-picker
      ref="datetimePickerRef"
      :show="showPicker"
      v-model="pickerDate"
      mode="date"
      :minDate="minDate"
      :maxDate="maxDate"
      @cancel="showPicker = false"
      @confirm="onConfirmDate"
    ></up-datetime-picker>
  </div>
</template>
<script lang="ts" setup>
const { storeApi, useUser, filters, dayjs, uploadFile, useStore } = useInstance();

let isLongTerm = ref(false);

let pickerDate = ref(Date.now());

let minDate = ref(new Date("1970-01-01"));

let maxDate = ref(new Date("2099-01-01"));

let merchantName = ref();

let identityNumber = ref();

let merchantPhone = ref();

let identityExpire = ref();

let identityFront = ref();

let bankNo = ref();

let bankPhone = ref();

let identityBack = ref();

let showPicker = ref(false);

let storeInfo:any = reactive({})

/**
 * 判断可提交
 */
const canSubmit = computed(() => {
  if (!isLongTerm.value && !identityExpire.value) {
    return false;
  }

  return (
    merchantName.value &&
    merchantPhone.value &&
    identityNumber.value &&
    identityFront.value &&
    identityBack.value &&
    bankPhone.value &&
    bankNo.value
  );
});

onLoad(async()=>{
    await useStore.setStoreId('109')
    Object.assign(storeInfo, useStore.storeInfo);
})

function onBack() {
  uni.navigateBack();
}

function onConfirmDate(e: any) {
  showPicker.value = false;
  identityExpire.value = dayjs(new Date(e.value)).format("YYYYMMDD");
}

/**
 * 上传身份证正面反面
 */
function onUploadPre() {
  uni.chooseMedia({
    count: 1,
    success: async function (res) {
      uni.showLoading({title: "上传中..."});
      identityFront.value = await uploadFileRequest(
        res.tempFiles[0].tempFilePath
      );
      uni.hideLoading();
    },
  });
}

function onUploadBack() {
  uni.chooseMedia({
    count: 1,
    success: async function (res) {
      uni.showLoading({title: "上传中..."});
      identityBack.value = await uploadFileRequest(
        res.tempFiles[0].tempFilePath
      );
      uni.hideLoading();
    },
  });
}

function uploadFileRequest(url: any) {
  return new Promise((resolve) => {
    uploadFile(url).then((e) => {
      resolve(e);
    });
  });
}

/**
 * 提交
 */
async function onSubmit(){
    if(isLongTerm.value){
        identityExpire.value = null;
    }
    await storeApi.postMerchantBase({
        bankNo: bankNo.value,
        bankPhone: bankPhone.value,
        identityAddress: storeInfo.address,
        identityBack: identityBack.value,
        identityExpire: identityExpire.value,
        identityFront: identityFront.value,
        identityNumber: identityNumber.value,
        identityOccupation: '18',
        isLongTerm: isLongTerm.value,
        merchantName: merchantName.value,
        merchantPhone: merchantPhone.value,
        merchantType: 'STORE',
        sourceId: storeInfo.id
    })
    uni.showToast({title: '提交成功！'})
}


</script>
<style>
.placeholderClass {
  font-size: 30rpx;
  color: #c6c7ca;
}
</style>
<style lang="scss" scoped>
.container {
  .topBar {
    @include hor-center;
    padding-left: 40rpx;
    padding-top: 10rpx;
    position: relative;
    &-title {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      @include text-normal(26rpx, #2e323e);
    }
  }
  &-cover {
    @include fixed-center;
    height: 320rpx;
  }
  &-bg {
    @include fixed-center;
    background: #f5f9fb;
    z-index: -1;
  }
  &-scrollBox {
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 0px;
    top: 172rpx;
  }
  &-title {
    @include text-normal(26rpx, #959aa5);
    margin-left: 40rpx;
    margin-top: 40rpx;
  }
  &-content {
    margin: 24rpx 0px 0px 10rpx;
    padding: 40rpx;
    box-sizing: border-box;
    width: 730rpx;
    background: #ffffff;
    border-radius: 32rpx 32rpx 32rpx 32rpx;
    &-note {
      @include text-normal(24rpx, #c6c7ca);
      padding-top: 20rpx;
      padding-bottom: 40rpx;
    }
    &-idCardBox {
      @include hor-center;
      image {
        display: flex;
        flex: 1;
      }
    }
  }
  &-tip {
    margin: 60rpx 0px 0px 30rpx;
    width: 650rpx;
    @include text-normal(26rpx, #959aa5);
  }
  &-bankBox {
    margin: 24rpx 0px 0px 10rpx;
    padding: 0 40rpx;
    width: 730rpx;
    background: #ffffff;
    border-radius: 32rpx 32rpx 32rpx 32rpx;
    box-sizing: border-box;
  }
  .cell {
    @include hor-between-center;
    &-title {
      @include text-middle(30rpx, #5f6572);
      &::before {
        content: "*";
        color: #f55353;
      }
    }
    &-rightBox {
      @include hor-center;
      input {
        font-size: 30rpx;
        text-align: right;
      }
      &-arrow {
        width: 20rpx;
        height: 20rpx;
      }
    }
  }
  .bottomLine {
    border-bottom: 1rpx solid #e9ebef;
  }
  .pd40 {
    padding: 40rpx 0px;
  }
  &-bottom {
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 168rpx;
    background: #ffffff;
    box-shadow: 0rpx -2rpx 20rpx 0rpx rgba(0, 0, 0, 0.07);
    z-index: 1;
    @include hor-center-center;
    &-button {
      width: 670rpx;
      height: 88rpx;
      background: #2e323e;
      border-radius: 24rpx;
      @include hor-center-center;
      @include text-middle(28rpx, #fff);
    }
    &-disableButton {
      width: 670rpx;
      height: 88rpx;
      background: #d9d9d9;
      border-radius: 24rpx;
      @include hor-center-center;
      @include text-middle(28rpx, #fff);
    }
  }
}
</style>