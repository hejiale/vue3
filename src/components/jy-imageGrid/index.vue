<template>
  <div class="image-grid">
    <div
      class="singleImageBox"
      v-if="images.length === 1"
      @click.stop="onPreView(0)"
    >
      <image
        :src="images[0]"
        v-if="isImage(images[0])"
        :class="isPortrait ? 'portrait' : 'land'"
        mode="aspectFill"
      />
      <image
        :src="videoPoster(images[0])"
        mode="aspectFill"
        v-else
        :class="isPortrait ? 'portrait' : 'land'"
      />
    </div>
    <div class="imageListBox-two" v-if="images.length === 2">
      <div
        v-for="(v, idx) in images"
        :key="idx"
        :style="gridStyle(idx)"
        class="imageListBox-two-grid"
      >
        <image
          :src="v"
          mode="aspectFill"
          @click.stop="onPreView(idx)"
          v-if="isImage(v)"
        />
        <image
          :src="videoPoster(v)"
          mode="aspectFill"
          @click.stop="onPreView(idx)"
          v-else
        />
      </div>
    </div>
    <div class="imageListBox-three" v-if="images.length === 3">
      <div
        v-for="(v, idx) in images"
        :key="idx"
        :style="gridStyle(idx)"
        class="imageListBox-three-grid"
      >
        <image
          :src="v"
          mode="aspectFill"
          @click.stop="onPreView(idx)"
          v-if="isImage(v)"
        />
        <image
          :src="videoPoster(v)"
          mode="aspectFill"
          @click.stop="onPreView(idx)"
          v-else
        />
      </div>
    </div>
    <div class="imagesBoxFour" v-if="images.length === 4">
      <div v-for="(v, idx) in images" :key="idx" class="imagesBoxFour-grid">
        <image
          :src="v"
          mode="aspectFill"
          @click.stop="onPreView(idx)"
          v-if="isImage(v)"
        />
        <image
          :src="videoPoster(v)"
          mode="aspectFill"
          @click.stop="onPreView(idx)"
          v-else
        />
      </div>
    </div>
    <div
      class="imageListBox-six"
      v-if="images.length > 4 && images.length <= 6"
    >
      <div
        v-for="(v, idx) in images"
        :key="idx"
        @click.stop="onPreView(idx)"
        class="imageListBox-six-grid"
        :style="gridStyle(idx)"
      >
        <image :src="v" mode="aspectFill" v-if="isImage(v)" />
        <image :src="videoPoster(v)" mode="aspectFill" v-else />
      </div>
    </div>
    <div class="imageListBox-more" v-if="images.length > 6">
      <div
        v-for="(v, idx) in images"
        :key="v.id"
        @click.stop="onPreView(idx)"
        class="imageListBox-more-grid"
        :style="gridStyle(idx)"
      >
        <image :src="v" mode="aspectFill" v-if="isImage(v)" />
        <image :src="videoPoster(v)" mode="aspectFill" v-else />
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
const { judgeMediaType, getVideoSize, getImageSize } = useInstance();

let isPortrait = ref(false);

const props = defineProps({
  images: {
    type: Array<any>,
    default: () => [],
  },
  size: {
    type: String,
    default: '',
  },
});

const isImage = computed(() => (v: any) => {
  return judgeMediaType(v) === "image";
});

const videoPoster = computed(() => (url: any) => {
  return `${url}?x-oss-process=video/snapshot,t_1000,m_fast`;
});

const gridStyle = computed(() => (idx: number) => {
  return `margin-right: ${idx === 2 || idx === 5 || idx === 8 ? 0 : 3}px; width: ${props.size}vw; height: ${props.size}vw`;
});

onMounted(async () => {
  judgeIsPortrait();
})

async function judgeIsPortrait() {
  if (props.images.length === 1) {
    //判断图片是否竖向
    let url = props.images[0];
    if (judgeMediaType(url) === "video") {
      let info: any = await getVideoSize(url);
      isPortrait.value = parseFloat(info.videoWidth) < parseFloat(info.videoHeight);
    } else {
      let info: any = await getImageSize(url);
      isPortrait.value = parseFloat(info.ImageWidth.value) < parseFloat(info.ImageHeight.value);
    }
  }
}
/**
 * 图片预览
 * @param current 
 */
function onPreView(current: number) {
  uni.setStorageSync('isPrview', true);

  let sources:any = [];
  props.images.map((v:any) => {
    sources.push({
      url: v,
      type: judgeMediaType(v) === "image" ? "image" : "video",
      poster: judgeMediaType(v) === "video" ? `${v}?x-oss-process=video/snapshot,t_1000,m_fast`: null,
    });
  });
  uni.previewMedia({
    current,
    sources,
  });
}
</script>
  
<style lang="scss" scoped>
.image-grid {
  .singleImageBox {
    .land {
      width: 60vw;
      height: 60vw;
      border-radius: 24rpx;
    }
    .portrait {
      width: 52.53vw;
      height: 36.57vh;
      border-radius: 24rpx;
    }
  }
  .imageListBox-two {
    white-space: nowrap;
    &-grid {
      margin-right: 6rpx;
      overflow: hidden;
      display: inline-block;
    }
    &-grid:nth-child(1) {
      border-top-left-radius: 24rpx;
      border-bottom-left-radius: 24rpx;
    }
    &-grid:nth-child(2) {
      border-top-right-radius: 24rpx;
      border-bottom-right-radius: 24rpx;
    }
  }
  .imageListBox-three {
    white-space: nowrap;
    &-grid {
      overflow: hidden;
      display: inline-block;
    }
    &-grid:nth-child(1) {
      border-top-left-radius: 32rpx;
      border-bottom-left-radius: 32rpx;
    }
    &-grid:nth-child(3) {
      border-top-right-radius: 32rpx;
      border-bottom-right-radius: 32rpx;
    }
  }
  .imagesBoxFour {
    width: 54vw;
    &-grid {
      width: 25.86vw;
      height: 25.86vw;
      margin-right: 6rpx;
      overflow: hidden;
      display: inline-block;
    }
    &-grid:nth-child(1) {
      border-top-left-radius: 24rpx;
    }
    &-grid:nth-child(2) {
      border-top-right-radius: 24rpx;
    }
    &-grid:nth-child(3) {
      border-bottom-left-radius: 24rpx;
    }
    &-grid:nth-child(4) {
      border-bottom-right-radius: 24rpx;
    }
  }
  .imageListBox-six {
    &-grid {
      display: inline-block;
      overflow: hidden;
    }
    &-grid:nth-child(1) {
      border-top-left-radius: 12rpx;
    }
    &-grid:nth-child(3) {
      border-top-right-radius: 12rpx;
    }
    &-grid:nth-child(4) {
      border-bottom-left-radius: 12rpx;
    }
    &-grid:nth-child(6) {
      border-bottom-right-radius: 12rpx;
    }
  }
  .imageListBox-more {
    &-grid {
      display: inline-block;
      overflow: hidden;
    }
    &-grid:nth-child(1) {
      border-top-left-radius: 12rpx;
    }
    &-grid:nth-child(3) {
      border-top-right-radius: 12rpx;
    }
    &-grid:nth-child(7) {
      border-bottom-left-radius: 12rpx;
    }
    &-grid:nth-child(9) {
      border-bottom-right-radius: 12rpx;
    }
  }
}
</style>
  