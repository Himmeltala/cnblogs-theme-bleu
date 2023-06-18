import request from "./use-axios";
import { strToDOM, ArbeitenTransform } from "@/transform";

export namespace ArbeitenApi {
  /**
   * 获取随笔、文章内容
   */
  export async function getArbeiten(id: string) {
    const { data } = await request.get(`/p/${id}.html`);
    return ArbeitenTransform.toArbeiten(id, strToDOM(data));
  }

  /**
   * 点赞或反对该随笔、文章
   *
   * @param form 随笔、文章实体。必须包含：isAbandoned、postId、voteType 三个字段。
   */
  export async function vote(form: BlogWorks): Promise<AjaxType> {
    const { data } = await request.post<AjaxType>(`/ajax/vote/blogpost`, form);
    ElMessage({
      message: data.message,
      grouping: true,
      type: data.isSuccess ? "success" : "error"
    });
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
    return ArbeitenTransform.toArbeitenListFull(strToDOM(data));
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
    return ArbeitenTransform.toArbeitenByL2(strToDOM(data));
  }

  /**
   * 获取随笔、文章的标签和分类
   */
  export async function getProps(id: string) {
    const { data } = await request.get(
      `/ajax/CategoriesTags.aspx?blogId=${BleuVars.getBlogId()}&postId=${id}`
    );
    return ArbeitenTransform.toProps(strToDOM(data));
  }

  /**
   * 获取随笔、文章的上下篇
   */
  export async function getPrevNext(id: string) {
    const { data } = await request.get(`/ajax/post/prevnext?postId=${id}`);
    return ArbeitenTransform.toPrevNext(strToDOM(data));
  }

  /**
   * 获取首页随笔列表
   *
   * @param page 页数，可以是 0，也可以是 1，都代表第一页
   */
  export async function getList(page?: number | string) {
    const { data } = await request.get(`/default.html?page=${page || 1}`);
    return ArbeitenTransform.toArbeitenList(strToDOM(data));
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
    return ArbeitenTransform.toArbeitenListFull(strToDOM(data));
  }

  /**
   * 通过标签获取随笔列表
   */
  export async function getListByMark(tag: string, page?: string | number) {
    const { data } = await request.get(`/tag/${tag}/default.html?page=${page ?? 1}`);
    return ArbeitenTransform.toArbeitenListPart(strToDOM(data));
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
    const isPassed = ArbeitenTransform.toIsUnLock(strToDOM(data));
    ElMessage({
      message: isPassed ? "密码正确！" : "密码错误！",
      grouping: true,
      type: isPassed ? "success" : "error"
    });
    return isPassed;
  }

  /**
   * 获取上锁的博文内容
   *
   * @param pwd 博文阅读密码
   * @returns 输入密码正确时返回这个博文内容
   */
  export async function getLockedArbeiten(pwd: string, id: string) {
    const formData = new FormData();
    formData.append("Password", pwd);
    const { data } = await request.post(`/protected/p/${id}.html`, formData);
    return ArbeitenTransform.toArbeiten(id, strToDOM(data));
  }

  /**
   * 获取日期分类的随笔、文章列表
   *
   * @param date 例如：2023/02/28
   */
  export async function getListByDay(date: string) {
    const { data } = await request.get(`/archive/${date}.html`);
    return ArbeitenTransform.toArbeitenList(strToDOM(data));
  }

  /**
   * 获取作品的关注信息
   *
   * @param id 作品 ID
   */
  export async function getArbeitenInfo(id: string) {
    let info = { isFollowed: false, isDigg: false };
    try {
      const { data } = await request.get(
        `/ajax/BlogPostInfo.aspx?blogId=${BleuVars.getBlogId()}&postId=${id}&blogUserGuid=${BleuVars.getBlogGuid()}`
      );
      info = ArbeitenTransform.toArbeitenInfo(strToDOM(data));
    } catch (e) {}
    return info;
  }

  /**
   * 推荐作品
   *
   * @param id 作品 ID
   */
  export async function nominate(id: string) {
    const { data } = await request.post<AjaxType>("/ajax/vote/blogpost", {
      isAbandoned: false,
      postId: id,
      voteType: "Digg"
    });
    if (data.isSuccess) {
      ElMessage.success(data.message);
    } else {
      ElMessage.error(data.message);
    }
  }

  /**
   * 关注博主
   */
  export async function follow() {
    try {
      const { data } = await request.post(`/ajax/Follow/FollowBlogger.aspx`, {
        blogUserGuid: BleuVars.getOppositeGuid()
      });
      if (data == "关注成功") ElMessage.success("关注成功！");
      else if (data == "未登录") ElMessage.error("没有登录！");
      else ElMessage.error("关注失败！");
    } catch (e: any) {
      ElMessage.error("操作失败！");
    }
  }

  /**
   * 取消关注
   */
  export async function unfollow() {
    try {
      const { data } = await request.post(`/ajax/Follow/RemoveFollow.aspx`, {
        blogUserGuid: BleuVars.getOppositeGuid()
      });
      if (data == "取消成功") ElMessage.success("取关成功！");
      else ElMessage.error("取关失败！");
    } catch (e: any) {
      ElMessage.error("操作失败！");
    }
  }
}
