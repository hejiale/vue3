import iconFont from '@/utils/icon-font';
/**
 *
 *
 */
const wxml = (storeInfo, canvasBg, sunCode, storeName, addressName) => {
  let posterTop = iconFont.getIconName("poster-top");
  let posterBottom = iconFont.getIconName("poster-bottom");
  let addressBg = iconFont.getIconName("address-bg");
  // let tag = iconFont.getIconName(
  //   `tag-${storeInfo.cityStoreRank}`
  // );
  let tagTitle = iconFont.getIconName("icon-rank-title");
  let tagValue = `“苏州市必玩门店排行榜第${storeInfo.cityStoreRank}名”`;
  let place = iconFont.getIconName("icon-place");
  let distance = `距离你所在位置${(storeInfo.distance / 1000).toFixed(
    2
  )}km`;
  let phone = iconFont.getIconName("icon-phone");
  let weChat = iconFont.getIconName("icon-wechat");
  let fullStar = iconFont.getIconName("full-star");

  //区分带排行榜 和 非排行榜的情况  <image src="` + tag + `" class="rankTag"/>
  let rankBg = '';
  let rankInfo = '';
  if (storeInfo.cityStoreRank > 0) {
    rankBg = `<view class="rankContent">
        <image src="`+ posterTop + `"  class="rankContentBg"/>
      </view>`;
    rankInfo = `
    <image src="`+ tagTitle + `" class="tagTitle" />
    <text class="rankValue">`+ tagValue + `</text>`
  }

  return `
<view class="container">
  <image src="` + canvasBg + `" class="cover"/>
  ${rankBg}
  <view class="content">
    <image src="`+ storeInfo.storeLogo + `"  class="logo"/>
    <text class="name">`+ storeName + `</text>
    <image class="star" src="`+ fullStar + `"/>
    <text class="comprehensiveScore">`+ storeInfo.evaluateItem.comprehensiveScore + `</text>
    <text class="serviceTitle">服务: </text>
    <text class="serviceValue">`+ storeInfo.evaluateItem.serviceScore + `</text>
    <text class="dmTitle">DM: </text>
    <text class="dmValue">`+ storeInfo.evaluateItem.dmScore + `</text>
    <text class="enviTitle">环境: </text>
    <text class="enviValue">`+ storeInfo.evaluateItem.environmentScore + `</text>
    <view class="wantCount">
      <text class="wantCountValue">`+ storeInfo.wangCount + ` 人想去</text>
    </view>
    <view class="explosiveCount">
      <text class="explosiveCountValue">`+ storeInfo.explosiveCount + ` 人气值</text>
    </view>
    <view class="addressBox">
      <image src="`+ addressBg + `" class="addressCover"/>
      <text class="addressVal">`+ addressName + `</text>
      <image src="`+ place + `" class="placeIcon"/>
      <text class="distance">`+ distance + `</text>
      <image src="`+ phone + `" class="phone"/>
      <image src="`+ weChat + `" class="weChat"/>
      <text class="phoneTitle">电话</text>
      <text class="wechatTitle">微信</text>
    </view>
  </view>
  <view class="rankBottom">
    <image src="`+ posterBottom + `"  class="rankBottomBg"/>
    <image src="`+ sunCode + `" class="sunCode"/>
  </view>
  ${rankInfo}
</view>
`
}

/**
 *
 *
 * @param {*} canvasWidth  画布宽度
 * @param {*} canvasHeight  画布高度
 * @param {*} numberWidth  数字宽度，动态设置
 * @return {*} 
 */
