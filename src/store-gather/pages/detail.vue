<template>
  <div class="container">
    <jy-navigationBar>
      <template v-slot:content>
        <div class="topBar">
          <image
            :src="filters.icon('gather-back-share')"
            class="topBar-back"
          ></image>
        </div>
      </template>
    </jy-navigationBar>
    <div class="container-contentBox">
      <image
        mode="aspectFill"
        class="container-contentBox-dramaCover"
        :src="gatherDetail.dramaItem.dramaCover"
      />
      <div class="container-contentBox-cover"></div>
      <div class="container-contentBox-scrollBox">
        <div class="container-contentBox-scrollBox-dramaInfoBox ml12">
          <div class="container-contentBox-scrollBox-dramaInfoBox-cover">
            <image :src="gatherDetail.dramaItem.dramaCover" />
            <image
               mode="aspectFill"
              :src="filters.icon(gatherDetail.dramaItem.sellType +'_border')"
              class="container-contentBox-scrollBox-dramaInfoBox-cover-border"
            />
          </div>
          <div class="container-contentBox-scrollBox-dramaInfoBox-right ml12">
            <div class="container-contentBox-scrollBox-dramaInfoBox-right-title">{{ gatherDetail.dramaItem.dramaName }}<image :src="filters.icon('gather-arrow')" class="arrow ml6"/></div>
            <div class="container-contentBox-scrollBox-dramaInfoBox-right-dict mt8">{{ filters.doCalculateDramaDicts(gatherDetail.dramaItem.dicts) }}</div>
            <div class="container-contentBox-scrollBox-dramaInfoBox-right-time mt8">{{ filters.doCalculateTime(gatherDetail.dramaItem) }}</div>
            <div class="container-contentBox-scrollBox-dramaInfoBox-right-price mt16">{{ gatherDetail.originPrice/100 }}</div>
          </div>
        </div>
        <div class="container-contentBox-scrollBox-addressBox mt12 ml12">
          <image :src="filters.processLogoImage(storeInfo)" class="container-contentBox-scrollBox-addressBox-logo"/>
          <div class="container-contentBox-scrollBox-addressBox-name">
            <span class="container-contentBox-scrollBox-addressBox-name-text">{{ storeInfo.storeName }}</span>
            <image :src="filters.icon('gather-arrow')" class="arrow ml10"/>
          </div>
          <div class="container-contentBox-scrollBox-addressBox-address">{{ storeInfo.address }}</div>
          <image :src="filters.icon('gather-little-location')" mode="aspectFill" class="container-contentBox-scrollBox-addressBox-location"/>
          <image :src="filters.icon('gather-little-phone')" mode="aspectFill" class="container-contentBox-scrollBox-addressBox-phone"/>
        </div>
        <div class="container-contentBox-scrollBox-gatherBox mt18">
          <div class="container-contentBox-scrollBox-gatherBox-memo mb12" v-if="gatherDetail.content">{{ gatherDetail.content }}</div>
          <div class="container-contentBox-scrollBox-gatherBox-memberBox">
            <div class="container-contentBox-scrollBox-gatherBox-memberBox-top">
              <div class="container-contentBox-scrollBox-gatherBox-memberBox-top-left">
                <div class="container-contentBox-scrollBox-gatherBox-memberBox-top-left-title">开场时间：</div>
                <div class="container-contentBox-scrollBox-gatherBox-memberBox-top-left-date mt4">{{ formatOpenTime(gatherDetail.gameStartTime) }}</div>
              </div>
              <div class="container-contentBox-scrollBox-gatherBox-memberBox-top-right" v-if="gatherDetail.gatherStatus === 'GATHERING'">
                <div class="container-contentBox-scrollBox-gatherBox-memberBox-top-right-title">剩余车位：</div>
                <div class="container-contentBox-scrollBox-gatherBox-memberBox-top-right-value mt4">{{ filters.doCalculateNeedCount(gatherDetail, false) }}</div>
              </div>
            </div>
            <div class="container-contentBox-scrollBox-gatherBox-memberBox-bottom mt16">
              <div class="container-contentBox-scrollBox-gatherBox-memberBox-bottom-avatarBox" :class="memberStyle(index)" v-for="(v,index) in gatherDetail.gatheringMemberItems" :key="index">
                <image class="container-contentBox-scrollBox-gatherBox-memberBox-bottom-avatarBox-avatar" :src="v.avatar" v-if="v.id"/>
                <image class="container-contentBox-scrollBox-gatherBox-memberBox-bottom-avatarBox-head" :src="filters.icon('gather-add-player')" v-else/>
                <span class="container-contentBox-scrollBox-gatherBox-memberBox-bottom-avatarBox-value" v-if="v.id">{{ v.nickName }}</span>
                <span class="container-contentBox-scrollBox-gatherBox-memberBox-bottom-avatarBox-title" v-else>邀请</span>
              </div>
            </div>
          </div>
          <div class="container-contentBox-scrollBox-returnPayBox">
            <div class="container-contentBox-scrollBox-returnPayBox-title">退款规则</div>
            <div class="container-contentBox-scrollBox-returnPayBox-value mt12">· 预订成功后，平台暂不支持修改订单。</div>
            <div class="container-contentBox-scrollBox-returnPayBox-value mt8">· 如您有时间调整等需求，请联系商家进行协商。</div>
            <div class="container-contentBox-scrollBox-returnPayBox-value mt8">· 未达到开场人数要求，支持随时申请免审核退款。</div>
            <div class="container-contentBox-scrollBox-returnPayBox-date mt8 ml6">{{ formatGameTime(gatherDetail.gameStartTime) }}</div>
          </div>
          <image :src="filters.icon('gather-fail-status')" class="gatherStatus"></image>
        </div>
      </div>
      <image :src="filters.icon('gathering-status')" class="gatheringStatus" v-if="gatherDetail.gatherStatus === 'GATHERING'"></image>
    </div>
    <div class="container-bottomBox">
      <div class="fail">拼车失败</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const { useUser, filters, dayjs, gatherApi, useStore, storeApi } = useInstance();

