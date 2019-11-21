<template>
  <div style="display:flex;" class="top">
    <vue-video v-if="data.type=='video'" v-bind="data"></vue-video>
    <vue-header v-else-if="data.type=='header'" v-bind="data"></vue-header>
  </div>
</template>

<script lang="ts">

import Vue, { PropType } from "vue";
import VueHeader from "./header.vue";
import VueVideo from "./video.vue";
import { VideoDataAndPlaylist } from "./../../util/youtubeApi";
export default Vue.extend({
  components: {
    VueHeader,VueVideo
  },
  props: {
    data: Object as PropType<(VideoDataAndPlaylist & { sortValue: string, sortName: string, type: "video" }) | { type: "header", label: string, link: string }>
  },
  data() {
    return {
      data: this.data
    };
  },
});
</script>
<style lang="scss" scoped>
@keyframes blink {
  75% {
    opacity: 0;
  }
}
.blink {
  /* text-decoration: blink; の代わりに以下の指定を入れる */
  animation: blink 0.5s step-end infinite;
}
.no {
  flex: 0 0 1.6em;
  display: flex;
  flex-direction: column;
  font-size: 100px;
  font-weight: bold;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-family: monospace;
  .top {
    flex: 1 1 0;
  }
  .middle {
    flex: 1 1 0;
  }
  .bottom {
    flex: 1 1 0;
    font-size: 10px;
    font-weight: normal;
    display: flex;
    text-align: center;
  }
}
.thumbnail {
  flex: 0 0 100px;
  display: flex;
  align-items: center;
  > a {
    > div {
      &.top {
        background: linear-gradient(
          to bottom,
          #808080 0%,
          #000000 50%,
          #000000 100%
        );
      }
      &.bottom {
        background: linear-gradient(
          to bottom,
          #0e0e0e 0%,
          #000000 50%,
          #808080 100%
        );
      }
      position: relative;
      text-decoration: none;
      color: white;
      font-size: 10px;
      &:visited {
        color: white;
        text-decoration: none;
      }
      .right {
        position: absolute;
        right: 0;
      }
    }
  }
}
.data {
  flex: 1 1 0;
  .video-name {
    font-size: 17px;
  }
  .description {
    white-space: pre-line;
    font-size: 10px;
    max-height: 130px;
    overflow-y: scroll;
    width: 100%;
    border: solid 1px black;
  }
  .tags {
    font-size: 10px;
    > a {
      padding-right: 5px;
    }
  }
}
</style>