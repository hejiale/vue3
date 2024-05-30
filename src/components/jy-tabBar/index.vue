<script setup lang="ts">
const tabs = [
  {
    name: 'home',
    text: '首页',
    icon: '/static/image/tab/homePage.png',
    selectedIcon: '/static/image/tab/sel-homePage.png',
    path:'/pages/index/index'
  },
  {
    name: 'user',
    text: '我的',
    icon: '/static/image/tab/myUser.png',
    selectedIcon: '/static/image/tab/sel-myUser.png',
    path:'/pages/my/my'
  },
];

defineProps(['activeTab'])

const changeTab = (path: string) => {
  // console.log("changeTab", path)
  uni.switchTab({
    url:path
  })
};

</script>

<template>
  <u-tabbar
      :value="activeTab"
      :border="false"
      :fixed="true"
      :placeholder="true"
      :safeAreaInsetBottom="true"
      @change="changeTab"
      inactiveColor="#999999"
      activeColor="#111111"
  >
    <u-tabbar-item
        v-for="(tab, index) in tabs"
        :key="index"
        :name="tab.path"
        :text="tab.text"
    >
      <template #active-icon>
        <image style="width: 24px; height: 24px"  :src=tab.selectedIcon></image>
      </template>
      <template #inactive-icon>
        <image style="width: 24px; height: 24px"  :src=tab.icon></image>
      </template>
    </u-tabbar-item>
  </u-tabbar>
</template>
<style scoped>




</style>