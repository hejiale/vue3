<template>
  <view class="share-page">
    <wxml-to-canvas
      class="widget"
      :width="canvasWidth"
      :height="canvasHeight"
      v-if="show"
    ></wxml-to-canvas>
  </view>
</template>
<script>
const { wxml, style } = require("./DomData.js");
import { judgeMediaType, getImageSize } from "@/utils/index";
export default {
  props: {
    storeInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    isShowPoster: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      canvasWidth: 320, // 默认canvas宽高
      canvasHeight: 480,
      widget: null,
      sunCode: null,
      canvasImgPortrait: false,
      canvasBg: null,
      show: false,
    };
  },
  async created() {
    wx.showLoading({ title: "海报生成中..." });

    await this.getSunCode();

    //先查询图片宽高尺寸
    let url;
    if (this.storeInfo.imageList && this.storeInfo.imageList.length) {
      let v = this.storeInfo.imageList.find(
        (file) => judgeMediaType(file.fileUrl) === "image"
      );
      if (v) {
        url = v.fileUrl;
      } else {
        url = this.storeInfo.storeDoorstep || this.storeInfo.storeLogo;
      }
    } else {
      url = this.storeInfo.storeDoorstep || this.storeInfo.storeLogo;
    }
    this.canvasBg = url;

    let info = await getImageSize(url);
    this.canvasImgPortrait =
      parseFloat(info.ImageWidth.value) < parseFloat(info.ImageHeight.value);
    
    console.log(this.canvasImgPortrait)

    // 获取设备信息
    wx.getSystemInfo({
      success: (res) => {
        this.canvasWidth = res.screenWidth;
        if(this.storeInfo.cityStoreRank > 0){
          this.canvasHeight = 599;
        }else{
          this.canvasHeight = 567;
        }
        
        this.show = true;

        // 数字容器宽度 动态设置
        setTimeout(() => {
          this.widget = this.selectComponent(".widget");
          this.renderToCanvas();
        }, 1000);
      },
    });
  },
  methods: {
    // wxml 转 canvas
    async renderToCanvas() {
      let _wxml = wxml(
        this.storeInfo,
        this.canvasBg,
        this.sunCode,
        this.getWords(this.storeInfo.storeName, 2, 0.0426, 0.6),
        this.getWords(this.storeInfo.storeAddress, 1, 0.0346, 0.5)
      );

      const _style = style(
        this.canvasWidth,
        this.canvasHeight,
        this.storeInfo.cityStoreRank > 0,
        this.canvasImgPortrait
      );
      const p1 = this.widget.renderToCanvas({ wxml: _wxml, style: _style });
      p1.then((result) => {
        const p2 = this.widget.canvasToTempFilePath();
        p2.then((result) => {
          wx.hideLoading();
          this.$emit("update:isShowPoster", false);

          let path = result.tempFilePath;
          wx.showShareImageMenu({
            path: path,
          });
        });
      }).catch((err) => {
        console.log(err);
      });
    },
    //获取太阳码
    async getSunCode() {
      try {
        //trial 体验版 release 正式版
        let res = await this.$api.getSunCode({
          page: "store-package/pages/index",
          dynamicId: this.storeInfo.id,
          envVersion: "trial",
        });
        this.sunCode = res.data;
      } catch (e) {}
    },
    //计算行数
    getWords(text, maxLine, fontSizeScale, widthScale) {
      let fontSize = this.canvasWidth * fontSizeScale;
      let nameWidth = this.canvasWidth * widthScale;
      let lineNum = Math.ceil(nameWidth / fontSize);
      let texts = text.split("");
      let line = Math.ceil(texts.length / lineNum);
      console.log(line);
      let words = [];
      if (line > maxLine) {
        texts.map((v, idx) => {
          if (idx < lineNum * maxLine - 2) {
            words.push(v);
          } else {
            words.push("...");
          }
        });
      } else {
        words = texts;
      }
      return words.join("");
    },
  },
};
</script>
<style lang="scss" scoped>
.share-page {
  background: unset;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  right: 0;
  z-index: 1000;
}
.widget {
  position: absolute;
  top: -10000px;
}
</style>