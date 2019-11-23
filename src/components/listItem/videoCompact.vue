<template>
  <div style="display:flex;" class="top">
    <a style="display:flex;width:100%;" v-bind:style="{backgroundColor:data.backgroundColor}">
      <div class="thumbnail">
        <a
          class="header"
          v-if="data.header !== undefined "
          v-bind:href="data.header.link"
        >{{data.header.label}}</a>
        <div class="title">{{videoTitle}}</div>
        <a class="channel" v-bind:href="channelUrl">{{channelTitle}}</a>
        <a v-bind:href="aLink" style="position: relative;">
          <div class="top" v-if="liveType=='before'">
            <span style="color:blue;">●</span>
            待機 {{liveStartDateStr}} に配信開始予定
          </div>
          <div class="top" v-if="liveType=='ended'">
            <span style="color:gray;">●</span>
            終了 {{liveStartDateStr}} から配信
            <span class="right">{{videoViewStr}}再生</span>
          </div>
          <div class="top" v-if="liveType=='now'">
            <span style="color:red;" class="blink">●</span>
            配信中 {{liveStartDateStr}} に開始
            <span class="right">{{liveCurrentViewStr}}視聴</span>
          </div>
          <div class="top" v-if="liveType=='video'">
            通常動画
            <span class="right">{{videoViewStr}}再生</span>
          </div>
          <img v-bind:src="thumbnail" style="vertical-align: bottom;" />
          <div class="bottom">
            投稿 {{postDateStr}}
            <span class="right">{{durationStr}}</span>
          </div>
        </a>
        <div
          class="meta"
        >視聴数:{{viewCount}} Like:{{likeCount}} UnLile:{{unlikeCount}} コメント:{{commentCount}}</div>
      </div>
    </a>
  </div>
</template>

<script lang="ts">

import Vue, { PropType } from "vue";
import { formatDate, formatNumber, formatSecond } from "../../util/stringUtil";
export default Vue.extend({
  props: {
    data: Object as PropType<MainListItemVideo>
  },
  data() {
    console.log(`aaa`, this.data.backgroundColor)
    let durationStr = "";
    let liveEndDateStr = "";
    let liveStartDateStr = "";
    let videoViewStr = "";
    let liveCurrentViewStr = "";
    if (this.data.liveStreaming == null) {
      durationStr = formatSecond(this.data.durationSec);
      videoViewStr = formatNumber(this.data.viewCount);
    } else if (this.data.liveStreaming.type == "ended") {
      durationStr = formatSecond(this.data.durationSec);
      liveStartDateStr = formatDate(this.data.liveStreaming.actualStartTime);
      videoViewStr = formatNumber(this.data.viewCount);
    } else if (this.data.liveStreaming.type == "before") {
      durationStr = "--:--";
      liveStartDateStr = formatDate(this.data.liveStreaming.scheduledStartTime);
    } else {
      const liveDurationSec = Math.floor(new Date().getTime() - new Date(this.data.liveStreaming.actualStartTime).getTime());
      durationStr = "+" + formatSecond(liveDurationSec);
      liveStartDateStr = formatDate(this.data.liveStreaming.actualStartTime);
      liveCurrentViewStr = formatNumber(this.data.liveStreaming.concurrentViewers);
    }
    const tags = this.data.tags.map(a => {
      return {
        href: `https://www.youtube.com/results?search_query=${encodeURIComponent(a)}&sp=EgIQAQ%253D%253D`,
        name: a
      };
    });
    return {
      no: String(this.data.playlistPosition + 1),
      videoTitle: this.data.title,
      aLink: `https://www.youtube.com/watch?v=${this.data.videoId}`,
      thumbnail: this.data.thumbnail,
      channelTitle: this.data.channelTitle,
      channelUrl: `https://www.youtube.com/channel/${this.data.channelId}/videos`,
      viewCount: String(this.data.viewCount),
      likeCount: String(this.data.likeCount),
      unlikeCount: String(this.data.dislikeCount),
      commentCount: String(this.data.commentCount),
      postDateStr: formatDate(new Date(this.data.publishDate)),
      durationStr, liveEndDateStr, videoViewStr, liveStartDateStr, liveCurrentViewStr,
      liveType: this.data.liveStreaming == null ? "video" : this.data.liveStreaming.type,
      description: this.data.description, tags
    }
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
.thumbnail {
  flex: 0 0 100px;
  flex-direction: column;
  display: flex;
  align-items: baseline;
  > .header {
    width: 100%;
    border-bottom: solid 1px black;
    font-size: 10px;
  }
  > .title {
    color: black;
    font-size: 10px;
  }
  > .channel {
    color: black;
    text-align: left;
    font-size: 10px;
  }
  > .meta {
    color: black;
    font-size: 10px;
  }
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
</style>