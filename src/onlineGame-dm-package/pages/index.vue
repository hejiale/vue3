<template>
  <div class="container">
    <!--  大背景&蒙板  -->
    <div class="container-bg" >
      <image class="container-bg-img" :src="bgImage" mode="aspectFill"/>
      <div class="container-bg-mask" :style="backgroundColorCode"/>
    </div>
    <jy-navigationBar>
      <template v-slot:content>
        <div class="container-bar">
          <div class="container-bar-back">
            <image class="container-bar-back-img" :src="filters.icon('transparentBack')" @click="goBack"/>
          </div>
          <div class="container-bar-content">
            <div class="container-bar-content-name">
              未来社死未来社死未来社死{{dramaName}}
            </div>
            <div class="container-bar-content-number">
              房间编号:1234567{{onlineGameNumber}}
            </div>
          </div>
        </div>
      </template>
    </jy-navigationBar>
    <!--  头部    -->
    <div class="container-top">
      <div class="container-top-playerNum">
        <div class="container-top-playerNum-left">当前房间人数(1{{}})</div>
        <div class="container-top-playerNum-right">
          <image class="container-top-playerNum-right-img" :src="filters.icon('invite-player')"/>
        </div>
      </div>
      <div class="container-top-players">
        <div class="container-top-players-empty" v-if="playerFlag" >
          暂无玩家进入房间
        </div>
        <div class="container-top-players-enable" v-else>
          <u-scroll-list indicatorColor="rgba(255,255,255,0.6)" indicatorActiveColor="#FFFFFF">
            <div class="container-top-players-enable-box" v-for="(avatar, id) in playerAvatars" :key="id">
              <image class="container-top-players-enable-box-img" :src="avatar.pic" mode="aspectFill"/>
            </div>
          </u-scroll-list>
        </div>
      </div>
      <div class="container-top-sort">
        当前上车玩家(10)
      </div>
    </div>
    <!--  中部角色&玩家   -->
    <scroll-view scroll-y class="container-middle" >
      <div class="container-middle-topMask"></div>
      <div class="container-middle-bottomMask"></div>
      <div class="container-middle-content">
        <div class="container-middle-content-players"  v-for="index in 18" :key="index">
          <image class="container-middle-content-players-frame"/>
          <image class="container-middle-content-players-frame"/>
        </div>
      </div>
    </scroll-view>
    <!--  尾部&开始游戏&刷新&解散   -->
    <div class="container-bottom">
      <div class="container-bottom-left">
        <image class="container-bottom-left-img" :src="filters.icon('terminate-game')"/>
      </div>
      <div class="container-bottom-middle">
        <div class="container-bottom-middle-top">
          <image class="container-bottom-middle-top-img" :src="filters.icon('start-choose')"/>
        </div>
        <div class="container-bottom-middle-bottom">
          点击座位，选择参与游戏的玩家
        </div>
      </div>
      <div class="container-bottom-right">
        <image class="container-bottom-right-img" :src="filters.icon('game-refresh')"/>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const {api, myApi, dayjs, filters, getColor, menuButtonRect, useUser} = useInstance();


// 有无玩家状态的 flag
let playerFlag = ref(false);
// 背景图片 背景取色 蒙板
let backgroundColor = ref<string>('');
let backgroundColorCode = computed(() => `background: linear-gradient(180deg, rgba(${backgroundColor.value},0.8) 0%, rgba(${backgroundColor.value}) 100%`);
let bgImage = ref("https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230620/33eac33f-68f7-46e6-9389-662505577ace/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20230206114034.jpg")
// 剧本名称
let dramaName = ref<string>('');
// 房间号
let onlineGameNumber = ref<string>('');
// 玩家列表
let playerAvatars = reactive([
  {
    id:1,
    pic:'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230628/124fff0f-9184-4dc1-a7a0-2c7b7ca04e71/%E4%BA%95%E5%B7%9D%E4%B8%8D%E7%BE%8E.png'
  },{
    id:2,
    pic:'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230628/124fff0f-9184-4dc1-a7a0-2c7b7ca04e71/%E4%BA%95%E5%B7%9D%E4%B8%8D%E7%BE%8E.png'
  },{
    id:2,
    pic:'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230628/124fff0f-9184-4dc1-a7a0-2c7b7ca04e71/%E4%BA%95%E5%B7%9D%E4%B8%8D%E7%BE%8E.png'
  },{
    id:3,
    pic:'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230628/124fff0f-9184-4dc1-a7a0-2c7b7ca04e71/%E4%BA%95%E5%B7%9D%E4%B8%8D%E7%BE%8E.png'
  },{
    id:4,
    pic:'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230628/124fff0f-9184-4dc1-a7a0-2c7b7ca04e71/%E4%BA%95%E5%B7%9D%E4%B8%8D%E7%BE%8E.png'
  },{
    id:5,
    pic:'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230628/124fff0f-9184-4dc1-a7a0-2c7b7ca04e71/%E4%BA%95%E5%B7%9D%E4%B8%8D%E7%BE%8E.png'
  },{
    id:6,
    pic:'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230628/124fff0f-9184-4dc1-a7a0-2c7b7ca04e71/%E4%BA%95%E5%B7%9D%E4%B8%8D%E7%BE%8E.png'
  },{
    id:7,
    pic:'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230628/124fff0f-9184-4dc1-a7a0-2c7b7ca04e71/%E4%BA%95%E5%B7%9D%E4%B8%8D%E7%BE%8E.png'
  },{
    id:8,
    pic:'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230628/124fff0f-9184-4dc1-a7a0-2c7b7ca04e71/%E4%BA%95%E5%B7%9D%E4%B8%8D%E7%BE%8E.png'
  },{
    id:9,
    pic:'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20230628/124fff0f-9184-4dc1-a7a0-2c7b7ca04e71/%E4%BA%95%E5%B7%9D%E4%B8%8D%E7%BE%8E.png'
  },

])





