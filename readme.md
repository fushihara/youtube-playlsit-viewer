# todo

- URL って書いてオートコンプリートをすると、複数のクラスがマッチするけど、これってどう区別されてるんだっけ
- localStorageUtilのオートコンプリートが効かない。直接書いたら認識はするのでvscodeの問題
  - 再現せず。
- asyncDataで定義したasyncDataの変数がthisにbindされてない。これってvue.d.ts管轄だと思うけどどうしようかな。thisを改造する必要あり？
- vue.d.tsでbase ってプロパティがあるけどドキュメントに無い。ソースコードを見て、どの場合でも必ずある事を確認して、githubのレポジトリを見て、昔からある事の確認をする
- redirectの引数のパラメータってなに？
- nuxt.config.tsで、モジュールの設定箇所は２箇所ある。topのはプラグインに使う。routerのは自作のに使う
- NuxtContext<Vue & { $axios: any }> に任意の型を追加出来る発見！
- トークンの更新時にクライアントシークレットを投げてるけど、これっていいの？
- 既存のソースのasyncDataの引数の型のanyを直す
- AxiosRequestConfig という引数の型があるはずだが https://qiita.com/shts/items/e15ab37dff40df73048c 見つからないのでなんとかする
- vueのmethodの中でthis.$axiosが効かないので、なんとかする。vueやmethodにジェネリックをつければなんとかなるかな？
- index.vueでプレイリストの一覧を取得する時、urlを文字列としてベタ書きしているのでちゃんとする
- index.vueでレスポンスに型が無いので、可能な限りつける
- option/selectにどうbindすれば、選択変更時にtoString()ではなく元のオブジェクトを取得出来るか。index.vueにあるのでメモする

# nuxtでspa シングル・ページ・アプリケーションを返す

- `npm run dev` 開発用サーバ
- `npm run build` htmlをビルドする。configのgenerate.dir に出力する。今回のテンプレの場合はdist-generate
- `npm run start` サーバを起動する。buildの後に実行する
- `npm run generate` buildと同じ
- `npm run generate` buildと同じ
