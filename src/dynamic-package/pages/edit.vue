<template>
  <div class="container">
    <div class="fixedBg"></div>
    <jy-navigationBar>
      <template v-slot:content>
        <div class="topBar">
          <image
            :src="filters.icon('store-back')"
            class="topBar-back"
            @click="onBack"
          ></image>
          <span class="topBar-title">发布动态</span>
        </div>
      </template>
      <template v-slot:view>
        <div class="content">
          <div class="content-inputBox">
            <textarea
              placeholder="分享你的有趣见闻～"
              :maxlength="1000"
              v-model="content"
            ></textarea>
            <div class="content-inputBox-count">{{ content.length }}</div>
            <view class="content-inputBox-picScroll" scroll-x>
              <div
                class="content-inputBox-picScroll-item"
                v-for="(url,idx) in imageList"
                :key="url"
              >
                <image
                  :src="url"
                  class="content-inputBox-picScroll-item-cover"
                  mode="aspectFill"
                ></image>
                <image
                  :src="filters.icon('icon-dark-close')"
                  class="content-inputBox-picScroll-item-close"
                  @click="onDeleteImg(idx)"
                ></image>
              </div>
              <div
                class="content-inputBox-picScroll-upload"
                @click="onUploadImage"
                v-if="imageList.length < 6"
              >
                <image :src="filters.icon('icon-upload-camera')"></image>
                <span class="content-inputBox-picScroll-upload-title"
                  >{{ imageList.length > 0 ? needCount:'图片/视频' }}</span
                >
              </div>
            </view>
          </div>
          <div class="content-relatedBox">
            <div class="content-relatedBox-leftBox" @click="onLeftShowPop">
              <span class="content-relatedBox-leftBox-title">{{ typeName }}</span>
              <image
                :src="filters.icon('right_arrow')"
                class="content-relatedBox-leftBox-arrow"
                v-if="chooseType !== -1"
              ></image>
            </div>
            <div class="content-relatedBox-rightBox" @click="onShowPop">
              <span class="content-relatedBox-rightBox-note" :class="{active: chooseType !== -1}"
                >{{ typeValue }}</span
              >
              <image
                :src="filters.icon('right_arrow')"
                class="content-relatedBox-rightBox-arrow"
              ></image>
            </div>
          </div>
        </div>
      </template>
    </jy-navigationBar>
    <div class="container-bottomBox">
      <div class="container-bottomBox-sure" @click="onSureSave">确认</div>
    </div>
    <u-popup
      :show="showPop"
      @close="showPop = false"
      :round="16"
      zIndex="10071"
    >
      <div class="popBox">
        <div class="popBox-title">关联内容选择</div>
        <div class="popBox-note">本次动态最多关联下方一条内容</div>
        <image
          :src="filters.icon('icon-close-white')"
          class="popBox-close"
        ></image>
        <div class="popBox-item" @click="onShowChoosePop(0)">
          <span class="popBox-item-title">关联剧本</span>
          <div class="popBox-item-rightBox">
            <span class="popBox-item-rightBox-note" :class="{active: chooseType === 0}">{{ chooseType === 0 ? typeValue: '选择您体验的剧本' }}</span>
            <image
              :src="filters.icon('right_arrow')"
              class="popBox-item-rightBox-arrow"
            ></image>
          </div>
        </div>
        <div class="popBox-item" @click="onShowChoosePop(1)">
          <span class="popBox-item-title">关联店铺</span>
          <div class="popBox-item-rightBox">
            <span class="popBox-item-rightBox-note" :class="{active: chooseType === 1}">{{ chooseType === 1 ? typeValue: '选择您体验的剧本店铺' }}</span>
            <image
              :src="filters.icon('right_arrow')"
              class="popBox-item-rightBox-arrow"
            ></image>
          </div>
        </div>
        <div class="popBox-item" @click="onShowChoosePop(2)">
          <span class="popBox-item-title">关联资讯</span>
          <div class="popBox-item-rightBox">
            <span class="popBox-item-rightBox-note" :class="{active: chooseType === 2}">{{ chooseType === 2 ? typeValue: '选择您要关联的资讯' }}</span>
            <image
              :src="filters.icon('right_arrow')"
              class="popBox-item-rightBox-arrow"
            ></image>
          </div>
        </div>
        <div class="popBox-item" @click="onShowChoosePop(3)">
          <span class="popBox-item-title">关联用户</span>
          <div class="popBox-item-rightBox">
            <span class="popBox-item-rightBox-note" :class="{active: chooseType === 3}">{{ chooseType === 3 ? typeValue: '选择您要关联的用户' }}</span>
            <image
              :src="filters.icon('right_arrow')"
              class="popBox-item-rightBox-arrow"
            ></image>
          </div>
        </div>
        <div class="popBox-item" @click="onShowChoosePop(4)">
          <span class="popBox-item-title">关联排行榜</span>
          <div class="popBox-item-rightBox">
            <span class="popBox-item-rightBox-note" :class="{active: chooseType === 4}">{{ chooseType === 4 ? typeValue: '选择您要关联的排行榜' }}</span>
            <image
              :src="filters.icon('right_arrow')"
              class="popBox-item-rightBox-arrow"
            ></image>
          </div>
        </div>
      </div>
    </u-popup>
    <u-popup
      :show="showSelectDrama"
      @close="showSelectDrama = false"
      :round="16"
      :safeAreaInsetBottom="false"
    >
      <SelectDrama @getDrama="onGetDrama" ref="selectDramaRef"></SelectDrama>
    </u-popup>
    <u-popup
      :show="showSelectStore"
      @close="showSelectStore = false"
      :round="16"
      :safeAreaInsetBottom="false"
    >
      <SelectStore @getStore="onGetStore" ref="selectStoreRef"></SelectStore>
    </u-popup>
    <u-popup
      :show="showSelectInfo"
      @close="showSelectInfo = false"
      :round="16"
      :safeAreaInsetBottom="false"
    >
      <SelectInfomation @getInfomation="onGetInfomation" ref="selectInfoRef"></SelectInfomation>
    </u-popup>
    <u-popup
      :show="showUser"
      @close="showUser = false"
      :round="16"
      :safeAreaInsetBottom="false"
    >
      <SelectUser @getUser="onGetUser" ref="selectUserRef"></SelectUser>
    </u-popup>
    <u-popup
      :show="showRank"
      @close="showRank = false"
      :round="16"
      :safeAreaInsetBottom="false"
    >
      <SelectRank ref="selectRankRef" @getRank="onGetRank"></SelectRank>
    </u-popup>
  </div>
