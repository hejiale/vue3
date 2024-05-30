<template>
  <div class="container">
    <image :src="filters.icon('evaluate-bg')" class="bg" mode="widthFix" />
    <jy-navigationBar>
      <template v-slot:content>
        <div class="topBar">
          <image
            :src="filters.icon('store-back')"
            class="topBar-back"
            @click="onBack"
          ></image>
          <span class="topBar-title">店铺评价</span>
        </div>
      </template>
    </jy-navigationBar>
    <div class="titleBox">
      <div class="titleBox-left">
        <image :src="storeInfo.storeLogo" mode="aspectFill" />
        <span class="titleBox-left-title">{{ storeInfo.storeName }}</span>
      </div>
      <image
        :src="filters.icon('evaluate-release')"
        class="titleBox-right"
        @click="evaluateRequest"
      />
    </div>
    <scroll-view class="content" scroll-y>
      <div class="content-statusBox">
        <image
          :src="filters.icon('evaluate-unUse-select')"
          mode="aspectFill"
          v-if="evaluateStatus === 0"
          @click="onUnChange()"
        />
        <image
          :src="filters.icon('evaluate-unUse-unSelect')"
          mode="aspectFill"
          v-if="evaluateStatus !== 0"
          @click="onChange(0)"
        />
        <image
          :src="filters.icon('evaluate-normal-select')"
          mode="aspectFill"
          v-if="evaluateStatus === 1"
          @click="onUnChange()"
        />
        <image
          :src="filters.icon('evaluate-normal-unSelect')"
          mode="aspectFill"
          v-if="evaluateStatus !== 1"
          @click="onChange(1)"
        />
        <image
          :src="filters.icon('evaluate-nice-select')"
          mode="aspectFill"
          v-if="evaluateStatus === 2"
          @click="onUnChange()"
        />
        <image
          :src="filters.icon('evaluate-nice-unSelect')"
          mode="aspectFill"
          v-if="evaluateStatus !== 2"
          @click="onChange(2)"
        />
      </div>
      <div class="content-rateBox">
        <div class="content-rateBox-item">
          <span class="content-rateBox-item-title">环境</span>
          <u-rate active-color="#FE5C35" inactive-color="#CECECE" gutter="5" v-model="environmentValue" size="20" allowHalf></u-rate>
          <span :class="environmentValue * 2 >= 9 ? 'niceText ml12' : 'normalText ml12'"
            >{{ environmentValue * 2 }}分{{
              niceStatus(environmentValue * 2)
            }}</span
          >
        </div>
        <div class="content-rateBox-item">
          <span class="content-rateBox-item-title">服务</span>
          <u-rate active-color="#FE5C35" inactive-color="#CECECE" gutter="5" v-model="serviceValue" size="20" allowHalf></u-rate>
          <span :class="serviceValue * 2 >= 9 ? 'niceText ml12' : 'normalText ml12'"
            >{{ serviceValue * 2 }}分{{ niceStatus(serviceValue * 2) }}</span
          >
        </div>
        <div class="content-rateBox-item">
          <span class="content-rateBox-item-title">D M</span>
          <u-rate active-color="#FE5C35" inactive-color="#CECECE" gutter="5" v-model="dmValue" size="20" allowHalf></u-rate>
          <span :class="dmValue * 2 >= 9 ? 'niceText ml12' : 'normalText ml12'"
            >{{ dmValue * 2 }}分{{ niceStatus(dmValue * 2) }}</span
          >
        </div>
      </div>
      <div class="content-inputContent">
        <div class="content-inputContent-textareaBox">
          <textarea
            placeholder="你可以从环境、服务、DM等方面进行评价"
            :maxlength="1000"
            v-model="evaluateContent"
            auto-height
            @blur="onBlurText"
            class="content-inputContent-textareaBox-textarea"
          />
          <div class="content-inputContent-textareaBox-numBox">
            {{ evaluateContent.length }}
          </div>
        </div>
        <view class="content-inputContent-uploadImgsBox" scroll-x>
          <div
            src=""
            v-for="(url, idx) in imageList"
            :key="url"
            class="content-inputContent-uploadImgsBox-item"
          >
            <image
              :src="url"
              @click.stop="onPreView(idx)"
              v-if="isImage(url)"
              mode="aspectFill"
            />
            <image
              :src="url + '?x-oss-process=video/snapshot,t_1000,m_fast'"
              @click.stop="onPreView(idx)"
              v-else
              mode="aspectFill"
            />
            <image
              :src="filters.icon('icon-dark-close')"
              class="content-inputContent-uploadImgsBox-item-close"
              @click="onDeleteImg(idx)"
            />
          </div>
          <div
            class="content-inputContent-uploadImgsBox-add"
            @click="onUploadImage"
            v-if="imageList.length < 6"
          >
            <image
              :src="filters.icon('icon-upload-camera')"
              class="content-inputContent-uploadImgsBox-add-icon"
            />
            <span class="content-inputContent-uploadImgsBox-add-title">{{
              uploadNote
            }}</span>
          </div>
        </view>
        <div class="content-inputContent-bottomBox">
          <div
            class="content-inputContent-bottomBox-item"
            @click="onSelectDrama"
          >
            <div class="content-inputContent-bottomBox-item-top">
              <image
                :src="filters.icon('relate-drama-select')"
                class="content-inputContent-bottomBox-item-top-icon"
                v-if="evaluateDrama.dramaId"
              />
              <image
                :src="filters.icon('relate-drama-unSelect')"
                class="content-inputContent-bottomBox-item-top-icon"
                v-else
              />
              <span class="content-inputContent-bottomBox-item-top-title">{{
                evaluateDrama.dramaName || "关联剧本"
              }}</span>
              <u-icon name="arrow-right" size="12" color="#959AA5"></u-icon>
            </div>
            <div class="content-inputContent-bottomBox-item-bottom">
              选择您体验的剧本
            </div>
          </div>
          <div class="content-inputContent-bottomBox-item" @click="onSelectDM">
            <div class="content-inputContent-bottomBox-item-top">
              <image
                :src="filters.icon('relate-DM-select')"
                class="content-inputContent-bottomBox-item-top-icon"
                v-if="evaluateDM.userId"
              />
              <image
                :src="filters.icon('relate-DM-unSelect')"
                class="content-inputContent-bottomBox-item-top-icon"
                v-else
              />
              <span class="content-inputContent-bottomBox-item-top-title">{{
                evaluateDM.userId
                  ? evaluateDM.userName || evaluateDM.nickName
                  : "DM评价"
              }}</span>
              <u-icon name="arrow-right" size="12" color="#959AA5"></u-icon>
            </div>
            <div class="content-inputContent-bottomBox-item-bottom">
              请选择本次带本的DM
            </div>
          </div>
        </div>
      </div>
    </scroll-view>
    <u-popup :show="showSelectDrama" @close="showSelectDrama = false" :round="16">
      <div class="popDramaBox">
        <div class="popDramaBox-title">关联剧本 ({{ dramaTotal }})</div>
        <div class="popDramaBox-subTitle">{{ storeInfo.storeName }}</div>
        <div class="popDramaBox-searchBox">
          <input
            v-model="searchValue"
            @focus="onFocus"
            @input="onFocus"
            @blur="onSearch"
          />
          <div class="popDramaBox-searchBox-placeholderBox" v-if="!isFocus">
            <image :src="filters.icon('icon-search')" />
            <span class="popDramaBox-searchBox-placeholderBox-title">输入关键词搜索</span>
          </div>
        </div>
        <div class="popDramaBox-filterBox">
          <div class="popDramaBox-filterBox-item">
            <span class="popDramaBox-filterBox-item-title">题材：</span>
            <scroll-view scroll-x class="popDramaBox-filterBox-item-scrolls">
              <div
                class="popDramaBox-filterBox-item-scrolls-item"
                :class="{active: dictParama === dic.id}"
                v-for="dic in dicts"
                :key="dic.id"
                @click="onSelectDict(dic.id)"
              >
                {{ dic.dictValue }}
              </div>
            </scroll-view>
          </div>
          <div class="popDramaBox-filterBox-item">
            <span class="popDramaBox-filterBox-item-title">人数：</span>
            <scroll-view scroll-x class="popDramaBox-filterBox-item-scrolls">
              <div
                class="popDramaBox-filterBox-item-scrolls-item"
                :class="{active: peopleParama === v}"
                v-for="v in peoples"
                :key="v"
                @click="onSelectPeople(v)"
              >
                {{ v }}
              </div>
            </scroll-view>
          </div>
        </div>
        <scroll-view
          class="popDramaBox-listBox"
          scroll-y
          @scrolltolower="onLoadMore"
          v-if="dramaList.length"
        >
          <div
            class="popDramaBox-listBox-item"
            v-for="drama in dramaList"
            :key="drama.id"
            @click.stop="onChooseDrama(drama)"
          >
            <div class="popDramaBox-listBox-item-cover">
              <image :src="drama.dramaCover" mode="aspectFill" />
              <image
                :src="filters.icon(drama.sellType)"
                class="popDramaBox-listBox-item-cover-sellType"
              />
            </div>
            <div class="popDramaBox-listBox-item-info">
              <span class="popDramaBox-listBox-item-info-name">{{ drama.dramaName }}</span>
              <span class="popDramaBox-listBox-item-info-dictValue">{{ filters.doCalculateDramaDicts(drama.dramaThemes) }}</span>
              <span class="popDramaBox-listBox-item-info-game"
                >{{ drama.maleGamerNum }}男{{ drama.femaleGamerNum }}女
                {{ drama.gameTime }}小时</span
              >
            </div>
            <image
              :src="filters.icon('pop-select')"
              class="popDramaBox-listBox-item-status"
              v-if="selectDrama.dramaId === drama.dramaId"
            />
            <image
              :src="filters.icon('pop-unSelect')"
              class="popDramaBox-listBox-item-status"
              v-else
            />
          </div>
        </scroll-view>
        <!-- <notcData v-else /> -->
        <div class="popDramaBox-sureBox" @click="onSureSelect">
          <image
            :src="filters.icon('pop-sure-select')"
            class="popDramaBox-sureBox-select"
            v-if="selectDrama"
          />
          <image
            :src="filters.icon('pop-sure-unSelect')"
            class="popDramaBox-sureBox-select"
            v-else
          />
        </div>
      </div>
    </u-popup>
    <u-popup :show="showSelectDM" @close="showSelectDM = false" :round="16">
      <div class="popDM_Box">
        <div class="popDM_Box-title">关联DM ({{ DM_total }})</div>
        <div class="popDM_Box-subTitle">{{ storeInfo.storeName }}</div>
        <scroll-view
          class="popDM_Box-listBox"
          scroll-y
          @scrolltolower="onLoadMore"
          v-if="dmList.length"
        >
          <div
            class="popDM_Box-listBox-item"
            v-for="dm in dmList"
            :key="dm.userId"
            @click="onChooseDM(dm)"
          >
            <image
              class="popDM_Box-listBox-item-cvoer"
              :src="dm.avatar"
              mode="aspectFill"
            />
            <span class="popDM_Box-listBox-item-name">{{ dm.userName }}</span>
            <image
              :src="filters.icon('pop-select')"
              class="popDM_Box-listBox-item-status"
              v-if="selectDM.userId === dm.userId"
            />
            <image
              :src="filters.icon('pop-unSelect')"
              class="popDM_Box-listBox-item-status"
              v-else
            />
          </div>
        </scroll-view>
        <notcData v-else />
        <div class="popDM_Box-sureBox" @click="onSureSelectDM">
          <image
            :src="filters.icon('pop-sure-select')"
            class="popDM_Box-sureBox-select"
            v-if="selectDM"
          />
          <image
            :src="filters.icon('pop-sure-unSelect')"
            class="popDM_Box-sureBox-select"
            v-else
          />
        </div>
      </div>
    </u-popup>
  </div>
