<template>
  <div class="container">
    <!--    开启更多时光     -->
    <div class="container-head">
      <div class="container-head-spot"></div>
      <div class="container-head-box">
        <span class="container-head-box-content">开启更多时光 +</span>
      </div>
    </div>
    <!--  年月日 分段时光  -->
    <div class="container-item" v-if="emptyDailyLife" v-for="(item, index) in myDailyLifeList.userLifeTimeVos" :key="index">
      <!--   年月   -->
      <div class="container-item-year">
        <div class="container-item-year-spot"></div>
        <div class="container-item-year-content">{{item.partitionDate}}</div>
      </div>
      <div class="container-item-stage" v-if="item.partitionStage" v-for="(stageItem, index) in item.partitionStage" :key="index">
        <div class="container-item-stage-item"  v-for="(partitionItem, index) in stageItem.userLiftRecordVo" :key="index">
          <!--     月日     -->
          <div class="container-item-stage-item-day">
            <div class="container-item-stage-item-day-spot">
              <div class="container-item-stage-item-day-spot-spot"></div>
            </div>
            <div class="container-item-stage-item-day-content">{{stageItem.partitionDate}}</div>
          </div>
          <div class="container-item-stage-item-content" v-if="partitionItem.userLiftTimeEnum === 'DRAMA_WANT_PLAY_FLAG' ">想玩的剧本</div>
          <div class="container-item-stage-item-content" v-if="partitionItem.userLiftTimeEnum === 'DRAMA_PLAYED_FLAG' ">玩过的剧本</div>
          <div class="container-item-stage-item-box">
            <!--     想玩的剧本   ||   玩过的剧本 && 没有评论       -->
            <div class="container-item-stage-item-box-box"
                 v-if="partitionItem.userLiftTimeEnum === 'DRAMA_WANT_PLAY_FLAG' ||
                  (partitionItem.userLiftTimeEnum === 'DRAMA_PLAYED_FLAG' &&  partitionItem.dramaEvaluateDetail === null)">
              <!--     剧本封面     -->
              <div class="container-item-stage-item-box-box-left">
                <image class="container-item-stage-item-box-box-left-image" :src="partitionItem.dramaItem.dramaCover" mode="aspectFill"/>
                <image v-if="partitionItem.dramaItem.sellType === 'LIMITED' " class="container-item-stage-item-box-box-left-icon" :src="filters.icon('LIMITED')"/>
                <image v-if="partitionItem.dramaItem.sellType === 'EXCLUSIVE' " class="container-item-stage-item-box-box-left-icon" :src="filters.icon('EXCLUSIVE')"/>
                <image v-if="partitionItem.dramaItem.sellType === 'REAL_SCENE' " class="container-item-stage-item-box-box-left-icon" :src="filters.icon('REAL_SCENE')"/>
              </div>
              <div class="container-item-stage-item-box-box-right">
                <div class="container-item-stage-item-box-box-right-first">
                  <div class="container-item-stage-item-box-box-right-first-content">{{partitionItem.dramaItem.dramaName}}</div>
                  <image v-if="partitionItem.userLiftTimeEnum === 'DRAMA_WANT_PLAY_FLAG'" class="container-item-stage-item-box-box-right-first-image" :src="filters.icon('go-gathering')"/>
                  <image v-if="partitionItem.userLiftTimeEnum === 'DRAMA_PLAYED_FLAG' &&  partitionItem.dramaEvaluateDetail === null" class="container-item-stage-item-box-box-right-first-image" :src="filters.icon('go-evaluate')"/>
                </div>
                <div class="container-item-stage-item-box-box-right-second">
                  <span>{{dayjs(partitionItem.dramaItem.publishDate).format('YYYY-MM-DD')}}</span>
                  <span class="container-item-stage-item-box-box-right-second-publish">发行</span>
                  <span class="container-item-stage-item-box-box-right-second-line"> | </span>
                  <span class="container-item-stage-item-box-box-right-second-content">{{filters.doCalculateDramaDicts(partitionItem.dramaItem.dramaThemeList)}}</span>
                </div>
                <div class="container-item-stage-item-box-box-right-third">
                  <span>作者：</span>
                  <span>{{filters.doCalculateDramaAuthors(partitionItem.dramaItem.authorItems, " ")}}</span>
                </div>
                <div class="container-item-stage-item-box-box-right-forth">
                  <span>发行：</span>
                  <span>{{filters.doCalculateDramaPublisher(partitionItem.dramaItem.publishers, " ") }}</span>
                </div>
              </div>
            </div>
            <!--      玩过的剧本 & 有评论      -->
            <div class="container-item-stage-item-box-evaluate" v-else>
              <div class="container-item-stage-item-box-evaluate-score">
                <div class="container-item-stage-item-box-evaluate-score-left">
                  <span>我觉得</span>
                  <span>《</span>
                  <span class="container-item-stage-item-box-evaluate-score-left-name">{{partitionItem.dramaItem.dramaName}}</span>
                  <span>》</span>
                  <span v-if="partitionItem.dramaEvaluateDetail.dramaEvaluateType === 'RECOMMEND' ">推荐</span>
                  <image v-if="partitionItem.dramaEvaluateDetail.dramaEvaluateType === 'RECOMMEND' " class="container-item-stage-item-box-evaluate-score-left-image" :src="filters.icon('RECOMMEND')"/>
                  <span v-if="partitionItem.dramaEvaluateDetail.dramaEvaluateType === 'SO_SO' ">一般</span>
                  <image v-if="partitionItem.dramaEvaluateDetail.dramaEvaluateType === 'SO_SO' " class="container-item-stage-item-box-evaluate-score-left-image" :src="filters.icon('SO_SO')"/>
                  <span v-if="partitionItem.dramaEvaluateDetail.dramaEvaluateType === 'NOT_GOOD' ">不行</span>
                  <image v-if="partitionItem.dramaEvaluateDetail.dramaEvaluateType === 'NOT_GOOD' " class="container-item-stage-item-box-evaluate-score-left-image" :src="filters.icon('NOT_GOOD')"/>
                </div>
                <div class="container-item-stage-item-box-evaluate-score-right">
                  {{filters.doCalculateDramaEvaluate(partitionItem.dramaEvaluateDetail.scoreList)}}
                </div>
              </div>
              <div class="container-item-stage-item-box-evaluate-content" v-if="partitionItem.dramaEvaluateDetail.content">
                {{partitionItem.dramaEvaluateDetail.content}}
              </div>
              <div class="container-item-stage-item-box-evaluate-drama">
                <!--     剧本封面     -->
                <div class="container-item-stage-item-box-evaluate-drama-left" >
                  <image class="container-item-stage-item-box-evaluate-drama-left-image" :src="partitionItem.dramaItem.dramaCover" mode="aspectFill"/>
                  <image v-if="partitionItem.dramaItem.sellType === 'LIMITED' " class="container-item-stage-item-box-evaluate-drama-left-icon" :src="filters.icon('LIMITED')"/>
                  <image v-if="partitionItem.dramaItem.sellType === 'EXCLUSIVE' " class="container-item-stage-item-box-evaluate-drama-left-icon" :src="filters.icon('EXCLUSIVE')"/>
                  <image v-if="partitionItem.dramaItem.sellType === 'REAL_SCENE' " class="container-item-stage-item-box-evaluate-drama-left-icon" :src="filters.icon('REAL_SCENE')"/>
                </div>
                <div class="container-item-stage-item-box-evaluate-drama-right" >
                  <div class="container-item-stage-item-box-evaluate-drama-right-top">
                    {{partitionItem.dramaItem.dramaName}}
                  </div>
                  <div class="container-item-stage-item-box-evaluate-drama-right-bottom">
                    <span>{{dayjs(partitionItem.dramaItem.publishDate).format('YYYY-MM-DD')}}</span>
                    <span class="container-item-stage-item-box-evaluate-drama-right-bottom-publish">发行</span>
                    <span class="container-item-stage-item-box-evaluate-drama-right-bottom-line"> | </span>
                    <span class="container-item-stage-item-box-evaluate-drama-right-bottom-content">{{filters.doCalculateDramaDicts(partitionItem.dramaItem.dramaThemeList)}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--    第一天默认数据样式      -->
    <div class="container-bottom">
      <div class="container-bottom-year">
        <div class="container-bottom-year-spot"></div>
        <span class="container-bottom-year-content">{{ dayjs(myDailyLifeList.createTime).format("YYYY.MM") }}</span>
      </div>
      <div class="container-bottom-day">
        <div class="container-bottom-day-spot">
          <div class="container-bottom-day-spot-spot"></div>
        </div>
        <span class="container-bottom-day-content">{{ dayjs(myDailyLifeList.createTime).format("MM.DD") }}</span>
      </div>
      <span class="container-bottom-text">加入剧游宇宙</span>
      <div class="container-bottom-box">
        <image class="container-bottom-box-image" :src="filters.icon('firstDay')"/>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const {api, myApi, dayjs, filters, getColor, menuButtonRect} = useInstance();


const props = defineProps({
  /**
   * 剧评列表
   */
  myDailyLifeList: {
    type: Object,
    default: () => {
    },
  },

})



// 是否存在我的剧游时光
let emptyDailyLife = ref(false);

watchEffect(() => {
  if (props.myDailyLifeList?.userLifeTimeVos) {
    // 处理你的逻辑
    emptyDailyLife.value = props.myDailyLifeList.userLifeTimeVos?.length > 0
  }
  // console.log("myDailyLifeList", props.myDailyLifeList);
});


</script>
<style scoped lang="scss">
.container {
  width: calc(100vw - 20rpx);

  &-head {
    padding-bottom: 20rpx;
    margin-left: 25rpx;
    position: relative;
    height: 110rpx;
    width: calc(100vw - 45rpx);
    @include hor-center;
    &-box {
      width: 304rpx;
      height: 84rpx;
      background: linear-gradient(90deg, #36E4BB 0%, #ABDB24 100%);
      border-radius: 42rpx 42rpx 42rpx 42rpx;
      opacity: 1;
      border: 2rpx solid #FFFFFF;
      margin-left: 20rpx;
      @include ver-center-center;
      &-content {
        @include text-custom(600, 28rpx, #FFFFFF);
      }
    }
    &-spot {
      width: 12rpx;
      height: 12rpx;
      background: #2E323E;
      border-radius: 50%;
      opacity: 1;
      margin-left: -4rpx;
      z-index: 2;
    }
  }

  &-item {
    margin-left: 25rpx;
    width: calc(100vw - 45rpx);
    &-year {
      padding-bottom: 22rpx;
      @include hor-center;
      position: relative;
      &-content{
        margin-left: 30rpx;
        @include text-custom(600, 40rpx, #2E323E);
      }
      &-spot{
        width: 12rpx;
        height: 12rpx;
        background: #2E323E;
        border-radius: 50%;
        opacity: 1;
        margin-left: -4rpx;
        z-index: 2;
      }
    }
    &-stage{
      &-item{
        @include ver;
        &-day{
          position: relative;
          @include hor-center;
          &-content{
            margin-left: 20rpx;
            @include text-custom(600, 32rpx, #2E323E);
          }
          &-spot{
            width: 28rpx;
            height: 28rpx;
            background: rgba(160, 130, 188, 0.2);
            border-radius: 50%;
            margin-left: -12rpx;
            z-index: 2;
            @include hor-center-center;
            &-spot {
              width: 12rpx;
              height: 12rpx;
              background: #A082BC;
              border-radius: 50%;
              z-index: 3
            }
          }
        }
        &-content{
          position: relative;
          padding-left: 40rpx;
          @include text-custom(400, 26rpx, #5F6572);
        }
        &-box{
          position: relative;
          width: 686rpx;
          padding-bottom: 50rpx;
          &-box{
            background: #FFFFFF;
            width: 646rpx;
            margin-left: 40rpx;
            margin-top: 18rpx;
            border-radius: 12rpx;
            @include hor-center;
            &-left{
              width: 186rpx;
              height: 232rpx;
              border-radius: 12rpx;
              position: relative;
              &-image{
                margin-left: 24rpx;
                margin-top: 24rpx;
                width: 138rpx;
                height: 184rpx;
                border-radius: 12rpx;
              }
              &-icon{
                position: absolute;
                width: 60rpx;
                height: 32rpx;
                top: 24rpx;
                right: 24rpx;
              }
            }
            &-right{
              width: 460rpx;
              height: 232rpx;
              border-radius: 12rpx;
              @include ver;
              &-first{
                width: 450rpx;
                margin-top: 32rpx;
                @include hor-between-center;
                &-content{
                  @include text-custom(600, 32rpx, #2E323E)
                }
                &-image{
                  width: 92rpx;
                  height: 40rpx;
                  border-radius: 27rpx;
                }
              }
              &-second{
                margin-top: 12rpx;
                @include text-overflow-line(1);
                @include text-custom(400, 24rpx, #5F6572);
                &-publish{
                  margin-left: 6rpx;
                }
                &-line{
                  margin-left: 8rpx;
                }
                &-content{
                  margin-left: 8rpx;
                }
              }
              &-third{
                margin-top: 8rpx;
                @include text-overflow-line(1);
                @include text-custom(400, 24rpx, #5F6572);
              }
              &-forth{
                margin-top: 8rpx;
                @include text-overflow-line(1);
                @include text-custom(400, 24rpx, #5F6572);
              }

            }
          }
          &-evaluate{
            background: #FFFFFF;
            width: 646rpx;
            margin-left: 40rpx;
            margin-top: 18rpx;
            border-radius: 12rpx;
            @include ver;
            &-score{
              width: 598rpx;
              margin-left: 24rpx;
              margin-top: 30rpx;
              @include hor-between-center;
              &-left{
                @include text-custom(400, 24rpx, #959AA5);
                &-name{
                  max-width: 100rpx;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: inline-block;
                  transform: translateY(20%);
                }
                &-image{
                  width: 30rpx;
                  height: 30rpx;
                  transform: translateY(-10%);
                  margin-left: 10rpx;
                }
              }
              &-right{
                @include text-custom(400, 20rpx, #959AA5);
              }
            }
            &-content{
              width: 598rpx;
              margin-left: 24rpx;
              margin-top: 12rpx;
              @include text-overflow-line(1);
              @include text-custom(400, 28rpx, #2E323E);
            }
            &-drama{
              width: 598rpx;
              height: 112rpx;
              background: #F5F6F8;
              border-radius: 6rpx;
              margin-left: 24rpx;
              margin-top: 18rpx;
              margin-bottom: 30rpx;
              @include hor;
              &-left{
                position: relative;
                &-image{
                  width: 84rpx;
                  height: 112rpx;
                  border-radius: 6rpx;
                }
                &-icon{
                  position: absolute;
                  width: 48rpx;
                  height: 28rpx;
                  top: 0;
                  left: 0;
                }
              }
              &-right{
                @include ver;
                &-top{
                  margin-top: 20rpx;
                  margin-left: 18rpx;
                  @include text-overflow-line(1);
                  @include text-custom(600, 26rpx, #2E323E);
                }
                &-bottom{
                  margin-top: 10rpx;
                  margin-left: 18rpx;
                  @include text-custom(400, 24rpx, #959AA5);
                  &-publish{
                    margin-left: 6rpx;
                  }
                  &-line{
                    margin-left: 8rpx;
                  }
                  &-content{
                    margin-left: 8rpx;
                  }
                }
              }
            }
          }
        }
      }

    }
  }

  &-bottom {
    margin-left: 25rpx;
    width: calc(100vw - 45rpx);
    &-year {
      padding-bottom: 22rpx;
      position: relative;
      @include hor-center;
      &-content {
        margin-left: 30rpx;
        @include text-custom(600, 40rpx, #2E323E);
      }
      &-spot {
        width: 12rpx;
        height: 12rpx;
        background: #2E323E;
        border-radius: 50%;
        opacity: 1;
        margin-left: -4rpx;
        z-index: 2;
      }
    }
    &-day {
      position: relative;
      @include hor-center;
      &-content {
        margin-left: 20rpx;
        @include text-custom(600, 32rpx, #2E323E);
      }
      &-spot {
        width: 28rpx;
        height: 28rpx;
        background: rgba(160, 130, 188, 0.2);
        border-radius: 50%;
        margin-left: -12rpx;
        z-index: 2;
        @include hor-center-center;
        &-spot {
          width: 12rpx;
          height: 12rpx;
          background: #A082BC;
          border-radius: 50%;
          z-index: 3
        }
      }
    }
    &-text {
      margin-left: 40rpx;
      @include text-custom(400, 26rpx, #5F6572);
    }
    &-box {
      &-image {
        margin-left: 40rpx;
        width: 646rpx;
        height: 200rpx;
      }
    }
  }
}


.container-head::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 4px;
  height: 50%;
  background: #EBEBED;
  opacity: 1;
}
.container-bottom-year::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: #EBEBED;
  opacity: 1;
}
.container-bottom-day::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 50%;
  background: #EBEBED;
  opacity: 1;
}
.container-item-year::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: #EBEBED;
  opacity: 1;
}

.container-item-stage-item-day::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: #EBEBED;
  opacity: 1;
}
.container-item-stage-item-content::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: #EBEBED;
  opacity: 1;
}
.container-item-stage-item-box::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: #EBEBED;
  opacity: 1;
}

</style>