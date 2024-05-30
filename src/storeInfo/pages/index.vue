<template>
  <div class="container">
    <div class="container-cover"></div>
    <div class="container-bg"></div>
    <jy-navigationBar>
      <template v-slot:content>
        <div class="topBar">
          <image :src="filters.icon('store-back')" class="topBar-back"></image>
          <span class="topBar-title">店铺信息</span>
        </div>
      </template>
    </jy-navigationBar>
    <span class="container-title">店铺基础信息将在首页上展示</span>
    <scroll-view class="container-content" scroll-y>
      <div class="container-content-locationBox">
        <div class="cell border-bottom" @click="onUploadImage(false)">
          <span class="cell-requireTitle">门店logo</span>
          <image
            :src="form.storeLogo"
            class="cell-logoBox"
            v-if="form.storeLogo"
            mode="aspectFill"
          ></image>
          <image
            :src="filters.icon('icon-uploadImg')"
            class="cell-uploadBox"
            v-else
          ></image>
        </div>
        <div class="cell border-bottom" @click="onGoEdit('storeName', form.storeName)">
          <span class="cell-requireTitle">门店名称</span>
          <div class="cell-right">
            <input
              placeholder="请输入您的店铺名称"
              class="cell-right-field"
              placeholder-class="placeholderClass"
              maxlength="20"
              disabled
              v-model="form.storeName"
            />
            <image
              :src="filters.icon('sass_right_arrow')"
              class="cell-right-arrow"
            ></image>
          </div>
        </div>
        <div class="cell border-bottom" @click="onGoEdit('storeLocation',form.address)">
          <span class="cell-requireTitle">门店定位</span>
          <div class="cell-right">
            <input
              placeholder="点击获取定位地址"
              class="cell-right-field"
              placeholder-class="placeholderClass"
              maxlength="20"
              disabled
              v-model="form.address"
            />
            <image
              :src="filters.icon('sass_right_arrow')"
              class="cell-right-arrow"
            ></image>
          </div>
        </div>
        <div class="cell" @click="onGoEdit('storeDoor',form.storeAddress)">
          <span class="cell-title">门牌号</span>
          <div class="cell-right">
            <input
              v-model="form.storeAddress"
              placeholder="请输入门店门牌号"
              class="cell-right-field"
              placeholder-class="placeholderClass"
              maxlength="20"
              disabled
            />
            <image
              :src="filters.icon('sass_right_arrow')"
              class="cell-right-arrow"
            ></image>
          </div>
        </div>
      </div>
      <div class="container-content-title">
        联系方式将在店铺上显示，请确保店铺联系方式正确，否 则您的客户无法联系您
      </div>
      <div class="container-content-telBox">
        <div class="cell border-bottom" @click="onGoEdit('storePhone',form.telephone)">
          <span class="cell-requireTitle">门店电话</span>
          <div class="cell-right">
            <input
              v-model="form.telephone"
              placeholder="请输入门店电话"
              class="cell-right-field"
              placeholder-class="placeholderClass"
              maxlength="20"
              disabled
            />
            <image
              :src="filters.icon('sass_right_arrow')"
              class="cell-right-arrow"
            ></image>
          </div>
        </div>
        <div class="cell" @click="onGoEdit('storeWechat',form.wxNumber)">
          <span class="cell-requireTitle">门店微信</span>
          <div class="cell-right">
            <input
              v-model="form.wxNumber"
              placeholder="请输入店铺微信"
              class="cell-right-field"
              placeholder-class="placeholderClass"
              maxlength="20"
              disabled
            />
            <image
              :src="filters.icon('sass_right_arrow')"
              class="cell-right-arrow"
            ></image>
          </div>
        </div>
      </div>
      <div class="container-content-title">可介绍展示您的门店，吸引顾客</div>
      <div class="container-content-imageListBox">
        <div class="uploadCell border-bottom">
          <span class="uploadCell-title">照片墙</span>
          <div class="uploadCell-imageListBox">
            <image
              :src="filters.icon('icon-uploadImg')"
              class="uploadCell-imageListBox-item"
              mode="aspectFill"
              @click="onUploadImage(true)"
            ></image>
            <image
              :src="url"
              class="uploadCell-imageListBox-item"
              v-for="url in form.imageList"
              :key="url"
            ></image>
          </div>
        </div>
        <div class="cell" @click="onGoEdit('storeDesc',form.storeDescription)">
          <span class="cell-requireTitle">店铺简介</span>
          <div class="cell-right">
            <input
              v-model="form.storeDescription"
              placeholder="请输入店铺简介"
              class="cell-right-field"
              placeholder-class="placeholderClass"
              maxlength="20"
              disabled
            />
            <image
              :src="filters.icon('sass_right_arrow')"
              class="cell-right-arrow"
            ></image>
          </div>
        </div>
      </div>
      <div style="height: 236rpx"></div>
    </scroll-view>
    <div class="container-bottomBox">
      <div class="container-bottomBox-saveButton" @click="onSave">保存</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const {
  api,
  sassApi,
  useUser,
  getColor,
  requestAuthorize,
  filters,
  uploadFile,
  menuButtonRect,
} = useInstance();

