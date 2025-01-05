/**
 * 评论 HTML 解析器
 *
 * @author Himmeltala
 * @date 2023 年 1 月 15 日
 */
/**
 * 解析评论数量，官方默认一页是 50 条，pageIndex = 0 开始
 *
 * 40 / 50 = 0.8 意思还是第一页，100 / 50 = 2，刚好第二页，因此除了之后是一个向上取整的
 *
 * @param data 评论数量计数
 * @returns 返回一共有多少个 pageIndex
 */
export function toCommentPages(data: string): number {
  return Math.ceil(parseInt(data) / 50);
}

/**
 * 解析随笔详细页面的评论列表
 */
export function toCommentList(dom: Document): CommentModel[] {
  const data: CommentModel[] = [];
  const eles = dom.getElementsByClassName("feedbackItem");

  for (let i = 0; i < eles.length; i++) {
    const layer = eles[i].getElementsByClassName("layer")[0];
    const anchorId = layer.getAttribute("href").split("#")[1];
    const eleAvatar = eles[i].querySelector(`#comment_${anchorId}_avatar`);
    const avatar = eleAvatar ? eleAvatar.innerText.trim() : "";

    const digg = eles[i].getElementsByClassName("comment_digg")[0].innerText.match(/[\d]+/)[0];
    const bury = eles[i].getElementsByClassName("comment_burry")[0].innerText.match(/[\d]+/)[0];

    data.push({
      isEditing: false,
      isAnsling: false,
      commentId: anchorId,
      space: eles[i].querySelector(`#a_comment_author_${anchorId}`).getAttribute("href"),
      author: eles[i].querySelector(`#a_comment_author_${anchorId}`).innerText,
      layer: layer.innerText,
      date: eles[i].getElementsByClassName("comment_date")[0].innerText,
      content: eles[i].querySelector(`#comment_body_${anchorId}`).innerHTML,
      digg: Number(digg),
      bury: Number(bury),
      avatar
    });
  }

  return data;
}
