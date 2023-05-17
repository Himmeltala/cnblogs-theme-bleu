import request from "./use-axios";
import { strToDOM, WorksTransform, CalendarTransform } from "@/transform";

export namespace WorksApi {
  /**
   * 获取随笔、文章
   */
  export async function getWorks(id: string) {
    const { data } = await request.get(`/p/${id}.html`);
    return WorksTransform.toWorks(id, strToDOM(data));
  }

  /**
   * 点赞或反对该随笔、文章
   *
   * @param form 随笔、文章实体。必须包含：isAbandoned、postId、voteType 三个字段。
   */
  export async function vote(form: BlogWorks): Promise<AjaxType> {
    const { data } = await request.post(`/ajax/vote/blogpost`, form);
    return data;
  }

  /**
   * 获取随笔、文章的点赞和反对的数据
   *
   * @param id 传递一个数组，数组第一个就是 postId 的值
   */
  export async function getViewPoint(id: string): Promise<BlogWorksViewPoint> {
    const { data } = await request.post(`/ajax/GetPostStat`, [id]);
    return data[0];
  }

  /**
   * 获取随笔或文章的一级分类
   *
   * @param id 分类 id
   * @param page 页数
   */
  export async function getByL1(id: string, page?: number | string) {
    const { data } = await request.get(`/category/${id}.html?page=${page || 1}`);
    return WorksTransform.toWorksFull(strToDOM(data));
  }

  /**
   * 获取随笔或文章的二级分类
   *
   * @param id 分类 ID
   * @param isArticle 分类类型，随笔的类型是1，文章的类型是2
   */
  export async function getByL2(id: string, isArticle: boolean) {
    const { data } = await request.get(
      `/ajax/TreeCategoryList.aspx?parentId=${id}&categoryType=${isArticle ? 2 : 1}`
    );
    return WorksTransform.toWorksByL2(strToDOM(data));
  }

  /**
   * 获取随笔、文章的标签和分类
   */
  export async function getProps(id: string) {
    const { data } = await request.get(
      `/ajax/CategoriesTags.aspx?blogId=${BleuVars.getBlogId()}&postId=${id}`
    );
    return WorksTransform.toWorksProps(strToDOM(data));
  }

  /**
   * 获取随笔、文章的上下篇
   */
  export async function getPrevNext(id: string) {
    const { data } = await request.get(`/ajax/post/prevnext?postId=${id}`);
    return WorksTransform.toWorksPrevNext(strToDOM(data));
  }

  /**
   * 获取首页随笔列表
   *
   * @param page 页数，可以是 0，也可以是 1，都代表第一页
   */
  export async function getList(page?: number | string) {
    const { data } = await request.get(`/default.html?page=${page || 1}`);
    return WorksTransform.toWorksList(strToDOM(data));
  }

  /**
   * 获取随笔档案、文章档案
   *
   * @param date 日期
   * @param type 文章的请求链接是 archives，随笔的请求链接是 archive
   */
  export async function getListByArchive(date: string, type: "article" | "works") {
    const split = date.split("-");
    const { data } = await request.get(
      `/${type === "article" ? "archives" : "archive"}/${split[0]}/${split[1]}.html}`
    );
    return WorksTransform.toWorksFull(strToDOM(data));
  }

  /**
   * 通过标签获取随笔列表
   */
  export async function getListByMark(tag: string, page?: string | number) {
    const { data } = await request.get(`/tag/${tag}/default.html?page=${page ?? 1}`);
    return WorksTransform.toWorksSlice(strToDOM(data));
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
    const { data } = await request.post(`/protected/p/${id}.html`, formData);
    return WorksTransform.toIsUnLock(strToDOM(data));
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
    const { data } = await request.post(`/protected/p/${id}.html`, formData);
    return WorksTransform.toWorks(id, strToDOM(data));
  }

  /**
   * 获取日期下的随笔、文章
   *
   * @param date 2023/02/28
   */
  export async function getListByDay(date: string) {
    const { data } = await request.get(`/archive/${date}.html`);
    return WorksTransform.toWorksList(strToDOM(data));
  }

  /**
   * 获取月日历
   *
   * @param date 2023/02/15
   */
  export async function getCalendar(date: string) {
    const { data } = await request.get(`/ajax/calendar.aspx?dateStr=${date}`);
    return CalendarTransform.toCalendar(strToDOM(data));
  }
}
