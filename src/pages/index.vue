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
    <div class="videoList-solid" v-on:wheel="listWheelEvent">
      <video-element v-for="data in videoItemsSolid" v-bind:key="data.videoId" v-bind:data="data"></video-element>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import VideoElement from "../components/listItem/videoCompact.vue";
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
  watch: {
    enableUserGroup: function (newValue) {
      this.applySort();
    }
  },
  methods: {
    listWheelEvent(event: WheelEvent) {
      const el = this.$el.querySelector<HTMLLIElement>(".videoList-solid")!;
      el.scrollLeft += event.deltaY / 2;
      event.preventDefault();
    },
    changeSort(type: SortType) {
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
      this.videoItemsSolid = applySort(this.videoItemsRaw, this.sortType,this.enableUserGroup);
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
.videoList-solid {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  > * {
    width: 322px;
    flex: 0 0 auto;
  }
}
</style>