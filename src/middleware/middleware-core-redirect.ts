import Vue from "vue";
import { NuxtContext } from "vue/types/options";
import { LocalStorageUtil } from "../util/localStorageUtil";

export default function (context: NuxtContext<Vue>) {
  console.log(`---------middleware-need-login-Clinet=${process.client}/Server=${process.server}/Static=${process.static}`);
  if(process.client){
    const url = new URL(document.location.href);
    const keys = [...url.searchParams.keys()];
    const isCode = keys.length == 2 && keys.includes("code") && keys.includes("scope");
    const saveData = LocalStorageUtil.load();
    if(isCode && saveData.clientId != "" && saveData.clientSecret != ""){
      //ok
    }else{
      context.redirect("./login");
    }
  }
}