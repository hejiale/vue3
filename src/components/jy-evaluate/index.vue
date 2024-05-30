<template>
  <div>
    <div
      class="evaluateBox"
      v-for="evaluate in evaluateList"
      :key="evaluate.id"
    >
      <image class="evaluateBox-avatar" :src="evaluate.avatar" />
      <div class="evaluateBox-infoBox">
        <span class="evaluateBox-infoBox-nickName">{{
          evaluate.nickName
        }}</span>
        <div class="evaluateBox-infoBox-time">
          {{ filters.formatDynamicPublishTime(evaluate.createdTime) }}
        </div>
        <div class="evaluateBox-infoBox-userBox">
          <span class="evaluateBox-infoBox-userBox-nickName">{{
            evaluate.nickName
          }}</span>
          <span>评价这部剧本：</span>
          <image
            :src="filters.icon(evaluate.dramaEvaluateType)"
            class="evaluateBox-infoBox-userBox-statusIcon"
          ></image>
          <span class="evaluateBox-infoBox-userBox-statusText">{{
            enums.EVALUATE_Type.getName(evaluate.dramaEvaluateType)
          }}</span>
        </div>
        <div class="evaluateBox-infoBox-description">
          <span :class="{hidden: !evaluate.isInfo}">{{
            evaluate.content
          }}</span>
          <div
            class="tips"
            v-if="evaluate.content && evaluate.content.length > 45"
            @click.stop="onExpand(evaluate)"
          >
            {{ evaluate.isInfo ? "收起" : "...全文" }}
          </div>
        </div>
        <jy-imageGrid :images="evaluate.imageList" size="25"></jy-imageGrid>
        <div
          class="evaluateBox-infoBox-roleStore"
          v-if="evaluate.roleName || evaluate.storeName"
        >
          <div
            class="evaluateBox-infoBox-roleStore-role"
            v-if="evaluate.roleName"
          >
            <image :src="filters.icon('icon-role-gray')"></image>
            <span class="evaluateBox-infoBox-roleStore-role-value"
              >体验角色：{{ evaluate.roleName }}</span
            >
          </div>
          <div
            class="evaluateBox-infoBox-roleStore-store"
            v-if="evaluate.storeName"
          >
            <image :src="filters.icon('icon-store-gray')"></image>
            <span class="evaluateBox-infoBox-roleStore-role-value">{{
              evaluate.storeName
            }}</span>
          </div>
        </div>
        <div class="evaluateBox-infoBox-dramaBox">
          <image
            class="evaluateBox-infoBox-dramaBox-cover"
            :src="evaluate.dramaItem.dramaCover"
            mode="aspectFill"
          ></image>
          <span class="evaluateBox-infoBox-dramaBox-name">{{
            evaluate.dramaItem.dramaName
          }}</span>
          <div class="evaluateBox-infoBox-dramaBox-dictValue">
            <span
              >{{ evaluate.dramaItem.maleGamerNum }}男{{
                evaluate.dramaItem.femaleGamerNum
              }}女 {{ evaluate.dramaItem.gameTime }}小时</span
            >
            <div class="line"></div>
            <span>{{
              filters.doCalculateDramaDicts(evaluate.dramaItem.dicts)
            }}</span>
          </div>
          <image
            :src="filters.icon('hasWantPlay')"
            class="unWantIcon"
            v-if="evaluate.playStatus === 'WANT_PLAY'"
            @click.stop="onChangePlayStatus(evaluate)"
          ></image>
          <image
            :src="filters.icon('icon-unWantPlay')"
            class="unWantIcon"
            @click.stop="onChangePlayStatus(evaluate)"
            v-else
          ></image>
        </div>
        <div class="evaluateBox-infoBox-bottomBox">
          <div class="evaluateBox-infoBox-bottomBox-sayBox">说说你的想法…</div>
          <div class="evaluateBox-infoBox-bottomBox-rightBox">
            <div class="evaluateBox-infoBox-bottomBox-rightBox-shareBox ml16">
              <image
                :src="filters.icon('icon-share-gray')"
                class="evaluateBox-infoBox-bottomBox-rightBox-shareBox-icon"
              ></image>
              <span class="evaluateBox-infoBox-bottomBox-rightBox-shareBox-value"
                >分享</span
              >
            </div>
            <div class="evaluateBox-infoBox-bottomBox-rightBox-shareBox ml24" @click.stop="onPraise(evaluate)">
              <image
                :src="filters.icon('icon-like')"
                class="evaluateBox-infoBox-bottomBox-rightBox-shareBox-icon"
                v-if="evaluate.hasFabulous"
              ></image>
              <image
                :src="filters.icon('icon-unLike')"
                class="evaluateBox-infoBox-bottomBox-rightBox-shareBox-icon"
                v-else
              ></image>
              <span class="evaluateBox-infoBox-bottomBox-rightBox-shareBox-value">{{ filters.formatNum(evaluate.praiseQuantity || 0) }}</span>
            </div>
            <div class="evaluateBox-infoBox-bottomBox-rightBox-shareBox ml24">
              <image
                :src="filters.icon('icon-evaluate-gray')"
                class="evaluateBox-infoBox-bottomBox-rightBox-shareBox-icon"
              ></image>
              <span class="evaluateBox-infoBox-bottomBox-rightBox-shareBox-value"
                >{{ filters.formatNum(evaluate.shareQuantity || 0) }}</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="evaluateBox-moreBox">
        <image :src="filters.icon('icon-more-gray')"></image>
      </div>
    </div>
    <div class="emptyBox"></div>
  </div>
