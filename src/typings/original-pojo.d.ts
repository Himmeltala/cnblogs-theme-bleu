type VoteType = "Bury" | "Digg";

/**
 * 返回的博客园的字段类型
 */
type AjaxType = Partial<{
  id: number;
  isSuccess: boolean;
  message: string;
  data: any;
}>;

/**
 * 根据博客园的数据库字段而来的博客园评论模型
 */
interface BlogCommentModel {
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
interface BlogPostModel {
  postId?: number;
  voteType?: VoteType;
  isAbandoned?: boolean;
}

/**
 * 随笔投票，博客园接口需要的正确字段
 *
 * @deprecated
 */
interface BlogPostViewPointModel {
  buryCount: number;
  diggCount: number;
  feedbackCount: number;
  postId: string;
  viewCount: number;
}