let form: any = reactive({
  storeLogo: null,
  storeName: null,
  latitude: null,
  longitude: null,
  address: null,
  storeAddress: null,
  wxNumber: null,
  telephone: null,
  imageList: [],
  storeDescription: null,
  provinceId: null,
  cityId: null,
  districtId: null,
});

let storeId = ref('');

onLoad(async () => {
  storeId.value = '10';
  await getStoreInfo();
});

onShow(() => {
  if (uni.getStorageSync("changeValue")) {
    changeEdit();
    uni.removeStorageSync("changeValue");
  }
});

function onGoEdit(type: string, value: string) {
  if (type === "storeLocation") {
    openLocation();
  } else {
    uni.navigateTo({
      url: `./edit?type=${type}&value=${value}`,
    });
  }
}

//打开定位
function openLocation() {
  uni.chooseLocation({
    latitude: uni.getStorageSync("latitude"),
    longitude: uni.getStorageSync("longitude"),
    success: (res) => {
      form.latitude = res.latitude;
      form.longitude = res.longitude;
      form.address = res.address;
      changeAreaId(res.latitude, res.longitude);
    },
  });
}
/**
 * 上传图片
 */
function onUploadImage(multiple: boolean) {
  let count = 1;

  if (multiple) {
    count = 6 - form.imageList.length;
  }

  if (count <= 0) {
    uni.showToast({
      title: "最多上传6张",
      icon: "none",
    });
    return;
  }

  uni.chooseMedia({
    count,
    success: async function (res) {
      uni.showLoading();

      let promiseArr = [];
      for (let i = 0; i < res.tempFiles.length; i++) {
        promiseArr.push(onUploadFile(res.tempFiles[i].tempFilePath, multiple));
      }
      Promise.all(promiseArr).then((_) => {
        uni.hideLoading();
      });
    },
  });
}
function onUploadFile(url: any, multiple: boolean) {
  return new Promise((resolve) => {
    uploadFile(url).then((e) => {
      if (multiple) {
        form.imageList.push(e);
      } else {
        form.storeLogo = e;
      }
      resolve("");
    });
  });
}
function changeEdit() {
  let res = uni.getStorageSync("changeValue");

  if (res.type === "storeName") {
    form.storeName = res.value;
  } else if (res.type === "storeDoor") {
    form.storeAddress = res.value;
  } else if (res.type === "storePhone") {
    form.telephone = res.value;
  } else if (res.type === "storeWechat") {
    form.wxNumber = res.value;
  } else if (res.type === "storeDesc") {
    form.storeDescription = res.value;
  }
}
//根据坐标转换省市区id
async function changeAreaId(latitude: any, longitude: any) {
  let data: any = await api.regionResolver({
    latitude,
    longitude,
  });
  form.provinceId = data.provinceId;
  form.cityId = data.cityId;
  form.districtId = data.districtId;
}
async function getStoreInfo() {
  let data:any = await api.queryStoreDetail({
    id: storeId.value,
  });
  data.imageList = data.imageList.map((it:any)=>it.fileUrl)

  Object.assign(form, data);
}
/**
 * 保存提交
 */
