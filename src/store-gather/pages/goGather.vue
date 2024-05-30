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
          <span class="topBar-title">发起组局</span>
        </div>
      </template>
      <template v-slot:view>
        <div
          class="cell mt15"
          @click="onSelectDrama"
          :style="gatherProduct.dramaItem ? 'height: 270rpx;' : ''"
        >
          <image :src="filters.icon('gather-select-drama')" class="cell-tag" />
          <span class="cell-title">选择剧本</span>
          <image :src="filters.icon('gather-right-arrow')" class="cell-arrow" />
          <div class="cell-dramaInfo" v-if="gatherProduct.dramaItem">
            <image
              :src="gatherProduct.dramaItem.dramaCover"
              class="cell-dramaInfo-cover"
              mode="aspectFill"
            />
            <image
              :src="filters.icon(gatherProduct.dramaItem.sellType)"
              class="cell-dramaInfo-sellType"
            />
            <span class="cell-dramaInfo-title">{{
              gatherProduct.dramaItem.dramaName
            }}</span>
            <div class="cell-dramaInfo-dictBox">
              <div
                class="cell-dramaInfo-dictBox-val mr6"
                v-for="val in gatherProduct.dramaItem.dicts"
                :key="val.id"
              >
                {{ val.dictValue }}
              </div>
            </div>
          </div>
        </div>
        <div class="cell mt15" @click="showPicker = true">
          <image :src="filters.icon('gather-select-date')" class="cell-tag" />
          <span class="cell-title">选择时间</span>
          <span class="cell-moreValue">{{ formatDate }}</span>
          <image :src="filters.icon('gather-right-arrow')" class="cell-arrow" />
        </div>
        <div class="cell mt15">
          <image :src="filters.icon('gather-select-price')" class="cell-tag" />
          <span class="cell-title">价格</span>
          <span class="cell-value" v-if="gatherProduct.dramaItem"
            >¥{{ gatherProduct.currentPrice / 100 }}</span
          >
          <span class="cell-placeholder" v-else>待定</span>
        </div>
        <div class="cell mt18">
          <image
            :src="filters.icon('gather-select-revertSex')"
            class="cell-tag"
          />
          <span class="cell-title">角色反串</span>
          <div class="cell-radio">
            <div @click="onChangeReverSex(true)" class="cell-radio-left">
              <image
                :src="filters.icon('gather-checkBox')"
                class="cell-radio-check"
                v-if="isRevertSex"
              />
              <div class="cell-radio-unCheck" v-else></div>
              <span class="cell-radio-title">是</span>
            </div>
            <div style="width: 80rpx"></div>
            <div @click="onChangeReverSex(false)" class="cell-radio-right">
              <image
                :src="filters.icon('gather-checkBox')"
                class="cell-radio-check"
                v-if="!isRevertSex"
              />
              <div class="cell-radio-unCheck" v-else></div>
              <span class="cell-radio-title">否</span>
            </div>
          </div>
        </div>
        <div class="cell mt18" @click="onShowTimePicker">
          <image :src="filters.icon('gather-select-store')" class="cell-tag" />
          <span class="cell-title">剧本时长</span>
          <image :src="filters.icon('gather-right-arrow')" class="cell-arrow" />
          <span class="cell-moreValue" v-if="pickerTime.length">{{ pickerTime[0] }}{{ pickerTime[1] }}</span>
        </div>
        <div class="cell mt18" @click="onEditPeople">
          <image :src="filters.icon('gather-select-people')" class="cell-tag" />
          <span class="cell-timeTitle">添加占位</span>
          <span class="cell-moreValue">{{ maleCount }}男{{ femaleCount }}女</span>
          <image :src="filters.icon('gather-right-arrow')" class="cell-arrow" />
        </div>
        <div class="remarkBox mt15 ml15">
          <textarea
            placeholder="(选填)可以描述一下想和怎样的队友一起玩，或者其他特殊说明~"
            placeholder-class="placeholder"
            class="remark"
            v-model="content"
            maxlength="100"
          ></textarea>
          <span class="remarkBox-count">{{ content.length }}</span>
          <div class="remarkBox-deleteBox" @click="onDeleteRemark">
            <image
              :src="filters.icon('remark-delete')"
              class="remarkBox-deleteBox-tag"
            />
            <span class="ml2">清空</span>
          </div>
        </div>
        <div style="height: 200rpx"></div>
      </template>
    </jy-navigationBar>
    <div class="bottomBox" @click="onGoGather" v-if="canSubmit">发布组局</div>
    <div class="un-bottomBox" v-else>发布组局</div>
    <!-- 选择时间 -->
    <up-datetime-picker
      ref="datetimePickerRef"
      :show="showPicker"
      v-model="pickerDate"
      mode="datetime"
      :formatter="formatter"
      :minDate="minDate"
      :maxDate="maxDate"
      :filter="filter"
      @cancel="showPicker = false"
      @confirm="showPicker = false"
    ></up-datetime-picker>
    <up-picker :show="showTimePicker" :defaultIndex="[0]" ref="uPickerRef" :columns="columns" @cancel="showTimePicker = false" @confirm="onConfirmPicker" @change="changeHandler"></up-picker>
    <u-popup
      :show="showPop"
      @close="showPop = false"
      @open="showPop = true"
      mode="center"
      :round="22"
      :safeAreaInsetBottom="false"
    >
      <div class="popBox">
        <span class="popBox-title">添加占位</span>
        <div class="popBox-close" @click="showPop = false">
          <up-icon name="close" color="#1A1A1A" size="20"></up-icon>
        </div>
        <div class="popBox-maleBox">
          <image
            :src="filters.icon('store-gather-male')"
            class="popBox-maleBox-tag"
          />
          <span class="popBox-maleBox-title">男</span>
          <div class="popBox-maleBox-editMaleBox">
            <image
              :src="filters.icon(canCaledate('reduce', 'male'))"
              class="popBox-maleBox-editMaleBox-cart"
              @click="onCaledate('reduce', 'male')"
            />
            <span class="popBox-maleBox-editMaleBox-count">{{
              editMaleNum
            }}</span>
            <image
              :src="filters.icon(canCaledate('plus', 'male'))"
              class="popBox-maleBox-editMaleBox-cart"
              @click="onCaledate('plus', 'male')"
            />
          </div>
        </div>
        <div class="popBox-femaleBox">
          <image
            :src="filters.icon('store-gather-female')"
            class="popBox-femaleBox-tag"
          />
          <span class="popBox-femaleBox-title">女</span>
          <div class="popBox-femaleBox-editFeMaleBox">
            <image
              :src="filters.icon(canCaledate('reduce', 'female'))"
              class="popBox-femaleBox-editFeMaleBox-cart"
              @click="onCaledate('reduce', 'female')"
            />
            <span class="popBox-femaleBox-editFeMaleBox-count">{{
              editFemaleNum
            }}</span>
            <image
              :src="filters.icon(canCaledate('plus', 'female'))"
              class="popBox-femaleBox-editFeMaleBox-cart"
              @click="onCaledate('plus', 'female')"
            />
          </div>
        </div>
        <div class="popBox-note">{{ needPeople }}</div>
        <div class="popBox-bottom" @click="onSurePeople">确定</div>
      </div>
    </u-popup>
  </div>
