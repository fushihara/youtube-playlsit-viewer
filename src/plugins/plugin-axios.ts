import Vue from "vue";
import { NuxtContext } from "vue/types/options";
import { updateToken } from "../util/youtubeApi";
import { LocalStorageUtil } from "../util/localStorageUtil";

export default function (context: NuxtContext<Vue & { $axios: any }>) {
  context.app.$axios.interceptors.response.use(null, (error: any) => {
    if (error.config && error.response && error.response.status === 401) {
      console.log(`axios-エラーである事を検知。トークンの更新開始`);
      return updateToken().then(() => {
        console.log(`axios-トークンの更新確認`);
        const savedata = LocalStorageUtil.load();
        error.config.headers.Authorization = `Bearer ${savedata.accessToken}`;
        console.log(`axios-トークンを更新して再度リクエストを投げます`);
        return context.app.$axios.request(error.config);
      }).catch(() => {
        console.log(`axios-トークンの更新に失敗したのでエラーを投げて終わりにします`);
        return Promise.reject(error);
      });
    }
    console.log(`axios-エラーではなさそうなので処理続行します？`);
    return Promise.reject(error);
  });
  context.app.$axios.interceptors.request.use((config: any) => {
    const savedata = LocalStorageUtil.load();
    config.headers = { Authorization: `Bearer ${savedata.accessToken}` };
    return config;
  });
}