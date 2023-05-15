/**
 * 提供对接博客园各种可用的基础 API
 *
 * @author Himmelbleu
 * @date 2022 年 12 月 1 日
 */

import axios from "axios";
import * as Parser from "@/transform/parse-html";

/**
 * 以 async/await 风格写异步请求，代码更加简洁，逻辑更加清晰
 *
 * @param url 请求地址
 * @returns 返回一个 Promise 对象
 */
async function sendAwaitGet(url: string): Promise<any> {
  let awt;
  try {
    awt = await axios.get(`${EcyConfig.baseAPI}${url}`, { timeout: 5000 });
  } catch (e) {
    ElMessage.error(e);
  }
  return awt;
}

/**
 * 以 async/await 风格写异步请求，代码更加简洁，逻辑更加清晰
 *
 * @param url 请求地址
 * @param data 请求体
 * @returns 返回一个 Promise 对象
 */
async function sendAwaitPost(url: string, data: any): Promise<any> {
  let awt;
  let token = "";
  const eleToken = document.getElementById("antiforgery_token");
  if (!!eleToken) token = eleToken.getAttribute("value");
  else ElMessage.error("未获取到你的 Token！");
  try {
    awt = await axios.post(`${EcyConfig.baseAPI}${url}`, data, {
      timeout: 5000,
      headers: { RequestVerificationToken: token || "" }
    });
  } catch (e) {
    ElMessage.error(e);
  }
  return awt;
}

export namespace WorksApi {
  /**
   * 获取随笔、文章
   */
  export async function getWorks(id: string) {
    const { data } = await sendAwaitGet(`/p/${id}.html`);
    return Parser.parseWorks(id, Parser.parseDOM(data));
  }

  /**
   * 点赞或反对该随笔、文章
   *
   * @param form 随笔、文章实体。必须包含：isAbandoned、postId、voteType 三个字段。
   */
  export async function vote(form: BlogType.IWorks): Promise<BlogType.AjaxType> {
    const { data } = await sendAwaitPost(`/ajax/vote/blogpost`, form);
    return data;
  }

  /**
   * 获取随笔、文章的点赞和反对的数据
   *
   * @param id 传递一个数组，数组第一个就是 postId 的值
   */
  export async function getViewPoint(id: string): Promise<BlogType.IWorksViewPoint> {
    const { data } = await sendAwaitPost(`/ajax/GetPostStat`, [id]);
    return data[0];
  }

  /**
   * 获取随笔或文章的一级分类
   *
   * @param id 分类 id
   * @param page 页数
   */
  export async function getByL1(id: string, page?: number | string) {
    const { data } = await sendAwaitGet(`/category/${id}.html?page=${page || 1}`);
    return Parser.parseWorksFull(Parser.parseDOM(data));
  }

  /**
   * 获取随笔或文章的二级分类
   *
   * @param id 分类 ID
   * @param isArticle 分类类型，随笔的类型是1，文章的类型是2
   */
  export async function getByL2(id: string, isArticle: boolean) {
    const { data } = await sendAwaitGet(`/ajax/TreeCategoryList.aspx?parentId=${id}&categoryType=${isArticle ? 2 : 1}`);
    return Parser.parseWorksByL2(Parser.parseDOM(data));
  }

  /**
   * 获取随笔、文章的标签和分类
   */
  export async function getProps(id: string) {
    const { data } = await sendAwaitGet(`/ajax/CategoriesTags.aspx?blogId=${EcyConfig.blogId}&postId=${id}`);
    return Parser.parseWorksProps(Parser.parseDOM(data));
  }

  /**
   * 获取随笔、文章的上下篇
   */
  export async function getPrevNext(id: string) {
    const { data } = await sendAwaitGet(`/ajax/post/prevnext?postId=${id}`);
    return Parser.parseWorksPrevNext(Parser.parseDOM(data));
  }

