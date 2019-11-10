import Vue from "vue";
import { NuxtContext } from "vue/types/options";
import { LocalStorageUtil } from "../util/localStorageUtil";

export default function (context: NuxtContext<Vue>) {
  console.log(`---------middleware-need-login-Clinet=${process.client}/Server=${process.server}/Static=${process.static}`);
  if(process.client){
    if(LocalStorageUtil.load().認証済み == false){
      context.redirect("./login");
    }
  }
}