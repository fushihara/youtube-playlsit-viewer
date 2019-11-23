declare type SortType = "number-up" | "number-down" | "live-start-up" | "live-start-down" | "post-up" | "post-down" | "pv-up" | "pv-down";
declare type MainListItemVideo = {
  header?: { label: string, link: string },
  backgroundColor: string,
} & VideoDataAndPlaylist;
declare type VideoDataAndPlaylist = VideoData & PlayListData;
declare type PlayListData = {
  playlistPosition: number,
  playlistRegistrationDate: Date
}
declare type VideoData = {
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
declare type LiveStreamingBefore = { // 配信前
  type: "before",
  scheduledStartTime: Date
};
declare type LiveStreamingNow = { //配信中
  type: "now",
  actualStartTime: Date,
  scheduledStartTime: Date,
  concurrentViewers: number
};
declare type LiveStreamingEnded = { // 配信終了
  type: "ended",
  actualStartTime: Date,
  actualEndTime: Date
};