</template>
<script setup lang="ts">
import SelectRank from "../components/SelectRank/index.vue";
import SelectUser from "../components/SelectUser/index.vue";
import SelectInfomation from "../components/SelectInfomation/index.vue";
import SelectStore from "../components/SelectStore/index.vue";
import SelectDrama from "../components/SelectDrama/index.vue";

const { filters, useUser, uploadFile, api, storeApi, enums } = useInstance();

const userInfo:any = reactive({});

let dynamicId = ref();

let imageList: Array<any> = reactive([]);

let content = ref("");

let showPop = ref(false);

let showSelectDrama = ref(false);

let showSelectStore = ref(false);

let showSelectInfo = ref(false);

let showUser = ref(false);

let showRank = ref(false);

let chooseDrama:any = reactive({});

let chooseStore:any = reactive({});

let chooseInfomation:any = reactive({});

let chooseUser:any = reactive({});

let chooseRank:any = reactive({});

let chooseType = ref(-1); //选择类型

const selectDramaRef = ref<any>();

const selectStoreRef = ref<any>();

const selectInfoRef = ref<any>();

const selectUserRef = ref<any>();

const selectRankRef = ref<any>();

const typeName = computed(() => {
  if(chooseType.value === 0){
    return '关联剧本';
  }else if(chooseType.value === 1){
    return '关联店铺';
  }else if(chooseType.value === 2){
    return '关联资讯';
  }else if(chooseType.value === 3){
    return '关联用户';
  }else if(chooseType.value === 4){
    return '关联排行榜';
  }
  return '关联内容';
})

const typeValue = computed(() => {
  if(chooseType.value === 0){
    return chooseDrama.dramaName;
  }else if(chooseType.value === 1){
    return chooseStore.storeName;
  }else if(chooseType.value === 2){
    return chooseInfomation.activityName;
  }else if(chooseType.value === 3){
    return chooseUser.nickName;
  }else if(chooseType.value === 4){
    return chooseRank.name;
  }
  return '选择本次动态需要关联的内容';
})

const needCount = computed(() => {
  return `可再加${6 - imageList.length}张`;
})

onLoad(async (option: any) =>{
  dynamicId.value = option.id;

  Object.assign(userInfo, await useUser.getUserInfo());

  await queryDynamicDetail();

  if(showSelectStore.value){
    nextTick(()=>{
      selectStoreRef.value.refresh();
    })
  }
});

function onBack() {
  uni.navigateBack();
}

function onLeftShowPop(){
  if(chooseType.value !== -1){
    showPop.value = true;
  }
}