</template>
<script setup lang="ts">
const { filters, enums, api, useUser } = useInstance();

const userInfo:any = reactive({})

const props = defineProps({
  /**
   * 剧评列表
   */
  evaluateList: {
    type: Array<any>,
    default: () => [],
  },
});

onMounted(async () => {
  let res = await useUser.getUserInfo();
  Object.assign(userInfo, res);
});


//文章的收起展开
function onExpand(e: any) {
  e.isInfo = !e.isInfo;
}

//切换想玩已玩
async function onChangePlayStatus(evaluate: any) {
  if(evaluate.playStatus === 'WANT_PLAY'){
    await api.cancelUserDramaPlayMP({
      playStatus: null,
      userId: userInfo.id,
      dramaId: evaluate.dramaItem.id
    })
    evaluate.playStatus = null;
  }else{
    await api.updateUserDramaPlayMP({
      playStatus: 'WANT_PLAY',
      userId: userInfo.id,
      dramaId: evaluate.dramaItem.id 
    })
    evaluate.playStatus = 'WANT_PLAY';
  }
}

//点赞
async function onPraise(evaluate: any) {
  await api.userPraiseDynamic({
    dynamicType: 3,
    statusEnum: evaluate.hasFabulous ? 'DISABLE': 'ENABLE',
    dynamicId: evaluate.id
  })
  
  evaluate.hasFabulous ? evaluate.praiseQuantity-- : evaluate.praiseQuantity++;
  evaluate.hasFabulous = !evaluate.hasFabulous;
}

</script>
  <style lang="scss" scoped>
.evaluateBox {
  position: relative;
  padding-top: 36rpx;
  @include hor;
  &-avatar {
    margin-left: 32rpx;
    @include circle(80rpx);
    background: rgba($color: #dad9dc, $alpha: 0.4);
  }
  &-infoBox {
    @include ver;
    margin-left: 12rpx;
    width: 80vw;
    &-nickName {
      @include text-bold(30rpx, #2e323e);
      line-height: 36rpx;
    }
    &-time {
      margin-top: 10rpx;
      @include text-normal(22rpx, #959aa5);
    }
    &-description {
      @include text-normal(28rpx, #2e323e);
      margin-bottom: 10rpx;
      position: relative;
      margin-top: 18rpx;
      .hidden {
        @include text-overflow-line(2);
      }
      .tips {
        width: 90rpx;
        height: 40rpx;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        color: #4876ae;
        background: #ffffff;
        position: absolute;
        bottom: -4rpx;
        right: 4rpx;
        &.expand {
          position: initial;
          width: auto;
          display: flex;
          flex: 1;
          justify-content: flex-end;
        }
      }
    }
    &-roleStore {
      margin-top: 18rpx;
      @include hor;
      align-items: center;
      &-role,
      &-store {
        background: #ffffff;
        border-radius: 23rpx;
        border: 1rpx solid #cdd1d5;
        padding: 0 10rpx;
        height: 48rpx;
        min-width: 20vw;
        max-width: 45vw;
        @include hor-center;
        image {
          width: 28rpx;
          height: 28rpx;
        }
        &-value {
          margin-left: 6rpx;
          @include text-middle(22rpx, #5f6572);
          @include text-overflow-line(1);
        }
      }
      &-role {
        margin-right: 36rpx;
      }
    }
    &-dramaBox {
      margin-top: 18rpx;
      width: 594rpx;
      height: 128rpx;
      background: #f5f6f8;
      border-radius: 12rpx;
      position: relative;
      &-cover {
        width: 96rpx;
        height: 100%;
        border-radius: 12rpx;
      }
      &-name {
        position: absolute;
        left: 108rpx;
        top: 24rpx;
        @include text-bold(28rpx, #2e323e);
        width: 50%;
        @include text-overflow-line(1);
      }
      &-dictValue {
        @include hor-center;
        position: absolute;
        left: 108rpx;
        top: 72rpx;
        @include text-normal(24rpx, #959aa5);
        .line {
          width: 2rpx;
          height: 22rpx;
          background: #d9d9d9;
          margin: 0 8rpx;
        }
      }
      .unWantIcon {
        position: absolute;
        right: 18rpx;
        top: 26rpx;
        width: 120rpx;
        height: 36rpx;
      }
    }
    &-bottomBox {
      margin-top: 28rpx;
      @include hor-between-center;
      &-sayBox {
        width: 202rpx;
        height: 54rpx;
        background: #f5f6f8;
        border-radius: 94rpx;
        @include text-normal(22rpx, #959aa5);
        @include hor-center-center;
      }
      &-rightBox{
        @include hor-center;
        margin-right: 10rpx;
        &-shareBox {
          @include hor-center;
          &-icon {
            width: 32rpx;
            height: 32rpx;
          }
          &-value {
            margin-left: 8rpx;
            @include text-middle(24rpx, #5f6572);
          }
        }
      }
    }
    &-userBox {
      margin-top: 12rpx;
      @include hor-center;
      @include text-normal(28rpx, #2e323e);
      &-nickName {
        max-width: 40vw;
        @include text-overflow-line(1);
      }
      &-statusIcon {
        width: 40rpx;
        height: 40rpx;
      }
      &-statusText {
        @include text-bold(28rpx, #2e323e);
      }
    }
  }
  &-moreBox {
    position: absolute;
    right: 0px;
    top: 36rpx;
    @include hor-center-center;
    padding: 20rpx 32rpx;
    image {
      width: 40rpx;
      height: 8rpx;
    }
  }
}
.emptyBox {
  height: 200rpx;
}
</style>