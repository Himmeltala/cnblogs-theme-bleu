/**
 * 提供解析博客园 HTML 或字符 HTML 的各种基础 API
 *
 * @author Himmelbleu
 * @date 2022 年 12 月 1 日
 * @url https://www.cnblogs.com/Himmelbleu/#/
 */

import $ from "jquery";

/**
 * 把字符串转换为 DOM
 *
 * @param dom 字符串
 */
export function parseDOM(dom: any) {
  return new DOMParser().parseFromString(dom, "text/html");
}

/**
 * 获取页数
 */
function getMaxPage(dom: any): number {
  const reg = $(dom)
    .text()
    .match(/[1-9]+/g);
  if (reg) return reg.map(i => parseInt(i)).pop();
  else return 0;
}

/**
 * 只适用于获取首页随笔列表；日历随笔、文章列表。列表项包含描述、评论、点赞的随笔列表。
 */
export function parseWritingList(dom: any): CustType.IWritingList {
  const id = $(dom).find(".postTitle2");
  const head = $(dom).find(".postTitle");
  const desc = $(dom).find(".c_b_p_desc");
  const notes = $(dom).find(".postDesc").text();
  const date = notes.match(/[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d/g);
  const view = notes.match(/阅读\([0-9]+\)/g);
  const comm = notes.match(/评论\([0-9]+\)/g);
  const digg = notes.match(/推荐\([0-9]+\)/g);

  const data: CustType.IWriting[] = [];

  $(desc).each((i, e) => {
    data.push({
      id: $(id[i])
        .attr("href")
        .match(/[0-9]+/g)[0],
      text: EcyUtils.Text.replace($(head[i]).text().trim(), [/\[置顶\]/g]),
      desc: EcyUtils.Text.replace($(desc[i]).text(), [/阅读全文/g]),
      date: date[i],
      view: view[i],
      comm: comm[i],
      digg: digg[i],
      surface: $(e).find(".desc_img").attr("src") ?? "",
      isLocked: !!$(id[i]).find(`img[title="密码保护"]`).attr("title"),
      isOnlyMe: !!$(id[i]).find(`img[title="仅自己可见"]`).attr("title"),
      isTop: $(head[i]).find(".pinned-post-mark").text() === "[置顶]"
    });
  });

  return { page: getMaxPage($(dom).find("#homepage_top_pager > .pager")), data, hint: $(dom).find(".dayTitle").text() + " 档案" ?? "" };
}

/**
 * 解析随笔详细页面
 */
export function parseWriting(id: string, dom: any): CustType.IWriting {
  return {
    id,
    text: $(dom).find(".postTitle > a > span").text(),
    content: $(dom).find("#cnblogs_post_body").html(),
    date: $(dom).find("#post-date").text(),
    view: $(dom).find("#post_view_count").text(),
    comm: $(dom).find("#post_comment_count").text(),
    isLocked: $(dom).find(`img[title="密码保护"]`).attr("title") ? true : false
  };
}

/**
 * 解析随笔详细页面的评论列表
 */
export function parseCommentList(dom: any): Array<CustType.IComment> {
  const data: CustType.IComment[] = [];

  $(parseDOM(dom))
    .find(".feedbackItem")
    .map((i, elem) => {
      const anchorId = $(elem).find(".layer").attr("href")!.split("#")[1];
      data[i] = {
        isEditing: false,
        isAnsling: false,
        commentId: anchorId,
        space: $(elem).find(`#a_comment_author_${anchorId}`).attr("href"),
        author: $(elem).find(`#a_comment_author_${anchorId}`).text(),
        layer: $(elem).find(".layer").text(),
        date: $(elem).find(".comment_date").text(),
        content: $(elem).find(`#comment_body_${anchorId}`).html(),
        digg: $(elem).find(".comment_digg").text().trim(),
        bury: $(elem).find(".comment_burry").text().trim(),
        avatar: $(elem).find(`#comment_${anchorId}_avatar`).text().trim()
      };
    });

  return data;
}

/**
 * 解析评论数量，官方默认一页是 50 条，pageIndex = 0 开始
 *
 * 40 / 50 = 0.8 意思还是第一页，100 / 50 = 2，刚好第二页，因此除了之后是一个向上取整的
 *
 * @param json 评论数量计数
 * @returns 返回一共有多少个 pageIndex
 */
export function parseCommentPages(json: any): number {
  return Math.ceil(parseInt(json) / 50);
}

/**
 * 解析随笔详细页面中的属性：标签、分类
 */
export function parseWritingProps(dom: any): CustType.IWritingProps {
  const data = <CustType.IWritingProps>{ tags: [], sorts: [] };
  const _dom = parseDOM(dom);

  $(_dom)
    .find("#BlogPostCategory > a")
    .map((i, d) => {
      data.sorts.push({
        href: $(d)
          .attr("href")
          .match(/\/category\/\d+/g)[0]
          .split("/")[2]
          .split(",")[0],
        text: $(d).text()
      });
    });

  $(_dom)
    .find("#EntryTag > a")
    .map((i, d) => {
      data.tags.push({
        text: $(d).text()
      });
    });

  return data;
}

/**
 * 解析上下篇随笔
 */
export function parseEssayPrevNext(dom: any): CustType.IPrevNext {
  const data: CustType.IPrevNext = { prev: {}, next: {} };

  $(parseDOM(dom))
    .find("a")
    .each((i, e) => {
      const prefix = $(e).text().trim();
      if (prefix == "«") {
        data["prev"] = {
          text: $(e).next("a").text(),
          href: $(e).next("a").attr("href")
        };
      } else if (prefix == "»") {
        data["next"] = {
          text: $(e).next("a").text(),
          href: $(e).next("a").attr("href")
        };
      }
    });

  return data;
}

/**
 * 获取分类和档案的随笔、文章列表。列表项包含描述、评论、点赞的随笔列表。
 *
 * 只适用于获取分类、档案的随笔、文章列表。
 */
export function parseWritingsFull(dom: any): CustType.IWritingList2 {
  const data: CustType.IWriting[] = [];

  const dateReg = /[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d/g;
  const viewReg = /阅读\([0-9]+\)/g;
  const commReg = /评论\([0-9]+\)/g;
  const diggReg = /推荐\([0-9]+\)/g;

  $(dom)
    .find(".entrylistItem")
    .each((i, e) => {
      const item = $(e).find(".entrylistItemPostDesc").text();
      data.push({
        id: $(e)
          .find(".entrylistItemTitle")
          .attr("href")
          .match(/[0-9]+/g)[0],
        text: $(e).find(".entrylistItemTitle > span").text(),
        desc: $(e).find(".c_b_p_desc").text(),
        date: item.match(dateReg)[0],
        view: item.match(viewReg)[0],
        comm: item.match(commReg)[0],
        digg: item.match(diggReg)[0],
        surface: $(e).find(".c_b_p_desc > .desc_img").attr("src") ?? ""
      });
    });

  return {
    desc: $(dom).find(".entrylistTitle .category-crumb-item").attr("title"),
    desc2: $(dom).find(".entrylistDescription")?.text() ?? "",
    page: getMaxPage($(dom).find("#mainContent .pager")[0]),
    hint: $(dom).find(".entrylistTitle").text() ?? "",
    data
  };
}

/**
 * 获取随笔、文章列表。
 *
 * 只适用于获取以标签区别的随笔、文章列表。
 */
export function parseWritingsSlice(dom: any): CustType.IWritingList2 {
  const head = $(dom).find(".PostList > .postTitl2 > a");
  const desc = $(dom).find(".PostList > .postDesc2");
  const hint = $(dom).find(".PostListTitle").text().trim();
  const data: CustType.IWriting[] = [];

  $(head).each((i, e) => {
    data.push({
      id: $(e)
        .attr("href")
        .match(/[0-9]+/g)[0],
      text: $(e).text().trim(),
      date: $(desc[i])
        .text()
        .match(/[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d/g)[0],
      view: $(desc[i]).find(".post-view-count").text().split(":")[1],
      comm: $(desc[i]).find(".post-comment-count").text().split(":")[1],
      digg: $(desc[i]).find(".post-digg-count").text().split(":")[1]
    });
  });

  return { data, hint };
}

function loadColumn(dom: any, selector: string, success: (e: any, matched?: any) => void, regexp?: RegExp) {
  $(dom)
    .find(selector)
    .each((i, e) => {
      if (regexp) {
        const matched = $(e)?.attr("href")?.match(regexp);
        if (matched) success(e, matched);
      } else success(e);
    });
}

/**
 * 解析侧边栏分类列表、标签列表，... 列表
 */
export function parseCabinetColumn(dom: any): CustType.ICabinetColumn {
  const _dom = parseDOM(dom);

  const data: CustType.ICabinetColumn = {
    essaySort: [],
    essayArchive: [],
    articleArchive: [],
    articleSort: [],
    latestEssayList: [],
    latestComments: [],
    rankings: [],
    tagList: [],
    albumn: []
  };

  loadColumn(
    _dom,
    "#sidebar_recentposts ul li > a",
    (e, matched) => {
      data.latestEssayList.push({
        id: matched[0],
        text: $(e).text()
      });
    },
    /[0-9]+/g
  );

  loadColumn(
    _dom,
    "#sidebar_toptags ul li > a",
    (e, matched) => {
      data.tagList.push({
        id: matched[1],
        text: $(e).text()
      });
    },
    /tag\/(.[^\/]+)/
  );

  loadColumn(_dom, "#sidebar_scorerank ul li", e => {
    data.rankings.push({
      text: $(e).text()
    });
  });

  loadColumn(
    _dom,
    "#sidebar_postcategory ul li > a",
    (e, matched) => {
      data.essaySort.push({
        id: matched[0],
        text: $(e).text()
      });
    },
    /[0-9]+/g
  );

  loadColumn(
    _dom,
    "#sidebar_postarchive ul li > a",
    (e, matched) => {
      const date = matched[1].split("/");
      data.essayArchive.push({
        id: `${date[0]}-${date[1]}`,
        text: $(e).text()
      });
    },
    /archive\/([0-9]+\/[0-9]+)/
  );

  loadColumn(
    _dom,
    "#sidebar_imagecategory ul li > a",
    (e, matched) => {
      data.albumn.push({
        id: matched[1],
        text: $(e).text()
      });
    },
    /gallery\/([0-9]+)/
  );

  loadColumn(
    _dom,
    "#sidebar_articlecategory ul li > a",
    (e, matched) => {
      data.articleSort.push({
        id: matched[0],
        text: $(e).text()
      });
    },
    /[0-9]+/g
  );

  loadColumn(
    _dom,
    "#sidebar_articlearchive ul li > a",
    (e, matched) => {
      const date = matched[1].split("/");
      data.articleArchive.push({
        id: `${date[0]}-${date[1]}`,
        text: $(e).text()
      });
    },
    /archives\/([0-9]+\/[0-9]+)/
  );

  let count = 1;
  let bounds = false;
  let comment = { id: "", title: "", content: "", author: "" };

  $(_dom)
    .find("#sidebar_recentcomments ul li")
    .each((i, e) => {
      if (bounds) bounds = false;

      if (!bounds) {
        if ($(e).attr("class") === "recent_comment_title") {
          comment.title = $(e).find("a").text();
          comment.id = $(e)
            .find("a")
            .attr("href")
            .match(/[0-9]+/g)[0];
        } else if ($(e).attr("class") === "recent_comment_body") {
          comment.content = $(e).text();
        } else if ($(e).attr("class") === "recent_comment_author") {
          comment.author = EcyUtils.Text.replace($(e).text(), [/--/g]);
        }
      }

      if (count % 3 == 0) {
        bounds = true;
        data.latestComments.push(comment);
        comment = { id: "", title: "", content: "", author: "" };
      }
      count++;
    });

  return data;
}

/**
 * 解析侧边栏博主主人基本的昵称、粉丝数、园龄等数据
 */
export function parseAuthorData(dom: string): CustType.ICabinetItemData[] {
  const data: CustType.ICabinetItemData[] = [];
  $(parseDOM(dom))
    .find("#profile_block > a")
    .each((i, e) => {
      data.push({ text: $(e).text().trim(), href: $(e).attr("href")! });
    });
  return data;
}

/**
 * 解析博主主人的随笔、文章、评论、阅读等数据
 *
 * @param dom 真实 DOM
 */
export function parseMasterData(dom: string): Array<CustType.ICabinetItemData> {
  const data: CustType.ICabinetItemData[] = [];
  $(parseDOM(dom))
    .find("span")
    .each((i, d) => {
      if ($(d).attr("id")) {
        const t = $(d).text();
        const text = t.match(/^[\u4e00-\u9fa5]*/g)[0];
        let digg = t.match(/\d+/g)[0];
        if (i === 3) digg = EcyUtils.Parser.unit(digg);
        data.push({ text, digg });
      }
    });
  return data;
}

/**
 * 解析侧边栏博客排行信息。
 *
 * @param dom 真实 DOM
 */
export function parseCabinetRankList(dom: string): CustType.ICabinetItemData[] {
  const data: CustType.ICabinetItemData[] = [];
  $(parseDOM(dom))
    .find("li")
    .each((i, d) => {
      const t = $(d).text().trim();
      const text = t.match(/^[\u4e00-\u9fa5]*/g)[0];
      const digg = t.match(/\d+/g)[0];
      data.push({ text, digg });
    });
  return data;
}

/**
 * 解析博客阅读排行榜
 *
 * @param dom 真实 DOM
 */
export function parseCabinetTopList(dom: string): CustType.ICabinetTopList {
  const data: CustType.ICabinetTopList = {
    topView: [],
    topComments: [],
    topDigg: []
  };

  const _dom = parseDOM(dom);

  $(_dom)
    .find("#TopFeedbackPostsBlock ul > li > a")
    .each((i, e) => {
      data.topComments.push({
        id: $(e)
          .attr("href")
          ?.match(/\/p\/\d+/g)[0]
          .split("/")[2],
        text: $(e).text()
      });
    });

  $(_dom)
    .find("#TopViewPostsBlock ul > li > a")
    .each((i, e) => {
      data.topView.push({
        id: $(e)
          .attr("href")
          ?.match(/\/p\/\d+/g)[0]
          .split("/")[2],
        text: $(e).text()
      });
    });

  $(_dom)
    .find("#TopDiggPostsBlock ul > li > a")
    .each((i, e) => {
      data.topDigg.push({
        id: $(e)
          .attr("href")
          ?.match(/\/p\/\d+/g)[0]
          .split("/")[2],
        text: $(e).text()
      });
    });

  return data;
}

export function parseMarkList(realDOM: any): CustType.IMark[] {
  const data: CustType.IMark[] = [];
  $(realDOM)
    .find("#MyTag1_dtTagList")
    .find("td")
    .each((i, e) => {
      const count = parseInt($(e).attr("data-use-count"));
      const href = $(e).find("a").attr("href");
      const text = $(e).find("a").text();
      data.push({ count, href, text });
    });
  return data;
}

/**
 * 解析输入密码之后返回的 DOM，查找是否有错误密码提示
 *
 * @returns 输入密码正确返回 true
 */
export function parseIsUnLock(dom: any): boolean {
  const isError = $(dom).find(".field-validation-error")?.text();
  if (isError && isError === "密码错误") {
    return false;
  } else if (!isError) {
    return true;
  }
}

export function parseWritingSortChild(dom: any): CustType.IWritingSortChild[] {
  const data: CustType.IWritingSortChild[] = [];
  $(dom)
    .find("li")
    .each((i, el) => {
      data.push({
        id: $(el).attr("data-category-id"),
        text: $(el).find(".tree-categories-item-title-right").text()
      });
    });
  return data;
}

export function parseAlbumn(dom: any) {
  const data: CustType.AlbumnItem[] = [];

  $(dom)
    .find(".divPhoto")
    .each((i, e) => {
      const id = $(e)
        .find("a")
        .attr("href")
        .match(/\/gallery\/image\/\d+/g)[0]
        .split("/")[3];
      data.push({
        id,
        src: $(e).find("img").attr("src")
      });
    });

  return {
    title: $(dom).find(".thumbTitle").text(),
    desc: $(dom).find(".thumbDescription").text(),
    data
  };
}

export function parseCalendar(dom: any): string[] {
  const dates: string[] = [];
  $(dom)
    .find("a[href^='https']")
    .each((i, el) => {
      const date = $(el)
        .attr("href")
        .match(/\d+\/\d+\/\d+/g)[0];
      dates.push(date);
    });
  return dates;
}