let gatherId = ref();

let gatherDetail: any = reactive({});

let storeInfo:any = reactive({});

const formatGameTime = computed(()=>(date:any)=>{
  return `${dayjs(date).format('MM月DD日 HH:mm')} (${filters.getWeek(date)})`;
})

const formatOpenTime = computed(()=>(date:any)=>{
  return `${dayjs(date).format('MM月DD日')} ${filters.getWeek(date)} ${dayjs(date).format('HH:mm')}`;
})

const memberStyle = computed(()=>(index:number)=>{
  return index % 6 === 1  ? 'mr0': 'mr6';
})

onLoad((option: any) => {
  gatherId.value = option.id;
  queryGathering();
});

async function queryGathering() {
  let res:any = await gatherApi.getGatheringDetail({ id: gatherId.value });

  if(res.gatherStatus === 'GATHERING'){
    res.gatheringMemberItems.unshift({id: null});
  }

  Object.assign(gatherDetail, res);

  await queryStore(res.storeId)
}

async function queryStore(storeId:any){
  let res = await storeApi.getStoreHome({storeId})
  Object.assign(storeInfo, res);
}
</script>
<style lang="scss" scoped>
.container {
  &-contentBox {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    overflow-y: scroll;
    &-cover {
      height: 1134rpx;
      background: linear-gradient(
        180deg,
        rgba(46, 29, 34, 0) 0%,
        rgba(35, 41, 53, 0) 0%,
        #232935 40%
      );
    }
    &-dramaCover {
      position: absolute;
      left: 0px;
      right: 0px;
      top: 0px;
      height: 890rpx;
      z-index: -1;
    }
    &-scrollBox {
      position: absolute;
      top: 268rpx;
      padding-bottom: 176rpx;
      &-dramaInfoBox {
        height: 234rpx;
        @include hor;
        &-cover {
          width: 168rpx;
          height: 234rpx;
          position: relative;
          overflow: hidden;
          &-border {
            @include abs-center;
          }
        }
        &-right{
            @include ver;
            &-title{
                @include text-bold(32rpx, #fff);
                @include hor-center;
                max-width: 50vw;
                @include text-overflow-line(1);
            }
            &-dict, &-time{
                @include text-normal(24rpx, #fff);
                opacity: .6;
            }
            &-price{
              font-family: DIN, DIN;
              font-weight: bold;
              font-size: 36rpx;
              color: #F35454;
              position: relative;
              &::before{
                content: '¥ ';
                @include text-middle(26rpx,#F35454);
              }
              &::after{
                content: ' /位';
                @include text-middle(26rpx,rgba(#fff, 0.8));
                position: absolute;
                bottom: 6rpx;
              }
            }
        }
      }
      &-addressBox {
        width: 93.6vw;
        height: 132rpx;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 32rpx 32rpx 32rpx 32rpx;
        border: 2rpx solid rgba(255, 255, 255, 0.2);
        position: relative;
        &-logo{
          width: 100rpx;
          height: 100rpx;
          position: absolute;
          left: 24rpx;
          top: 16rpx;
          border-radius: 50%;
        }
        &-name{
          position: absolute;
          left: 140rpx;
          top: 28rpx;
          @include hor-center;
          &-text{
            @include text-middle(28rpx, #fff);
            max-width: 45vw;
            @include text-overflow-line(1);
          }
        }
        &-address{
          @include text-normal(24rpx, #fff);
          opacity: 0.6;
          position: absolute;
          left: 140rpx;
          bottom: 28rpx;
          width: 50vw;
          @include text-overflow-line(1);
        }
        &-location{
          position: absolute;
          right: 48rpx;
          top: 28rpx;
          width: 48rpx;
          height: 76rpx;
        }
        &-phone{
          position: absolute;
          right: 112rpx;
          top: 28rpx;
          width: 48rpx;
          height: 76rpx;
        }
      }
      &-gatherBox {
        width: 100vw;
        background: #fefefe;
        border-radius: 32rpx 32rpx 0rpx 0rpx;
        box-sizing: border-box;
        padding: 24rpx;
        box-sizing: border-box;
        position: relative;
        .gatherStatus{
          position: absolute;
          right: 36rpx;
          top: 84rpx;
          width: 200rpx;
          height: 200rpx;
          z-index: 1;
        }
        &-memo{
          width: 702rpx;
          height: 88rpx;
          background: #F6F8F9;
          border-radius: 20rpx;
          padding: 24rpx;
          box-sizing: border-box;
          @include text-normal(28rpx, #666);
        }
        &-memberBox{
          width: 702rpx;
          background: #F6F8F9;
          border-radius: 20rpx;
          padding: 24rpx 24rpx 20rpx 24rpx;
          box-sizing: border-box;
          &-top{
            @include hor-between-center;
            &-left{
              @include ver;
              &-title{
                @include text-normal(26rpx, #666);
              }
              &-date{
                @include text-middle(28rpx, #111);
              }
            }
            &-right{
              @include ver;
              width: 216rpx;
              &-title{
                @include text-normal(26rpx, #666);
              }
              &-value{
                @include text-middle(28rpx, #FB2F2F);
                &::before{
                  content: '差';
                  color: #111;
                }
              }
            }
          }
          &-bottom{
            &-avatarBox{
              display: inline-flex;
              flex-direction: column;
              align-items: center;
              margin-bottom: 24rpx;
              &-head{
                width: 80rpx;
                height: 80rpx;
              }
              &-avatar{
                width: 80rpx;
                height: 80rpx;
                border-radius: 50%;
              }
              &-title{
                @include text-normal(24rpx, #1CBC80);
                width: 80rpx;
                text-align: center;
              }
              &-value{
                @include text-normal(24rpx, #111111);
                width: 80rpx;
                text-align: center;
                @include text-overflow-line(1);
              }
            }
          }
        }
      }
      &-returnPayBox{
        box-sizing: border-box;
        margin-top: 24rpx;
        @include ver;
        &-title{
          @include text-middle(28rpx, #111);
        }
        &-value{
          @include text-normal(26rpx, #999);
        }
        &-date{
          @include text-normal(26rpx, #111);
          line-height: 40rpx;
          &::after{
            content: '前未达到开场人数要求，系统将自动退款。';
            @include text-normal(26rpx, #999);
          }
        }
      }
    }
    .gatheringStatus{
      position: absolute;
      right: 34rpx;
      top: 440rpx;
      width: 82rpx;
      height: 72rpx;
    }
  }
  &-bottomBox{
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 172rpx;
    background: #FFFFFF;
    border: 2rpx solid #EEEEEE;
    @include hor-center-center;
    .fail{
      width: 702rpx;
      height: 88rpx;
      background: rgba($color: #111, $alpha: 0.1);
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      @include hor-center-center;
      @include text-bold(30rpx, #999);
    }
  }
}
.arrow{
  width: 20rpx;
  height: 20rpx;
}
.topBar {
  transform: translateY(-12rpx);
  z-index: 10;
  &-back {
    width: 200rpx;
    height: 88rpx;
  }
}
</style>