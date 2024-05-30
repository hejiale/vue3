<template>
  <div>
    <div class="authorizeButton" @click.stop="onAuthorize"></div>
    <u-popup :show="sureAuthorizePhone" :round="16">
      <view class="phone-popup" :style="{ 'padding-bottom': paddingBottom }">
        <view class="phone-popup__box">
          <view class="phone-popup__title mb12">欢迎登录剧游宝～</view>
          <view class="phone-popup__instruction">登录后享受更好的服务体验</view>
          <div class="phone-popup__noteBox">
            <div class="phone-popup__noteBox-item">
              <span class="phone-popup__noteBox-item-title"
                >● 获取您的手机号（获取您的账户信息）</span
              >
              <u-icon
                name="success"
                size="32rpx"
                color="#999999"
                v-if="isComplete"
              />
            </div>
          </div>
          <div class="mp-bottomBtn">
            <button
              open-type="getPhoneNumber"
              @getphonenumber="getPhoneNumber"
              class="authorPhoneButton"
            >
              <span>授权手机号码</span>
            </button>
          </div>
        </view>
      </view>
    </u-popup>
    <u-popup :show="sureAuthorizeName" :round="16">
      <view class="name-popup" :style="{ 'padding-bottom': paddingBottom }">
        <view class="name-popup__box">
          <span class="name-popup__box-title">获取您的昵称和头像</span>
          <span class="name-popup__box-note"
            >为了方便让朋友们识别您的身份，请授权您的头像和昵称</span
          >
          <u-cell class="name-popup__box_cell">
            <template v-slot:title>
              <span class="name-popup__box_cell-title">头像</span>
            </template>
            <template #right-icon>
              <div class="name-popup__box_cell-right">
                <img
                  :src="uploadData || filters.icon('default_head')"
                  class="name-popup__box_cell-right_photo-image"
                  mode="aspectFill"
                />
                <button
                  open-type="chooseAvatar"
                  @chooseavatar="chooseavatar"
                  class="name-popup__box_cell-right-button"
                ></button>
              </div>
            </template>
          </u-cell>
          <u-cell class="name-popup__box_cell">
            <template v-slot:title>
              <span class="name-popup__box_cell-title">昵称</span>
            </template>
            <template #right-icon>
              <input
                v-model="inputValue"
                placeholder="请输入昵称"
                :maxlength="32"
                class="name-popup__box_cell-input"
              />
            </template>
          </u-cell>
        </view>
        <div class="name-popup-memo">昵称限1-32个字符，一个汉字为2个字符</div>
        <div class="name-popup-bottomBox" v-if="canReject">
          <div class="name-popup-bottomBox-reject" @click="onReject">拒绝</div>
          <div class="name-popup-bottomBox-allow" @click="onSubmit">允许</div>
        </div>
        <div class="name-popup-bottomBox" v-else>
          <div class="name-popup-bottomBox-allowOnly" @click="onSubmit">
            允许
          </div>
        </div>
      </view>
    </u-popup>
  </div>
</template>
<script lang="ts" setup>
const { api, useUser, uploadFile, filters } = useInstance();

const emits = defineEmits(["on-show-authorize", "on-success-authorize"]);

const props = defineProps({
  paddingBottom: {
    type: String,
    default: "40rpx",
  },
  canReject: {
    type: Boolean,
    default: true,
  },
});

let sureAuthorizePhone = ref(false);
let sureAuthorizeName = ref(false);
let isComplete = ref(false);
let uploadData = ref();
let inputValue = ref();
let userInfo: any = reactive({});