</template>
<script setup lang="ts">
const {
  api,
  storeApi,
  filters,
  useUser,
  checkContent,
  judgeMediaType,
  uploadFile,
} = useInstance();

let dmValue = ref(0);
let environmentValue = ref(0);
let serviceValue = ref(0);
let evaluateStatus = ref(); // 0 不行 1  普通 2 超赞
let evaluateContent = ref("");
let imageList: Array<any> = reactive([]);
let showSelectDrama = ref(false);
let showSelectDM = ref(false);
let searchValue = ref("");
let dicts: Array<any> = reactive([]);
let peoples = ref(["全部", "≤4人", "5人", "6人", "7人", "8人", "≥9人"]);
let dictParama: any = reactive({id: -1});
let peopleParama = ref("全部");
let pageNo = ref(1);
let dramaList: Array<any> = reactive([]);
let isFocus = ref(false);
let selectDrama:any = reactive({});
let evaluateDrama: any = reactive({});
let selectDM: any = reactive({});
let evaluateDM: any = reactive({});
let dramaTotal = ref(0);
let DM_total = ref(0);
let dmList: Array<any> = reactive([]);
let storeInfo: any = reactive({});
let userInfo: any = reactive({});
let evaluateId = ref();
let canRate = ref(false);
let auditStatus = ref();
let canDo = ref(false);

