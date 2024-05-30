<template>
  <div class="container">
    <jy-navigationBar>
      <template v-slot:content>
        <div>
          <image
            :src="filters.icon('store-back')"
            class="backBox"
            @click="onBack"
          ></image>
          <div class="titleBox">
            <div class="titleBox-title">
              门店相册 ({{ storeInfo.imageList ? storeInfo.imageList.length: 0 }})
            </div>
            <div class="titleBox-storeName">{{ storeInfo.storeName }}</div>
          </div>
        </div>
      </template>
    </jy-navigationBar>
    <scroll-view
      scroll-y
      class="container-listBox"
      v-if="storeInfo.imageList && storeInfo.imageList.length"
    >
      <div
        class="container-listBox-item"
        v-for="(v, idx) in storeInfo.imageList"
        :key="v.id"
        @click="onPreView(idx)"
      >
        <image :src="v.fileUrl" mode="aspectFill" v-if="isImage(v.fileUrl)" />
        <image
          :src="v.fileUrl + '?x-oss-process=video/snapshot,t_1000,m_fast'"
          mode="aspectFill"
          v-else
        />
        <image
          src="../static/image/icon-play.png"
          class="container-listBox-item-playIcon"
          v-if="!isImage(v.fileUrl)"
        />
      </div>
      <jy-noMore></jy-noMore>
    </scroll-view>
    <jy-noData v-else title="店铺暂无相册" bgUrl=""></jy-noData>
  </div>
</template>
<script setup lang="ts">
const { judgeMediaType, filters } = useInstance();
//店铺信息
let storeInfo: any = reactive({});

onLoad(async () => {
  Object.assign(storeInfo, JSON.parse(uni.getStorageSync("store-detail")));
  uni.removeStorageSync('store-detail');
});

const isImage = computed(() => (v: any) => {
  if (v) {
    if (judgeMediaType(v) === "image") {
      return true;
    }
    return false;
  }
});

function onBack() {
  uni.navigateBack();
}
//预览
function onPreView(index: number) {
  let sources: Array<any> = [];
  storeInfo.imageList.map((v: any) => {
    sources.push({
      url: v.fileUrl,
      type: judgeMediaType(v.fileUrl) === "image" ? "image" : "video",
      poster:
        judgeMediaType(v.fileUrl) === "video"
          ? `${v.fileUrl}?x-oss-process=video/snapshot,t_1000,m_fast`
          : null,
    });
  });
  uni.previewMedia({
    current: index,
    sources,
  });
}
</script>
<style lang="scss" scoped>
.container {
  .backBox {
    position: absolute;
    left: 24rpx;
    width: 36rpx;
    height: 36rpx;
    z-index: 1;
  }
  .titleBox {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    @include ver;
    align-items: center;
    &-title {
      @include text-middle(32rpx, #2e323e);
      line-height: 38rpx;
    }
    &-storeName {
      margin-top: 10rpx;
      @include text-normal(24rpx, #959aa5);
      line-height: 28rpx;
      @include text-overflow-line(1);
    }
  }
  &-listBox {
    position: fixed;
    left: 24rpx;
    right: 24rpx;
    bottom: 0;
    top: 12.2vh;
    &-item {
      display: inline-block;
      width: 45.6vw;
      height: 45.6vw;
      margin-right: 18rpx;
      margin-bottom: 12rpx;
      border-radius: 12rpx;
      overflow: hidden;
      position: relative;
      &-playIcon {
        width: 72rpx;
        height: 72rpx;
        position: absolute;
        left: calc(50% - 36rpx);
        top: calc(50% - 36rpx);
      }
    }
  }
}
</style>