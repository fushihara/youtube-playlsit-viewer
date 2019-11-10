declare module "*.vue" {
  const content: any;
  export default content;
}
// https://github.com/wagerfield/nuxt-typescript/issues/6#issuecomment-412837539
// https://gist.github.com/fukuiretu/b4b13794972e8234ac09ab96b86ab6e8
// Vue.extendでasyncDataとfetchを使うのに必要な型定義。

/*

./node_modules/vue/types/options.d.ts
export interface ComponentOptions<V extends Vue>{
  // ここに追加
}

*/
import Vue from 'vue'
import { Store } from 'vuex'
declare module 'vue/types/options' {
  interface Redirect {
    (status: number, path: string, query?: string): void;
    (path: string): void;
  }
  // https://ja.nuxtjs.org/api/context/
  interface NuxtContext<V extends Vue> {
    app: V,
    isClient: boolean,
    isServer: boolean,
    isStatic: boolean,
    isDev: boolean,
    store: Store<any>, // Consider vuex-typex in future
    env: object,
    params: object,
    query: object,
    redirect: Redirect,
    base?: string, // baseはドキュメント上には無い
  }

  interface ComponentOptions<V extends Vue> {
    asyncData?(context: NuxtContext<V>): Promise<object> | object
    fetch?(context: NuxtContext<V>): Promise<object> | object,
    middleware?: string | string[]
  }
}

