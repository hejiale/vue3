<template>
  <div class="container">
    <jy-navigationBar :barHeight="42">
      <template v-slot:content>
        <div class="topBar">
          <up-icon name="arrow-left" color="#000" size="22" @click="onBack"></up-icon>
          <span class="topBar-title">企业进件</span>
        </div>
      </template>
    </jy-navigationBar>
    <image :src="filters.icon('sass-bg')" class="container-cover"></image>
    <div class="container-bg"></div>
    <scroll-view scroll-y class="container-scrollBox">
      <div class="container-title">个人信息（建议与店主一致）</div>
      <div class="container-content">
        <div class="cell bottomLine pd40">
          <span class="cell-title">企业名称</span>
          <div class="cell-rightBox">
            <input
              type="text"
              v-model="merchantName"
              placeholder="请输入您的企业名称"
              placeholder-class="placeholderClass"
            />
            <image
              :src="filters.icon('sass_right_arrow')"
              class="cell-rightBox-arrow ml4"
            ></image>
          </div>
        </div>
        <div class="cell bottomLine pd40">
          <span class="cell-title">企业联系方式</span>
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
          <span class="cell-title">法人姓名</span>
          <div class="cell-rightBox">
            <input
              v-model="legalreptName"
              placeholder="请输入法人姓名"
              placeholder-class="placeholderClass"
            />
            <image
              :src="filters.icon('sass_right_arrow')"
              class="cell-rightBox-arrow ml4"
            ></image>
          </div>
        </div>
        <div class="cell bottomLine pd40">
          <span class="cell-title">法人手机号</span>
          <div class="cell-rightBox">
            <input
              type="number"
              v-model="legalreptPhone"
              placeholder="请输入法人手机号"
              placeholder-class="placeholderClass"
            />
            <image
              :src="filters.icon('sass_right_arrow')"
              class="cell-rightBox-arrow ml4"
            ></image>
          </div>
        </div>
        <div class="cell bottomLine pd40">
          <span class="cell-title">法定代表人身份证</span>
          <div class="cell-rightBox">
            <input
              type="idcard"
              v-model="legalreptIdNo"
              placeholder="请输入法定代表人身份证"
              placeholder-class="placeholderClass"
            />
            <image
              :src="filters.icon('sass_right_arrow')"
              class="cell-rightBox-arrow ml4"
            ></image>
          </div>
        </div>
        <div class="cell pd40" :class="{ bottomLine: !isLegalreptLongTerm }">
          <span class="cell-title">身份证是否为长期</span>
          <div class="cell-rightBox">
            <up-switch
              v-model="isLegalreptLongTerm"
              activeColor="#59DB99"
            ></up-switch>
          </div>
        </div>
        <div class="cell pd40" v-if="!isLegalreptLongTerm">
          <span class="cell-title">身份证有效时长</span>
          <div class="cell-rightBox">
            <input
              type="text"
              placeholder="请选择有效期"
              placeholder-class="placeholderClass"
              disabled
              v-model="legalreptIdExp"
              @click="showPicker = true, isLicense = false"
            />
            <image
              :src="filters.icon('sass_right_arrow')"
              class="cell-rightBox-arrow ml4"
            ></image>
          </div>
        </div>
        <div class="container-content-idCardBox">
          <image
            :src="idPortrait || filters.icon('ID-card-pre')"
            mode="widthFix"
            class="container-content-idCardBox-card mr10"
            @click="onUploadPre"
          ></image>
          <image
            :src="idEmblem || filters.icon('ID-card-back')"
            mode="widthFix"
            class="container-content-idCardBox-card"
            @click="onUploadBack"
          ></image>
        </div>
        <div class="cell bottomLine pd40">
          <span class="cell-title">注册邮箱</span>
          <div class="cell-rightBox">
            <input
              v-model="regEmail"
              placeholder="请输入您的注册邮箱"
              placeholder-class="placeholderClass"
            />
            <image
              :src="filters.icon('sass_right_arrow')"
              class="cell-rightBox-arrow ml4"
            ></image>
          </div>
        </div>
        <div class="cell bottomLine pd40">
          <span class="cell-title">企业地址</span>
          <div class="cell-rightBox">
            <input
              v-model="address"
              placeholder="请输入您的企业地址"
              placeholder-class="placeholderClass"
            />
            <image
              :src="filters.icon('sass_right_arrow')"
              class="cell-rightBox-arrow ml4"
            ></image>
          </div>
        </div>
        <div class="cell bottomLine pd40">
          <span class="cell-title">统一社会信用代码</span>
          <div class="cell-rightBox">
            <input
              v-model="idNo"
              placeholder="请输入统一社会信用代码"
              placeholder-class="placeholderClass"
            />
            <image
              :src="filters.icon('sass_right_arrow')"
              class="cell-rightBox-arrow ml4"
            ></image>
          </div>
        </div>
        <div class="cell pd40" :class="{ bottomLine: !isLongTerm }">
          <span class="cell-title">营业执照是否为长期</span>
          <div class="cell-rightBox">
            <up-switch v-model="isLongTerm" activeColor="#59DB99"></up-switch>
          </div>
        </div>
        <div class="cell pt20 pb10" v-if="!isLongTerm">
          <span class="cell-title">身份证有效时长</span>
          <div class="cell-rightBox">
            <input
              type="text"
              placeholder="请选择有效期"
              placeholder-class="placeholderClass"
              disabled
              v-model="idExp"
              @click="showPicker = true, isLicense = true"
            />
            <image
              :src="filters.icon('sass_right_arrow')"
              class="cell-rightBox-arrow ml4"
            ></image>
          </div>
        </div>
        <div class="container-content-idCardBox pb20">
          <image
            :src="unifiedCodeUrl || filters.icon('businessLicense')"
            class="container-content-idCardBox-license"
            @click="onUploadLicense"
          ></image>
        </div>
      </div>
      <div class="container-tip">
        银行信息（银行开户人需与个人信息一致，不可填写企业银行卡）
      </div>
      <div class="container-bankBox">
        <div class="cell pd40 bottomLine">
          <span class="cell-title">对公账户名</span>
          <div class="cell-rightBox">
            <input
              v-model="linkedAcctName"
              placeholder="请输入账户名"
              placeholder-class="placeholderClass"
            />
            <image
              :src="filters.icon('sass_right_arrow')"
              class="cell-rightBox-arrow ml4"
            ></image>
          </div>
        </div>
        <div class="cell pd40">
          <span class="cell-title">对公账户开户行</span>
          <div class="cell-rightBox">
            <input
              v-model="linkedBrBankName"
              placeholder="请输入对公账户开户行"
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
      <div class="container-bottom-button" v-if="canSubmit" @click="onSubmit">
        确认提交
      </div>
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

