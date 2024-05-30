<template>
  <div class="container">
    <div class="container-fixBg"></div>
    <jy-navigationBar>
      <template v-slot:content>
        <div class="topBar">
          <image
            :src="filters.icon('icon_gather_back')"
            class="topBar-back"
            @click="onBack"
          ></image>
          <span class="topBar-title">立即上车</span>
        </div>
      </template>
      <template v-slot:view>
        <div class="container-dramaBox ml15 mt12">
          <image :src="gatherInfo.dramaCoverImg" class="container-dramaBox-cover" mode="aspectFill"/>
          <span class="container-dramaBox-name">{{ gatherInfo.dramaName }}</span>
          <div class="container-dramaBox-dictBox">
            <div class="container-dramaBox-dictBox-val mr6" v-for="val in gatherInfo.dicts" :key="val.id">{{ val.dictValue }}</div>
          </div>
          <span class="container-dramaBox-price">¥{{ gatherInfo.currentPrice / 100  }}/位</span>
        </div>
        <div class="container-dateBox ml15 mt15">
          <image :src="filters.icon('gather-select-date')" class="container-dateBox-tag"/>
          <span class="container-dateBox-title">开场时间</span>
          <span class="container-dateBox-value">{{ formatDate }}</span>
        </div>
        <div class="container-phoneBox ml15 mt15">
          <image :src="filters.icon('gather-select-phone')" class="container-phoneBox-tag"/>
          <span class="container-phoneBox-title">手机号码</span>
          <!-- <up-input placeholder="请输入内容" border="none" v-model="phone"></up-input> -->
          <input type="text" class="container-phoneBox-value" v-model="phone"/>
          <span class="container-phoneBox-note">供店家紧急联系使用</span>
          <image :src="filters.icon('gather-right-arrow')" class="container-phoneBox-arrow" />
        </div>
        <div class="container-memberBox ml15 mt15">
          <image :src="filters.icon('gather-select-people')" class="container-memberBox-tag"/>
          <span class="container-memberBox-title">上车人数</span>
          <span class="container-memberBox-note">为保证玩家体验，请如实选择性别</span>
          <span class="container-memberBox-needLabel">{{ needCount }}</span>
          <div class="container-memberBox-maleBox">
            男<image :src="filters.icon('light-male')" class="container-memberBox-maleBox-tag ml4"/>
          </div>
          <div class="container-memberBox-femaleBox">
            女<image :src="filters.icon('light-female')" class="container-memberBox-maleBox-tag ml4"/>
          </div>
          <div class="container-memberBox-editMaleBox">
            <image :src="filters.icon(canCaledate('reduce','male'))" class="container-memberBox-editMaleBox-cart" @click="onCaledate('reduce', 'male')"/>
            <span class="container-memberBox-editMaleBox-count">{{ memberInfo.maleCount }}</span>
            <image :src="filters.icon(canCaledate('plus','male'))" class="container-memberBox-editMaleBox-cart" @click="onCaledate('plus', 'male')"/>
          </div>
          <div class="container-memberBox-editFeMaleBox">
            <image :src="filters.icon(canCaledate('reduce','female'))" class="container-memberBox-editFeMaleBox-cart" @click="onCaledate('reduce', 'female')"/>
            <span class="container-memberBox-editFeMaleBox-count">{{ memberInfo.femaleCount }}</span>
            <image :src="filters.icon(canCaledate('plus','female'))" class="container-memberBox-editFeMaleBox-cart" @click="onCaledate('plus', 'female')"/>
          </div>
        </div>
        <div class="container-noteBox ml15 mt15">
          <div class="container-noteBox-title">退款规则</div>
            <div class="container-noteBox-value mt12">· 预订成功后，平台暂不支持修改订单。</div>
            <div class="container-noteBox-value mt8">· 如您有时间调整等需求，请联系商家进行协商。</div>
            <div class="container-noteBox-value mt8">· 未达到开场人数要求，支持随时申请免审核退款。</div>
            <div class="container-noteBox-date mt8 ml6">{{ formatGameTime }}</div>
        </div>
        <div class="container-bottom">
          <span class="container-bottom-title">上车人数</span>
          <span class="container-bottom-subtitle">开场价格</span>
          <span class="container-bottom-value">{{ totalPeople }}人</span>
          <span class="container-bottom-subvalue">¥{{ totalPrice }}</span>
          <div class="container-bottom-pay" v-if="gatherInfo.orderId" @click="onPay">继续支付</div>
          <div class="container-bottom-pay" :class="{disable: totalPeople === 0}" @click="onPay" v-else>支付 ¥{{ totalPrice }}</div>
        </div>
      </template>
    </jy-navigationBar>
  </div>
