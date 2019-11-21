import { VideoDataAndPlaylist } from "./youtubeApi";

export function applySort(videoItemsRaw:VideoDataAndPlaylist[],sortType:SortType,enableUserGroup:boolean):VideoDataAndPlaylist[]{
  const sortData = videoItemsRaw.map(a => {
    let sortValueNum: number | null = null;
    switch (sortType) {
      case "number-up":
      case "number-down":
        sortValueNum = a.playlistPosition;
        sortValueNum = a.playlistPosition;
        break;
      case "live-start-up":
      case "live-start-down":
        if (a.liveStreaming && (a.liveStreaming.type == "now" || a.liveStreaming.type == "ended")) {
          sortValueNum = new Date(a.liveStreaming.actualStartTime).getTime();
        }
        break;
      case "pv-up":
      case "pv-down":
        if (a.liveStreaming == null || a.liveStreaming.type == "ended") {
          sortValueNum = a.viewCount;
        }
        break;
      case "post-up":
      case "post-down":
        sortValueNum = new Date(a.publishDate).getTime();
        break;
    }
    return {
      ...a,
      sortValueNum,
    }
  }).filter(a => {
    return a.sortValueNum !== null;
  }).sort((a, b) => {
    let rev = false;
    switch (sortType) {
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
  });
  return sortData;
}
