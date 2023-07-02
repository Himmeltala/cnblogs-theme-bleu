import request from "./use-axios";
import { toDOM, DatumTransform } from "@/transform";

export namespace DatumApi {
  /**
   * 获取侧边栏随笔分类、随笔档案、文章分类、文章档案、最新评论等数据
   */
  export async function getColumn() {
    const { data } = await request.get(`/ajax/sidecolumn.aspx`);
    return DatumTransform.toMenuColumn(toDOM(data));
  }

  /**
   * 获取侧边栏的博主信息
   *
   */
  export async function getNews() {
    const { data } = await request.get(`/ajax/news.aspx`);
    return DatumTransform.toAuthorData(toDOM(data));
  }

  /**
   * 获取博主的阅读量、文章数、评论数、随笔数
   */
  export async function getStats() {
    const { data } = await request.get(`/ajax/blogStats`);
    return DatumTransform.toMasterData(toDOM(data));
  }

  /**
   * 获取侧边栏阅读排行榜、评论排行榜、推荐排行榜列表
   */
  export async function getTopList() {
    const { data } = await request.get(`/ajax/TopLists.aspx`);
    return DatumTransform.toTopList(toDOM(data));
  }

  /**
   * 获取所有标签列表
   */
  export async function getMarkList() {
    const { data } = await request.get(`/tag`);
    return DatumTransform.toMarkList(toDOM(data));
  }

  /**
   * 获取相册照片
   *
   * @param id 相册图片 ID
   */
  export async function getAlbumnItem(id: string) {
    const { data } = await request.get(`/gallery/image/${id}.html`);
    return DatumTransform.toAlbumnItem(toDOM(data));
  }

  /**
   * 获取相册下的所有图片
   */
  export async function getAlbumn(id: string) {
    const { data } = await request.get(`/gallery/${id}.html`);
    return DatumTransform.toAlbumn(toDOM(data));
  }

  /**
   * 获取日历
   *
   * @param date 例如：2023/02/15
   */
  export async function getCalendar(date: string) {
    const { data } = await request.get(`/ajax/calendar.aspx?dateStr=${date}`);
    return DatumTransform.toCalendar(toDOM(data));
  }
}
