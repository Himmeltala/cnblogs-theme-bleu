import request from "./use-axios";
import { Transform } from "@/transform";

/**
 * 获取侧边栏数据。
 *
 * 包括：随笔分类、随笔档案、文章分类、文章档案、最新评论。
 */
export async function getColumnContent() {
  const { data } = await request.get(`/ajax/sidecolumn.aspx`);
  return Transform.Datum.toColumnData(Transform.toDOM(data));
}

/**
 * 获取阅读量、文章数、评论数、随笔数、年龄、粉丝、关注
 */
export async function getStatistics() {
  const { data: stats } = await request.get(`/ajax/blogStats`);
  const { data: news } = await request.get(`/ajax/news.aspx`);
  return [
    ...Transform.Datum.toAuthorData(Transform.toDOM(news)),
    ...Transform.Datum.toStatistics(Transform.toDOM(stats))
  ];
}

/**
 * 获取侧边栏阅读排行榜、评论排行榜、推荐排行榜列表
 */
export async function getTopList() {
  const { data } = await request.get(`/ajax/TopLists.aspx`);
  return Transform.Datum.toTopList(Transform.toDOM(data));
}

/**
 * 获取所有标签列表
 */
export async function getMarkList() {
  const { data } = await request.get(`/tag`);
  return Transform.Datum.toMarkList(Transform.toDOM(data));
}

/**
 * 获取相册照片
 *
 * @param id 相册图片 ID
 */
export async function getAlbumnItem(id: string) {
  const { data } = await request.get(`/gallery/image/${id}.html`);
  return Transform.Datum.toPhotoDetail(Transform.toDOM(data));
}

/**
 * 获取相册下的所有图片
 */
export async function getAlbumn(id: string) {
  const { data } = await request.get(`/gallery/${id}.html`);
  return Transform.Datum.toPhotos(Transform.toDOM(data));
}

/**
 * 获取日历
 *
 * @param date 例如：2023/02/15
 */
export async function getCalendar(date: string) {
  const { data } = await request.get(`/ajax/calendar.aspx?dateStr=${date}`);
  return Transform.Datum.toCalendar(Transform.toDOM(data));
}
