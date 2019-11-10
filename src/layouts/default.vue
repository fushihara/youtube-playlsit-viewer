<template>
  <div style="height:100vh;display:flex;flex-direction:column;">
    <nav-header style="flex:0 0 auto;background-color:#FAA;"></nav-header>
    <nuxt style="flex:1 1 0;overflow-x:hidden;overflow-y:hidden;" ref="main" />
    <div style="flex:0 0 auto;">
      <a href="https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas">APIのクオータ確認</a>
      <a href="https://developers.google.com/youtube/v3/determine_quota_cost?hl=ja">APIのクオータ計算機</a>
      <a href="https://developers.google.com/youtube/v3/docs/videos/list?hl=ja">APIのリファレンス</a>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import navHeader from "./../components/header.vue";
export default Vue.extend({
  components: {
    navHeader
  }
});
</script>
<style lang="scss" scoped>
</style>