</template>
<script lang="ts" setup>
const {
  getDate,
  useUser,
  filters,
  dayjs,
  gatherApi,
  useStore,
  storeApi,
  menuButtonRect,
} = useInstance();

let userInfo: any = reactive({});

let storeInfo: any = reactive({});

let gatherProduct: any = reactive({});

let showPicker = ref(false);

let showTimePicker = ref(false);

let showPop = ref(false);

let pickerDate = ref(Date.now());

let pickerTime:Array<String> = reactive([]);

let minDate = ref();

let maxDate = ref();

const datetimePickerRef = ref();

const uPickerRef = ref();

let content = ref("");

let cityName = ref();

let isRevertSex = ref(true);

let maleCount = ref(0);

let femaleCount = ref(0);

let editMaleNum = ref(0);

let editFemaleNum = ref(0);

let canDo = ref(false);

const columns = reactive([
  ['1时', '2时','3时', '4时','5时', '6时','7时', '8时','9时', '10时','11时', '12时']
]);
const columnData = reactive([
  ['00分', '30分']
]);

/**
 * 格式化日期picker
 * @param type
 * @param value
 */
const formatter = (type: string, value: string) => {
  if (type === "year") {
    return `${value}年`;
  }
  if (type === "month") {
    return `${value}月`;
  }
  if (type === "day") {
    return `${value}日`;
  }
  if (type === "hour") {
    return `${value}时`;
  }
  if (type === "minute") {
    return `${value}分`;
  }
  return value;
};

const formatDate = computed(() => {
  return `${dayjs(pickerDate.value).format("MM月DD日")} ${filters.getWeek(
    pickerDate.value
  )} ${dayjs(pickerDate.value).format("HH:mm")}`;
});


