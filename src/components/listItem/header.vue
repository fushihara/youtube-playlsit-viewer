<template>
  <a v-bind:href="data.link">{{data.label}}</a>
</template>

<script lang="ts">

import Vue, { PropType } from "vue";
import { VideoDataAndPlaylist } from "./../../util/youtubeApi";
export default Vue.extend({
  props: {
    data: Object as PropType<{ type: "header", label: string, link: string }>
  },
  data() {
    return {}
  },
});
</script>
<style lang="scss" scoped>
a {
  width: 100%;
  display: block;
  background-color: gray;
}
</style>