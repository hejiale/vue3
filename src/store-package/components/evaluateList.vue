<template>
  <div class="evaluateBox" @click.stop="onGoEvaluateDetail">
    <div class="evaluateBox-head">
      <image :src="parama.avatar" mode="aspectFill" @click.stop="onGoPersonal"/>
      <div v-if="parama.userId !== userInfo.id" @click.stop="onFocus">
        <div class="evaluateBox-head-hasFocus" v-if="parama.focusId">
          已关注
        </div>
        <div class="evaluateBox-head-focus" v-else>+</div>
      </div>
    </div>
    <div class="evaluateBox-contentBox">
      <div class="evaluateBox-contentBox-title">
        {{ parama.nickName || "" }}
      </div>
      <div class="evaluateBox-contentBox-starBox">
        <image
          :src="filters.icon('store-star')"
          class="evaluateBox-contentBox-starBox-star"
        />
        <span class="evaluateBox-contentBox-starBox-score">{{
          parama.comprehensiveScore
        }}</span>
        <div class="evaluateBox-contentBox-starBox-values">
          环境: {{ parama.environmentScore }}
        </div>
        <div class="evaluateBox-contentBox-starBox-values">
          服务: {{ parama.serviceScore }}
        </div>
        <div class="evaluateBox-contentBox-starBox-values">
          DM: {{ parama.dmScore }}
        </div>
      </div>
      <div class="evaluateBox-contentBox-evaluateBox">
        <span class="evaluateBox-contentBox-evaluateBox-nickName">{{
          parama.nickName || ""
        }}</span>
        <span>评价这家店铺：</span>
        <image :src="filters.icon(parama.summarizeEvaluate)" />
        <span class="evaluateBox-contentBox-evaluateBox-value">{{
          enums.EVALUATE_Type.getName(parama.summarizeEvaluate)
        }}</span>
      </div>
      <div
        class="evaluateBox-contentBox-textBox"
        :class="{overflowLine: !isOpen}"
        v-if="parama.comment"
      >
        {{ parama.comment }}
        <div
          class="evaluateBox-contentBox-textBox-openBox"
          v-if="parama.comment && parama.comment.length > 80"
          @click.stop="onFold"
        >
          {{ isOpen ? "收起" : "...展开" }}
        </div>
      </div>
      <div class="evaluateBox-contentBox-imageGridBox" v-if="images.length">
        <jy-imageGrid :images="images" size="25.86" />
      </div>
      <div
        class="evaluateBox-contentBox-dramaBox"
        v-if="parama.dramaDetailVo"
        @click.stop="onDramaDetail"
      >
        <div class="evaluateBox-contentBox-dramaBox-coverBox">
          <image :src="parama.dramaDetailVo.dramaCover" mode="aspectFill" />
          <image
            :src="filters.icon(parama.dramaDetailVo.sellType)"
            v-if="parama.dramaDetailVo.sellType"
            class="evaluateBox-contentBox-dramaBox-coverBox-sellType"
          />
        </div>
        <div class="evaluateBox-contentBox-dramaBox-right">
          <span class="evaluateBox-contentBox-dramaBox-right-title">{{
            parama.dramaDetailVo.dramaName
          }}</span>
          <div class="evaluateBox-contentBox-dramaBox-right-bottomBox">
            <div>
              {{ filters.doCalculateDramaDicts(parama.dramaDetailVo.dicts) }}
            </div>
            <div></div>
            <div>
              {{ parama.dramaDetailVo.maleGamerNum }}男{{
                parama.dramaDetailVo.femaleGamerNum
              }}女 {{ parama.dramaDetailVo.gameTime }}小时
            </div>
          </div>
        </div>
        <div class="evaluateBox-contentBox-dramaBox-priceBox">
          ¥{{ parama.storeDramaPrice / 100 }}/位
        </div>
      </div>
    </div>
    <div class="evaluateBox-dateBox">
      {{ dayjs(parama.createdTime).format("MM.DD HH:mm") }}
    </div>
    <div class="evaluateBox-noteBox" v-if="parama.hasGathered">
      通过剧游组局评价
    </div>
  </div>
</template>
<script setup lang="ts">
const { filters, dayjs, enums, useUser, storeApi } = useInstance();

let isOpen = ref(false);
let userInfo: any = reactive({});

const props = defineProps({
  parama: {
    type: Object,
    default: () => {},
  },
});

const emmits = defineEmits(["activeUser"]);

const images = computed(() => {
  if (!props.parama) return [];
  return props.parama.attachments.map((v: any) => v.fileUrl);
});

onMounted(async () => {
  let res = await useUser.getUserInfo();
  Object.assign(userInfo, res);
});

//展开收起
function onFold() {
  isOpen.value = !isOpen.value;
}

//跳转剧评详情
function onGoEvaluateDetail() {
  uni.navigateTo({
    url: `/store-package/pages/evaluate-detail?id=${props.parama.id}`
  })
}