async function onAuthorize() {
  let data: any = await useUser.getUserInfo();
  uploadData.value = data.avatar;
  inputValue.value = data.nickName;
  Object.assign(userInfo, data);

  emits("on-show-authorize", true);
  sureAuthorizeName.value = true;
}
//暂不授权
function onReject() {
  emits("on-show-authorize", false);
  sureAuthorizeName.value = false;
}
//授权手机号
async function getPhoneNumber(e: any) {
  if (!e.detail.code) {
    uni.showToast({
      title: "授权失败，请重试！",
      icon: "none",
    });
    return;
  }
  uni.showLoading({
    title: "授权中...",
  });

  try {
    let res: any = await api.mpBindPhone({
      code: e.detail.code,
      userId: userInfo.id,
    });

    isComplete.value = true;
    sureAuthorizePhone.value = false;
    //重置token
    uni.setStorageSync("SID", JSON.stringify(res.saTokenInfo));
    emits("on-success-authorize");
    emits("on-show-authorize", false);

    uni.showToast({
      title: "授权成功！",
      icon: "none",
    });
  } catch (e) {
    uni.showToast({
      title: "授权失败，请重试！",
      icon: "none",
    });
  }
}
//授权个人信息
function chooseavatar(e: any) {
  onUploadFile(e.detail.avatarUrl);
}
//保存昵称头像
async function onSubmit() {
  if (!uploadData.value) {
    uni.showToast({
      title: "请上传头像！",
      icon: "none",
    });
    return;
  }
  if (!inputValue.value) {
    uni.showToast({
      title: "请填写昵称！",
      icon: "none",
    });
    return;
  }
  try {
    await api.saveAppUserEditInfo({
      avatar: uploadData.value /*昵称*/,
      nickName: inputValue.value /*头像*/,
      id: userInfo.id,
      dataSource: "SAAS_MP",
    });
    uni.showToast({
      title: "授权信息成功！",
    });

    setTimeout(() => {
      sureAuthorizeName.value = false;
      sureAuthorizePhone.value = true;
    }, 1000);
  } catch (e) {}
}
function onUploadFile(url: any) {
  uni.showLoading({ title: "上传中" });

  uploadFile(url).then((e) => {
    uploadData.value = e;
    uni.hideLoading();
  });
}
</script>
<style lang="scss" scoped>
.phone-popup {
  @include ver-center;
  margin-top: rpx(47);
  padding-top: 32rpx;
  width: 100%;
  &__box {
    width: 80%;
  }
  &__title {
    font-weight: bold;
    font-size: 40rpx;
    color: #363434;
  }
  &__instruction {
    font-size: 24rpx;
    color: #666;
  }
  &__btn {
    position: relative;
    bottom: 0;
    margin-top: rpx(28);
  }
  .mp-bottomBtn {
    @include hor-center-center;
    width: 550rpx;
    height: 96rpx;
    border-radius: 80rpx;
    font-size: 32rpx;
    color: #fff;
    background-color: #000;
    box-shadow: 0 rpx(8) rpx(9) 0 rgba(128, 128, 128, 0.25);
    overflow: hidden;
    margin-top: 32rpx;
    .authorPhoneButton {
      background: unset !important;
      color: #fff !important;
      font-size: 32rpx;
    }
  }
  &__noteBox {
    margin-top: 40rpx;
    &-item {
      @include hor;
      align-items: center;
      margin-top: 12rpx;
      // margin-left: 10%;
      &-title {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}

.name-popup {
  @include ver;
  padding: 0px 32rpx;
  &__box {
    @include ver;
    &-title {
      font-weight: bold;
      font-size: 30rpx;
      color: #363434;
      margin: 60rpx 0 0 0rpx;
    }
    &-note {
      font-size: 20rpx;
      color: #999;
      margin: 20rpx 0 0 0rpx;
    }
    &_cell {
      margin-left: 60rpx;
      position: relative;
      &-title {
        font-size: 26rpx;
        color: #999;
        margin-left: -30rpx;
      }
      &-right {
        position: relative;
        &_photo-image {
          width: 80rpx;
          height: 80rpx;
          border-radius: 80rpx;
        }
        &-button {
          @include abs-center;
          background: unset !important;
        }
      }
      &-input {
        font-weight: 400;
        text-align: right;
        font-size: 26rpx;
      }
    }
  }
  &-memo {
    font-size: 20rpx;
    margin: 16rpx 0 0 0rpx;
    color: #999;
  }
  &-bottomBox {
    margin-top: 80rpx;
    @include hor-center-center;
    &-reject {
      width: 35%;
      height: 80rpx;
      @include hor-center-center;
      color: #fff;
      background: #ccc;
      border-radius: 80rpx;
      font-size: 26rpx;
      font-weight: 400;
    }
    &-allow {
      margin-left: 10%;
      width: 35%;
      height: 80rpx;
      @include hor-center-center;
      color: #fff;
      background: linear-gradient(150deg, #1ee9c4 0%, #14c9c9 100%);
      border-radius: 80rpx;
      font-size: 26rpx;
      font-weight: 400;
    }
    &-allowOnly {
      width: 80%;
      height: 80rpx;
      @include hor-center-center;
      color: #fff;
      background: linear-gradient(150deg, #1ee9c4 0%, #14c9c9 100%);
      border-radius: 80rpx;
      font-size: 26rpx;
      font-weight: 400;
    }
  }
}
.authorizeButton {
  @include abs-center;
  z-index: 10;
}
button::after {
  border: none !important;
}
</style>
  