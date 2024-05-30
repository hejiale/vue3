<template>
  <div v-for="parama in gatherList" :key="parama.id">
    <div class="gatherBox" @click="onGatherDetail(parama.id)">
      <div class="gatherBox-cover">
        <image :src="parama.dramaItem.dramaCover" mode="aspectFill" />
        <image
          :src="filters.icon(parama.dramaItem.sellType)"
          v-if="parama.dramaItem.sellType"
          class="gatherBox-cover-sellType"
        />
      </div>
      <div class="gatherBox-title">{{ parama.dramaItem.dramaName }}</div>
      <div class="gatherBox-dicts">{{ filters.doCalculateDramaDicts(parama.dramaItem.dicts) }}</div>
      <div class="gatherBox-people">{{ parama.recommendCount || 0 }}</div>
      <div class="gatherBox-storeBox">
        <div class="gatherBox-storeBox-name">店铺：{{ parama.storeName }}</div>
        <div class="gatherBox-storeBox-line"></div>
        <div>{{ filters.metersTransferThousand(parama.distance) }}</div>
      </div>
      <div class="gatherBox-timeBox">开局：{{ openDate(parama) }}</div>
      <div class="gatherBox-line"></div>
      <div class="gatherBox-bottomBox">
        <div class="gatherBox-bottomBox-left">
          <image
            :src="member.avatar"
            v-for="(member, index) in parama.gatheringMemberItemList"
            :key="member.id"
            class="gatherBox-bottomBox-left-cover"
            :style="{'margin-left: -8px' : index > 0 }"
          />
          <span class="gatherBox-bottomBox-left-has" v-if="parama.realPeople !== undefined">{{ parama.realPeople }}人已上车</span>
          <span class="gatherBox-bottomBox-left-has" v-else>{{ havePeople(parama) }}人已上车</span>
          <!-- <span class="gatherBox-bottomBox-left-need">差{{ needMember(parama) }}</span> -->
        </div>
        <div class="gatherBox-bottomBox-right">
          ¥{{ parama.originPrice / 100 }}/位
        </div>
      </div>
      <div class="gatherBox-rightTag" v-if="parama.gatherSuccessState">
        {{ parama.gatherSuccessState }}
      </div>
    </div>
  </div>
  </template>
  <script setup lang="ts">
  const { filters, dayjs, enums, useUser, api } = useInstance();
  
  const props = defineProps({
    gatherList: {
      type: Array<any>,
      default: () => [],
    }
  });
  
  const havePeople = computed(() =>(obj:any)=> {
    return (
      obj.botMaleGamerNum +
      obj.botFemaleGamerNum +
      obj.realMaleGamerNum +
      obj.realFemaleGamerNum
    );
  });
  
  const needMember = computed(() =>(obj:any)=> {
    if (!obj) return "";
  
    if (obj.isRevertSex) {
      let needCount =
      obj.totalGamerNum -
      obj.realMaleGamerNum -
      obj.botMaleGamerNum -
      obj.realFemaleGamerNum -
      obj.botFemaleGamerNum;
      if (needCount > 0) {
        return `${needCount}人`;
      } else {
        return null;
      }
    }
  
    let femaleNum =
    obj.femaleLimitNum -
    obj.realFemaleGamerNum -
    obj.botFemaleGamerNum;
    let maleNum =
    obj.maleLimitNum -
    obj.realMaleGamerNum -
    obj.botMaleGamerNum;
    if (maleNum === 0 && femaleNum === 0) return null;
  
    return `${maleNum > 0 ? `${maleNum}男` : ""}${
      femaleNum > 0 ? `${femaleNum}女` : ""
    }`;
  });
  
  const openDate = computed(() => (obj:any)=> {
    if (!obj) return "";
    return `${dayjs(obj.gameStartTime).format("MM月DD日")} ${
      fnTime(obj.gameStartTime) || getWeek(obj.gameStartTime)
    } ${dayjs(obj.gameStartTime).format("HH:mm")}`;
  });
  
  
  function onGatherDetail(id:any) {
    uni.navigateTo({
      url: `/player-gather/pages/detail?id=${id}`
    })
  }
  /**
   * 转换日期
   */
  function getWeek(dateString: any) {
    let date = new Date(dateString).getDay();
    var weeks = new Array("日", "一", "二", "三", "四", "五", "六");
    return "周" + weeks[date];
  }
  
  function fnTime(time: any) {
    let d = new Date(time).setHours(0, 0, 0, 0);
    let today = new Date().setHours(0, 0, 0, 0);
  
    let obj: any = {
      "-86400000": "昨天",
      0: "今天",
      86400000: "明天",
    };
    return obj[d - today] || "";
  }
  </script>
  <style lang="scss" scoped>
  .gatherBox {
    margin-top: 20rpx;
    background: #ffffff;
    border-radius: 9px;
    position: relative;
    padding-bottom: 18rpx;
    padding-top: 30rpx;
    margin-left: 24rpx;
    width: calc(100vw - 48rpx);
    &-cover {
      width: 156rpx;
      height: 228rpx;
      border-radius: 6px;
      margin-left: 24rpx;
      position: relative;
      overflow: hidden;
      &-sellType {
        position: absolute;
        right: 8rpx;
        top: 8rpx;
        width: 60rpx;
        height: 32rpx;
      }
    }
    &-title {
      position: absolute;
      left: 224rpx;
      top: 32rpx;
      @include text-bold(32rpx, #2e323e);
      line-height: 38rpx;
      @include text-overflow-line(1);
      width: 45%;
    }
    &-dicts {
      position: absolute;
      left: 224rpx;
      top: 92rpx;
      @include text-normal(24rpx, #5f6572);
      line-height: 28rpx;
    }
    &-people {
      position: absolute;
      left: 224rpx;
      top: 136rpx;
      @include text-normal(24rpx, #ff7a00);
      line-height: 14px;
    }
    &-people::after {
      color: #5f6572;
      content: "人推荐";
    }
    &-storeBox {
      position: absolute;
      left: 224rpx;
      top: 174rpx;
      @include text-normal(24rpx, #5f6572);
      line-height: 28rpx;
      @include hor;
      align-items: center;
      &-name {
        width: 80%;
        @include text-overflow-line(1);
      }
      &-line {
        width: 2rpx;
        height: 22rpx;
        background: #d9d9d9;
        margin: 0 10rpx;
        transform: translateY(2rpx);
      }
    }
    &-timeBox {
      position: absolute;
      left: 224rpx;
      top: 218rpx;
      @include text-normal(24rpx, #5f6572);
      line-height: 28rpx;
    }
    &-line {
      margin: 30rpx 24rpx 16rpx 24rpx;
      height: 1rpx;
      background: rgba($color: #e9ebef, $alpha: 1);
    }
    &-bottomBox {
      @include hor-between-center;
      margin: 0 24rpx;
      &-left {
        &-cover {
          width: 32rpx;
          height: 32rpx;
          border: 1px solid #ffffff;
          border-radius: 32rpx;
        }
        &-has {
          margin-left: 12rpx;
          @include text-normal(24rpx, #666);
        }
        &-need {
          margin-left: 8rpx;
          @include text-normal(24rpx, #ff7a00);
        }
      }
      &-right {
        @include text-middle(24rpx, #fd2e2e);
        line-height: 28rpx;
      }
    }
    &-rightTag {
      position: absolute;
      right: 24rpx;
      top: 38rpx;
      @include text-normal(24rpx, #fd2e2e);
      line-height: 28rpx;
    }
    &-rightTag::before {
      content: "拼成率";
      color: #333333;
    }
  }
  </style>