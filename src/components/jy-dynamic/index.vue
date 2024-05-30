<template>
  <div>
    <div class="dynamics" v-for="item in dynamics" :key="item.id">
      <!--   角色头像   -->
      <div class="dynamics-avatar-box" @click.stop="onGoUser(item.createUserId)">
        <image
          class="dynamics-avatar-box-content"
          :src="item.avatar || filters.icon('defaultAvatar')"
        />
      </div>
      <div class="dynamics-moreBox">
        <image class="dynamics-moreBox-moreIcon" :src="filters.icon('icon-more-gray')"/>
      </div>
      <!--   角色内容   -->
      <div class="dynamics-content">
        <span class="dynamics-content-nickName" @click="onDynamicDetail(item.id)">{{ item.nickName }}</span>
        <span class="dynamics-content-time" @click="onDynamicDetail(item.id)">{{ item.createdTime }}</span>
        <!--   角色评论内容   -->
        <div class="dynamics-content-text" @click="onDynamicDetail(item.id)">
          <span :class="{hidden: !item.isExpand}">{{
            item.content
          }}</span>
          <div
            class="tips"
            v-if="item.content && item.content.length > 45"
            @click.stop="onExpand(item)"
          >
            {{ item.isExpand ? "收起" : "...全文" }}
          </div>
        </div>
        <!--   角色评论插图   -->
        <div class="dynamics-content-image">
          <jy-imageGrid :images="item.fileList" size="25"></jy-imageGrid>
        </div>
        <!--   角色关联内容   -->
        <div class="dynamics-content-bar">
          <!--   角色关联店铺   -->
          <template v-if="item.joinServiceCode === 'STORE_CODE'">
            <div class="dynamics-content-bar-store-imgBox" @click="onGoStore(item.storeItem.id)">
              <image
                class="dynamics-content-bar-store-imgBox-img"
                :src="item.storeItem.storeLogo"
                mode="aspectFill"
              />
            </div>
            <div class="dynamics-content-bar-store-right" @click="onGoStore(item.storeItem.id)">
              <div class="dynamics-content-bar-store-right-first">
                <span
                  class="dynamics-content-bar-store-right-first-storeName"
                  >{{ item.storeItem.storeName }}</span
                >
                <span
                  class="dynamics-content-bar-store-right-first-districtName"
                  >{{ item.storeItem.districtName || "" }} |
                  {{ filters.metersTransferThousand(item.storeItem.distance || 0) }}</span
                >
              </div>
              <div class="dynamics-content-bar-store-right-second">
                <span
                  v-if="
                    item.storeItem.evaluateItem &&
                    item.storeItem.evaluateItem?.comprehensiveScore
                  "
                  class="dynamics-content-bar-store-right-second-score"
                >
                  {{ item.storeItem.evaluateItem.comprehensiveScore }}
                </span>
                <span
                  v-else
                  class="dynamics-content-bar-store-right-second-empty"
                  >暂无评</span
                >
                <span class="dynamics-content-bar-store-right-second-text"
                  >分</span
                >
                <span class="dynamics-content-bar-store-right-second-right">
                  人气值{{ filters.formatNum(item.storeItem.explosiveCount || 0) }} |
                  {{ filters.formatNum(item.storeItem.recentTo  || 0) }}近期去过
                </span>
              </div>
            </div>
          </template>
          <!--   角色关联用户   -->
          <template v-if="item.joinServiceCode === 'WITH_USER_CODE'">
            <div class="dynamics-content-bar-user-avatarBox" @click.stop="onGoUser(item.withUserItem.id)">
              <image
                class="dynamics-content-bar-user-avatarBox-img"
                :src="item.withUserItem.avatar"
                mode="aspectFill"
              />
            </div>
            <div class="dynamics-content-bar-user-right">
              <div class="dynamics-content-bar-user-right-nickName">
                {{ item.withUserItem.nickName }}
              </div>
              <div class="dynamics-content-bar-user-right-follow" @click.stop="onFocus(item.withUserItem)">
                <image
                  class="dynamics-content-bar-user-right-follow-img"
                  :src="filters.icon('follow')"
                  mode="aspectFill"
                />
              </div>
            </div>
          </template>
          <!--   角色关联剧本   -->
          <template v-if="item.joinServiceCode === 'DRAMA_CODE'">
            <div class="dynamics-content-bar-drama-imgBox" @click="onGoDramaDetail(item.dramaItem.id)">
              <image
                class="dynamics-content-bar-drama-imgBox-img"
                :src="item.dramaItem.dramaCover"
                mode="aspectFill"
              />
              <image
                class="dynamics-content-bar-drama-imgBox-sellType"
                v-if="item.dramaItem.sellType === 'LIMITED'"
                :src="filters.icon('LIMITED')"
              />
              <image
                class="dynamics-content-bar-drama-imgBox-sellType"
                v-if="item.dramaItem.sellType === 'REAL_SCENE'"
                :src="filters.icon('REAL_SCENE')"
              />
              <image
                class="dynamics-content-bar-drama-imgBox-sellType"
                v-if="item.dramaItem.sellType === 'EXCLUSIVE'"
                :src="filters.icon('EXCLUSIVE')"
              />
            </div>
            <div class="dynamics-content-bar-drama-right" @click="onGoDramaDetail(item.dramaItem.id)">
              <div class="dynamics-content-bar-drama-right-first">
                <div class="dynamics-content-bar-drama-right-first-dramaName">
                  {{ item.dramaItem.dramaName }}
                </div>
                <div class="dynamics-content-bar-drama-right-first-play">
                  <image
                    v-if="item.playStatus === 'WANT_PLAY'"
                    class="dynamics-content-bar-drama-right-first-play-img"
                    :src="filters.icon('hasWantPlay')"
                    mode="aspectFill"
                  />
                  <image
                    v-else
                    class="dynamics-content-bar-drama-right-first-play-img"
                    :src="filters.icon('icon-unWantPlay')"
                    mode="aspectFill"
                  />
                </div>
              </div>
              <div class="dynamics-content-bar-drama-right-second">
                {{ item.dramaItem.maleGamerNum }}男{{
                  item.dramaItem.femaleGamerNum
                }}女 |
                {{ filters.doCalculateDramaDicts(item.dramaItem.dramaThemeList) }}
              </div>
            </div>
          </template>
          <!--   角色关联活动   -->
          <template v-if="item.joinServiceCode === 'ACTIVITY_CODE'">
            <div class="dynamics-content-bar-promotion-imgBox">
              <image
                class="dynamics-content-bar-promotion-imgBox-img"
                :src="item.activityPromotion.activityImg"
                mode="aspectFill"
              />
            </div>
            <div class="dynamics-content-bar-promotion-content">
              <div class="dynamics-content-bar-promotion-content-name">
                {{ item.activityPromotion.activityName }}
              </div>
              <div class="dynamics-content-bar-promotion-content-contentText">
                {{ item.activityPromotion.contentText }}
              </div>
            </div>
          </template>
          <!--   角色关联排行榜   -->
          <template
            v-if="
              item.joinServiceCode === 'HOT_RANK' ||
              item.joinServiceCode === 'PRAISE_RANK' ||
              item.joinServiceCode === 'GATHER_SUM_RANK' ||
              item.joinServiceCode === 'FOCUS_RANK'
            "
          >
            <div class="dynamics-content-bar-rank-imgBox" @click="onGoRank(item.joinServiceCode)">
              <image
                class="dynamics-content-bar-rank-imgBox-img"
                :src="filters.icon('icon-rank')"
                mode="aspectFill"
              />
            </div>
            <div class="dynamics-content-bar-rank-content" @click="onGoRank(item.joinServiceCode)">
              <div
                v-if="item.joinServiceCode === 'HOT_RANK'"
                class="dynamics-content-bar-rank-content-name"
              >
                30天热榜
              </div>
              <div
                v-if="item.joinServiceCode === 'HOT_RANK'"
                class="dynamics-content-bar-rank-content-contentText"
              >
                根据30天内最多组局开玩降序排序
              </div>

              <div
                v-if="item.joinServiceCode === 'PRAISE_RANK'"
                class="dynamics-content-bar-rank-content-name"
              >
                口碑榜
              </div>
              <div
                v-if="item.joinServiceCode === 'PRAISE_RANK'"
                class="dynamics-content-bar-rank-content-contentText"
              >
                根据30天内最多组局开玩降序排序
              </div>

              <div
                v-if="item.joinServiceCode === 'GATHER_SUM_RANK'"
                class="dynamics-content-bar-rank-content-name"
              >
                人气总榜
              </div>
              <div
                v-if="item.joinServiceCode === 'GATHER_SUM_RANK'"
                class="dynamics-content-bar-rank-content-contentText"
              >
                根据30天内最多组局开玩降序排序
              </div>

              <div
                v-if="item.joinServiceCode === 'FOCUS_RANK'"
                class="dynamics-content-bar-rank-content-name"
              >
                期待榜
              </div>
              <div
                v-if="item.joinServiceCode === 'FOCUS_RANK'"
                class="dynamics-content-bar-rank-content-contentText"
              >
                根据30天内最多组局开玩降序排序
              </div>
            </div>
          </template>
        </div>
        <div class="dynamics-content-bottom">
          <div class="dynamics-content-bottom-evaluate" @click="onDynamicDetail(item.id)">说说你的想法…</div>
          <div class="dynamics-content-bottom-right">
            <div class="dynamics-content-bottom-right-share ml16">
              <image
                class="dynamics-content-bottom-right-share-img"
                :src="filters.icon('icon-share-gray')"
              />
              <span class="dynamics-content-bottom-right-share-text">分享</span>
            </div>
            <div class="dynamics-content-bottom-right-like ml24" @click.stop="onChangePraise(item)">
              <image
                v-if="item.isPraise"
                class="dynamics-content-bottom-right-like-img"
                :src="filters.icon('icon-like')"
              />
              <image
                v-else
                class="dynamics-content-bottom-right-like-img"
                :src="filters.icon('icon-unLike')"
              />
              <span class="dynamics-content-bottom-right-like-text">{{
                item.praiseQuantity || 0
              }}</span>
            </div>
            <div class="dynamics-content-bottom-right-evaluates ml24">
              <image
                class="dynamics-content-bottom-right-evaluates-img"
                :src="filters.icon('icon-evaluate-gray')"
              />
              <span class="dynamics-content-bottom-right-evaluates-text">{{
                item.commentQuantity || 0
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const { useUser, filters, api,storeApi } = useInstance();

let userInfo: any = reactive({});

const props = defineProps({
  /**
   * 动态列表
   */
  dynamics: {
    type: Array<any>,
    default: () => [],
  },
});

onMounted(async () => {
  let res = await useUser.getUserInfo();
  Object.assign(userInfo, res);
});

//展开收起
function onExpand(e: any) {
  e.isExpand = !e.isExpand;
}

//跳转个人主页
function onGoUser(e: any){
  uni.navigateTo({
    url: `/my-package/pages/myHome?userId=${e}`
  })
}

//点赞
async function onChangePraise(e: any){
  await api.userPraiseDynamic({
    dynamicType: 1,
    statusEnum: e.isPraise ? 'DISABLE': 'ENABLE',
    dynamicId: e.id
  })
  
  e.isPraise ? e.praiseQuantity-- : e.praiseQuantity++;
  e.isPraise = !e.isPraise;
}

//关注
async function onFocus(e: any) {
  try {
      await storeApi.updateUserFocus({
        flag: e.focusId ? false : true,
        focusUserId:e.id,
        userId: userInfo.id,
      });
      //刷新列表
      e.focusId = e.focusId ? null: e.userId;
  } catch (e) {}
}

function onDynamicDetail(e: any){
  uni.navigateTo({url: `/dynamic-package/pages/detail?id=${e}`})
}

function onGoStore(id:any){
  uni.navigateTo({
    url: `/store-package/pages/index?storeId=${id}`
  })
}

function onGoDramaDetail(id:any){
  uni.navigateTo({
    url: `/drama-package/pages/index?dramaId=${id}`
  })
}

function onGoRank(type:any){
  uni.navigateTo({
    url: `/rank-charts/pages/index?type=${type}`
  })
}

</script>
<style scoped lang="scss">
.dynamics {
  width: 100vw;
  background: transparent;
  display: flex;
  position: relative;
  padding-bottom: 36rpx;
  &-avatar-box {
    margin-left: 32rpx;
    width: 80rpx;
    height: 80rpx;
    border-radius: 70rpx 70rpx 70rpx 70rpx;
    border: 4rpx solid #ffffff;
    flex-shrink: 0;
    &-content {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  &-content {
    width: 78vw;
    @include ver;
    position: relative;
    left: 20rpx;
    &-nickName {
      @include text-custom(600, 30rpx, #2e323e);
      padding-bottom: 10rpx;
    }
    &-time {
      @include text-custom(400, 22rpx, #959aa5);
    }
    &-text {
      @include text-normal(28rpx, #2e323e);
      padding: 12rpx 0px 8rpx 0px;
      position: relative;
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
        bottom: 4rpx;
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
    &-image {
      background: transparent;
    }
    &-bar {
      background: #f5f6f8;
      border-radius: 12rpx;
      @include hor;
      margin-top: 20rpx;
      overflow: hidden;
      &-store {
        &-imgBox {
          width: 104rpx;
          height: 104rpx;
          margin-top: 12rpx;
          margin-bottom: 12rpx;
          margin-left: 12rpx;
          border-radius: 24rpx 24rpx 24rpx 24rpx;
          &-img {
            width: 100%;
            height: 100%;
            border-radius: 24rpx 24rpx 24rpx 24rpx;
          }
        }
        &-right {
          @include ver;
          flex: 1;
          &-first {
            @include hor-between-center;
            align-items: baseline;
            &-storeName {
              margin-top: 24rpx;
              margin-left: 12rpx;
              width: 25vw;
              @include text-overflow-line(1);
              @include text-custom(600, 28rpx, #2e323e);
            }
            &-districtName {
              @include text-custom(400, 24rpx, #5f6572);
              margin-right: 20rpx;
            }
          }
          &-second {
            @include hor-center;
            margin-top: 20rpx;
            margin-left: 12rpx;
            &-score {
              @include text-custom(600, 26rpx, #ff6300);
            }
            &-empty,
            &-text {
              @include text-custom(400, 24rpx, #5f6572);
            }
            &-right {
              margin-left: 5rpx;
              @include text-custom(400, 24rpx, #959aa5);
            }
          }
        }
      }
      &-user {
        &-avatarBox {
          width: 70rpx;
          height: 70rpx;
          margin-top: 15rpx;
          margin-bottom: 15rpx;
          margin-left: 15rpx;
          border-radius: 50%;
          &-img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        &-right {
          position: relative;
          width: 80%;
          height: 100%;
          &-nickName {
            position: absolute;
            left: 15rpx;
            top: 20rpx;
            @include text-custom(600, 26rpx, #2e323e);
          }
          &-follow {
            position: absolute;
            left: 400rpx;
            top: 25rpx;
            width: 90rpx;
            height: 40rpx;
            &-img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      &-drama {
        &-imgBox {
          position: relative;
          width: 96rpx;
          height: 128rpx;
          border-radius: 24rpx 24rpx 24rpx 24rpx;
          &-img {
            width: 100%;
            height: 100%;
            border-radius: 24rpx 24rpx 24rpx 24rpx;
          }
          &-sellType {
            position: absolute;
            top: 0;
            left: 0;
            width: 30rpx;
            height: 16rpx;
          }
        }
        &-right {
          @include ver;
          flex: 1;
          &-first {
            @include hor-between-center;
            align-items: baseline;
            &-dramaName {
              @include text-custom(600, 28rpx, #2e323e);
              margin-left: 12rpx;
              margin-top: 24rpx;
            }
            &-play {
              width: 120rpx;
              height: 36rpx;
              margin-right: 18rpx;
              &-img {
              }
            }
          }
          &-second {
            @include text-custom(400, 24rpx, #959aa5);
            margin-left: 12rpx;
            margin-top: 20rpx;
          }
        }
      }
      &-promotion {
        &-imgBox {
          position: relative;
          width: 96rpx;
          height: 128rpx;
          border-radius: 24rpx 24rpx 24rpx 24rpx;
          &-img {
            width: 100%;
            height: 100%;
            border-radius: 24rpx 24rpx 24rpx 24rpx;
          }
        }
        &-content {
          @include ver;
          flex: 1;
          &-name {
            margin-top: 24rpx;
            margin-left: 12rpx;
            @include text-custom(600, 28rpx, #2e323e);
          }
          &-contentText {
            margin-top: 25rpx;
            margin-left: 12rpx;
            @include text-custom(400, 24rpx, #2e323e);
          }
        }
      }
      &-rank {
        &-imgBox {
          width: 104rpx;
          height: 104rpx;
          margin-top: 12rpx;
          margin-bottom: 12rpx;
          margin-left: 12rpx;
          border-radius: 24rpx 24rpx 24rpx 24rpx;
          &-img {
            width: 100%;
            height: 100%;
            border-radius: 24rpx 24rpx 24rpx 24rpx;
          }
        }
        &-content {
          @include ver;
          flex: 1;
          &-name {
            margin-top: 24rpx;
            margin-left: 12rpx;
            @include text-custom(600, 28rpx, #2e323e);
          }
          &-contentText {
            margin-top: 20rpx;
            margin-left: 12rpx;
            @include text-custom(400, 24rpx, #959aa5);
          }
        }
      }
    }
    &-bottom {
      background: transparent;
      @include hor-between-center;
      margin-top: 28rpx;
      &-evaluate {
        width: 202rpx;
        height: 54rpx;
        background: #f5f6f8;
        border-radius: 94rpx;
        @include text-normal(22rpx, #959aa5);
        @include hor-center-center;
      }
      &-right {
        @include hor-center;
        &-share,
        &-like,
        &-evaluates {
          @include hor-center;
          &-img {
            width: 32rpx;
            height: 32rpx;
          }
          &-text {
            margin-left: 8rpx;
            @include text-middle(24rpx, #5f6572);
          }
        }
      }
    }
  }
  &-moreBox{
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1;
    &-moreIcon{
      width: 40rpx;
      height: 8rpx;
      padding: 32rpx;
    }
  }
}

</style>