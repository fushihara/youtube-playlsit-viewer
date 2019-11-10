export namespace LocalStorageUtil {
  const saveKey = `youtube-playlist-viewr-savekey`
  export type SaveType = { clientId: string, clientSecret: string, redirectUrl: string, scopes: string[], accessToken: string, refreshToken: string }
  export function load(): SaveType & { 認証済み: boolean } {
    const defaultData: SaveType & { 認証済み: boolean } = { clientId: "", clientSecret: "", redirectUrl: "", scopes: [], accessToken: "", refreshToken: "", 認証済み: false };
    try {
      const loadData = JSON.parse(localStorage[saveKey]);
      const mergetData: SaveType & { 認証済み: boolean } = Object.assign({}, defaultData, loadData);
      if (mergetData.accessToken != "" && mergetData.clientId != "" && mergetData.clientSecret != "" && mergetData.refreshToken != "") {
        mergetData.認証済み = true;
      }
      return mergetData;
    } catch{ }
    return defaultData;
  }
  export function save(data: SaveType) {
    localStorage[saveKey] = JSON.stringify(data);
  }
}