const canSubmit = computed(()=>{
  return pickerDate.value && pickerTime.length && gatherProduct.id;
})

//缺男女人数
const needPeople = computed(()=>{
  if(!gatherProduct.id)return "";

  if(isRevertSex.value){
    let count = gatherProduct.maleGamerNum + gatherProduct.femaleGamerNum - editMaleNum.value - editFemaleNum.value;
    if(count > 0){
      return `缺${count}人`;
    }
  }else{
    let maleNum = gatherProduct.maleGamerNum - editMaleNum.value;
    let femaleNum = gatherProduct.femaleGamerNum - editFemaleNum.value;
    return `${maleNum > 0 || femaleNum > 0 ? '缺':''}${maleNum > 0 ? `${maleNum}男`: ''}${femaleNum > 0 ? `${femaleNum}女`: ''}`;
  }
  return "";
})

/**
 * 处理加减男女按钮状态
 */
const canCaledate = computed(() => (type: string, sex: string) => {
  let needCount = gatherProduct.maleGamerNum + gatherProduct.femaleGamerNum;
  let maleLimitNum = gatherProduct.id ? gatherProduct.maleGamerNum: 0;
  let femaleLimitNum = gatherProduct.id ? gatherProduct.femaleGamerNum: 0;

  if (sex === "male") {
    if (type === "reduce") {
      if (editMaleNum.value === 0) {
        return "icon-disable-reduce";
      } else {
        return "icon-can-reduce";
      }
    } else {
      if (editMaleNum.value === (isRevertSex.value ? (needCount - editFemaleNum.value): maleLimitNum) || !gatherProduct.id) {
        return "icon-disable-plus";
      } else {
        return "icon-can-plus";
      }
    }
  } else {
    if (type === "reduce") {
      if (editFemaleNum.value === 0) {
        return "icon-disable-reduce";
      } else {
        return "icon-can-reduce";
      }
    } else {
      if (editFemaleNum.value === (isRevertSex.value ? (needCount - editMaleNum.value): femaleLimitNum) || !gatherProduct.id) {
        return "icon-disable-plus";
      } else {
        return "icon-can-plus";
      }
    }
  }
});

onLoad(async () => {
  await useStore.setStoreId(4);
  Object.assign(storeInfo, useStore.storeInfo);
  Object.assign(userInfo, await useUser.getUserInfo());
  onDoCurrentDate();
});

onShow(() => {
  if (uni.getStorageSync("gatherProduct")) {
    Object.assign(gatherProduct, uni.getStorageSync("gatherProduct"));
    uni.removeStorageSync("gatherProduct");
  }
  cityName.value = uni.getStorageSync("city-info").name;
});

function onSelectDrama() {
  uni.navigateTo({
    url: `/player-gather/pages/selectDrama?storeId=${storeInfo.id}`,
  });
}

function onBack() {
  uni.navigateBack();
}

function onDeleteRemark() {
  content.value = "";
}

function onChangeReverSex(status:boolean){
  isRevertSex.value = status;
  maleCount.value = 0;
  femaleCount.value = 0;
}

function onShowTimePicker(){
  showTimePicker.value = true;
  uPickerRef.value.setColumnValues(1, columnData[0]);
}

function changeHandler(){
  uPickerRef.value.setColumnValues(1, columnData[0]);
}

function onConfirmPicker(e:any){
  if(!e.value[1]) e.value[1] = '00分';

  Object.assign(pickerTime, e.value);
  showTimePicker.value = false;
}

//发起拼车
async function onGoGather() {
  if(canDo.value)return;
  canDo.value = true;

  uni.showLoading();

  let gameTime;
  if(pickerTime.length){
    gameTime = Number(pickerTime[0].substring(0, pickerTime[0].length - 1)) + Number(pickerTime[1].substring(0, pickerTime[1].length - 1)) / 60;
  }

  try{
    await gatherApi.storeCreateGathering({
      botFemaleGamerNum: femaleCount.value,
      botMaleGamerNum: maleCount.value,
      content: content.value,
      gameStartTime: dayjs(pickerDate.value).format("YYYY-MM-DD HH:mm:ss"),
      gameTime,
      isRevertSex: isRevertSex.value,
      originPrice: gatherProduct.originPrice,
      storeId: storeInfo.id,
      storeProductId: gatherProduct.id,
    })

    setTimeout(()=>{
      uni.showToast({title: '发布组局成功'});
      uni.navigateBack();
    }, 1000) 
  }catch(e:any){
    uni.hideLoading();
    canDo.value = false;
  }
}