onLoad(async (options: any) => {
  evaluateId.value = options.id;

  if (evaluateId.value) {
    queryEvaluateDetail();
  }
  Object.assign(storeInfo, uni.getStorageSync("store-info"));
  uni.removeStorageSync("store-info");

  let res = await useUser.getUserInfo();
  Object.assign(userInfo, res);

  getDicts();
});
const niceStatus = computed(() => (val: any) => {
  return val >= 9 ? " 超赞!" : "";
});

const uploadNote = computed(() => {
  return imageList.length < 6
    ? imageList.length > 0
      ? `可再加${6 - imageList.length}张`
      : "图片/视频"
    : "";
});

const isImage = computed(() => (v: any) => {
  return judgeMediaType(v) === "image";
});

//加载更多
function onLoadMore() {
  if (showSelectDrama.value) {
    if (dramaTotal.value === dramaList.length) return;

    pageNo.value++;
    queryDramaList();
  } else {
    if (DM_total.value === dmList.length) return;

    pageNo.value++;
    queryDM_List();
  }
}

//输入搜索框处理
function onFocus() {
  isFocus.value = true;
}
function onSearch() {
  if (!searchValue.value) {
    isFocus.value = false;
  }
  pageNo.value = 1;
  queryDramaList();
}
//对评价内容判断是否违规
async function onBlurText() {
  try {
    await checkContent(evaluateContent.value);
  } catch (e) {
    evaluateContent.value = "";
  }
}
function onChooseDrama(v: any) {
  if(selectDrama.dramaId === v.dramaId){
    Object.assign(selectDrama, {dramaId: null});
  }else{
    Object.assign(selectDrama, v);
  }
}
function onSureSelect() {
  if (selectDrama) {
    Object.assign(evaluateDrama, JSON.parse(JSON.stringify(selectDrama)));
    Object.assign(selectDrama, {});
  } else {
    Object.assign(evaluateDrama, {});
  } 
  showSelectDrama.value = false;
}
function onChooseDM(v: any) {
  if (selectDM.userId === v.userId) {
    Object.assign(selectDM, {userId: null});
  } else {
    Object.assign(selectDM, v);
  }
}
function onSureSelectDM() {
  if (selectDM) {
    Object.assign(evaluateDM, JSON.parse(JSON.stringify(selectDM)));
    evaluateDM["id"] = evaluateDM.userId;
    Object.assign(selectDM, {});
  } else {
    Object.assign(evaluateDM, {});
  }
  showSelectDM.value = false;
}
function onBack() {
  uni.navigateBack();
}
function onUnChange() {
  evaluateStatus.value = null;
}
function onChange(index: number) {
  //修改评分默认值
  if (!canRate) {
    if (index === 0) {
      serviceValue.value = 2.5;
      dmValue.value = 2.5;
      environmentValue.value = 2.5;
    } else if (index === 1) {
      serviceValue.value = 3.5;
      dmValue.value = 3.5;
      environmentValue.value = 3.5;
    } else {
      serviceValue.value = 5;
      dmValue.value = 5;
      environmentValue.value = 5;
    }
  }

  evaluateStatus.value = index;
}
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
        resolve('');
      });
  });
}
function onDeleteImg(idx: number) {
  imageList.splice(idx, 1);
}
function onSelectDict(v: any) {
  if (dictParama === v) {
    dictParama = {id: -1};
  } else {
    dictParama = v;
  }
  pageNo.value = 1;
  queryDramaList();
}
function onSelectPeople(v: any) {
  if (peopleParama.value === v) {
    peopleParama.value = "全部";
  } else {
    peopleParama.value = v;
  }
  pageNo.value = 1;
  queryDramaList();
}
async function getDicts() {
  try {
    let data: any = await api.queryDictParama({
      dictType: "DRAMA",
    });
    data.map((v: any) => {
      if (v.dictType === "DRAMA") {
        dicts = v.dictList;
      }
    });
    dicts.unshift({ dictValue: "全部", id: null });
  } catch (e) {}
}
function onSelectDrama() {
  if (evaluateDrama.dramaId) {
    Object.assign(selectDrama, JSON.parse(JSON.stringify(evaluateDrama)));
  }

  showSelectDrama.value = true;
  pageNo.value = 1;
  queryDramaList();
}
function onSelectDM() {
  if (evaluateDM.id) {
    Object.assign(selectDM, JSON.parse(JSON.stringify(evaluateDM)));
  }

  showSelectDM.value = true;
  pageNo.value = 1;
  queryDM_List();
}
async function queryDramaList() {
  let minGamerNum, maxGamerNum;
  switch (peopleParama.value) {
    case "≤4人":
      minGamerNum = 4;
      maxGamerNum = 0;
      break;
    case "5人":
      minGamerNum = 5;
      maxGamerNum = 5;
      break;
    case "6人":
      minGamerNum = 6;
      maxGamerNum = 6;
      break;
    case "7人":
      minGamerNum = 7;
      maxGamerNum = 7;
      break;
    case "8人":
      minGamerNum = 8;
      maxGamerNum = 8;
      break;
    case "≥9人":
      minGamerNum = null;
      maxGamerNum = 9;
      break;
    default:
      minGamerNum = null;
      maxGamerNum = null;
      break;
  }
  try {
    let data: any = await api.queryStoreDramaPage({
      pageNo: pageNo.value,
      pageSize: 10,
      storeId: storeInfo.id,
      dramaThemeIdList: dictParama.id !== -1 ? [dictParama] : null,
      minGamerNum,
      maxGamerNum,
      dramaName: searchValue.value,
    });
    if (pageNo.value === 1) dramaList.splice(0);

    if (data.records.length) {
      dramaList.push(...data.records);
    }
    dramaTotal.value = data.total;
  } catch (e) {}
}
async function queryDM_List() {
  try {
    let data: any = await storeApi.getStoreDMList({
      pageNo: pageNo.value,
      pageSize: 20,
      storeId: storeInfo.id,
      storeUserType: "DM",
    });
    if (pageNo.value === 1) dmList.splice(0);

    if (data.records.length) {
      dmList.push(...data.records);
    }
    DM_total.value = data.total;
  } catch (e) {}
}
//发布评价
async function evaluateRequest() {
  if (!evaluateStatus) {
    return uni.showToast({
      title: "给店铺打个分吧！",
      icon: "none",
    });
  }
  if (canDo.value) return;
  canDo.value = true;

  uni.showLoading();
  try {
    await storeApi.evaluateOperation({
      comment: evaluateContent.value,
      dmScore: dmValue.value * 20,
      environmentScore: environmentValue.value * 20,
      evaluationSource: "DETAIL_EVALUATE",
      serviceScore: serviceValue.value * 20,
      storeId: storeInfo.id,
      summarizeEvaluate:
        evaluateStatus.value === 0
          ? "NOT_GOOD"
          : evaluateStatus.value === 1
          ? "SO_SO"
          : "RECOMMEND",
      userId: userInfo.id,
      imageList: imageList,
      dramaId: evaluateDrama.dramaId || null,
      dmId: evaluateDM.userId || null,
      id: evaluateId.value,
      cityId: uni.getStorageSync('city-info').id,
      auditStatus: auditStatus.value,
    });
    uni.showToast({
      title: "评价成功！",
      icon: "none",
    });
    setTimeout(() => {
      uni.navigateBack();
    }, 1000);
  } catch (e) {
    canDo.value = false;
    uni.hideLoading();
  }
}
async function queryEvaluateDetail() {
  try {
    let data: any = await storeApi.evaluateDetail({
      id: evaluateId.value,
    });

    imageList = data.attachments.map((it: any) => it.fileUrl);
    evaluateContent.value = data.comment || '';

    evaluateDrama = data.dramaDetailVo;

    if (data.dramaDetailVo) {
      evaluateDrama["dramaId"] = data.dramaDetailVo.id;
    }
    evaluateDM = data.dmuserInfo;
    if (data.dmuserInfo) {
      evaluateDM["userId"] = evaluateDM.id;
    }
    evaluateStatus.value =
      data.summarizeEvaluate === "SO_SO"
        ? 1
        : data.summarizeEvaluate === "NOT_GOOD"
        ? 0
        : 2;
    serviceValue.value = data.serviceScore / 2;
    environmentValue.value = data.environmentScore / 2;
    dmValue.value = data.dmScore / 2;
    auditStatus.value = data.auditStatus;
  } catch (e) {}
}
function onPreView(current: any) {
  let sources: Array<any> = [];

  imageList.map((v) => {
    sources.push({
      url: v,
      type: judgeMediaType(v) === "image" ? "image" : "video",
      poster:
        judgeMediaType(v) === "video"
          ? `${v}?x-oss-process=video/snapshot,t_1000,m_fast`
          : null,
    });
  });
  uni.previewMedia({
    current,
    sources,
  });
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
}
.bg {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
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
.titleBox {
  position: fixed;
  left: 32rpx;
  right: 32rpx;
  top: 192rpx;
  @include hor-between-center;
  &-left {
    @include hor;
    align-items: center;
    width: 70%;
    image {
      width: 64rpx;
      height: 64rpx;
      border-radius: 6px;
      border: 1px solid #ffffff;
    }
    &-title {
      margin-left: 18rpx;
      @include text-bold(26rpx, #2e323e);
      @include text-overflow-line(1);
      width: 80%;
    }
  }
  &-right {
    width: 108rpx;
    height: 52rpx;
  }
}
.content {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 19vh;
  @include ver;
  &-statusBox {
    @include hor;
    align-items: center;
    margin-left: 9.6vw;
    image {
      width: 24.26vw;
      height: 13.05vh;
      margin-right: 30rpx;
      box-sizing: border-box;
    }
  }
  &-rateBox {
    margin-top: 32rpx;
    margin-left: 80rpx;
    &-item {
      @include hor;
      align-items: center;
      margin-bottom: 24rpx;
      &-title {
        @include text-normal(28rpx, #2e323e);
        margin-right: 48rpx;
      }
      .normalText {
        @include text-bold(28rpx, #959aa5);
      }
      .niceText {
        font-size: 28rpx;
        font-weight: 600;
        background: linear-gradient(180deg, #fe9535 0%, #fe5c35 100%);
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }
  &-inputContent {
    @include ver;
    margin-top: 52rpx;
    width: 100vw;
    background: #fff;
    border-radius: 20px;
    position: relative;
    overflow: hidden;
    &-textareaBox {
      width: 100vw;
      min-height: 15vh;
      padding-bottom: 40rpx;
      position: relative;
      &-textarea {
        margin: 40rpx 0px 0px 40rpx;
        width: calc(100% - 80rpx);
        @include text-normal(30rpx, #2e323e);
      }
      &-numBox {
        position: absolute;
        right: 36rpx;
        bottom: 0px;
        @include text-normal(24rpx, #2e323e);
      }
      &-numBox::after {
        content: "/1000";
        color: "#959AA5";
      }
    }
    &-uploadImgsBox {
      white-space: nowrap;
      margin: 0 26rpx;
      width: calc(100vw - 52rpx);
      overflow-x: scroll;
      &-item {
        position: relative;
        display: inline-block;
        width: 180rpx;
        height: 180rpx;
        margin-right: 10rpx;
        image {
          border-radius: 28rpx;
        }
        &-close {
          position: absolute;
          right: -6rpx;
          top: -6rpx;
          width: 36rpx;
          height: 36rpx;
        }
      }
      &-add {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        width: 180rpx;
        height: 180rpx;
        background: #f6f6f6;
        border-radius: 14px;
        transform: translateY(12rpx);
        &-icon {
          width: 80rpx;
          height: 80rpx;
          margin-top: 32rpx;
        }
        &-title {
          @include text-bold(26rpx, #2e323e);
        }
      }
    }
    &-bottomBox {
      display: flex;
      width: 100%;
      background: linear-gradient(180deg, #fbfbfb 0%, #ffffff 56%);
      border-top: 1px solid #eeeeee;
      margin-top: 24rpx;
      padding-bottom: 5vh;
      &-item {
        margin: 56rpx 0 0 40rpx;
        @include ver;
        max-width: 40%;
        &-top {
          @include hor;
          align-items: center;
          &-icon {
            width: 32rpx;
            height: 32rpx;
          }
          &-title {
            @include text-middle(26rpx, #2e323e);
            margin-left: 18rpx;
            @include text-overflow-line(1);
            max-width: 60%;
          }
          .arrow {
            transform: translateY(2rpx);
          }
        }
        &-bottom {
          @include text-normal(24rpx, #959aa5);
          margin-top: 8rpx;
        }
      }
      &-item:nth-child(2) {
        margin-left: 64rpx !important;
      }
    }
  }
}
.popDramaBox {
  margin-top: 30rpx;
  height: 85vh;
  background: #fff;
  &-title {
    @include text-middle(32rpx, #000);
    text-align: center;
  }
  &-subTitle {
    margin-top: 4rpx;
    @include text-normal(24rpx, rgba($color: #444, $alpha: 0.4));
    text-align: center;
    width: 80%;
    margin-left: 10%;
  }
  &-searchBox {
    margin-left: 32rpx;
    margin-top: 20rpx;
    width: calc(100vw - 64rpx);
    height: 60rpx;
    background: #f5f6f8;
    border-radius: 30rpx;
    @include hor-center-center;
    position: relative;
    &-placeholderBox {
      image {
        width: 32rpx;
        height: 32rpx;
      }
      &-title {
        @include text-normal(26rpx, #959aa5);
      }
    }
    input {
      position: absolute;
      left: 40rpx;
      right: 40rpx;
      text-align: center;
    }
  }
  &-filterBox {
    @include ver;
    padding: 50rpx 0;
    &-item {
      @include hor;
      align-items: center;
      margin-bottom: 20rpx;
      white-space: nowrap;
      &-title{
        @include text-normal(26rpx, #2E323E);
        padding-left: 40rpx;
      }
      &-scrolls {
        white-space: nowrap;
        width: 85vw;
        &-item {
          display: inline-flex;
          padding: 8rpx 28rpx;
          background: unset;
          border-radius: 12px;
          @include text-normal(26rpx, #2e323e);
        }
        .active {
          background: rgba($color: #36e4bb, $alpha: 0.1);
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: #36e4bb;
        }
      }
    }
  }
  &-listBox {
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 11.1vh;
    top: 39vh;
    background: #fafafa;
    padding: 0 24rpx;
    &-item {
      margin-top: 20rpx;
      width: 93.6vw;
      background: #ffffff;
      border-radius: 6px;
      @include hor;
      position: relative;
      &-cover {
        width: 108rpx;
        height: 144rpx;
        border-radius: 6px;
        margin: 24rpx;
        overflow: hidden;
        position: relative;
        &-sellType {
          position: absolute;
          right: 0rpx;
          top: 0rpx;
          width: 60rpx;
          height: 32rpx;
        }
      }
      &-info {
        margin-left: 18rpx;
        margin-top: 30rpx;
        @include ver;
        width: 60%;
        &-name {
          @include text-bold(32rpx, #2e323e);
          @include text-overflow-line(1);
        }
        &-dictValue {
          margin-top: 14rpx;
          @include text-normal(24rpx, #959aa5);
        }
        &-game {
          margin-top: 10rpx;
          @include text-normal(24rpx, #959aa5);
          line-height: 28rpx;
        }
      }
      &-status {
        position: absolute;
        right: 24rpx;
        top: 50%;
        transform: translateY(-50%);
        width: 40rpx;
        height: 40rpx;
      }
    }
  }
  &-sureBox {
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 11vh;
    background: #fff;
    @include hor-center-center;
    &-select {
      width: 91.46vw;
      height: 80rpx;
    }
  }
}
.popDM_Box {
  margin-top: 30rpx;
  height: 85vh;
  background: #fff;
  &-title {
    @include text-middle(32rpx, #000);
    text-align: center;
  }
  &-subTitle {
    margin-top: 4rpx;
    @include text-normal(24rpx, rgba($color: #444, $alpha: 0.4));
    text-align: center;
  }
  &-listBox {
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 11vh;
    top: 20vh;
    background: #fafafa;
    padding: 24rpx;
    &-item {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      margin-right: 6rpx;
      margin-bottom: 24rpx;
      position: relative;
      &-cvoer {
        width: 30.66vw;
        height: 30.66vw;
        border-radius: 40rpx;
        border: 1px solid #d2d2d2;
      }
      &-name {
        @include text-normal(32rpx, #2e323e);
        margin-top: 16rpx;
        width: 28vw;
        text-align: center;
        @include text-overflow-line(1);
      }
      &-status {
        position: absolute;
        right: 24rpx;
        top: 24rpx;
        width: 40rpx;
        height: 40rpx;
      }
    }
  }
  &-sureBox {
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 11vh;
    background: #fff;
    @include hor-center-center;
    &-select {
      width: 91.46vw;
      height: 80rpx;
    }
  }
}
</style>