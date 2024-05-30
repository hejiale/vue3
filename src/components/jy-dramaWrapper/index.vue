<template>
    <div class="recommend" v-for="item in props.recommendList" :key="item.id" @click.stop="onGoDramaDetail(item.id)">
      <div class="recommend-item" >
        <div class="recommend-item-top" >
          <image :src="item.dramaCover" mode="aspectFill"/>
          <div class="recommend-item-top-right" >
            <div class="recommend-item-top-right-title" >
              {{sliceText(7,item.dramaName)}}
              <image :src="dramaTitleLevel(item.dramaTitle)" mode="aspectFill"/>
            </div>
            <div class="recommend-item-top-right-theme" >
              <div class="recommend-item-top-right-theme-item" v-for="theme in item.dramaThemeList" :key="theme.id" >
                {{theme.dictValue}}
              </div>
            </div>
            <div class="recommend-item-top-right-player" >
                {{item.maleGamerNum}}男{{item.femaleGamerNum}}女  {{item.gameTime}}小时
            </div>
            <div class="recommend-item-top-right-author">
                {{dramaAuthor(item.authorItems)}}
            </div>
            <div class="recommend-item-top-right-publisher">
                {{dramaPublish(item.publishers)}}
            </div>
          </div>
        </div>



        <div class="recommend-item-bottom" >
          {{item.nowDramaPlayingGatherCount || item.gatherCount || 0}}场拼局进行中
          <image :src="filters.icon('right_arrow')" mode="aspectFill"/>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
const {api, myApi,homeApi , dayjs, filters, getColor, menuButtonRect} = useInstance();

const props = defineProps({
  recommendList: {
    type: Object,
    default: [],
  },
})


/*获取title icon*/
function dramaTitleLevel(dramaTitle: any) {
  if(dramaTitle==="满分神作") return filters.icon('dramaLevel1');
  else if(dramaTitle==="剧游必玩") return filters.icon('dramaLevel2');
  else if(dramaTitle==="优质剧作") return filters.icon('dramaLevel3');
  else if(dramaTitle==="值得一试") return filters.icon('dramaLevel4');
  else if(dramaTitle==="水平在线") return filters.icon('dramaLevel5');
}

function dramaAuthor(authors: any) {
  let author = '作者: ';
  authors.forEach((item: any) => {
    author += item.authorName + '&';
  });
  return sliceText(20,author.slice(0, -1));
}

function dramaPublish(publishes: any) {
  let publish = '发行: ';
  publishes.forEach((item: any) => {
    publish += item.publisherName + '&';
  });
  return sliceText(20,publish.slice(0, -1));
}

/*文字截取*/
function sliceText(size:number,str: string): string {
  if (str.length > size) {
    return str.substring(0, size) + '...';
  } else {
    return str;
  }
}

function onGoDramaDetail(id:any){
  wx.navigateTo({
    url:`/drama-package/pages/index?dramaId=${id}`
  })
}


</script>
<style lang="scss" scoped>
.bg{
  background: #FAFAFA;
  z-index: 3;
  min-height: 100vh;
  @include ver;
}

.recommend-item{
  width: 702rpx;
  height: 386rpx;
  background: #FFFFFF;
  border-radius: 18rpx 18rpx 18rpx 18rpx;
  margin-top: 20rpx;
  margin-left: 24rpx;
  @include ver;
  &-top{
    width: 654rpx;
    height: 224rpx;
    margin: 30rpx 24rpx;
    @include hor;
    image{
      width: 168rpx;
      height: 224rpx;
      border-radius: 12rpx 12rpx 12rpx 12rpx;
      margin-right: 26rpx;
    }
    &-right{
      @include ver;
      width: 462rpx;
      &-title{
        @include hor-center;
        justify-content: space-between;
        @include text-custom(600, 32rpx, #2E323E);
        line-height: 38rpx;
        margin-bottom: 16rpx;
        image{
          width: 130rpx;
          height: 34rpx;
        }
      }
      &-theme{
        @include hor;
        margin-bottom: 8rpx;
        &-item{
          @include text-custom(400, 24rpx, #5F6572);
          margin-right: 13rpx;
        }
      }
      &-player{
        @include text-custom(400, 24rpx, #5F6572);
        @include hor;
        margin-bottom: 8rpx;
      }
      &-author{
        @include text-custom(400, 24rpx, #5F6572);
        margin-bottom: 8rpx;
      }
      &-publisher{
        @include text-custom(400, 24rpx, #5F6572);
      }
    }
  }
  &-bottom{
    margin-left: 24rpx;
    width: 654rpx;
    height: 72rpx;
    background: #F5F6F8;
    border-radius: 12rpx 12rpx 12rpx 12rpx;
    @include hor-center-center;
    @include text-custom(500, 26rpx, #2E323E);
    line-height: 30rpx;
    image{
      width: 16rpx;
      height: 20rpx;
      margin-left: 8rpx;
    }
  }
}

</style>