function goBack(){
  uni.navigateBack({
    delta: 1 // 这里的 delta 表示返回的层数，1 表示返回上一层
  });
}

onLoad(async () => {
  backgroundColor.value = await getColor(bgImage.value) as string;

});

</script>
<style scoped lang="scss">
.container{
  width: 100vw;
  height: 100vh;
  position: fixed;
  &-bg{
    position: absolute;
    width: 100vw;
    height: 100vh;
    z-index: 1;
    &-img{
      width: 100vw;
      height: 100vh;
    }
    &-mask{
      width: 100vw;
      height: 100vh;
      content: '';
      position: absolute;
      inset: 0;
    }
  }
  &-bar{
    width: 400vw;
    height: 70rpx;
    @include hor-center;
    &-back{
      width: 32rpx;
      height: 32rpx;
      margin-left: 32rpx;
      &-img{
        width: 32rpx;
        height: 32rpx;
      }
    }
    &-content{
      min-width: 280rpx;
      height: 80rpx;
      margin-left: 150rpx;
      @include ver-center;
      transform: translateY(16rpx);
      &-name{
        max-width: 280rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
        @include text-custom(500, 28rpx, #FFFFFF);
      }
      &-number{
        margin-top: 5rpx;
        @include text-custom(400, 20rpx, rgba(255,255,255,0.6));
      }
    }
  }
  &-top{
    position: absolute;
    width: 100vw;
    height: 450rpx;
    z-index: 3;
    top: 0;
    &-playerNum{
      position: absolute;
      width: 100vw;
      height: 60rpx;
      top: 190rpx;
      @include hor-between-center;
      &-left{
        margin-left: 28rpx;
        @include text-custom(400, 20rpx, rgba(255,255,255,0.6));
      }
      &-right{
        width: 72rpx;
        height: 80rpx;
        &-img{
          width: 100%;
          height: 100%;
        }
      }
    }
    &-players{
      position: absolute;
      width: 100vw;
      height: 150rpx;
      top: 250rpx;
      @include hor-center-center;
      &-empty{
        @include text-custom(400, 26rpx, rgba(255,255,255,0.6));
      }
      &-enable{
        width: 100vw;
        height: 150rpx;
        &-box{
          width: 70rpx;
          height: 80rpx;
          margin-top: 25rpx;
          margin-left: 25rpx;
          &-img{
            width: 70rpx;
            height: 70rpx;
            border-radius: 50%;
          }
        }
      }
    }
    &-sort{
      position: absolute;
      width: calc(100vw - 28rpx);
      height: 60rpx;
      top: 400rpx;
      margin-left: 28rpx;
      @include text-custom(400, 20rpx, rgba(255,255,255,0.6));
    }
  }
  &-middle{
    position: absolute;
    width: 100vw;
    //height: calc(100vh - 690rpx);
    //top: 450rpx;
    height: calc(100vh - 670rpx);
    top: 430rpx;
    z-index: 2;
    &-topMask{
      position: fixed;
      width: 100%;
      height: 100rpx;
      //background: linear-gradient(to bottom, rgba(0, 0, 0, 1), transparent);
      border-radius: 5rpx ;
      z-index: 3;
    }
    &-bottomMask{
      position: fixed;
      width: 100%;
      height: 40rpx;
      //background: linear-gradient(to top, rgba(0, 0, 0, 1), transparent);
      border-radius: 5rpx;
      margin-top: 915rpx;
      z-index: 3;
    }
    &-content{
      position: absolute;
      top: 20rpx;
      width: 100%;
      height: 100%;
      @include ver-center;
      &-players{
        width: 700rpx;
        min-height: 110rpx;
        background: rgba(0, 0, 0, 0.1);
        margin-top: 18rpx;
        border-radius: 24rpx;
        border: 2rpx solid rgba(255, 255, 255, 0.1);
      }
    }
  }
  &-bottom{
    position: absolute;
    width: 100vw;
    height: 240rpx;
    z-index: 3;
    bottom: 0;
    &-left{
      position: absolute;
      width: 96rpx;
      height: 82rpx;
      margin-left: 36rpx;
      margin-top: 55rpx;
    }
    &-middle{
      position: absolute;
      margin-left: 220rpx;
      margin-top: 38rpx;
      @include ver-center-center;
      &-top{
        width: 320rpx;
        height: 92rpx;
      }
      &-bottom{
        margin-top: 12rpx;
        @include text-custom(400, 20rpx, rgba(255,255,255,0.6));
      }
    }
    &-right{
      position: absolute;
      width: 50rpx;
      height: 82rpx;
      margin-left: 650rpx;
      margin-top: 55rpx;
    }
  }


}


</style>