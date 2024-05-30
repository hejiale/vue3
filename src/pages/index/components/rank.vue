<template>
  <div class="rankBox">
    <div :style="{ background: bgColor }" class="rankBox-bg"></div>
    <div class="rankBox-TabBar" :style="{ background: bgColor }">
      <div
        class="rankBox-TabBar-menu"
        v-for="menu in menus"
        :key="menu"
        :class="{active: activeMenu === menu}"
        @click.stop="onChangeTab(menu)"
      >
        {{ menu }}
      </div>
    </div>
    <div class="rankBox-dramaBox" v-if="hotRankList.length">
      <div class="rankBox-dramaBox-firstBox">
        <div class="rankBox-dramaBox-firstBox-nameBox">
          <image
            :src="filters.icon('rank-top-one')"
            class="rankBox-dramaBox-firstBox-nameBox-tag"
          ></image>
          <div class="rankBox-dramaBox-firstBox-nameBox-name">
            <span>《</span>
            <span class="rankBox-dramaBox-firstBox-nameBox-name-value">{{
              hotRankList[0].dramaName
            }}</span>
            <span>》</span>
          </div>
        </div>
        <div class="rankBox-dramaBox-firstBox-value">
          {{ hotRankList[0].maleGamerNum }}男{{
            hotRankList[0].femaleGamerNum
          }}女 {{ hotRankList[0].gameTime }}小时
        </div>
        <div class="rankBox-dramaBox-firstBox-value">
          {{ filters.doCalculateDramaDicts(hotRankList[0].dramaThemeList) }}
        </div>
        <div class="rankBox-dramaBox-firstBox-subValue">
          作者：{{ filters.doCalculateDramaAuthors(hotRankList[0].authorItems) }}
        </div>
        <div class="rankBox-dramaBox-firstBox-subValue">
          发行：{{ filters.doCalculateDramaPublisher(hotRankList[0].publishers) }}
        </div>
        <div class="rankBox-dramaBox-firstBox-lineBox">
          <div class="rankBox-dramaBox-firstBox-lineBox-left"></div>
          <div class="rankBox-dramaBox-firstBox-lineBox-right"></div>
        </div>
        <div class="rankBox-dramaBox-firstBox-content">
          {{ hotRankList[0].contentStr }}
        </div>
      </div>
      <div class="rankBox-dramaBox-listBox">
        <div
          class="rankBox-dramaBox-listBox-item"
          v-for="(rank, idx) in rankList"
          :key="rank.id"
        >
          <image
            :src="filters.icon('rank-top-two')"
            class="rankBox-dramaBox-listBox-item-tag"
            v-if="idx === 0"
          ></image>
          <image
            :src="filters.icon('rank-top-three')"
            class="rankBox-dramaBox-listBox-item-tag"
            v-else-if="idx === 1"
          ></image>
          <span class="rankBox-dramaBox-listBox-item-num" v-else>{{
            filters.fillZero(idx + 2)
          }}</span>
          <div class="rankBox-dramaBox-listBox-item-coverBox">
            <image
            :src="rank.dramaCover"
            mode="aspectFill"
          ></image>
          <image class="rankBox-dramaBox-listBox-item-coverBox-sellType" :src="filters.icon(rank.sellType)"></image>
          </div>
          <div class="rankBox-dramaBox-listBox-item-infoBox">
            <div class="rankBox-dramaBox-listBox-item-infoBox-name">
              {{ rank.dramaName }}
            </div>
            <div
              class="rankBox-dramaBox-listBox-item-infoBox-dictValue"
              :style="{ color: bgColor }"
            >
              {{ filters.doCalculateDramaDicts(rank.dramaThemeList) }}
            </div>
            <div class="rankBox-dramaBox-listBox-item-infoBox-value">
              {{ rank.maleGamerNum }}男{{ rank.femaleGamerNum }}女
              {{ rank.gameTime }}小时
            </div>
            <div class="rankBox-dramaBox-listBox-item-infoBox-value">
              作者：{{ filters.doCalculateDramaAuthors(rank.authorItems) }}
            </div>
            <div class="rankBox-dramaBox-listBox-item-infoBox-value">
              发行：{{ filters.doCalculateDramaPublisher(rank.publishers) }}
            </div>
          </div>
        </div>
        <div style="height: 100px"></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const { filters } = useInstance();