//关注
async function onFocus() {
  try {
    if(userInfo.phone){
      await storeApi.updateUserFocus({
        flag: props.parama.focusId ? false : true,
        focusUserId: props.parama.userId,
        userId: userInfo.id,
      });
      //刷新列表
      props.parama.focusId = props.parama.focusId ? null: props.parama.userId;
    }else{
      emmits('activeUser')
    }
  } catch (e) {}
}

//跳剧本详情
function onDramaDetail() {
}

//跳转个人主页
function onGoPersonal(){

}

</script>
<style lang="scss" scoped>
.evaluateBox {
  position: relative;
  @include hor;
  padding-bottom: 30rpx;
  margin-left: 24rpx;
  width: calc(100vw - 48rpx);
  &-head {
    margin: 20rpx 0 0 0rpx;
    position: relative;
    width: 84rpx;
    height: 84rpx;
    image {
      border-radius: 84rpx;
    }
    &-focus {
      position: absolute;
      bottom: -12rpx;
      width: 36rpx;
      height: 24rpx;
      left: 50%;
      transform: translateX(-50%);
      background: #36e4bb;
      border-radius: 28px;
      @include hor-center-center;
      @include text-middle(22rpx, #fff);
      line-height: 0rpx;
    }
    &-hasFocus {
      position: absolute;
      bottom: -12rpx;
      width: 56rpx;
      height: 26rpx;
      left: 50%;
      transform: translateX(-50%);
      background: #36e4bb;
      border-radius: 28px;
      @include hor-center-center;
      @include text-middle(16rpx, #fff);
      line-height: 0rpx;
    }
  }
  &-contentBox {
    margin: 20rpx 0 0 18rpx;
    width: 80vw;
    &-title {
      @include text-middle(30rpx, #2e323e);
      line-height: 36rpx;
      @include text-overflow-line(1);
      width: 70%;
    }
    &-starBox {
      margin-top: 8rpx;
      @include hor;
      align-items: baseline;
      &-star {
        width: 16rpx;
        height: 16rpx;
      }
      &-score {
        @include text-bold(26rpx, #ff6300);
        line-height: 30rpx;
        margin-left: 4rpx;
        margin-right: 20rpx;
      }
      &-values {
        @include text-normal(22rpx, #5f6572);
        line-height: 26rpx;
        margin-right: 12rpx;
      }
    }
    &-evaluateBox {
      margin-top: 20rpx;
      @include hor;
      align-items: center;
      @include text-normal(26rpx, #2e323e);
      &-nickName {
        max-width: 40%;
        @include text-overflow-line(1);
      }
      image {
        width: 40rpx;
        height: 40rpx;
      }
      &-value {
        @include text-bold(26rpx, #2e323e);
        margin-left: 8rpx;
      }
    }
    &-textBox {
      margin-top: 20rpx;
      @include text-normal(28rpx, #2e323e);
      line-height: 32rpx;
      width: 100%;
      position: relative;
      word-break: break-all;
      &-openBox {
        position: absolute;
        right: 0;
        bottom: 0;
        @include text-normal(28rpx, #4876ae);
        background: #fff;
        height: 42rpx;
        display: flex;
        flex-direction: column-reverse;
      }
    }
    &-imageGridBox {
      margin-top: 24rpx;
    }
    .overflowLine {
      @include text-overflow-line(4);
    }
    &-dramaBox {
      margin-top: 18rpx;
      width: 100%;
      height: 7.88vh;
      background: #f5f6f8;
      border-radius: 6px;
      @include hor;
      position: relative;
      &-coverBox {
        width: 96rpx;
        height: 100%;
        border-radius: 6px;
        overflow: hidden;
        position: relative;
        &-sellType {
          position: absolute;
          left: 0rpx;
          top: 0rpx;
          width: 60rpx;
          height: 32rpx;
        }
      }
      &-right {
        @include ver;
        margin: 24rpx 0 0 12rpx;
        width: 80%;
        &-title {
          @include text-bold(28rpx, #2e323e);
          line-height: 32rpx;
          @include text-overflow-line(1);
          width: 70%;
        }
        &-bottomBox {
          @include hor;
          margin-top: 10rpx;
          @include text-normal(24rpx, #959aa5);
          line-height: 28rpx;
          div:nth-child(1) {
            @include text-overflow-line(1);
          }
          div:nth-child(2) {
            width: 2rpx;
            height: 22rpx;
            background: #d9d9d9;
            margin: 0 8rpx;
            transform: translateY(2px);
          }
        }
      }
      &-priceBox {
        position: absolute;
        right: 18rpx;
        top: 22rpx;
        padding: 6rpx 12rpx;
        background: #f94c4c;
        border-radius: 16px;
        @include hor-center-center;
        @include text-middle(20rpx, #fff);
      }
    }
  }
  &-dateBox {
    position: absolute;
    right: 0rpx;
    top: 26rpx;
    @include text-normal(24rpx, #959aa5);
    line-height: 28rpx;
  }
  &-noteBox {
    position: absolute;
    right: 0rpx;
    top: 62rpx;
    @include text-normal(24rpx, #5f6572);
    padding: 0 6rpx;
    background: #f6f6f6;
    border-radius: 4rpx;
  }
}
</style>