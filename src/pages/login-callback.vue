<template>
  <div class="container">
    <div>
      <h1>STEP 1/3</h1>
      <h2>コード</h2>
      <input type="text" v-model.trim="code" readonly />
      <h2>クライアントID</h2>
      <input type="text" v-model.trim="clientId" readonly />
      <h2>クライアントシークレット</h2>
      <input type="text" v-model.trim="clientSecret" readonly />
      <h2>リダイレクトURL</h2>
      <input type="text" v-model.trim="redirectUrl" readonly />
      <h2>スコープ</h2>
      <textarea v-model.trim="scope" readonly></textarea>
      <hr />
      <button v-on:click="getToken">トークン取得</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { LocalStorageUtil } from "../util/localStorageUtil";
export default Vue.extend({
  middleware: ['middleware-per-page'],
  data() {
    const saveData = LocalStorageUtil.load();
    return {
      code: new URL(document.location.href).searchParams.get("code") || "",
      clientId: saveData.clientId,
      clientSecret: saveData.clientSecret,
      scope: "https://www.googleapis.com/auth/youtube.readonly"
    }
  },
  asyncData(context) {
    console.log({
      ...context,
      "p_client": process.client,
      "p_server": process.server,
      "p_static": process.static,
    });
    return {
      redirectUrl: new URL("login-callback",new URL(context.base,document.location.href)).href
    };
  },
  methods: {
    getToken(): void {
      const saveData = LocalStorageUtil.load();
      const postValues = [];
      postValues.push(`code=${encodeURIComponent(this.code)}`);
      postValues.push(`client_id=${encodeURIComponent(saveData.clientId)}`);
      postValues.push(`client_secret=${encodeURIComponent(saveData.clientSecret)}`);
      //@ts-ignore
      postValues.push(`redirect_uri=${encodeURIComponent(this.redirectUrl)}`);
      postValues.push(`grant_type=authorization_code`);
      postValues.push(`access_type=offline`);
      fetch(`https://www.googleapis.com/oauth2/v4/token`, {
        method: "post",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: postValues.join("&")
      }).then(request => {
        return request.json().then(json => {
          const accessToken = json.access_token;
          const expiresInSecond = json.expires_in;
          const refreshToken = json.refresh_token;
          saveData.accessToken = accessToken;
          saveData.refreshToken = refreshToken;
          LocalStorageUtil.save(saveData);
          //@ts-ignore
          this.$router.push("/")
        });
      }).catch(e => {
        alert(`コードからアクセストークンとリフレッシュトークンを取得する事に失敗しました。\n${e}`);
      });
    }
  }
});
</script>

<style lang="scss" scoped>
.container {
  background-color: gray;
  display: flex;
  justify-content: center;
  align-items: center;
  > div {
    background-color: white;
    padding: 5px;
    width: 700px;
    > h1 {
      font-size: 15px;
    }
    > h2 {
      font-size: 13px;
    }
    > input[type="text"] {
      width: 100%;
      padding: 5px;
      font-family: monospace;
    }
    > textarea {
      width: 100%;
      height: 5em;
      padding: 5px;
      font-family: monospace;
    }
    hr {
      margin: 5px 0;
    }
    button {
      width: 100%;
    }
    > .memo {
      ul {
        display: flex;
        flex-wrap: wrap;
        li {
          display: inline;
          padding-right: 5px;
          &:last-child {
            padding-right: 0;
          }
        }
      }
    }
  }
}
</style>