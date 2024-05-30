<template>
  <div class="myProfile" >
    <u-skeleton
        rows="3"
        title
        :loading = "loading" :animate="true"
        :rowsWidth="['100%', '100%', '100%']"
        :rowsHeight="['308rpx', '308rpx', '308rpx']"
        class="skeleton"
    ></u-skeleton>
    <jy-navigationBar>
      <template v-slot:content>
        <div class="myProfile-top-navigation">
          <image class="myProfile-top-navigation-back" @click="goBack" :src="filters.icon('transparentBack')"/>
          <image class="myProfile-top-navigation-changeBackground" :src="filters.icon('changeBackground')"/>
        </div>
      </template>
    </jy-navigationBar>
    <div class="myProfile-top">
      <div class="myProfile-top-gradient-mask" :style="backgroundColorCode"></div>
      <image class="myProfile-top-background-image" :src="user.personalBackground || filters.icon('defaultBackground')" mode="aspectFill"/>
    </div>
    <div class="myProfile-bottom">
      <div class="myProfile-bottom-avatarBox">
        <image class="myProfile-bottom-avatarBox-avatar" :src="user.avatar"/>
      </div>
      <div class="myProfile-bottom-content">
        <div class="myProfile-bottom-content-nickName ">
          <div class="myProfile-bottom-content-nickName-label">昵称</div>
          <div class="myProfile-bottom-content-nickName-content">{{user.nickName}}</div>
          <image class="myProfile-bottom-content-nickName-image" :src="filters.icon('right-arrow')"/>
        </div>
        <div class="myProfile-bottom-content-introduce ">
          <div class="myProfile-bottom-content-introduce-label">简介</div>
          <div class="myProfile-bottom-content-introduce-content">{{user.personSign}}</div>
          <image class="myProfile-bottom-content-introduce-image" :src="filters.icon('right-arrow')"/>
        </div>
        <div class="myProfile-bottom-content-phoneNumber ">
          <div class="myProfile-bottom-content-phoneNumber-label">手机号</div>
          <div class="myProfile-bottom-content-phoneNumber-content">{{user.phone}}</div>
          <image class="myProfile-bottom-content-phoneNumber-image" :src="filters.icon('right-arrow')"/>
        </div>
        <div class="myProfile-bottom-content-gender">
          <div class="myProfile-bottom-content-gender-label">性别</div>
          <div class="myProfile-bottom-content-gender-content">{{gender}}</div>
          <image class="myProfile-bottom-content-gender-image" :src="filters.icon('right-arrow')"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup >
const { api, useUser, getColor, filters } = useInstance();
let user = reactive({
  'id': null,
  'avatar' : '',
  'introduce' : '',
  'personSign': '',
  'nickName' : '',
  'phone' : null,
  'sex' : '',
  'personalBackground': ''
})
let gender = computed(() => user.sex === 'MALE' ? '男' : '女')
let backgroundColor = ref('');
let backgroundColorCode = computed(() => `background: linear-gradient(180deg, rgba(${backgroundColor.value},0.8) 0%, rgba(${backgroundColor.value}) 100%`);

let loading = ref(true)

function goBack(){
  uni.navigateBack({
    delta: 1 // 这里的 delta 表示返回的层数，1 表示返回上一层
  });
}


onShow(async () => {
  let remoteUser = await useUser.getUserInfo();
  Object.assign(user, remoteUser)
  let homePageData = await api.homePage({});
  user.personalBackground = homePageData.personalBackground;
  backgroundColor.value = await getColor(user.personalBackground);
  loading.value = false
});

</script>
<style scoped lang="scss">
.flipInY{
  animation: flipInY;
  animation-duration: 2s;
}
.myProfile{
  height: 100vh;
  background: #f2f2f2;
  &-top{
    width: 100vw;
    height: 982rpx;
    &-background-image {
      width: 100%;
      height: 100%;
    }
    &-gradient-mask{
      width: 100vw;
      height: 982rpx;
      content: '';
      position: absolute;
      inset: 0;
    }
    &-navigation{
      position: relative;
      left: 20rpx;
      &-back{
        width: 35rpx;
        height: 35rpx;
      }
      &-changeBackground{
        position: relative;
        left: 208rpx;
        width: 162rpx;
        height: 58rpx;
      }
    }
  }
  &-bottom{
    background: #FAFAFA;
    width: 750rpx;
    height: 1000rpx;
    position: absolute;
    top: 600rpx;
    border-radius: 42rpx;
    &-avatarBox{
      width: 228rpx;
      height: 228rpx;
      border-radius: 50%;
      border: 6rpx solid #FFFFFF;
      position: relative;
      transform: translate(100%, -50%);
      background: #FAFAFA;
      &-avatar{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;

      }
    }
    &-content{
      background: #FAFAFA;
      position: absolute;
      width: 750rpx;
      top: 130rpx;
      &-nickName, &-introduce, &-phoneNumber, &-gender
      {
        font-size: 32rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #5F6572;
        line-height: 38rpx;
        margin-top: 56rpx;
        margin-left: 32rpx;
        display: flex;


        /*animation: bounce;
        animation-duration: 2s;*/
        &-label{
          width: 20%;
          /*animation: fadeInTopLeft;
          animation-duration: 2s;*/
        }
        &-content{
          font-size: 32rpx;
          font-family: PingFang SC, PingFang SC;
          font-weight: 600;
          color: #2E323E;
          line-height: 38rpx;

          /*animation: fadeInRight;
          animation-duration: 2s;*/
        }
        &-image{
          height: 24rpx;
          width: 24rpx;
          position: absolute;
          right: 32rpx;

          /*animation: fadeInRight;
          animation-duration: 2s;*/
        }
      }
    }
  }
}
</style>