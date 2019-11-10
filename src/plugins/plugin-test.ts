import Vue from "vue";
import { NuxtContext } from "vue/types/options";

export default function (context: NuxtContext<Vue>) {
  console.log(`---------plugins-Client=${process.client}/Server=${process.server}/Static=${process.static}`);
}