//添加机器人
function onEditPeople(){
  editMaleNum.value = JSON.parse(JSON.stringify(maleCount.value));
  editFemaleNum.value = JSON.parse(JSON.stringify(femaleCount.value));
  showPop.value = true;
} 

function onSurePeople(){
  maleCount.value = JSON.parse(JSON.stringify(editMaleNum.value));
  femaleCount.value = JSON.parse(JSON.stringify(editFemaleNum.value));
  editMaleNum.value = 0;
  editFemaleNum.value = 0;
  showPop.value = false;
}

//加减男女操作
function onCaledate(action:string, type:string){
  if(!gatherProduct.id)return;

  let needCount = gatherProduct.maleGamerNum + gatherProduct.femaleGamerNum;

  if(action === 'reduce'){
    if(type === 'male'){
      if(editMaleNum.value > 0){
        editMaleNum.value--;
      }
    }else{
      if(editFemaleNum.value > 0){
        editFemaleNum.value--;
      }
    }
  }else{
    if(type === 'male'){
      if(editMaleNum.value < (isRevertSex.value ? (needCount - editFemaleNum.value): gatherProduct.maleGamerNum)){
        editMaleNum.value++;
      }
    }else{
      if(editFemaleNum.value < (isRevertSex.value ? (needCount - editMaleNum.value): gatherProduct.femaleGamerNum)){
        editFemaleNum.value++;
      }
    }
  }
}

/**
 * 筛选日期picker选项
 * @param type
 * @param options
 */
function filter(type: string, options: any) {
  if (type === "minute") {
    return options.filter(
      (option: any) =>
        option === "00" ||
        option === "10" ||
        option === "20" ||
        option === "30" ||
        option === "40" ||
        option === "50"
    );
  }
  return options;
}

/**
 * 处理日期picker的最大最小日期
 */
function onDoCurrentDate() {
  let hour = new Date().setHours(new Date().getHours() + 1);
  let addHour = new Date(hour).setMinutes(new Date().getMinutes());
  let minute = new Date(addHour).getMinutes();

  if (minute > 0 && minute <= 10) {
    minute = 10;
  } else if (minute > 10 && minute <= 20) {
    minute = 20;
  } else if (minute > 20 && minute <= 30) {
    minute = 30;
  } else if (minute > 30 && minute <= 40) {
    minute = 40;
  } else if (minute > 40 && minute <= 50) {
    minute = 50;
  } else if (minute === 0 || minute > 50) {
    minute = 0;
    addHour = new Date().setHours(new Date().getHours() + 2);
  } else {
    minute = 0;
    addHour = new Date().setHours(new Date().getHours() + 1);
  }
  minDate.value = pickerDate.value = new Date(addHour).setMinutes(minute);
  maxDate.value = new Date(getDate(-13)).getTime();
}
</script>
  <style>
.placeholder {
  font-family: PingFang SC, PingFang SC;
  font-size: 28rpx !important;
  color: #bbbbbb !important;
}
</style>
  <style lang="scss" scoped>