</template>
<script lang="ts" setup>
const {
  bus,
  orderPay,
  getDate,
  useUser,
  filters,
  dayjs,
  gatherApi,
  useStore,
  storeApi,
  menuButtonRect,
} = useInstance();

let canDo = ref(false);

let userInfo: any = reactive({});

let gatherInfo:any = reactive({});

let phone = ref('');

let memberInfo:any = reactive({maleCount: 0, femaleCount: 0})

onLoad(async()=>{
  //处理数据
  Object.assign(userInfo, await useUser.getUserInfo());
  phone.value = userInfo.phone;

  if(uni.getStorageSync('gather-initiate'))
  {
    Object.assign(gatherInfo, uni.getStorageSync('gather-initiate'));
    // uni.removeStorageSync('gather-initiate');
  }
  //加入组局
  if(uni.getStorageSync('gather-join'))
  {
    let res = uni.getStorageSync('gather-join');
    res.currentPrice =  res.originPrice;
    Object.assign(memberInfo, {maleCount: res.realMaleGamerNum, femaleCount: res.realFemaleGamerNum});
    Object.assign(gatherInfo, res);
    uni.removeStorageSync('gather-join');
  }
})

const totalPeople = computed(()=>{
  return memberInfo.femaleCount + memberInfo.maleCount;
})

const totalPrice = computed(()=>{
  return (memberInfo.femaleCount + memberInfo.maleCount) * ( gatherInfo.currentPrice / 100 );
})

const formatDate = computed(()=>{
  return `${dayjs(gatherInfo.gameStartTime).format('MM月DD日')} ${filters.getWeek(gatherInfo.gameStartTime)}${dayjs(gatherInfo.gameStartTime).format('HH:mm')}`
})

const formatGameTime = computed(()=>{
  return `${dayjs(gatherInfo.gameStartTime).format('MM月DD日 HH:mm')} (${filters.getWeek(gatherInfo.gameStartTime)})`;
})

const needCount = computed(()=>{
  if(gatherInfo.isRevertSex){
    let count = gatherInfo.maleLimitNum +
      gatherInfo.femaleLimitNum -
      (gatherInfo.botMaleGamerNum || 0) -
      (gatherInfo.botFemaleGamerNum || 0) -
      memberInfo.maleCount - memberInfo.femaleCount;
    if(count > 0){
      return `差${count}人`;
    } 
  }else{
    let maleCount = gatherInfo.maleLimitNum - (gatherInfo.botMaleGamerNum || 0) - memberInfo.maleCount;
    let femaleCount = gatherInfo.femaleLimitNum - (gatherInfo.botFemaleGamerNum || 0) - memberInfo.femaleCount;
    if (maleCount > 0 || femaleCount > 0) {
      return `差${maleCount > 0 ? `${maleCount}男` : ''}${femaleCount > 0 ? `${femaleCount}女` : ''}`;
    }
  }
  return "";
})

/**
 * 处理加减男女按钮状态
 */
const canCaledate = computed(()=>(type: string, sex: string)=>{
  if(sex === 'male'){
    if(type === 'reduce'){
      if(memberInfo.maleCount === 0 || gatherInfo.orderId){
        return 'icon-disable-reduce';
      }else{
        return 'icon-can-reduce';
      }
    }else{
      if((memberInfo.maleCount + (gatherInfo.botMaleGamerNum || 0) === gatherInfo.maleLimitNum) || gatherInfo.orderId){
        return 'icon-disable-plus';
      }else{
        return 'icon-can-plus';
      }
    }
  }else{
    if(type === 'reduce'){
      if(memberInfo.femaleCount === 0 || gatherInfo.orderId){
        return 'icon-disable-reduce';
      }else{
        return 'icon-can-reduce';
      }
    }else{
      if((memberInfo.femaleCount + (gatherInfo.botFemaleGamerNum || 0) === gatherInfo.femaleLimitNum)  || gatherInfo.orderId){
        return 'icon-disable-plus';
      }else{
        return 'icon-can-plus';
      }
    }
  }
})

function onCaledate(type:string, sex:string){
  if(gatherInfo.orderId)return;

  if(sex === 'male'){
    if(type === 'reduce' && memberInfo.maleCount > 0){
      memberInfo.maleCount--;
    }
    if(type === 'plus' && memberInfo.maleCount + (gatherInfo.botMaleGamerNum || 0) < gatherInfo.maleLimitNum){
      memberInfo.maleCount++;
    }
  }else{
    if(type === 'reduce' && memberInfo.femaleCount > 0){
      memberInfo.femaleCount--;
    }
    if(type === 'plus' && memberInfo.femaleCount + (gatherInfo.botFemaleGamerNum || 0) < gatherInfo.femaleLimitNum){
      memberInfo.femaleCount++;
    }
  }
}

