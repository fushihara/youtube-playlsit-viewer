<template>
  <div class="container">
    トップページにようこそ！
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {  }
  },
  asyncData(context) {
    process.stdout;
    console.log({
      ...context,
      "p_client":process.client,
      "p_server":process.server,
      "p_static":process.static,
      });
    return {};
  }
});
</script>

<style lang="scss" scoped>
</style>