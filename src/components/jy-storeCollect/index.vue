<template>
  <div class="container">
    <div class="container-collect" v-for="item in collects" :key="item.id" @click.stop="onStoreDetail(item.id)">
      <!--   头部框   -->
      <div class="container-collect-head">
        <!--   店铺头像   -->
        <div class="container-collect-head-left">
          <image class="container-collect-head-left-logo" :src="item.storeLogo" mode="aspectFill"/>
        </div>
        <!--   右盒子   -->
        <div class="container-collect-head-right">
          <div class="container-collect-head-right-storeName">{{item.storeName}}</div>
          <div class="container-collect-head-right-score">
            <span class="container-collect-head-right-score-content">{{item.evaluateItem ? filters.forceOneDecimal(item.evaluateItem.comprehensiveScore): '0.0'}}</span>
            <span class="container-collect-head-right-score-text ml2">分</span>
            <span class="container-collect-head-right-score-text  ml12">人气值</span>
            <span class="container-collect-head-right-score-content ml2">{{item.explosiveCount || "0.0"}}</span>
          </div>
          <div class="container-collect-head-right-bottom">
            <div class="container-collect-head-right-bottom-left">
              <span class="container-collect-head-right-bottom-left-content">{{item.evaluateItem ? item.evaluateItem.recentTo: 0}}</span>
              <span class="container-collect-head-right-bottom-left-text ml2">人近期去过</span>
            </div>
            <div class="container-collect-head-right-bottom-right">
              <span class="container-collect-head-right-bottom-right-text">{{item.districtName}}</span>
              <div class="container-collect-head-right-bottom-right-line"></div>
              <span class="container-collect-head-right-bottom-right-text">{{filters.metersTransferThousand(item.distance || 0)}}</span>
            </div>
          </div>
        </div>
      </div>
      <!--   剧本框   -->
      <div class="container-collect-drama" v-if="item.storeRecommendDramaList && item.storeRecommendDramaList.length">
        <div class="container-collect-drama-text">精选剧本</div>
        <scroll-view scroll-x class="container-collect-drama-content" >
          <image
              v-for="drama in item.storeRecommendDramaList"
              :key="drama.id"
              :src="drama.dramaCover"
              @click.stop="onDramaDetail(drama.dramaId)"
              class="container-collect-drama-content-cover" mode="aspectFill"/>
        </scroll-view>
      </div>
      <!--   组局框   -->
      <div class="container-collect-gathering" v-if="item.gatheringCount > 0" >
        <span class="container-collect-gathering-content">{{item.gatheringCount}}</span>
        <image :src="filters.icon('right_arrow')" class="container-collect-gathering-arrow ml6"></image>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const { useUser, filters, api,storeApi } = useInstance();
const props = defineProps({
  /**
   * 店铺收藏列表
   */
  collects: {
    type: Array<any>,
    default: () => [],
  },
});

function onStoreDetail(id:any){
  uni.navigateTo({
    url: `/store-package/pages/index?storeId=${id}`
  })
}
function onDramaDetail(id:any){
  uni.navigateTo({
    url: `/drama-package/pages/index?dramaId=${id}`
  })
}


</script>
<style scoped lang="scss">
.container{
  width: 100vw;
  @include ver-center;
  &-collect{
    border-radius: 18rpx;
    margin-top: 16rpx;
    padding-bottom: 24rpx;
    width: 95vw;
    //height: 20vh;
    background: #FFFFFF;
    &-head{
      height: 166rpx;
      width: 95vw;
      @include hor-center;
      &-left{
        height: 166rpx;
        width: 160rpx;
        &-logo{
          height: 136rpx;
          width: 136rpx;
          border-radius: 18rpx;
          margin-top: 30rpx;
          margin-left: 24rpx;
        }
      }
      &-right{
        width: 530rpx;
        height: 166rpx;
        &-storeName{
          margin-top: 30rpx;
          margin-left: 24rpx;
          @include text-overflow-line(1);
          @include text-custom(600, 30rpx, #2E323E);
        }
        &-score{
          margin-top: 13rpx;
          margin-left: 24rpx;
          &-content{
            @include text-custom(500, 26rpx, #FF7A00);
          }
          &-text{
            @include text-custom(400, 26rpx, #5F6572);
          }
        }
        &-bottom{
          margin-top: 5rpx;
          margin-left: 24rpx;
          @include hor-between-center;
          &-left{
            &-content{
              @include text-custom(500, 26rpx, #FF7A00);
            }
            &-text{
              @include text-custom(400, 26rpx, #5F6572);
            }
          }
          &-right{
            @include hor-center;
            &-text{
              @include text-custom(400, 26rpx, #5F6572);
            }
            &-line{
              width: 2rpx;
              height: 22rpx;
              background: #D9D9D9;
              opacity: 1;
              margin-left: 12rpx;
              margin-right: 12rpx;
            }
          }
        }
      }
    }
    &-drama{
      width: 95vw;
      margin-top: 18rpx;
      @include ver;
      &-text{
        margin-left: 24rpx;
        @include text-custom(600, 26rpx, #2E323E);
      }
      &-content{
        margin-left: 24rpx;
        margin-top: 18rpx;
        display: flex;
        flex-direction: row;
        width: 90vw;
        white-space: nowrap;
        &-cover{
          width: 132rpx;
          height: 176rpx;
          border-radius: 12rpx;
          margin-right: 12rpx;
          opacity: 1;

        }
      }
    }
    &-gathering{
      width: 90vw;
      height: 72rpx;
      background: #F5F6F8;
      border-radius: 12rpx;
      opacity: 1;
      margin-left: 24rpx;
      margin-top: 30rpx;
      @include hor-center-center;
      &-content{
        @include text-custom(500, 26rpx, #2E323E);
      }
      &-content::after{
        content: '场拼局进行中';
        margin-left: 4rpx;
      }
      &-arrow{
        width: 16rpx;
        height: 20rpx;
      }
    }
  }
}
</style>