  /**
   * 获取首页随笔列表
   *
   * @param page 页数，可以是 0，也可以是 1，都代表第一页
   */
  export async function getList(page?: number | string) {
    const { data } = await sendAwaitGet(`/default.html?page=${page || 1}`);
    return Parser.parseWorksList(Parser.parseDOM(data));
  }

  /**
   * 获取随笔档案、文章档案
   *
   * @param date 日期
   * @param type 文章的请求链接是 archives，随笔的请求链接是 archive
   */
  export async function getListByArchive(date: string, type: "article" | "works") {
    const split = date.split("-");
    const { data } = await sendAwaitGet(`/${type === "article" ? "archives" : "archive"}/${split[0]}/${split[1]}.html}`);
    return Parser.parseWorksFull(Parser.parseDOM(data));
  }

  /**
   * 通过标签获取随笔列表
   */
  export async function getListByMark(tag: string, page?: string | number) {
    const { data } = await sendAwaitGet(`/tag/${tag}/default.html?page=${page ?? 1}`);
    return Parser.parseWorksSlice(Parser.parseDOM(data));
  }

  /**
   * 检测是否解锁博文
   *
   * @param pwd 博文阅读密码
   * @returns 输入密码正确时返回 true
   */
  export async function isPassed(pwd: string, id: string) {
    const formData = new FormData();
    formData.append("Password", pwd);
    const { data } = await sendAwaitPost(`/protected/p/${id}.html`, formData);
    return Parser.parseIsUnLock(Parser.parseDOM(data));
  }

  /**
   * 获取上锁的博文内容，普通的 API 无法获取
   *
   * @param pwd 博文阅读密码
   * @returns 输入密码正确时返回这个博文内容
   */
  export async function getLockedWorks(pwd: string, id: string) {
    const formData = new FormData();
    formData.append("Password", pwd);
    const { data } = await sendAwaitPost(`/protected/p/${id}.html`, formData);
    return Parser.parseWorks(id, Parser.parseDOM(data));
  }

  /**
   * 获取日期下的随笔、文章
   *
   * @param date 2023/02/28
   */
  export async function getListByDay(date: string) {
    const { data } = await sendAwaitGet(`/archive/${date}.html`);
    return Parser.parseWorksList(Parser.parseDOM(data));
  }

  /**
   * 获取月日历
   *
   * @param date 2023/02/15
   */
  export async function getCalendar(date: string) {
    const { data } = await sendAwaitGet(`/ajax/calendar.aspx?dateStr=${date}`);
    return Parser.parseCalendar(Parser.parseDOM(data));
  }
}

export namespace CommentApi {
  /**
   * 发送随笔的评论
   *
   * @param comment 评论实体
   */
  export async function insert(comment: BlogType.IComment): Promise<BlogType.AjaxType> {
    const { data } = await sendAwaitPost(`/ajax/PostComment/Add.aspx`, comment);
    return data;
  }

  /**
   * 删除其中一条评论
   *
   * @param comment 评论实体
   */
  export async function del(comment: BlogType.IComment): Promise<boolean> {
    const { data } = await sendAwaitPost(`/ajax/comment/DeleteComment.aspx`, comment);
    return data;
  }

  /**
   *  通过 ID 获取单个评论
   *
   * @param comment 评论实体，对应博客园默认的评论字段，需要传递一个包含评论 ID 的实体
   */
  export async function get(comment: BlogType.IComment) {
    const { data } = await sendAwaitPost(`/ajax/comment/GetCommentBody.aspx`, comment);
    return data;
  }

  /**
   * 修改评论
   *
   * @param comment 评论实体，对应博客园默认的评论字段，需要传递一个包含评论 ID、评论内容的实体
   */
  export async function update(comment: BlogType.IComment): Promise<BlogType.AjaxType> {
    const { data } = await sendAwaitPost(`/ajax/PostComment/Update.aspx`, comment);
    return data;
  }

  /**
   * 获取评论计数
   *
   * @param id 随笔 ID
   */
  export async function getCount(id: number | string) {
    const { data } = await sendAwaitGet(`/ajax/GetCommentCount.aspx?postId=${id}`);
    return Parser.parseCommentPages(data);
  }

