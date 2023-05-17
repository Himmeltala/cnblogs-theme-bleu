type VoteType = "Bury" | "Digg";

/**
 * 有些接口返回的数据类型是博客园的字段，需要该类型进行约束
 */
type AjaxType = Partial<{
  id: number;
  isSuccess: boolean;
  message: string;
  data: any;
}>;

/**
 * 博客园评论实体，区别于上面定义的评论实体，这个实体是根据博客园的数据库字段而来
 */
interface BlogComment {
  postId?: number;
  voteType?: VoteType;
  isAbandoned?: boolean;
  // 评论 ID
  commentId?: number;
  // 评论内容
  body?: string;
  // 回复的评论 ID
  parentId?: number;
  // 当前页面的 index
  pageIndex?: number;
  // 回复评论的 ID
  parentCommentId?: number;
}

/**
 * 获取随笔，返回的博客园接口的字段
 */
interface BlogWorks {
  postId?: number;
  voteType?: VoteType;
  isAbandoned?: boolean;
}

/**
 * 随笔投票，博客园接口需要的正确字段
 */
interface BlogWorksViewPoint {
  buryCount: number;
  diggCount: number;
  feedbackCount: number;
  postId: string;
  viewCount: number;
}