.container {
  &-fixBg {
    @include fixed-center;
    background: #f5f5f5;
  }
  .cell {
    margin-left: 30rpx;
    width: 690rpx;
    height: 104rpx;
    background: #ffffff;
    border-radius: 24rpx;
    position: relative;
    @include hor-center;
    &-tag {
      position: absolute;
      top: 32rpx;
      left: 30rpx;
      width: 40rpx;
      height: 40rpx;
    }
    &-arrow {
      position: absolute;
      top: 32rpx;
      right: 30rpx;
      width: 26rpx;
      height: 28rpx;
    }
    &-title,
    &-timeTitle {
      position: absolute;
      top: 32rpx;
      left: 90rpx;
      @include text-bold(26rpx, #1a1a1a);
      @include text-overflow-line(1);
      max-width: 60%;
    }
    &-timeTitle::after {
      content: "(选填)";
      color: #bbbbbb;
      font-size: 26rpx;
      margin-left: 6rpx;
    }
    &-value {
      position: absolute;
      top: 32rpx;
      right: 30rpx;
      @include text-middle(26rpx, #999);
    }
    &-moreValue {
      position: absolute;
      top: 32rpx;
      right: 88rpx;
      @include text-middle(26rpx, #999);
    }
    &-placeholder {
      position: absolute;
      top: 32rpx;
      right: 30rpx;
      @include text-middle(26rpx, #bbb);
    }
    &-dramaInfo {
      position: absolute;
      left: 30rpx;
      right: 30rpx;
      bottom: 30rpx;
      top: 104rpx;
      &-cover {
        width: 100rpx;
        height: 136rpx;
        border-radius: 12rpx;
      }
      &-sellType {
        position: absolute;
        left: 8rpx;
        top: 8rpx;
        width: 56rpx;
        height: 32rpx;
      }
      &-title {
        @include text-middle(28rpx, #1a1a1a);
        position: absolute;
        left: 120rpx;
        top: 18rpx;
      }
      &-dictBox {
        position: absolute;
        left: 120rpx;
        right: 0px;
        bottom: 16rpx;
        white-space: nowrap;
        overflow-x: scroll;
        @include hor-center;
        &-val {
          padding: 0px 10rpx;
          line-height: 32rpx;
          background: #f4f5f6;
          border-radius: 16rpx;
          @include text-normal(20rpx, #999);
        }
      }
    }
    &-radio {
      @include hor-center;
      position: absolute;
      right: 30rpx;
      &-left,
      &-right {
        @include hor-center;
      }
      &-check {
        width: 32rpx;
        height: 32rpx;
      }
      &-unCheck {
        width: 32rpx;
        height: 32rpx;
        border-radius: 10rpx;
        border: 2rpx solid #999999;
        box-sizing: border-box;
      }
      &-title {
        @include text-middle(28rpx, #1a1a1a);
        margin-left: 6rpx;
      }
    }
  }
  .remarkBox {
    width: 690rpx;
    height: 288rpx;
    background: #ffffff;
    border-radius: 24rpx;
    padding: 30rpx;
    box-sizing: border-box;
    position: relative;
    .remark {
      color: #999;
      height: 180rpx;
    }
    &-count {
      @include text-middle(22rpx, #1a1a1a);
      position: absolute;
      right: 30rpx;
      bottom: 30rpx;
      &::after {
        content: "/100";
        color: #999999;
      }
    }
    &-deleteBox {
      position: absolute;
      left: 30rpx;
      bottom: 30rpx;
      @include hor-center;
      @include text-middle(22rpx, #a3a3a3);
      z-index: 1;
      &-tag {
        width: 32rpx;
        height: 32rpx;
      }
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
.un-bottomBox,
.bottomBox {
  position: fixed;
  left: 30rpx;
  bottom: 62rpx;
  width: 690rpx;
  height: 96rpx;
  border-radius: 32rpx;
  @include text-bold(32rpx, #fff);
  @include hor-center-center;
}
.bottomBox {
  background: #14c9c9;
}
.un-bottomBox {
  background: rgba(20, 201, 201, 0.5);
}
.popBox {
  width: 626rpx;
  height: 678rpx;
  position: relative;
  &-title {
    position: absolute;
    top: 40rpx;
    width: 100%;
    text-align: center;
    @include text-bold(28rpx, #1a1a1a);
  }
  &-close {
    position: absolute;
    right: 0px;
    top: 0px;
    padding: 40rpx 40rpx 34rpx 40rpx;
  }
  &-maleBox,
  &-femaleBox {
    position: absolute;
    top: 102rpx;
    width: 252rpx;
    height: 340rpx;
    background: linear-gradient(
      180deg,
      #e2f8ff 0%,
      rgba(247, 247, 247, 0) 100%
    );
    border-radius: 32rpx;
    @include ver-center;
    &-tag {
      margin-top: 48rpx;
      width: 100rpx;
      height: 100rpx;
    }
    &-title {
      margin-top: 20rpx;
      @include text-bold(28rpx, #1a1a1a);
    }
    &-editMaleBox,
    &-editFeMaleBox {
      @include hor-center;
      margin-top: 56rpx;
      &-cart {
        width: 32rpx;
        height: 32rpx;
      }
      &-count {
        @include text-middle(28rpx, #1a1a1a);
        padding: 0px 30rpx;
      }
    }
    &-editFeMaleBox {
      top: 278rpx;
    }
  }
  &-maleBox {
    left: 40rpx;
  }
  &-femaleBox {
    right: 40rpx;
    background: linear-gradient(
      180deg,
      #ffe7e7 0%,
      rgba(247, 247, 247, 0) 100%
    );
  }
  &-note {
    position: absolute;
    width: 100%;
    text-align: center;
    bottom: 170rpx;
    @include text-middle(28rpx, #999);
  }
  &-bottom {
    position: absolute;
    left: 40rpx;
    bottom: 40rpx;
    width: 546rpx;
    height: 96rpx;
    background: #14c9c9;
    border-radius: 32rpx;
    @include text-bold(28rpx, #fff);
    @include hor-center-center;
  }
}
</style>