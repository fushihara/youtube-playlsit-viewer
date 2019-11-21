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
      <button v-on:click="changeSort('number-up')">昔に登録した動画順</button>
      <button v-on:click="changeSort('number-down')">最近登録した動画順</button>
      <button v-on:click="changeSort('live-start-up')">昔にライブ配信開始時刻</button>
      <button v-on:click="changeSort('live-start-down')">最近ライブ配信開始時刻</button>
      <button v-on:click="changeSort('post-up')">昔に動画投稿時刻</button>
      <button v-on:click="changeSort('post-down')">最近動画投稿時刻</button>
      <button v-on:click="changeSort('pv-up')">再生数多い順</button>
      <button v-on:click="changeSort('pv-down')">再生数少ない順</button>
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
import { getPlayList, getPlaylistVideos, VideoDataAndPlaylist, applySort } from "../util/youtubeApi";
import { formatDate, formatNumber, formatSecond } from "../util/stringUtil";

export default Vue.extend({
  middleware: ['middleware-per-page', "middleware-need-login"],
  components: { VideoElement },
  data() {
    return {
      playlistList: [] as { id: string, title: string, itemCount: number }[],
      activePlaylist: null as { id: string, title: string, itemCount: number } | null,
      videoItemsRaw: [] as VideoDataAndPlaylist[],
      videoItemsSolid: [] as VideoDataAndPlaylist[],
      enableUserGroup: false as boolean,
      sortType: "number-up" as SortType
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
      //@ts-ignore
      getPlayList(this.$axios).then(result => {
        this.playlistList = result;
        this.activePlaylist = result[0];
      });
    },
    applySort(): void {
      this.videoItemsSolid = applySort(this.videoItemsRaw, this.sortType);
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