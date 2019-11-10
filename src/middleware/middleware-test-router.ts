import Vue from "vue";
import { NuxtContext } from "vue/types/options";

export default function (context: NuxtContext<Vue>) {
  console.log(`---------middleware-router-Clinet=${process.client}/Server=${process.server}/Static=${process.static}`);
}