async function onSave(){
  await sassApi.updateMyStore({
    ...form,
    id: storeId.value
  })
  uni.showToast({title: '保存成功!'})

  setTimeout(()=>{
    uni.navigateBack()
  },1000)
}
</script>
<style>
.placeholderClass {
  font-size: 30rpx;
  color: #c6c7ca;
  font-weight: 400;
}
</style>
<style lang="scss" scoped>
.container {
  &-cover {
    @include fixed-center;
    background: #f5f9fb;
  }
  &-bg {
    width: 100vw;
    height: 320rpx;
    background: linear-gradient(
      180deg,
      #9effc8 0%,
      rgba(219, 249, 232, 0) 100%
    );
    opacity: 0.7;
  }
  &-title {
    position: fixed;
    left: 40rpx;
    top: 212rpx;
    @include text-normal(26rpx, #959aa5);
  }
  &-content {
    position: absolute;
    left: 10rpx;
    width: 730rpx;
    top: 272rpx;
    bottom: 0px;
    &-locationBox {
      background: #ffffff;
      border-radius: 32rpx 32rpx 32rpx 32rpx;
      padding: 0rpx 30rpx;
    }
    &-title {
      padding-top: 60rpx;
      padding-bottom: 24rpx;
      margin-left: 20rpx;
      width: 650rpx;
      @include text-normal(26rpx, #959aa5);
    }
    &-telBox {
      background: #ffffff;
      border-radius: 32rpx 32rpx 32rpx 32rpx;
      padding: 0rpx 30rpx;
    }
    &-imageListBox {
      background: #ffffff;
      border-radius: 32rpx 32rpx 32rpx 32rpx;
      padding: 0rpx 30rpx;
    }
  }
  &-bottomBox {
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 168rpx;
    background: #ffffff;
    box-shadow: 0rpx -2rpx 20rpx 0rpx rgba(0, 0, 0, 0.07);
    z-index: 10;
    &-saveButton {
      margin-left: 40rpx;
      width: 670rpx;
      height: 88rpx;
      background: #2e323e;
      border-radius: 24rpx;
      margin-top: 24rpx;
      @include text-middle(28rpx, #fff);
      @include hor-center-center;
    }
  }
}
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
.cell {
  @include hor-between-center;
  padding: 40rpx 0px;
  &-requireTitle,
  &-title {
    @include text-normal(30rpx, #5f6572);
  }
  &-requireTitle::before {
    content: "*";
    color: #f55353;
  }
  &-uploadBox {
    width: 140rpx;
    height: 140rpx;
  }
  &-logoBox {
    width: 140rpx;
    height: 140rpx;
    border-radius: 16rpx;
  }
  &-right {
    @include hor-center;
    &-field {
      text-align: right;
      margin-right: 8rpx;
      @include text-normal(30rpx, #2e323e);
    }
    &-arrow {
      width: 20rpx;
      height: 20rpx;
    }
  }
}
.uploadCell {
  @include ver;
  padding: 40rpx 0px;
  &-title {
    @include text-normal(30rpx, #5f6572);
  }
  &-title::before {
    content: "*";
    color: #f55353;
  }
  &-imageListBox {
    margin-top: 24rpx;
    white-space: nowrap;
    overflow-x: scroll;
    &-item {
      display: inline-block;
      width: 206rpx;
      height: 206rpx;
      margin-right: 12rpx;
      border-radius: 8rpx;
    }
  }
}
</style>