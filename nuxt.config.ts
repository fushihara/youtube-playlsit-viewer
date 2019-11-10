// ミドルウェアはnuxt-linkでの移動時も実行される
// pluginは実行されない。ページ読み込み時のみ。

export default {
  router: {
    base: process.env.GITHUB_REPOSITORY || "",
    middleware: ["middleware-test-router"],
  },
  generate: {
    fallback: true, // デフォルトの '200.html' の代わりに '404.html' を使用したい場合
    routes: [],
    dir: "dist-generate"
  },
  server: {
    host: '0.0.0.0', // デフォルト: localhost
  },
  mode: 'spa',
  srcDir: "./src",
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  buildModules: ['@nuxt/typescript-build'],
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    "~/asset/global.scss"
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    "@/plugins/plugin-test",
    "@/plugins/plugin-axios",
  ],
  /*
  ** Nuxt.js modules
  */
  // router側で設定すべきで、ここでの設定はなんかおかしくなるのでナシ
  modules: [
    '@nuxtjs/axios'
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config: any, ctx: any) {
      config.devtool = 'cheap-source-map'
      //console.log(`isClient=${ctx.isClient}`);
    },
    loaders: {
      imgUrl: { limit: 5000 }
    }
  }
}