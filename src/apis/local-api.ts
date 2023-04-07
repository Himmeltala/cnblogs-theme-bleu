/**
 * 提供对接博客园各种可用的基础 API，获取的数据来自于 #mainContent
 *
 * @author Himmelbleu
 * @date 2022 年 1 月 14 日
 * @url https://www.cnblogs.com/Himmelbleu/#/
 */

import $ from "jquery";
import * as Parser from "@/services/parse-html";

export function getCabinetColumn() {
  return Parser.parseCabinetColumn($("#home").find("#blog-sidecolumn").html());
}

export function getAuthorData() {
  return Parser.parseAuthorData($("#home").find("#blog-news").html());
}

export function getMasterData() {
  return Parser.parseMasterData($("#home").find(".blogStats").html());
}

export function getCabinetTopList() {
  return Parser.parseCabinetTopList($("#home").find("#sidebar_topviewedposts").html());
}

export function getAlbumnImg(): string {
  return $("#ViewPicture1_OriginalImage").attr("href");
}
