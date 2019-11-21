import { LocalStorageUtil } from "./localStorageUtil";
import { strict } from "assert";
export function updateToken() {
  const saveData = LocalStorageUtil.load();
  const postValues = [];
  postValues.push(`refresh_token=${encodeURIComponent(saveData.refreshToken)}`);
  postValues.push(`client_id=${encodeURIComponent(saveData.clientId)}`);
  postValues.push(`client_secret=${encodeURIComponent(saveData.clientSecret)}`);
  postValues.push(`grant_type=refresh_token`);
  postValues.push(`access_type=offline`);
  return fetch(`https://www.googleapis.com/oauth2/v4/token`, {
    method: "post",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: postValues.join("&")
  }).then(request => {
    return request.json().then(json => {
      const accessToken = json.access_token;
      const expiresInSecond = json.expires_in;
      // リフレッシュトークンは少なくとも6ヶ月使われなかったら必ず無効になる
      // https://developers.google.com/identity/protocols/OAuth2#expiration
      saveData.accessToken = accessToken;
      LocalStorageUtil.save(saveData);
    });
  });
}
export type VideoDataAndPlaylist = VideoData & {
  playlistPosition: number,
  playlistRegistrationDate: Date
}
type VideoData = {
  videoId: string,
  title: string,
  description: string,
  durationSec: number,
  channelId: string,
  channelTitle: string,
  tags: string[],
  thumbnail: string,
  publishDate: Date,
  liveStreaming: LiveStreamingBefore | LiveStreamingNow | LiveStreamingEnded | null,
  commentCount: number,
  favoriteCount: number,
  viewCount: number,
  likeCount: number,
  dislikeCount: number
}
type LiveStreamingBefore = { // 配信前
  type: "before",
  scheduledStartTime: Date
};
type LiveStreamingNow = { //配信中
  type: "now",
  actualStartTime: Date,
  scheduledStartTime: Date,
  concurrentViewers: number
};
type LiveStreamingEnded = { // 配信終了
  type: "ended",
  actualStartTime: Date,
  actualEndTime: Date
};
export async function getPlayList(axios: any): Promise<{ id: string, title: string, itemCount: number }[]> {
  const url = "https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&mine=true&maxResults=50";
  return axios.$get(url).then((a: any) => {
    return a.items.map((b: any) => {
      return {
        id: String(b.id),
        title: String(b.snippet.title),
        itemCount: Number(b.contentDetails.itemCount)
      };
    });
  });
}
export async function getPlaylistVideos(axios: any, playlistId: string, allGet: boolean): Promise<{ datas: VideoDataAndPlaylist[] }> {
  const filterVideoIds: string[] = [];
  const resultData: VideoDataAndPlaylist[] = [];
  let nextToken = "";
  while (true) {
    const playlistApiDatas = await apiPlaylist(axios, playlistId, nextToken);
    if (playlistApiDatas.items.length == 0) {
      break;
    }
    for (let v of playlistApiDatas.filterItems) {
      filterVideoIds.push(v);
    }
    const videoApiDatas = await apiVideoDatas(axios, playlistApiDatas.items.map(a => a.videoId));
    const videoApiDataVideoIds = videoApiDatas.map(a => a.videoId);
    const videoApiNoDataVideoIds = playlistApiDatas.items.map(a => a.videoId).filter(a => videoApiDataVideoIds.includes(a) == false);
    if (0 < videoApiNoDataVideoIds.length) {
      console.log(`これらの動画の情報取得に失敗しました`, videoApiNoDataVideoIds);
    }
    for (let v of videoApiDatas) {
      const videoId = v.videoId;
      const playlistData = playlistApiDatas.items.find(a => a.videoId == videoId);
      if (playlistData == null) {
        console.log(`動画情報がありませんでした`, v);
        continue;
      }
      resultData.push({
        ...v,
        ...playlistData
      });
    }
    console.log(playlistApiDatas, videoApiDatas);
    if (allGet == false) {
      break;
    }
    if (playlistApiDatas.nextToken == null) {
      break;
    }
    nextToken = playlistApiDatas.nextToken;
  }
  return {
    datas: resultData
  };
}
async function apiVideoDatas(axios: any, videoIds: string[]): Promise<VideoData[]> {
  const url = new URL(`https://www.googleapis.com/youtube/v3/videos`);
  url.searchParams.append("part", [
    "snippet", //公開日、チャンネルID、タイトル、説明、タグ、サムネ liveBroadcastContent 
    "contentDetails", // 動画長さ、字幕の有無
    "liveStreamingDetails", // ライブ配信の場合、そのステータス
    "statistics" // 再生回数やいいね回数
  ].join(","));
  url.searchParams.append("id", videoIds.join(","));
  url.searchParams.append("maxResults", "50");
  return await axios.$get(url.href).then((a: any) => {
    console.log("動画情報取得apiの戻り地", a.items);
    return a.items.map((b: any) => {
      const videoId = String(b.id);
      const title = String(b.snippet.title);
      const description = String(b.snippet.description);
      const durationSec = iso8601tosec(String(b.contentDetails.duration));
      const channelId = String(b.snippet.channelId);
      const channelTitle = String(b.snippet.channelTitle);
      const tags = (b.snippet.tags || []).map((a: any) => String(a)) as string[];
      const thumbnail = String(b.snippet.thumbnails.medium.url);
      const publishDate = new Date(b.snippet.publishedAt);
      let liveStreaming: LiveStreamingBefore | LiveStreamingNow | LiveStreamingEnded | null = null;
      if (b.liveStreamingDetails == null) {
        // liveではない
      } else if (b.liveStreamingDetails.actualEndTime) {
        // 配信終了
        liveStreaming = {
          type: "ended",
          actualEndTime: new Date(b.liveStreamingDetails.actualEndTime),
          actualStartTime: new Date(b.liveStreamingDetails.actualStartTime)
        };
      } else if (b.liveStreamingDetails.actualStartTime) {
        // 配信中
        liveStreaming = {
          type: "now",
          actualStartTime: new Date(b.liveStreamingDetails.actualStartTime),
          concurrentViewers: Number(b.liveStreamingDetails.concurrentViewers),
          scheduledStartTime: new Date(b.liveStreamingDetails.scheduledStartTime)
        };
      } else if (b.liveStreamingDetails.scheduledStartTime) {
        // 配信前
        liveStreaming = {
          type: "before",
          scheduledStartTime: new Date(b.liveStreamingDetails.scheduledStartTime)
        };
      } else {
        // 想定外
        console.error(`実況判定で想定外のパターンがありました`, b);
      }
      const commentCount = Number(b.statistics.commentCount);
      const favoriteCount = Number(b.statistics.favoriteCount);
      const viewCount = Number(b.statistics.viewCount);
      const likeCount = Number(b.statistics.likeCount);
      const dislikeCount = Number(b.statistics.dislikeCount);
      return {
        videoId,
        title,
        description,
        durationSec,
        channelId,
        channelTitle,
        tags,
        thumbnail,
        publishDate,
        liveStreaming,
        commentCount,
        favoriteCount,
        viewCount,
        likeCount,
        dislikeCount,
      }
    });
  });
}
// PT21M55S"
function iso8601tosec(val: string): number {
  let totalSec = 0;
  if (val.match(/(\d+)D/)) {
    const v = Number(RegExp.$1);
    totalSec += (v * 60 * 60 * 24);
  }
  if (val.match(/(\d+)H/)) {
    const v = Number(RegExp.$1);
    totalSec += (v * 60 * 60);
  }
  if (val.match(/(\d+)M/)) {
    const v = Number(RegExp.$1);
    totalSec += (v * 60);
  }
  if (val.match(/(\d+)S/)) {
    const v = Number(RegExp.$1);
    totalSec += (v);
  }
  return totalSec;
}
async function apiPlaylist(axios: any, playlistId: string, nextToken: string): Promise<{ nextToken: string | null, filterItems: string[], items: { videoId: string, playlistPosition: number, playlistRegistrationDate: Date }[] }> {
  const url = new URL(`https://www.googleapis.com/youtube/v3/playlistItems`);
  url.searchParams.append("part", [
    "snippet",
    //"contentDetails",
    //"status"
  ].join(","));
  url.searchParams.append("playlistId", playlistId);
  url.searchParams.append("maxResults", "50");
  if (nextToken != "") {
    url.searchParams.append("pageToken", nextToken);
  }
  return await axios.$get(url.href).then((a: any) => {
    let nextToken: string | null = null;
    if (a.nextPageToken !== undefined) {
      nextToken = String(a.nextPageToken);
    }
    let filterItems: string[] = a.items.filter((b: any) => b.snippet.thumbnails == null).map((b: any) => { b.snippet.resourceId.videoId });
    const items = a.items.filter((b: any) => b.snippet.thumbnails).map((b: any) => {
      const videoId = String(b.snippet.resourceId.videoId);
      const playlistPosition = Number(b.snippet.position);
      const playlistRegistrationDate = new Date(b.snippet.publishedAt);
      return {
        videoId, playlistPosition, playlistRegistrationDate
      };
    });
    return { nextToken, items, filterItems }
  });
}