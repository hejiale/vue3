<script setup lang="ts">
import { querySvgIcons } from '@/utils/index';

onLaunch(async() => {
  //预存储默认坐标
  if(!uni.getStorageSync("longitude") || !uni.getStorageSync("latitude")){
    uni.setStorageSync('longitude', 120.63132)
    uni.setStorageSync('latitude', 31.30227)
  }
  //预存储城市信息
  if(!uni.getStorageSync('city-info')){
    uni.setStorageSync('city-info', {id: 320500, name: '苏州市'});
  }
  //预存储IP地址
  uni.getLocalIPAddress({
    success: (res:any) => {
      uni.setStorageSync('localip', res.localip);
    },
    fail(err:any) {
      uni.showModal({
        title: "提示",
        content: "未开启微信定位权限",
      });
    },
  });
  await querySvgIcons();
});
onShow(() => {
  
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style lang="scss">
@import "uview-plus/index.scss";
@import "assets/style/index.scss";
@import "animate.css";
@import url("@/static/fonts/iconfont.css");
</style>