const style = (canvasWidth, canvasHeight, hasRank, canvasImgPortrait) => {
  return {
    "container": {
      width: canvasWidth,
      height: canvasHeight,
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#4D4D4D',
    },
    "cover": {
      position: 'absolute',
      left: canvasWidth * 0.0533,
      right: canvasWidth * 0.0533,
      top: 56,
      height: (canvasImgPortrait ? 330: 196),
      borderRadius: canvasWidth * 0.032,
    },
    "rankContent": {
      position: 'absolute',
      left: canvasWidth * 0.0533,
      right: canvasWidth * 0.0533,
      top: 211,
      height: 74
    },
    "rankContentBg": {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    "rankTag": {
      position: 'absolute',
      left: canvasWidth * 0.0853,
      top: 201,
      width: 46,
      height: 54,
    },
    "content": {
      position: 'absolute',
      left: canvasWidth * 0.053,
      right: canvasWidth * 0.053,
      top: (hasRank ? 243 : 211),
      height: 212,
      backgroundColor: "#fff",
      zIndex: 1,
      borderRadius: 12,
    },
    "logo": {
      position: 'absolute',
      left: canvasWidth * 0.032,
      top: 18,
      width: 42,
      height: 42,
      borderRadius: 6,
    },
    "name": {
      position: 'absolute',
      left: canvasWidth * 0.176,
      top: 18,
      fontSize: 16,
      color: '#2E323E',
      width: canvasWidth * 0.6,
      height: 48
    },
    "addressBox": {
      position: 'absolute',
      left: canvasWidth * 0.032,
      right: canvasWidth * 0.032,
      top: 126,
      height: 68,
    },
    "addressCover": {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    "addressVal": {
      position: 'absolute',
      left: canvasWidth * 0.032,
      top: 18,
      width: canvasWidth * 0.53,
      height: 18
    },
    "placeIcon": {
      position: 'absolute',
      left: canvasWidth * 0.032,
      top: 43,
      width: 12,
      height: 12
    },
    "distance": {
      position: 'absolute',
      left: canvasWidth * 0.064,
      top: 42,
      width: canvasWidth * 0.3,
      height: 14,
      fontSize: 10,
      fontWeight: 400,
      color: "#959AA5"
    },
    "phone": {
      position: 'absolute',
      right: canvasWidth * 0.16,
      top: 17,
      width: 24,
      height: 24
    },
    "phoneTitle": {
      position: 'absolute',
      right: canvasWidth * 0.168,
      bottom: 11,
      width: 18,
      height: 13,
      fontSize: 9,
      fontWeight: 400,
      color: "#82909C",
    },
    "wechatTitle": {
      position: 'absolute',
      right: canvasWidth * 0.0453,
      bottom: 11,
      width: 18,
      height: 13,
      fontSize: 9,
      fontWeight: 400,
      color: "#82909C",
    },
    "weChat": {
      position: 'absolute',
      right: canvasWidth * 0.0373,
      top: 17,
      width: 24,
      height: 24
    },
    "rankBottom": {
      position: 'absolute',
      left: canvasWidth * 0.053,
      right: canvasWidth * 0.053,
      bottom: 38,
      height: 107
    },
    "rankBottomBg": {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    "tagTitle": {
      position: 'absolute',
      left: canvasWidth * 0.0853,
      top: 218,
      width: canvasWidth * 0.128,
      height: 18,
    },
    "rankValue": {
      position: 'absolute',
      left: canvasWidth * 0.2426,
      top: 222,
      width: canvasWidth * 0.4,
      height: 14,
      fontSize: canvasWidth * 0.0266,
      fontWeight: 500,
      color: "#935D36",
      textOverflow: "ellipsis",
      overflow: 'hidden',
    },
    "wantCount": {
      position: 'absolute',
      left: canvasWidth * 0.176,
      top: 92,
      width: canvasWidth * 0.2186,
      height: 22,
      backgroundColor: "#F5F5F5",
      borderRadius: 8
    },
    "wantCountValue": {
      position: 'absolute',
      left: 8,
      top: 5,
      fontSize: 10,
      fontWeight: 400,
      color: "#2E323E",
      width: canvasWidth * 0.18,
      height: 22,
      textAlign: 'center'
    },
    "explosiveCount": {
      position: 'absolute',
      left: canvasWidth * 0.4053,
      top: 92,
      width: canvasWidth * 0.23,
      height: 22,
      backgroundColor: "#F5F5F5",
      borderRadius: 8
    },
    "explosiveCountValue": {
      position: 'absolute',
      left: 8,
      top: 5,
      fontSize: 10,
      fontWeight: 400,
      color: "#2E323E",
      width: canvasWidth * 0.18,
      height: canvasHeight * 0.0366,
      textAlign: 'center'
    },
    "star": {
      position: 'absolute',
      left: canvasWidth * 0.176,
      top: 72,
      width: 10,
      height: 10
    },
    "comprehensiveScore": {
      position: 'absolute',
      left: canvasWidth * 0.2133,
      top: 66,
      width: canvasWidth * 0.1,
      height: 20,
      fontSize: 15,
      // fontWeight: 400,
      // color: "#FF6300",
      fontFamily: "OPPOSans, OPPOSans",
      fontWeight: 800,
      color: "#FF6300",
    },
    "serviceTitle": {
      position: 'absolute',
      left: canvasWidth * 0.304,
      top: 70,
      width: canvasWidth * 0.1,
      height: 22,
      fontSize: 11,
      fontWeight: 400,
      color: "#2E323E",
    },
    "serviceValue": {
      position: 'absolute',
      left: canvasWidth * 0.375,
      top: 70,
      width: canvasWidth * 0.1,
      height: 22,
      fontSize: 11,
      fontWeight: 400,
      color: "#FF6300",
    },
    "dmTitle": {
      position: 'absolute',
      left: canvasWidth * 0.4266,
      top: 70,
      width: canvasWidth * 0.1,
      height: 22,
      fontSize: 11,
      fontWeight: 400,
      color: "#2E323E",
    },
    "dmValue": {
      position: 'absolute',
      left: canvasWidth * 0.492,
      top: 70,
      width: canvasWidth * 0.1,
      height: 22,
      fontSize: 11,
      fontWeight: 400,
      color: "#FF6300",
    },
    "enviTitle": {
      position: 'absolute',
      left: canvasWidth * 0.54,
      top: 70,
      width: canvasWidth * 0.1,
      height: 15,
      fontSize: 11,
      fontWeight: 400,
      color: "#2E323E",
    },
    "enviValue": {
      position: 'absolute',
      left: canvasWidth * 0.615,
      top: 70,
      width: canvasWidth * 0.1,
      height: 15,
      fontSize: 11,
      fontWeight: 400,
      color: "#FF6300",
    },
    "sunCode": {
      position: 'absolute',
      right: canvasWidth * 0.0586,
      top: 11,
      width: 54,
      height: 54
    }
  }
}

module.exports = {
  wxml,
  style
}