  /**
   * 点赞或反对评论
   *
   * @param comment 被操作的评论的实体，需要 isAbandoned、postId、voteType 三个字段，其中 voteType 请见 DataType.VoteType，只有两种类型。
   */
  export async function vote(comment: BlogType.IComment): Promise<BlogType.AjaxType> {
    const { data } = await sendAwaitPost(`/ajax/vote/comment`, comment);
    return data;
  }

  /**
   * 回复一条评论
   *
   * @param comment 博客园原有的评论实体，需要 body、parentCommentId、postId。parentCommentId 就是回复的那一条的 ID。
   */
  export async function answer(comment: BlogType.IComment): Promise<BlogType.AjaxType> {
    const { data } = await sendAwaitPost(`/ajax/PostComment/Add.aspx`, comment);
    return data;
  }

  /**
   * 获取随笔的评论列表
   *
   * @param postId 随笔 ID。从首页跳转到随笔页面之后，通过 vue-outer 获取 postId
   * @param page 1 页最多有 50 条评论
   * @param anchorId 当进入的是一个回复评论时，需要传递该参数，默认可以不传递
   */
  export async function getList(postId: string, page: number, anchorId?: number) {
    let url = `/ajax/GetComments.aspx?postId=${postId}&pageIndex=${page}`;
    if (anchorId) url += `&anchorCommentId=${anchorId}&isDesc=false`;
    const { data } = await sendAwaitGet(url);
    return Parser.parseCommentList(Parser.parseDOM(data));
  }
}

export namespace MenuApi {
  /**
   * 获取侧边栏随笔分类、随笔档案、文章分类、文章档案、最新评论等数据
   */
  export async function getColumn() {
    const { data } = await sendAwaitGet(`/ajax/sidecolumn.aspx`);
    return Parser.parseMenuColumn(Parser.parseDOM(data));
  }

  /**
   * 获取侧边栏的博主信息
   *
   */
  export async function getNews() {
    const { data } = await sendAwaitGet(`/ajax/news.aspx`);
    return Parser.parseAuthorData(Parser.parseDOM(data));
  }

  /**
   * 获取博主的阅读量、文章数、评论数、随笔数
   */
  export async function getStats() {
    const { data } = await sendAwaitGet(`/ajax/blogStats`);
    return Parser.parseMasterData(Parser.parseDOM(data));
  }

  /**
   * 获取侧边栏阅读排行榜、评论排行榜、推荐排行榜列表
   */
  export async function getTopList() {
    const { data } = await sendAwaitGet(`/ajax/TopLists.aspx`);
    return Parser.parseTopList(Parser.parseDOM(data));
  }

  /**
   * 关注博主
   */
  export async function follow() {
    const { data } = await sendAwaitPost(`/ajax/Follow/FollowBlogger.aspx`, {
      blogUserGuid: EcyConfig.userGuid
    });
    return data === "关注成功" ?? false;
  }

  /**
   * 取消关注
   */
  export async function unfollow() {
    const { data } = await sendAwaitPost(`/ajax/Follow/RemoveFollow.aspx`, {
      blogUserGuid: EcyConfig.userGuid
    });
    return data === "取消成功" ?? false;
  }
}

/**
 * 获取所有标签列表
 */
export async function getMarkList() {
  const { data } = await sendAwaitGet(`/tag`);
  return Parser.parseMarkList(Parser.parseDOM(data));
}

/**
 * 获取相册照片
 *
 * @param id 相册照片 ID
 */
export async function getAlbumnItem(id: string) {
  const { data } = await sendAwaitGet(`/gallery/image/${id}.html`);
  return Parser.parseAlbumnItem(Parser.parseDOM(data));
}

/**
 * 获取相册下的所有照片
 */
export async function getAlbumn(id: string) {
  const { data } = await sendAwaitGet(`/gallery/${id}.html`);
  return Parser.parseAlbumn(Parser.parseDOM(data));
}
