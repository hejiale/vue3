<template>
    <div v-for="parama in gatherList" :key="parama.id" @click="onGatherDetail(parama.id)">
      <div class="gatherBox">
        <div class="gatherBox-cover">
          <image :src="parama.dramaItem.dramaCover" mode="aspectFill" />
          <image
            :src="filters.icon(parama.dramaItem.sellType)"
            v-if="parama.dramaItem.sellType"
            class="gatherBox-cover-sellType"
          />
        </div>
        <div class="gatherBox-title">{{ parama.dramaItem.dramaName }}</div>
        <div class="gatherBox-timeBox">开局：{{ openDate(parama) }}</div>
        <div class="gatherBox-price">价格：¥{{parama.originPrice / 100}}/位</div>
        <div class="gatherBox-bottomBox">
          <div class="gatherBox-bottomBox-left">
            <image
              :src="member.avatar"
              v-for="(member, index) in parama.gatheringMemberItemList"
              :key="member.id"
              class="gatherBox-bottomBox-left-cover"
              :style="{'margin-left: -8px' : index > 0 }"
            />
            <span class="gatherBox-bottomBox-left-has"
              >{{ havePeople(parama) }}人已上车</span
            >
            <span class="gatherBox-bottomBox-left-need">差{{ needMember(parama) }}</span>
          </div>
          <div class="gatherBox-bottomBox-right">
            <image :src="filters.icon('icon-gather-share')" class="gatherBox-bottomBox-right-share"></image>
            <div class="gatherBox-bottomBox-right-unlock" v-if="parama.gatherLockStatus == 'LOCKED' && lockStatus(parama)" @click="onUnLock(parama.id)">解锁</div>
            <div class="gatherBox-bottomBox-right-lock" v-if="parama.gatherLockStatus == 'UNLOCKED' && lockStatus(parama)" @click="onLock(parama.id)">锁车</div>
          </div>
        </div>
        <div class="gatherBox-rightTag" :class="gatherStyle(parama)" v-if="parama.gatherStatus">
          {{
            (parama.gatherLockStatus == "LOCKED" && parama.gatherStatus == 'GATHERING')
            ? enums.GatherLockStatus.getName(parama.gatherLockStatus)
            : enums.GatherStatusType.getName(parama.gatherStatus)
          }}
        </div>
      </div>
    </div>
    </template>
    <script setup lang="ts">
    const { filters, dayjs, enums, useUser, gatherApi, bus } = useInstance();
    
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

    const gatherStyle = computed(() => (obj:any)=> {
      return {gathering: obj.gatherStatus === 'GATHERING' || (obj.gatherStatus === 'GATHERING' && obj.gatherLockStatus === 'LOCKED')}
    });

    const lockStatus = computed(() => (obj:any)=> {
      return (obj.gatherStatus === 'GATHERING' || obj.gatherStatus === 'SUCCESS') && new Date().getTime() < new Date(obj.gameStartTime).getTime()
    })
    
    //解锁
    function onUnLock(id:any){
      bus.emit('changeLockStatus', {type: 'unLock', id });
    }

    function onLock(id:any){
      bus.emit('changeLockStatus', {type: 'lock', id });
    }

    async function unLockGather(id: any){
      try {
        await gatherApi.unlockGathering({
          id,
        });

        bus.emit("reload-gather");

        uni.showToast({
          title: "解锁成功",
        });
      } catch (e) {
      }
    }
    
    //锁车
    async function lockGather(id:any){
      try {
        await gatherApi.lockGathering({
          id,
        });

        bus.emit("reload-gather");

        uni.showToast({
          title: "锁车成功",
        });
      } catch (e) {
      }
    }
    
    
    function onGatherDetail(id:any) {
      // uni.navigateTo({url: `/store-gather/pages/detail?id=${id}`});
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
      margin-bottom: 20rpx;
      background: #ffffff;
      border-radius: 9px;
      position: relative;
      padding-bottom: 30rpx;
      padding-top: 30rpx;
      width: calc(100vw - 60rpx);
      &-cover {
        width: 108rpx;
        height: 144rpx;
        border-radius: 6px;
        margin-left: 30rpx;
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
        left: 154rpx;
        top: 32rpx;
        @include text-bold(32rpx, #2e323e);
        line-height: 38rpx;
        @include text-overflow-line(1);
        width: 45%;
      }
      &-price{
        position: absolute;
        left: 154rpx;
        top: 142rpx;
        @include text-normal(24rpx, #999);
      }
      &-timeBox {
        position: absolute;
        left: 154rpx;
        top: 102rpx;
        @include text-middle(24rpx, #43BE24);
        line-height: 28rpx;
      }
      &-bottomBox {
        @include hor-between-center;
        margin: 30rpx 24rpx 0px 24rpx;
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
          @include hor-center;
          @include text-middle(24rpx, #fd2e2e);
          line-height: 28rpx;
          &-share{
            width: 56rpx;
            height: 56rpx;
          }
          &-lock{
            margin-left: 20rpx;
            width: 120rpx;
            height: 56rpx;
            background: #2E323E;
            border-radius: 16rpx;
            @include text-bold(24rpx, #fff);
            @include hor-center-center;
          }
          &-unlock{
            margin-left: 20rpx;
            width: 120rpx;
            height: 56rpx;
            background: #F6F6F6;
            border-radius: 16rpx;
            @include text-bold(24rpx, #2E323E);
            @include hor-center-center;
          }
        }
      }
      &-rightTag {
        position: absolute;
        right: 24rpx;
        top: 38rpx;
        @include text-middle(24rpx, #999);
        line-height: 28rpx;
      }
      .gathering{
        color: #FAA21E;
      }
    }
    </style>