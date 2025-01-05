import request from "./use-axios";
import { Transform } from "@/transform";

/**
 * 获取随笔、文章
 *
 * @param id
 */
export async function getDetail(id: string) {
  const { data } = await request.get(`/p/${id}`);
  return Transform.Posts.toPostDetail(id, Transform.toDOM(data));
}

/**
 * 点赞或反对该随笔、文章
 *
 * @param form 随笔、文章实体。必须包含：isAbandoned、postId、voteType 三个字段。
 */
export async function vote(form: BlogPostModel): Promise<AjaxType> {
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
 * @deprecated
 */
export async function getViewPoint(id: string): Promise<BlogPostViewPointModel> {
  const { data } = await request.post(`/ajax/GetPostStat`, [id]);
  return data[0];
}

/**
 * 获取随笔或文章的一级分类
 *
 * @param id 分类 id
 * @param page 页数
 */
export async function getByL1(id: string | number | string[], page?: string | number | string[]) {
  const { data } = await request.get(`/category/${id}.html?page=${page || 1}`);
  return Transform.Posts.toPostsList2(Transform.toDOM(data));
}

/**
 * 获取随笔或文章的二级分类
 *
 * @param id 分类 ID
 * @param isArticle 随笔的类型是false(1)，文章的类型是true(2)
 */
export async function getByL2(id: string | number | string[], isArticle: boolean) {
  const { data } = await request.get(
    `/ajax/TreeCategoryList.aspx?parentId=${id}&categoryType=${isArticle ? 2 : 1}`
  );
  return Transform.Posts.toPostByL2(Transform.toDOM(data));
}

/**
 * 获取首页随笔列表
 *
 * @param page 页码，可以是 0，也可以是 1，都代表第一页
 */
export async function getList(page?: number | string) {
  const { data } = await request.get(`/default.html?page=${page || 1}`);
  return Transform.Posts.toPostsList1(Transform.toDOM(data));
}

/**
 * 获取随笔归档、文章归档
 *
 * @param date 例如：2023/02，请求的是 2023 年 2 月下的随笔或文章归档
 * @param type 文章归档 articles，随笔归档 posts
 */
export async function getListArchive(date: string, type: string) {
  const splitDate = date.split("-");
  const { data } = await request.get(
    `/${type == "posts" ? "p" : "articles"}/archive/${splitDate[0]}/${splitDate[1]}`
  );
  return Transform.Posts.toPostsList2(Transform.toDOM(data));
}

/**
 * 通过标签获取随笔列表
 *
 * @param tag 标签名称
 * @param page 页码
 */
export async function getListLabel(tag: any, page?: string | number) {
  const { data } = await request.get(`/tag/${tag}/default.html?page=${page ?? 1}`);
  return Transform.Posts.toPartPostsList(Transform.toDOM(data));
}

/**
 * 检测是否解锁博文
 *
 * @param pwd 博文阅读密码
 * @param id
 * @returns 输入密码正确时返回 true
 */
export async function isPassed(pwd: string, id: string) {
  const formData = new FormData();
  formData.append("Password", pwd);
  const { data } = await request.post(`/protected/p/${id}.html`, formData);
  const isPassed = Transform.Posts.toIsUnLock(Transform.toDOM(data));
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
 * @param id
 * @returns 输入密码正确时返回这个博文内容
 */
export async function getLocked(pwd: string, id: string) {
  const formData = new FormData();
  formData.append("Password", pwd);
  const { data } = await request.post(`/protected/p/${id}.html`, formData);
  return Transform.Posts.toPostDetail(id, Transform.toDOM(data));
}

/**
 * 获取某天下的随笔或文章的列表
 *
 * @param date 例如：2023/02/28，请求的是 2023 年 2 月 28 日的随笔或文章列表
 * @deprecated 2024年9月8日 废弃该功能
 */
export async function getListByDay(date: string) {
  const { data } = await request.get(`/archive/${date}.html`);
  return Transform.Posts.toPostsList1(Transform.toDOM(data));
}

/**
 * 获取文章信息，postInfo、postStats、prevNext
 *
 * @param id
 * @since 2023年9月30日
 */
export async function getInfo(id: string): Promise<PostInfoModel> {
  const { data } = await request.get(`/ajax/post-accessories?postId=${id}`);
  return Transform.Posts.toPostDetailInfo(data);
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
  const blogUserGuid = Consts.getOppositeGuid();
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
  const blogUserGuid = Consts.getOppositeGuid();
  const { data } = await request.post(`/ajax/Follow/RemoveFollow.aspx`, {
    blogUserGuid
  });
  if (data == "取消成功") ElMessage.success("取关成功！");
  else ElMessage.error("取关失败！");
}