function onBack(){
  uni.navigateBack();
}

async function onPay(){
  if(canDo.value)return;
  canDo.value = true;

  let form = {
    createOrderRequest: {
      lianlianUserType: "USER",
      optUserId: userInfo.id,
      payUserType: "USER",
      productId: gatherInfo.productId,
      productName: gatherInfo.productName,
      productType: "GATHERING_PRODUCT",
      quantity: memberInfo.maleCount + memberInfo.femaleCount,
      storeId: gatherInfo.storeId,
      totalAmount:
        parseInt(memberInfo.maleCount + memberInfo.femaleCount) *
        parseFloat(gatherInfo.currentPrice),
      userId: userInfo.id,
    },
    gatherOrderType: gatherInfo.gatheringNo ? "MEMBER_JOIN": "USER_CREATE",
    gatheringAddInfo: {
      botFemaleGamerNum: gatherInfo.botFemaleGamerNum || 0,
      botMaleGamerNum: gatherInfo.botMaleGamerNum || 0,
      content: gatherInfo.content,
      gameStartTime: gatherInfo.gameStartTime,
      gameTime: gatherInfo.gameTime,
      isRevertSex: gatherInfo.isRevertSex,
      originPrice: gatherInfo.currentPrice,
      storeProductId: gatherInfo.gatheringNo ? gatherInfo.productId: gatherInfo.gatheringId,
      realFemaleGamerNum: memberInfo.femaleCount,
      realMaleGamerNum: memberInfo.maleCount,
      storeId: gatherInfo.storeId,
    },
    gatheringMemberJoinInfo: {
      femaleGamerNum: memberInfo.femaleCount,
      maleGamerNum: memberInfo.maleCount,
      phone: phone.value,
      userId: userInfo.id,
      gatheringId: gatherInfo.gatheringId,
      gatheringNo: gatherInfo.gatheringNo,
    },
  };

  if(form.createOrderRequest.totalAmount > 0){
    if(!gatherInfo.orderId){
      let res:any;

      if(gatherInfo.gatheringNo){
        res = await gatherApi.joinGathering(form);
      }else{
        res = await gatherApi.userCreateGathering(form);
      }
      gatherInfo.orderId = res.id;
    }
    
    orderPay(gatherInfo.orderId, userInfo.id).then(_=>{
      successBack();
    }).catch(_=>{
      canDo.value = false;
    })
  }else{
    successBack();
  }
}

function successBack(){
  uni.showToast({
    title: "发起组局成功！",
  });

  setTimeout(() => {
    if(gatherInfo.gatheringNo){
      uni.navigateBack();
    }else{
      //发起刷新页面的监听
      bus.emit("refresh-gather");
      
      uni.navigateBack({
        delta: 2
      })
    }
  }, 500);
}

