import request from "./use-axios";
import { strToDOM, CommentTransform } from "@/transform";

export namespace CommentApi {
  /**
   * 发送随笔的评论
   *
   * @param comment 评论实体
   */
  export async function insert(comment: BlogComment): Promise<AjaxType> {
    const { data } = await request.post(`/ajax/PostComment/Add.aspx`, comment);
    return data;
  }

  /**
   * 删除其中一条评论
   *
   * @param comment 评论实体
   */
  export async function del(comment: BlogComment): Promise<boolean> {
    const { data } = await request.post(`/ajax/comment/DeleteComment.aspx`, comment);
    return data;
  }

  /**
   *  通过 ID 获取单个评论
   *
   * @param comment 评论实体，对应博客园默认的评论字段，需要传递一个包含评论 ID 的实体
   */
  export async function get(comment: BlogComment) {
    const { data } = await request.post(`/ajax/comment/GetCommentBody.aspx`, comment);
    return data;
  }

  /**
   * 修改评论
   *
   * @param comment 评论实体，对应博客园默认的评论字段，需要传递一个包含评论 ID、评论内容的实体
   */
  export async function update(comment: BlogComment): Promise<AjaxType> {
    const { data } = await request.post(`/ajax/PostComment/Update.aspx`, comment);
    return data;
  }

  /**
   * 获取评论计数
   *
   * @param id 随笔 ID
   */
  export async function getCount(id: number | string) {
    const { data } = await request.get(`/ajax/GetCommentCount.aspx?postId=${id}`);
    return CommentTransform.toCommentPages(data);
  }

  /**
   * 点赞或反对评论
   *
   * @param comment 被操作的评论的实体，需要 isAbandoned、postId、voteType 三个字段，其中 voteType 请见 DataType.VoteType，只有两种类型。
   */
  export async function vote(comment: BlogComment): Promise<AjaxType> {
    const { data } = await request.post(`/ajax/vote/comment`, comment);
    return data;
  }

  /**
   * 回复一条评论
   *
   * @param comment 博客园原有的评论实体，需要 body、parentCommentId、postId。parentCommentId 就是回复的那一条的 ID。
   */
  export async function answer(comment: BlogComment): Promise<AjaxType> {
    const { data } = await request.post(`/ajax/PostComment/Add.aspx`, comment);
    return data;
  }

  /**
   * 获取随笔的评论列表
   *
   * @param postId 随笔 ID。
   * @param page 页数，从 1 开始，0 表示最后一页。1 页最多有 50 条评论
   * @param anchorId 当进入的是一个回复评论时，需要传递该参数，默认可以不传递
   */
  export async function getList(postId: string, page: number, anchorId?: number) {
    let url = `/ajax/GetComments.aspx?postId=${postId}&pageIndex=${page}`;
    if (anchorId) url = `/ajax/GetComments.aspx?postId=${postId}&pageIndex=0&anchorCommentId=${anchorId}`;
    const { data } = await request.get(url);
    return CommentTransform.toCommentList(strToDOM(data));
  }
}