function onShowPop(){
  if(chooseType.value === 0){
    showSelectDrama.value = true;

    nextTick(()=>{
      selectDramaRef.value.refresh();
    })
  }else if(chooseType.value === 1){
    showSelectStore.value = true;

    nextTick(()=>{
      selectStoreRef.value.refresh();
    })
  }else if(chooseType.value === 2){
    showSelectInfo.value = true;

    nextTick(()=>{
      selectInfoRef.value.refresh();
    })
  }else if(chooseType.value === 3){
    showUser.value = true;

    nextTick(()=>{
      selectUserRef.value.refresh();
    })
  }else if(chooseType.value === 4){
    showRank.value = true;

    nextTick(()=>{
      selectRankRef.value.refresh();
    })
  }else{
    showPop.value = true;
  }
}

function onShowChoosePop(type:any) {
  if(chooseType.value !== -1){
    uni.showModal({
      title: '提示',
      content: '你确定要重新选择关联吗？',
      success: (res) => {
      if (res.confirm) {
        //清空数据
        chooseDrama = {};
        chooseInfomation = {};
        chooseRank = {};
        chooseStore = {};
        chooseUser = {};

        chooseType.value = -1;
      }
    },
    })
    return;
  }
  showPop.value = false;

  if(type === 0){
    showSelectDrama.value = true;

    nextTick(()=>{
      selectDramaRef.value.refresh();
    })
  }else if(type === 1){
    showSelectStore.value = true;

    nextTick(()=>{
      selectStoreRef.value.refresh();
    })
  }else if(type === 2){
    showSelectInfo.value = true;

    nextTick(()=>{
      selectInfoRef.value.refresh();
    })
  }else if(type === 3){
    showUser.value = true;

    nextTick(()=>{
      selectUserRef.value.refresh();
    })
  }else if(type === 4){
    showRank.value = true;

    nextTick(()=>{
      selectRankRef.value.refresh();
    })
  }
}

/**
 * 上传图片
 */
function onUploadImage() {
  let count = 6 - imageList.length;
  if (count <= 0) {
    uni.showToast({
      title: "最多上传6张",
      icon: "none",
    });
    return;
  }

  uni.chooseMedia({
    count,
    success: async function (res) {
      uni.showLoading();

      let promiseArr = [];
      for (let i = 0; i < res.tempFiles.length; i++) {
        promiseArr.push(onUploadFile(res.tempFiles[i].tempFilePath));
      }
      Promise.all(promiseArr).then((_) => {
        uni.hideLoading();
      });
    },
  });
}
function onUploadFile(url: any) {
  return new Promise((resolve) => {
    uploadFile(url).then((e) => {
      imageList.push(e);
      resolve("");
    });
  });
}

/**
 * 选择关联剧本
 * @param e 
 */
function onGetDrama(e:any){
  chooseType.value = 0;
  Object.assign(chooseDrama, e);
  showSelectDrama.value = false;
}

/**
 * 选择关联店铺
 * @param e 
 */
function onGetStore(e:any){
  chooseType.value = 1;
  Object.assign(chooseStore, e);
  showSelectStore.value = false;
}

/**
 * 选择关联资讯
 * @param e 
 */
 function onGetInfomation(e:any){
  chooseType.value = 2;
  Object.assign(chooseInfomation, e);
  showSelectInfo.value = false;
}

/**
 * 选择关联用户
 * @param e 
 */
 function onGetUser(e:any){
  chooseType.value = 3;
  Object.assign(chooseUser, e);
  showUser.value = false;
}

/**
 * 选择关联排行榜
 * @param e 
 */
 function onGetRank(e:any){
  chooseType.value = 4;
  Object.assign(chooseRank, e);
  showRank.value = false;
}

/**
 * 保存动态
 */
async function onSureSave(){
  uni.showLoading();

  await storeApi.addDynamicWithDrama({
    id: dynamicId.value,
    city: uni.getStorageSync("city-info").name,
    content: content.value,
    fileList: imageList,
    isShowAddress: true,
    userId: userInfo.id,
    withDramaId: chooseDrama.id,
    withInfoId: chooseInfomation.id,
    withRankings: chooseRank.type,
    withStoreId: chooseStore.id,
    withUserId: chooseUser.id
  }).catch(e=>{})

  uni.showToast({title: '保存动态成功'});

  setTimeout(()=>{
    uni.navigateBack();
  },1000)
}

async function queryDynamicDetail() {
  let res:any = await api.dynamicDetail({
    id: dynamicId.value,
    userId: userInfo.id,
  });

  Object.assign(imageList, res.fileList);
  content.value = res.content;

  if(res.dramaItem){
    Object.assign(chooseDrama, res.dramaItem);
    chooseType.value = 0;
  }else if(res.storeItem){
    Object.assign(chooseStore, res.storeItem);
    chooseType.value = 1;
  }else if(res.activityPromotion){
    Object.assign(chooseInfomation, res.activityPromotion);
    chooseType.value = 2;
  }else if(res.withUserItem){
    Object.assign(chooseUser, res.withUserItem);
    chooseType.value = 3;
  }else if(res.joinServiceCode){
    Object.assign(chooseRank, {type: res.joinServiceCode, name: enums.Rank_Type.getName(res.joinServiceCode)});
    chooseType.value = 4;
  }
}

