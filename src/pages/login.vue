<template>
  <div class="container">
    <div>
      <h1>STEP 1/3</h1>
      <h2>クライアントID</h2>
      <input type="text" v-model.trim="clientId" />
      <h2>クライアントシークレット</h2>
      <input type="text" v-model.trim="clientSecret" />
      <h2>リダイレクトURL</h2>
      <input type="text" v-model.trim="redirectUrl" readonly />
      <h2>スコープ</h2>
      <textarea v-model.trim="scope" readonly></textarea>
      <hr />
      <button v-on:click="oauthPush">oAuth認証開始</button>
      <div class="memo">
        <ul>
          <li>
            <a href="https://developers.google.com/identity/protocols/googlescopes">スコープの一覧</a>
          </li>
          <li>
            <a
              href="https://console.cloud.google.com/apis/api/youtube.googleapis.com/credentials"
            >APIキーの一覧</a>
          </li>
        </ul>
      </div>
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
      redirectUrl: new URL("/login-callback", document.location.href)
    };
  },
  methods: {
    oauthPush(): void {
      const scopes = this.scope.split("\n").map(a => a.trim()).filter(a => a !== "");
      if (scopes.length == 0) {
        alert("スコープの指定がありません"); return;
      }
      if (this.clientId == "") {
        alert("クライアントIDの指定がありません"); return;
      }
      if (this.clientSecret == "") {
        alert("クライアント シークレットの指定がありません"); return;
      }
      const saveData = LocalStorageUtil.load();
      saveData.clientId = this.clientId;
      saveData.clientSecret = this.clientSecret;
      saveData.scopes = scopes;
      //@ts-ignore
      saveData.redirectUrl = this.redirectUrl;
      debugger;
      LocalStorageUtil.save(saveData);

      const urlBase = `https://accounts.google.com/o/oauth2/auth`;
      const params = [];
      params.push(`response_type=code`);
      params.push(`client_id=${encodeURIComponent(saveData.clientId)}`);
      params.push(`redirect_uri=${encodeURIComponent(saveData.redirectUrl)}`);
      params.push(`scope=${encodeURIComponent(scopes.join(" "))}`);
      params.push(`access_type=offline`);
      params.push(`approval_prompt=force`);
      const accessUrl = `${urlBase}?${params.join("&")}`;
      document.location.href = accessUrl;
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
    width: 500px;
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