let isLegalreptLongTerm = ref(false);

let pickerDate = ref(Date.now());

let minDate = ref(new Date("1970-01-01"));

let maxDate = ref(new Date("2099-01-01"));

let merchantName = ref();

let merchantPhone = ref();

let legalreptIdNo = ref();

let legalreptPhone = ref();

let regEmail = ref();

let legalreptName = ref();

let address = ref();

let idNo = ref();

let legalreptIdExp = ref();

let idPortrait = ref();

let isLongTerm = ref(false);

let idExp = ref();

let linkedAcctName = ref();

let linkedBrBankName = ref();

let idEmblem = ref();

let showPicker = ref(false);

let storeInfo: any = reactive({});

let unifiedCodeUrl = ref();

let isLicense = ref(false);

/**
 * 判断可提交
 */
const canSubmit = computed(() => {
  if (!isLegalreptLongTerm.value && !legalreptIdExp.value) {
    return false;
  }

  if (!isLongTerm.value && !idExp.value) {
    return false;
  }

  return (
    merchantName.value &&
    merchantPhone.value &&
    legalreptPhone.value &&
    legalreptName.value &&
    legalreptPhone.value &&
    legalreptIdNo.value &&
    idPortrait.value &&
    idEmblem.value &&
    regEmail.value &&
    address.value &&
    idNo.value &&
    linkedAcctName.value &&
    linkedBrBankName.value &&
    idPortrait.value &&
    idEmblem.value &&
    unifiedCodeUrl.value
  );
});

onLoad(async () => {
  await useStore.setStoreId("109");
  Object.assign(storeInfo, useStore.storeInfo);
});

function onBack() {
  uni.navigateBack();
}

function onConfirmDate(e: any) {
  showPicker.value = false;

  if(isLicense.value){
    idExp.value = dayjs(new Date(e.value)).format("YYYYMMDD");
  }else{
    legalreptIdExp.value = dayjs(new Date(e.value)).format("YYYYMMDD");
  }
}

/**
 * 上传身份证正面反面
 */
function onUploadPre() {
  uni.chooseMedia({
    count: 1,
    success: async function (res) {
      uni.showLoading({title: "上传中..."});
      idPortrait.value = await uploadFileRequest(res.tempFiles[0].tempFilePath);
      uni.hideLoading();
    },
  });
}

function onUploadBack() {
  uni.chooseMedia({
    count: 1,
    success: async function (res) {
      uni.showLoading({title: "上传中..."});
      idEmblem.value = await uploadFileRequest(res.tempFiles[0].tempFilePath);
      uni.hideLoading();
    },
  });
}

function onUploadLicense() {
  uni.chooseMedia({
    count: 1,
    success: async function (res) {
      uni.showLoading({title: "上传中..."});
      unifiedCodeUrl.value = await uploadFileRequest(
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
async function onSubmit() {
  //   if(isLongTerm.value){
  //       identityExpire.value = null;
  //   }
  //   await storeApi.postMerchantBase({
  //       bankNo: bankNo.value,
  //       bankPhone: bankPhone.value,
  //       identityAddress: storeInfo.address,
  //       identityBack: identityBack.value,
  //       identityExpire: identityExpire.value,
  //       identityFront: identityFront.value,
  //       identityNumber: identityNumber.value,
  //       identityOccupation: '18',
  //       isLongTerm: isLongTerm.value,
  //       merchantName: merchantName.value,
  //       merchantPhone: merchantPhone.value,
  //       merchantType: 'STORE',
  //       sourceId: storeInfo.id
  //   })
  //   uni.showToast({title: '提交成功！'})
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
    padding: 0px 40rpx;
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
      &-card {
        display: flex;
        flex: 1;
      }
      &-license {
        width: 324rpx !important;
        height: 228rpx;
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