function onDeleteImg(idx:number){
  imageList.splice(idx, 1);
}


</script>
<style lang="scss" scoped>
.container {
  background: linear-gradient(
    357deg,
    rgba(28, 184, 90, 0) 0%,
    rgba(220, 232, 255, 0.41) 100%
  );
  height: 100vh;
  &-bottomBox {
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 182rpx;
    background: #fff;
    &-sure {
      margin: 16rpx 0px 0px 24rpx;
      width: 686rpx;
      height: 80rpx;
      background: #d0d0d0;
      border-radius: 64rpx 64rpx 64rpx 64rpx;
      border: 8rpx solid #f2f2f2;
      @include text-middle(30rpx, #fff);
      @include hor-center-center;
    }
  }
}
.topBar {
  @include hor-center;
  height: 64rpx;
  position: relative;
  &-back {
    width: 32rpx;
    height: 32rpx;
    padding-left: 32rpx;
  }
  &-title {
    @include text-normal(26rpx, #2e323e);
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
}
.content {
  height: 100vh;
  &-inputBox {
    margin-top: 40rpx;
    width: 100vw;
    height: 998rpx;
    background: #fefefe;
    border-radius: 40rpx;
    position: relative;
    textarea {
      box-sizing: border-box;
      padding: 40rpx;
      width: 100vw;
      height: 48vh;
      @include text-normal(30rpx, #2e323e);
    }
    &-count {
      position: absolute;
      right: 24rpx;
      top: 46vh;
      @include text-normal(24rpx, #2e323e);
    }
    &-count::after {
      content: "/1000";
      color: #959aa5;
    }
    &-picScroll {
      position: absolute;
      left: 24rpx;
      right: 24rpx;
      // width: calc(100vw - 48rpx);
      bottom: 24rpx;
      // @include hor-center;
      white-space: nowrap;
      overflow-x: scroll;
      padding-top: 20rpx;
      &-item {
        width: 180rpx;
        height: 180rpx;
        display: inline-block;
        margin-right: 10rpx;
        position: relative;
        &-close {
          width: 36rpx;
          height: 36rpx;
          position: absolute;
          right: -6rpx;
          top: -6rpx;
        }
        &-cover {
          border-radius: 28rpx;
        }
      }
      &-upload {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        width: 180rpx;
        height: 180rpx;
        background: #f6f6f6;
        border-radius: 28rpx;
        transform: translateY(12rpx);
        image {
          margin-top: 32rpx;
          width: 80rpx;
          height: 80rpx;
        }
        &-title {
          @include text-bold(26rpx, #2e323e);
        }
      }
    }
  }
  &-relatedBox {
    margin-top: 18rpx;
    width: 100vw;
    padding: 40rpx 24rpx;
    background: #fefefe;
    border-radius: 40rpx;
    @include hor-between-center;
    box-sizing: border-box;
    &-leftBox{
      @include hor-center;
      &-title {
        @include text-bold(28rpx, #2e323e);
      }
      &-arrow {
        margin-left: 8rpx;
        width: 16rpx;
        height: 20rpx;
      }
    }
    &-rightBox {
      @include hor-center;
      &-note {
        @include text-normal(24rpx, #959aa5);
        max-width: 50vw;
        @include text-overflow-line(1);
      }
      &-arrow {
        margin-left: 8rpx;
        width: 16rpx;
        height: 20rpx;
      }
      .active{
        @include text-normal(26rpx, #2E323E);
      }
    }
  }
}
.popBox {
  width: 100vw;
  height: 800rpx;
  padding: 0px 40rpx;
  box-sizing: border-box;
  @include ver;
  &-title {
    @include text-middle(32rpx, #000);
    margin-top: 30rpx;
    text-align: center;
  }
  &-note {
    @include text-normal(24rpx, #959aa5);
    text-align: center;
    padding-bottom: 20rpx;
  }
  &-close {
    position: absolute;
    right: 0px;
    top: 0px;
    width: 45rpx;
    height: 45rpx;
    padding: 40rpx 30rpx 0px 0px;
  }
  &-item {
    @include hor-between-center;
    padding: 40rpx 0px;
    border-bottom: 2rpx solid #f5f5f5;
    &-rightBox {
      @include hor-center;
      &-note {
        @include text-normal(24rpx, #959aa5);
        max-width: 50vw;
        @include text-overflow-line(1);
      }
      &-arrow {
        margin-left: 8rpx;
        width: 16rpx;
        height: 20rpx;
      }
      .active{
        @include text-normal(26rpx, #2E323E);
      }
    }
  }
}
</style>