<template>
  <div class="container">
    <div style="display:flex;flex:0 0 auto;">
      <select style="flex:1 1 0;" v-model="activePlaylist">
        <option
          v-for="playlist in playlistList"
          v-bind:key="playlist.id"
          v-bind:value="playlist"
        >{{playlist.title}}({{playlist.itemCount}})</option>
      </select>
      <button v-on:click="updatePlaylistList">←プレイリスト一覧更新</button>
      <button v-on:click="getVideoList(false)">↓動画一覧更新</button>
      <button v-on:click="getVideoList(true)">↓動画一覧全部更新</button>
    </div>
    <div style="flex:0 0 auto;">
      <label>
        <input v-model="enableUserGroup" type="checkbox" />チャンネルでグループ分けする
      </label>
      <button v-on:click="changeSort('number-up')">↑番号順</button>
      <button v-on:click="changeSort('number-down')">↓番号順</button>
      <button v-on:click="changeSort('live-start-up')">↑ライブ配信開始時刻</button>
      <button v-on:click="changeSort('live-start-down')">↓ライブ配信開始時刻</button>
      <button v-on:click="changeSort('post-up')">↑動画投稿時刻</button>
      <button v-on:click="changeSort('post-down')">↓動画投稿時刻</button>
      <button v-on:click="changeSort('pv-up')">↑再生数</button>
      <button v-on:click="changeSort('pv-down')">↓再生数</button>
    </div>
    <div v-if="enableUserGroup==false" class="videoList-solid">
      <video-element v-for="data in videoItemsSolid" v-bind:key="data.videoId" v-bind:data="data"></video-element>
    </div>
    <div v-if="enableUserGroup==true" class="videoList-group">
      <div v-for="data in videoItemsGraup" v-bind:key="data.channelId">
        <a v-bind:href="'https://www.youtube.com/'+data.channelId+'/videos'">{{data.channelTitle}}</a>
        <div style="padding-left:20px;">
          <video-element
            v-for="videoData in data.videos"
            v-bind:key="videoData.videoId"
            v-bind:data="videoData"
            style="background-color:white;"
          ></video-element>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import VideoElement from "../components/video.vue";
import { getPlaylistVideos, VideoDataAndPlaylist } from "../util/youtubeApi";
import { formatDate, formatNumber, formatSecond } from "../util/stringUtil";

export default Vue.extend({
  middleware: ['middleware-per-page', "middleware-need-login"],
  components: { VideoElement },
  data() {
    return {
      playlistList: [] as { id: string, title: string, itemCount: number }[],
      activePlaylist: null as { id: string, title: string, itemCount: number } | null,
      videoItemsRaw: [] as VideoDataAndPlaylist[],
      videoItemsGraup: [] as { channelTitle: string, channelId: string, videos: VideoDataAndPlaylist[] }[],
      videoItemsSolid: [] as VideoDataAndPlaylist[],
      enableUserGroup: false as boolean,
      sortType: "number-up" as ("number-up" | "number-down" | "live-start-up" | "live-start-down" | "post-up" | "post-down" | "pv-up" | "pv-down")
    }
  },
  asyncData(context) {
    console.log({
      ...context,
      "p_client": process.client,
      "p_server": process.server,
      "p_static": process.static,
    });
    return {};
  },
  computed: {
    compValue(): string { return "" }
  },
  watch: {
    activePlaylist: function (newValue: any) {
      console.log(`newvalue`, newValue);
    },
    sortType: function (newValue) {
    }
  },
  methods: {
    changeSort(type: "number-up" | "number-down" | "live-start-up" | "live-start-down" | "post-up" | "post-down" | "pv-up" | "pv-down") {
      this.sortType = type;
      this.applySort();
    },
    updatePlaylistList(): void {
      const url = "https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&mine=true&maxResults=50";
      //@ts-ignore
      this.$axios.$get(url).then(a => {
        this.playlistList = a.items.map((b: any) => {
          return {
            id: String(b.id),
            title: String(b.snippet.title),
            itemCount: Number(b.contentDetails.itemCount)
          };
        });
        this.activePlaylist = this.playlistList[0];
      });
    },
    applySort(): void {
      const sortData = this.videoItemsRaw.map(a => {
        let sortValueNum: number | null = null;
        let sortName = "";
        switch (this.sortType) {
          case "number-up":
          case "number-down":
            sortValueNum = a.playlistPosition;
            sortValueNum = a.playlistPosition;
            sortName = "お気に入り登録";
            break;
          case "live-start-up":
          case "live-start-down":
            if (a.liveStreaming && (a.liveStreaming.type == "now" || a.liveStreaming.type == "ended")) {
              sortValueNum = new Date(a.liveStreaming.actualStartTime).getTime();
              sortName = "配信開始";
            }
            break;
          case "pv-up":
          case "pv-down":
            if (a.liveStreaming == null || a.liveStreaming.type == "ended") {
              sortValueNum = a.viewCount;
              sortName = "PV";
            }
            break;
          case "post-up":
          case "post-down":
            sortValueNum = new Date(a.publishDate).getTime();
            sortName = "動画投稿";
            break;
        }
        return {
          ...a,
          sortValue: formatDate(a.playlistRegistrationDate),
          sortValueNum,
          sortName
        }
      }).filter(a => {
        return a.sortValueNum !== null;
      }).sort((a, b) => {
        let rev = false;
        switch (this.sortType) {
          case "number-up":
            rev = true;
            break;
          case "number-down":
            rev = false;
            break;
          case "live-start-up":
            rev = true;
            break;
          case "live-start-down":
            rev = false;
            break;
          case "post-up":
            rev = true;
            break;
          case "post-down":
            rev = false;
            break;
        }
        if (a.sortValueNum === null) { return 0; }
        if (b.sortValueNum === null) { return 0; }
        if (rev) {
          return a.sortValueNum - b.sortValueNum;
        } else {
          return b.sortValueNum - a.sortValueNum;
        }
      })
      this.videoItemsSolid = sortData;
      this.videoItemsGraup = sortData.reduce<{ channelTitle: string, channelId: string, videos: VideoDataAndPlaylist[] }[]>((a, b) => {
        const data = a.find(a => a.channelId == b.channelId);
        if (data) {
          data.videos.push(b);
        } else {
          a.push({
            channelTitle: b.channelTitle,
            channelId: b.channelId,
            videos: [b]
          });
        }
        return a;
      }, []);
    },
    getVideoList(allGet: boolean): void {
      const targetPlaylistId = this.activePlaylist!.id;
      //@ts-ignore
      getPlaylistVideos(this.$axios, targetPlaylistId, allGet).then(data => {
        this.videoItemsRaw = data.datas;
        this.applySort();
      });
    }
  },
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
}
.videoList-solid,
.videoList-group {
  overflow: scroll;
  flex: 1 1 0;
}
.videoList-solid > * {
  border: solid 1px black;
  flex: 1 1 0;
}
.videoList-group > * {
  &:first-child {
    border-top: 2px solid black;
  }
  border-bottom: 2px solid black;
  display: flex;
  flex-direction: column;
  > a {
    background-color: lightgray;
  }
  > div {
    background-color: lightgray;
  }
}
</style>