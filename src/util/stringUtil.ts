import * as dateformat from "dateformat";
import { sprintf } from "sprintf-js";
export function formatDate(date: Date, format = "yyyy/mm/dd(ddd)HH:MM:ss"): string {
  // 日付オブジェクトを文字列に変換
  dateformat.i18n.dayNames = [
    '日', '月', '火', '水', '木', '金', '土',
    '日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'
  ];
  return dateformat(date, format);
}
export function formatNumber(num: number): string {
  // 万 いくつ
  if (num < 10000) {
    return String(num);
  } else {
    return sprintf("%d万%04d", Math.floor(num / 10000), num % 10000);
  }
}
export function formatSecond(num: number): string {
  // 10:00:00
  if (num < 60) {
    return sprintf("0:%02d", num);
  } else if (num < 3600) {
    return sprintf("%d:%02d", Math.floor(num / 60), num % 60);
  } else {
    return sprintf("%d:%02d:%02d", Math.floor(num / 3600), Math.floor(num / 60) % 60, num % 60);
  }
}
