import request from "./use-axios";
import { strToDOM, MenuTransform } from "@/transform";

export namespace MenuApi {
  /**
   * 获取侧边栏随笔分类、随笔档案、文章分类、文章档案、最新评论等数据
   */
  export async function getColumn() {
    const { data } = await request.get(`/ajax/sidecolumn.aspx`);
    return MenuTransform.toMenuColumn(strToDOM(data));
  }

  /**
   * 获取侧边栏的博主信息
   *
   */
  export async function getNews() {
    const { data } = await request.get(`/ajax/news.aspx`);
    return MenuTransform.toAuthorData(strToDOM(data));
  }

  /**
   * 获取博主的阅读量、文章数、评论数、随笔数
   */
  export async function getStats() {
    const { data } = await request.get(`/ajax/blogStats`);
    return MenuTransform.toMasterData(strToDOM(data));
  }

  /**
   * 获取侧边栏阅读排行榜、评论排行榜、推荐排行榜列表
   */
  export async function getTopList() {
    const { data } = await request.get(`/ajax/TopLists.aspx`);
    return MenuTransform.toTopList(strToDOM(data));
  }

  /**
   * 关注博主
   */
  export async function follow() {
    const { data } = await request.post(`/ajax/Follow/FollowBlogger.aspx`, {
      blogUserGuid: BleuVars.getUserGuid()
    });
    return data === "关注成功" ?? false;
  }

  /**
   * 取消关注
   */
  export async function unfollow() {
    const { data } = await request.post(`/ajax/Follow/RemoveFollow.aspx`, {
      blogUserGuid: BleuVars.getUserGuid()
    });
    return data === "取消成功" ?? false;
  }
}