let activeMenu = ref("30天热榜");

let menus: Array<string> = reactive([
  "30天热榜",
  "人气总榜",
  "口碑榜",
  "期待榜",
]);

const props = defineProps({
  /**
   * 背景色
   */
  bgColor: {
    type: String,
  },
  /**
   * 热门榜单
   */
  hotRankList: {
    type: Array<any>,
    default: () => [],
  },
});

const emmits = defineEmits(["changeTab"]);

const rankList = computed(() => {
  return props.hotRankList.splice(1, props.hotRankList.length - 1);
});

function onChangeTab(menu: string) {
  activeMenu.value = menu;
  emmits("changeTab", activeMenu.value);

  uni.pageScrollTo({
    scrollTop: 0,
  });
}
</script>
<style lang="scss" scoped>
.rankBox {
  height: 100vh;
  &-bg {
    @include fixed-center;
  }
  &-TabBar {
    position: fixed;
    left: 0px;
    right: 0px;
    top: 10vh;
    padding: 32rpx 30rpx 40rpx 30rpx;
    z-index: 1;
    @include hor-center;
    &-menu {
      padding: 10rpx 20rpx;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 60rpx;
      @include text-normal(24rpx, rgba(255, 255, 255, 0.8));
      margin-right: 30rpx;
    }
    .active {
      background: linear-gradient(76deg, #abfb50 9%, #36e4bb 100%);
      font-weight: 600;
      color: #232326;
    }
  }
  &-dramaBox {
    position: absolute;
    top: 17.5vh;
    width: 100vw;
    &-firstBox {
      @include ver;
      padding: 0 30rpx;
      &-nameBox {
        @include hor-center;
        margin-bottom: 14rpx;
        &-tag {
          width: 40rpx;
          height: 48rpx;
        }
        &-name {
          @include text-bold(36rpx, #fff);
          @include hor-center;
          &-value {
            @include text-overflow-line(1);
            width: 40vw;
          }
        }
      }
      &-value,
      &-subValue {
        margin-top: 6rpx;
        @include text-normal(24rpx, rgba(#fff, 0.8));
        @include text-overflow-line(1);
        width: 50vw;
      }
      &-subValue {
        color: rgba(#fff, 0.6);
      }
      &-lineBox {
        margin-top: 28rpx;
        @include hor-center;
        &-left {
          width: 24rpx;
          height: 2rpx;
          background: #ffffff;
          opacity: 0.4;
        }
        &-right {
          margin-left: 8rpx;
          width: 80rpx;
          height: 2rpx;
          background: #ffffff;
          border-radius: 0rpx 0rpx 0rpx 0rpx;
          opacity: 0.4;
        }
      }
      &-content {
        margin-top: 26rpx;
        @include text-normal(24rpx, rgba(#fff, 0.6));
        width: 55vw;
        @include text-overflow-line(3);
      }
    }
    &-listBox {
      background: #ffffff;
      border-radius: 32rpx 32rpx 0px 0px;
      margin-top: 60rpx;
      padding-top: 20rpx;
      &-item {
        @include hor-center;
        padding-top: 42rpx;
        &-tag {
          width: 40rpx;
          height: 48rpx;
          margin-left: 30rpx;
        }
        &-num {
          margin-left: 32rpx;
          @include text-bold(28rpx, #5f6572);
          width: 40rpx;
          text-align: center;
        }
        &-coverBox {
          margin-left: 30rpx;
          width: 168rpx;
          height: 224rpx;
          border-radius: 12rpx;
          position: relative;
          overflow: hidden;
          &-sellType{
            position: absolute;
            right: 8rpx;
            top: 8rpx;
            width: 60rpx;
            height: 32rpx;
          }
        }
        &-infoBox {
          @include ver;
          margin-left: 26rpx;
          flex: 1;
          transform: translateY(-16rpx);
          &-name {
            @include text-bold(32rpx, #2e323e);
            @include text-overflow-line(1);
          }
          &-dictValue {
            margin-top: 14rpx;
            @include text-normal(24rpx, #000);
            @include text-overflow-line(1);
          }
          &-value {
            @include text-normal(24rpx, #5f6572);
            @include text-overflow-line(1);
            width: 90%;
            margin-top: 8rpx;
          }
        }
      }
    }
  }
}
</style>