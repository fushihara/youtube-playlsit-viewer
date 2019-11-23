
export function applySort(videoItemsRaw: VideoDataAndPlaylist[], sortType: SortType, enableUserGroup: boolean): MainListItemVideo[] {
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
  }).map((now, index) => {
    const backgroundColors = ["white", "#DDD"];
    return {
      ...now,
      backgroundColor: backgroundColors[index % backgroundColors.length]
    }
  });
  if (enableUserGroup) {
    return groupByUser(sortData);
  }
  return sortData;
}
function groupByUser(videoList: MainListItemVideo[]): MainListItemVideo[] {
  const list: {
    channelName: string,
    channelId: string,
    videos: MainListItemVideo[]
  }[] = [];
  for (let video of videoList) {
    const listData = list.find(a => a.channelId == video.channelId);
    if (listData === undefined) {
      list.push({
        channelId: video.channelId,
        channelName: video.channelTitle,
        videos: [video]
      });
    } else {
      listData.videos.push(video);
    }
  }
  const result: MainListItemVideo[] = [];
  const backgroundColors = ["white", "#DDD"];
  for (let data of list) {
    const backgroundColor = backgroundColors[list.indexOf(data) % backgroundColors.length];
    let header: { label: string, link: string } | undefined = {
      label: data.channelName,
      link: `https://www.youtube.com/channel/${data.channelId}`
    };
    for (let video of data.videos) {
      video.backgroundColor = backgroundColor;
      result.push({
        header,
        ...video
      });
      header = undefined;
    }
  }
  return result;
}
