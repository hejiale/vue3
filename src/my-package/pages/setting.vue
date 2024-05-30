<template>
  <div class="area">
    <u-cell-group customStyle="">
      <u-cell
          title="商家认证"
          isLink
          url="/pages/componentsB/tag/tag"
          :titleStyle = "titleStyle"
      />
      <u-cell
          title="联系客服"
          isLink
          url="/pages/componentsB/tag/tag"
          :titleStyle = "titleStyle"
      />
      <u-cell
          title="用户协议"
          isLink
          url="/pages/componentsB/tag/tag"
          :titleStyle = "titleStyle"
      />
      <u-cell
          title="隐私政策"
          isLink
          url="/pages/componentsB/tag/tag"
          :titleStyle = "titleStyle"
      />
    </u-cell-group>
  </div>


</template>

<script setup lang="ts">
import { ref,computed,watch} from 'vue'
const titleStyle = ref("font-size: 32rpx;font-weight: 400;color: #5F6572;line-height: 38rpx;margin-top: 20rpx;margin-bottom: 20rpx;")

</script>


<style scoped lang="scss">
.area{
  width: 670rpx;
  height: 582rpx;
/*  background: #bd5b5b;*/
  position: absolute;
  left: 40rpx;
}


</style>
