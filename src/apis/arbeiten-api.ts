import request from "./use-axios";
import { toDOM, ArbeitenTransform } from "@/transform";

export namespace ArbeitenApi {
  /**
   * 获取随笔、文章内容
   * 
   * @param id 随笔、文章 ID
   */
  export async function getArbeiten(id: string) {
    const { data } = await request.get(`/p/${id}.html`);
    return ArbeitenTransform.toArbeiten(id, toDOM(data));
  }

  /**
   * 点赞或反对该随笔、文章
   *
   * @param form 随笔、文章实体。必须包含：isAbandoned、postId、voteType 三个字段。
   */
  export async function vote(form: BlogArbeiten): Promise<AjaxType> {
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
  export async function getViewPoint(id: string): Promise<BlogArbeitenViewPoint> {
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
    return ArbeitenTransform.toArbeitenList2(toDOM(data));
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
    return ArbeitenTransform.toArbeitenByL2(toDOM(data));
  }

  /**
   * 获取随笔、文章的标签和分类
   * 
   * @param id 随笔、文章 ID
   */
  export async function getProps(id: string) {
    const { data } = await request.get(
      `/ajax/CategoriesTags.aspx?blogId=${BleuVars.getBlogId()}&postId=${id}`
    );
    return ArbeitenTransform.toProps(toDOM(data));
  }

  /**
   * 获取随笔、文章的上下篇
   * 
   * @param 随笔、文章 ID
   */
  export async function getPrevNext(id: string) {
    const { data } = await request.get(`/ajax/post/prevnext?postId=${id}`);
    return ArbeitenTransform.toPrevNext(toDOM(data));
  }

  /**
   * 获取首页随笔列表
   *
   * @param page 页码，可以是 0，也可以是 1，都代表第一页
   */
  export async function getList(page?: number | string) {
    const { data } = await request.get(`/default.html?page=${page || 1}`);
    return ArbeitenTransform.toArbeitenList1(toDOM(data));
  }

  /**
   * 获取随笔归档、文章归档
   *
   * @param date 例如：2023/02，请求的是 2023 年 2 月下的随笔或文章归档
   * @param type 文章的请求链接是 archives，随笔的请求链接是 archive
   */
  export async function getListByArchive(date: string, type: "article" | "arbeiten") {
    const splitDate = date.split("-");
    const { data } = await request.get(
      `/${type === "article" ? "archives" : "archive"}/${splitDate[0]}/${splitDate[1]}.html`
    );
    return ArbeitenTransform.toArbeitenList2(toDOM(data));
  }

  /**
   * 通过标签获取随笔列表
   * 
   * @param tag 标签名称
   * @param page 页码
   */
  export async function getListByMark(tag: string, page?: string | number) {
    const { data } = await request.get(`/tag/${tag}/default.html?page=${page ?? 1}`);
    return ArbeitenTransform.toArbeitenListPart(toDOM(data));
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
    const isPassed = ArbeitenTransform.toIsUnLock(toDOM(data));
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
    return ArbeitenTransform.toArbeiten(id, toDOM(data));
  }

  /**
   * 获取某天下的随笔或文章的列表
   *
   * @param date 例如：2023/02/28，请求的是 2023 年 2 月 28 日的随笔或文章列表
   */
  export async function getListByDay(date: string) {
    const { data } = await request.get(`/archive/${date}.html`);
    return ArbeitenTransform.toArbeitenList1(toDOM(data));
  }

  /**
   * 获取作品状态信息
   *
   * @param id 作品 ID
   */
  export async function getArbeitenState(id: string): Promise<BleuArbeitenState> {
    let resp = { isFollowed: false, isDigg: false };
    const blogUserGuid = BleuVars.getUserGuid();
    if (blogUserGuid && isLogined) {
      const { data } = await request.get(
        `/ajax/BlogPostInfo.aspx?blogId=${BleuVars.getBlogId()}&postId=${id}&blogUserGuid=${blogUserGuid}`
      );
      resp = ArbeitenTransform.toArbeitenInfo(toDOM(data));
    }
    return resp;
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
    if (data.isSuccess) ElMessage.success(data.message);
    else ElMessage.error(data.message);
  }

  /**
   * 关注博主
   */
  export async function follow() {
    const blogUserGuid = BleuVars.getOppositeGuid();
    const { data } = await request.post(`/ajax/Follow/FollowBlogger.aspx`, {
      blogUserGuid
    });
    if (data == "关注成功") ElMessage.success("关注成功！");
    else if (data == "未登录") ElMessage.error("没有登录！");
    else ElMessage.error("关注失败！");
  }

  /**
   * 取消关注
   */
  export async function unfollow() {
    const blogUserGuid = BleuVars.getOppositeGuid();
    const { data } = await request.post(`/ajax/Follow/RemoveFollow.aspx`, {
      blogUserGuid
    });
    if (data == "取消成功") ElMessage.success("取关成功！");
    else ElMessage.error("取关失败！");
  }
}