</script>
<style lang="scss" scoped>
.container {
  &-fixBg {
    @include fixed-center;
    background: #f5f5f5;
  }
  &-dramaBox{
    width: 690rpx;
    height: 196rpx;
    background: #FFFFFF;
    border-radius: 24rpx;
    position: relative;
    &-cover{
      position: absolute;
      left: 30rpx;
      top: 30rpx;
      width: 100rpx;
      height: 136rpx;
      border-radius: 12rpx;
    }
    &-name{
      @include text-middle(28rpx, #1A1A1A);
      position: absolute;
      left: 150rpx;
      top: 32rpx;
      right: 0px;
      @include text-overflow-line(1);
    }
    &-dictBox{
      position: absolute;
      left: 150rpx;
      top: 82rpx;
      white-space: nowrap;
      overflow-x: scroll;
      @include hor-center;
      &-val{
        padding: 0px 10rpx;
        line-height: 32rpx;
        background: #F4F5F6;
        border-radius: 16rpx;
        @include text-normal(20rpx, #999);
      }
    }
    &-price{
      position: absolute;
      left: 150rpx;
      bottom: 32rpx;
      @include text-bold(28rpx, #14C9C9);
    }
  }
  &-dateBox{
    width: 690rpx;
    height: 104rpx;
    background: #FFFFFF;
    border-radius: 24rpx;
    position: relative;
    @include hor-center;
    &-tag{
      width: 40rpx;
      height: 40rpx;
      position: absolute;
      left: 30rpx;
    }
    &-title{
      @include text-bold(26rpx,#1A1A1A);
      position: absolute;
      left: 90rpx;
    }
    &-value{
      position: absolute;
      right: 30rpx;
      @include text-middle(26rpx, #999);
    }
  }
  &-phoneBox{
    width: 690rpx;
    height: 168rpx;
    background: #FFFFFF;
    border-radius: 24rpx;
    position: relative;
    &-tag{
      width: 40rpx;
      height: 40rpx;
      position: absolute;
      left: 30rpx;
      top: 30rpx;
    }
    &-title{
      @include text-bold(26rpx,#1A1A1A);
      position: absolute;
      left: 90rpx;
      top: 30rpx;
    }
    &-value{
      position: absolute;
      right: 88rpx;
      top: 24rpx;
      @include text-middle(26rpx, #999);
      text-align: right;
      z-index: 1;
    }
    &-arrow{
      position: absolute;
      right: 30rpx;
      top: 34rpx;
      width: 20rpx;
      height: 26rpx;
    }
    &-note{
      position: absolute;
      left: 30rpx;
      bottom: 30rpx;
      @include text-middle(26rpx, #999);
    }
  }
  &-memberBox{
    width: 690rpx;
    height: 348rpx;
    background: #FFFFFF;
    border-radius: 24rpx;
    position: relative;
    &-needLabel{
      position: absolute;
      right: 30rpx;
      top: 30rpx;
      @include text-middle(26rpx, #FAA21E);
    }
    &-tag{
      width: 40rpx;
      height: 40rpx;
      position: absolute;
      left: 30rpx;
      top: 30rpx;
    }
    &-title{
      @include text-bold(26rpx,#1A1A1A);
      position: absolute;
      left: 90rpx;
      top: 30rpx;
    }
    &-note{
      position: absolute;
      left: 30rpx;
      top: 94rpx;
      @include text-middle(26rpx, #999);
    }
    &-maleBox, &-femaleBox{
      position: absolute;
      left: 30rpx;
      top: 178rpx;
      width: 107rpx;
      height: 50rpx;
      border-radius: 36rpx;
      border: 2rpx solid #EBEBEB;
      @include hor-center-center;
      @include text-middle(24rpx, #1A1A1A);
      &-tag{
        width: 24rpx;
        height: 24rpx;
      }
    }
    &-femaleBox{
      top: 268rpx;
    }
    &-editMaleBox, &-editFeMaleBox{
      @include hor-center;
      position: absolute;
      right: 30rpx;
      top: 188rpx;
      @include hor-center;
      &-cart{
        width: 32rpx;
        height: 32rpx;
      }
      &-count{
        @include text-middle(28rpx, #1A1A1A);
        padding: 0px 30rpx;
      }
    }
    &-editFeMaleBox{
      top: 278rpx;
    }
  }
  &-noteBox{
    width: 690rpx;
    margin-bottom: 392rpx;
    background: #FFFFFF;
    border-radius: 32rpx;
    box-sizing: border-box;
    margin-top: 24rpx;
    padding: 30rpx;
    @include ver;
    &-title{
      @include text-middle(28rpx, #1A1A1A);
    }
    &-value{
      @include text-normal(26rpx, #999);
    }
    &-date{
      @include text-normal(26rpx, #1A1A1A);
      line-height: 40rpx;
      &::after{
        content: '前未达到开场人数要求，系统将自动退款。';
        @include text-normal(26rpx, #999);
      }
    }
  }
  &-bottom {
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 354rpx;
    background: #ffffff;
    border-radius: 24px 24px 0px 0px;
    &-title, &-subtitle{
      position: absolute;
      left: 32rpx;
      top: 50rpx;
      @include text-bold(28rpx, #1A1A1A);
    }
    &-value, &-subvalue{
      position: absolute;
      right: 32rpx;
      top: 50rpx;
      @include text-bold(28rpx, #14C9C9);
    }
    &-subtitle,  &-subvalue{
      top: 122rpx;
    }
    &-pay{
        width: 690rpx;
        height: 96rpx;
        background: #14C9C9;
        border-radius: 32rpx 32rpx 32rpx 32rpx;
        position: absolute;
        left: 30rpx;
        bottom: 56rpx;
        @include text-bold(28rpx, #fff);
        @include hor-center-center;
    }
    .disable{
      opacity: 0.6;
    }
  }
}
.topBar {
  @include hor-center;
  &-back {
    width: 64rpx;
    height: 64rpx;
    margin-left: 30rpx;
  }
  &-title {
    position: absolute;
    @include text-bold(32rpx, #000);
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>