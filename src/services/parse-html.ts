/**
 * 提供解析博客园 HTML 或字符 HTML 的各种基础 API
 *
 * @author Himmelbleu
 * @date 2022 年 12 月 1 日
 */

/**
 * 把字符串转换为 DOM
 */
export function parseDOM(dom: string) {
  return new DOMParser().parseFromString(dom, "text/html");
}

/**
 * 获取页数
 */
function getPage(dom: Element) {
  if (dom) {
    const pages = dom.innerText.match(/[1-9]+/g);
    if (pages) return pages.map(i => parseInt(i)).pop();
    else return 0;
  } else {
    return 0;
  }
}

/**
 * 只适用于获取首页随笔列表；日历随笔、文章列表。列表项包含描述、评论、点赞的随笔列表。
 */
export function parseWorksList(dom: Document): CustType.IWorksList {
  const id = dom.getElementsByClassName("postTitle2");
  const head = dom.getElementsByClassName("postTitle");
  const desc = dom.getElementsByClassName("c_b_p_desc");
  const notes = dom.getElementsByClassName("postDesc");
  const hint = dom.getElementsByClassName("dayTitle");
  const data: CustType.IWorks[] = [];

  for (let index = 0; index < desc.length; index++) {
    const eleDescImg = desc[index].getElementsByClassName("desc_img")[0];
    const surface = eleDescImg ? eleDescImg.getAttribute("src") : "";

    const eleLock = id[index].querySelector(`img[title="密码保护"]`);
    const isLocked = !!eleLock;

    const eleOnlyMe = id[index].querySelector(`img[title="仅自己可见"]`);
    const isOnlyMe = !!eleOnlyMe;

    const eleTop = head[index].getElementsByClassName("pinned-post-mark")[0];
    const isTop = eleTop && eleTop.innerText === "[置顶]";

    data.push({
      id: id[index].getAttribute("href").match(/[0-9]+/g)[0],
      text: EcyUtils.Text.replace(head[index].innerText.trim(), [/\[置顶\]/g]),
      desc: EcyUtils.Text.replace(desc[index].innerText, [/阅读全文/g]),
      date: notes[index].innerText.match(/[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d/g)[0],
      view: notes[index].innerText.match(/阅读\([0-9]+\)/g)[0],
      comm: notes[index].innerText.match(/评论\([0-9]+\)/g)[0],
      digg: notes[index].innerText.match(/推荐\([0-9]+\)/g)[0],
      surface,
      isLocked,
      isOnlyMe,
      isTop
    });
  }

  return {
    data,
    page: getPage(dom.querySelector("#homepage_top_pager > .pager")),
    hint: hint[0].innerText + " 档案" ?? ""
  };
}

/**
 * 解析随笔详细页面
 */
export function parseWorks(id: string, dom: Document): CustType.IWorks {
  const text = dom.querySelector(".postTitle > a > span").innerText;
  const content = dom.getElementById("cnblogs_post_body").innerHTML;

  return {
    id,
    text,
    content,
    date: dom.getElementById("post-date").innerText,
    view: dom.getElementById("post_view_count").innerText,
    comm: dom.getElementById("post_comment_count").innerText,
    isLocked: !text && !content
  };
}

/**
 * 解析随笔详细页面的评论列表
 */
export function parseCommentList(dom: Document): CustType.IComment[] {
  const data: CustType.IComment[] = [];
  const eles = dom.getElementsByClassName("feedbackItem");

  for (let i = 0; i < eles.length; i++) {
    const layer = eles[i].getElementsByClassName("layer")[0];
    const anchorId = layer.getAttribute("href").split("#")[1];
    const eleAvatar = eles[i].querySelector(`#comment_${anchorId}_avatar`);
    const avatar = eleAvatar ? eleAvatar.innerText.trim() : "";

    data.push({
      isEditing: false,
      isAnsling: false,
      commentId: anchorId,
      space: eles[i].querySelector(`#a_comment_author_${anchorId}`).getAttribute("href"),
      author: eles[i].querySelector(`#a_comment_author_${anchorId}`).innerText,
      layer: layer.innerText,
      date: eles[i].getElementsByClassName("comment_date")[0].innerText,
      content: eles[i].querySelector(`#comment_body_${anchorId}`).innerHTML,
      digg: eles[i].getElementsByClassName("comment_digg")[0].innerText.trim(),
      bury: eles[i].getElementsByClassName("comment_burry")[0].innerText.trim(),
      avatar
    });
  }

  return data;
}

/**
 * 解析评论数量，官方默认一页是 50 条，pageIndex = 0 开始
 *
 * 40 / 50 = 0.8 意思还是第一页，100 / 50 = 2，刚好第二页，因此除了之后是一个向上取整的
 *
 * @param data 评论数量计数
 * @returns 返回一共有多少个 pageIndex
 */
export function parseCommentPages(data: string): number {
  return Math.ceil(parseInt(data) / 50);
}

/**
 * 解析随笔详细页面中的属性：标签、分类
 */
export function parseWorksProps(dom: Document): CustType.IWorksProps {
  const data = <CustType.IWorksProps>{ tags: [], sorts: [] };

  const eleCates = dom.querySelectorAll("#BlogPostCategory > a");

  for (let i = 0; i < eleCates.length; i++) {
    data.sorts.push({
      href: eleCates[i]
        .getAttribute("href")
        .match(/\/category\/\d+/g)[0]
        .split("/")[2]
        .split(",")[0],
      text: eleCates[i].innerText
    });
  }

  const eleTags = dom.querySelectorAll("#EntryTag > a");

  for (let i = 0; i < eleTags.length; i++) {
    data.tags.push({
      text: eleTags[i].innerText
    });
  }

  return data;
}

/**
 * 解析上下篇随笔
 */
export function parseWorksPrevNext(dom: Document): CustType.IPrevNext {
  const data: CustType.IPrevNext = { prev: {}, next: {} };
  const eleAs = dom.getElementsByTagName("a");

  for (let i = 0; i < eleAs.length; i++) {
    const prefix = eleAs[i].innerText.trim();
    const nextElement = eleAs[i].nextElementSibling;
    if (prefix == "«") {
      data["prev"] = {
        text: nextElement.innerText.trim(),
        href: nextElement.getAttribute("href")
      };
    } else if (prefix == "»") {
      data["next"] = {
        text: nextElement.innerText.trim(),
        href: nextElement.getAttribute("href")
      };
    }
  }

  return data;
}

/**
 * 获取分类和档案的随笔、文章列表。列表项包含描述、评论、点赞的随笔列表。
 *
 * 只适用于获取分类、档案的随笔、文章列表。
 */
export function parseWorksFull(dom: Document): CustType.IWorksList2 {
  const data: CustType.IWorks[] = [];

  const dateReg = /[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d/g;
  const viewReg = /阅读\([0-9]+\)/g;
  const commReg = /评论\([0-9]+\)/g;
  const diggReg = /推荐\([0-9]+\)/g;

  const eleList = dom.getElementsByClassName("entrylistItem");

  for (let i = 0; i < eleList.length; i++) {
    const item = eleList[i].getElementsByClassName("entrylistItemPostDesc")[0].innerText;
    const eleDescImg = eleList[i].querySelector(".c_b_p_desc > .desc_img");
    const surface = eleDescImg ? eleDescImg.getAttribute("src") : "";

    data.push({
      id: eleList[i]
        .getElementsByClassName("entrylistItemTitle")[0]
        .getAttribute("href")
        .match(/[0-9]+/g)[0],
      text: eleList[i].querySelector(".entrylistItemTitle > span").innerText,
      desc: eleList[i].getElementsByClassName("c_b_p_desc")[0].innerText,
      date: item.match(dateReg)[0],
      view: item.match(viewReg)[0],
      comm: item.match(commReg)[0],
      digg: item.match(diggReg)[0],
      surface
    });
  }

  const eleDesc = dom.querySelector(".entrylistTitle .category-crumb-item");
  const desc = eleDesc ? eleDesc.getAttribute("title") : "";
  const eleDesc2 = dom.getElementsByClassName("entrylistDescription")[0];
  const desc2 = eleDesc2 ? eleDesc2.innerText : "";
  const eleHint = dom.getElementsByClassName("entrylistTitle")[0];
  const hint = eleHint ? eleHint.innerText : "";

  return {
    desc,
    desc2,
    page: getPage(dom.querySelectorAll("#mainContent .pager")[0]),
    hint,
    data
  };
}

/**
 * 获取随笔、文章列表。
 *
 * 只适用于获取以标签区别的随笔、文章列表。
 */
export function parseWorksSlice(dom: Document): CustType.IWorksList2 {
  const head = dom.querySelectorAll(".PostList > .postTitl2 > a");
  const desc = dom.querySelectorAll(".PostList > .postDesc2");
  const hint = dom.getElementsByClassName("PostListTitle")[0].innerText.trim();
  const data: CustType.IWorks[] = [];

  head.forEach((ele, index) => {
    data.push({
      id: ele.getAttribute("href").match(/[0-9]+/g)[0],
      text: ele.innerText.trim(),
      date: desc[index].innerText.match(/[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d/g)[0],
      view: desc[index].getElementsByClassName("post-view-count")[0].innerText.split(":")[1],
      comm: desc[index].getElementsByClassName("post-comment-count")[0].innerText.split(":")[1],
      digg: desc[index].getElementsByClassName("post-digg-count")[0].innerText.split(":")[1]
    });
  });

  return { data, hint, page: getPage(dom.getElementsByClassName("Pager")[0]) };
}

function loadColumn(dom: Document, selector: string, success: (e: Element, matched?: any) => void, regexp?: RegExp) {
  dom.querySelectorAll(selector).forEach(ele => {
    if (regexp) {
      const matched = ele.getAttribute("href")?.match(regexp);
      if (matched) success(ele, matched);
    } else success(ele);
  });
}

/**
 * 解析侧边栏分类列表、标签列表，... 列表
 */
export function parseMenuColumn(dom: Document): CustType.IMenuColumn {
  const data: CustType.IMenuColumn = {
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
    dom,
    "#sidebar_recentposts ul li > a",
    (e, matched) => {
      data.latestEssayList.push({
        id: matched[0],
        text: e.innerText
      });
    },
    /[0-9]+/g
  );

  loadColumn(
    dom,
    "#sidebar_toptags ul li > a",
    (e, matched) => {
      data.tagList.push({
        id: matched[1],
        text: e.innerText
      });
    },
    /tag\/(.[^\/]+)/
  );

  loadColumn(dom, "#sidebar_scorerank ul li", e => {
    data.rankings.push({
      text: e.innerText
    });
  });

  loadColumn(
    dom,
    "#sidebar_postcategory ul li > a",
    (e, matched) => {
      data.essaySort.push({
        id: matched[0],
        text: e.innerText
      });
    },
    /[0-9]+/g
  );

  loadColumn(
    dom,
    "#sidebar_postarchive ul li > a",
    (e, matched) => {
      const date = matched[1].split("/");
      data.essayArchive.push({
        id: `${date[0]}-${date[1]}`,
        text: e.innerText
      });
    },
    /archive\/([0-9]+\/[0-9]+)/
  );

  loadColumn(
    dom,
    "#sidebar_imagecategory ul li > a",
    (e, matched) => {
      data.albumn.push({
        id: matched[1],
        text: e.innerText
      });
    },
    /gallery\/([0-9]+)/
  );

  loadColumn(
    dom,
    "#sidebar_articlecategory ul li > a",
    (e, matched) => {
      data.articleSort.push({
        id: matched[0],
        text: e.innerText
      });
    },
    /[0-9]+/g
  );

  loadColumn(
    dom,
    "#sidebar_articlearchive ul li > a",
    (e, matched) => {
      const date = matched[1].split("/");
      data.articleArchive.push({
        id: `${date[0]}-${date[1]}`,
        text: e.innerText
      });
    },
    /archives\/([0-9]+\/[0-9]+)/
  );

  let count = 1;
  let bounds = false;
  let comment = { id: "", title: "", content: "", author: "" };

  const elesLi = dom.querySelectorAll("#sidebar_recentcomments ul li");

  for (let i = 0; i < elesLi.length; i++) {
    if (bounds) bounds = false;

    if (!bounds) {
      const attr = elesLi[i].getAttribute("class");
      if (attr === "recent_comment_title") {
        const eleA = elesLi[i].getElementsByTagName("a")[0];
        comment.title = eleA.innerText;
        comment.id = eleA.getAttribute("href").match(/[0-9]+/g)[0];
      } else if (attr === "recent_comment_body") {
        comment.content = elesLi[i].innerText;
      } else if (attr === "recent_comment_author") {
        comment.author = EcyUtils.Text.replace(elesLi[i].innerText, [/--/g]);
      }
    }

    if (count % 3 == 0) {
      bounds = true;
      data.latestComments.push(comment);
      comment = { id: "", title: "", content: "", author: "" };
    }
    count++;
  }

  return data;
}

/**
 * 解析侧边栏博主主人基本的昵称、粉丝数、园龄等数据
 */
export function parseAuthorData(dom: Document): CustType.IMenuItemData[] {
  const nodeList = dom.querySelectorAll("#profile_block > a");
  return Array.from(nodeList).map(ele => ({ text: ele.innerText.trim(), href: ele.getAttribute("href") }));
}

/**
 * 解析博主主人的随笔、文章、评论、阅读等数据
 */
export function parseMasterData(dom: Document): CustType.IMenuItemData[] {
  const data: CustType.IMenuItemData[] = [];
  const eles = dom.getElementsByTagName("span");

  for (let index = 0; index < eles.length; index++) {
    if (eles[index].getAttribute("id")) {
      const t = eles[index].innerText;
      const text = t.match(/^[\u4e00-\u9fa5]*/g)[0];
      let digg = t.match(/\d+/g)[0];
      if (index === 3) digg = EcyUtils.Parser.unit(digg);
      data.push({ text, digg });
    }
  }

  return data;
}

/**
 * 解析侧边栏博客排行信息。
 */
export function parseCabinetRankList(dom: string): CustType.IMenuItemData[] {
  const data: CustType.IMenuItemData[] = [];
  const eles = parseDOM(dom).querySelectorAll("li");

  for (let i = 0; i < eles.length; i++) {
    const t = eles[i].innerText.trim();
    const text = t.match(/^[\u4e00-\u9fa5]*/g)[0];
    const digg = t.match(/\d+/g)[0];
    data.push({ text, digg });
  }

  return data;
}

/**
 * 解析博客阅读排行榜
 */
export function parseTopList(dom: Document): CustType.ITopList {
  const data: CustType.ITopList = {
    topView: [],
    topComments: [],
    topDigg: []
  };

  const elesTopComms = dom.querySelectorAll("#TopFeedbackPostsBlock ul > li > a");

  for (let index = 0; index < elesTopComms.length; index++) {
    data.topComments.push({
      id: elesTopComms[index]
        .getAttribute("href")
        ?.match(/\/p\/\d+/g)[0]
        .split("/")[2],
      text: elesTopComms[index].innerText
    });
  }

  const elesTopWors = dom.querySelectorAll("#TopViewPostsBlock ul > li > a");

  for (let index = 0; index < elesTopWors.length; index++) {
    data.topView.push({
      id: elesTopWors[index]
        .getAttribute("href")
        ?.match(/\/p\/\d+/g)[0]
        .split("/")[2],
      text: elesTopWors[index].innerText
    });
  }

  data.topDigg = Array.from(dom.querySelectorAll("#TopViewPostsBlock ul > li > a")).map(ele => ({
    id: ele
      .getAttribute("href")
      ?.match(/\/p\/\d+/g)[0]
      .split("/")[2],
    text: ele.innerText
  }));

  return data;
}

export function parseMarkList(dom: Document): CustType.IMark[] {
  const data: CustType.IMark[] = [];
  const eles = dom.getElementById("MyTag1_dtTagList").getElementsByTagName("td");

  for (let i = 0; i < eles.length; i++) {
    const eleA = eles[i].getElementsByTagName("a")[0];
    data.push({ count: parseInt(eles[i].getAttribute("data-use-count")), href: eleA.getAttribute("href"), text: eleA.innerText });
  }

  return data;
}

/**
 * 解析输入密码之后返回的 DOM，查找是否有错误密码提示
 *
 * @returns 输入密码正确返回 true
 */
export function parseIsUnLock(dom: Document): boolean {
  const isError = dom.getElementsByClassName("field-validation-error")[0]?.innerText;
  if (isError && isError === "密码错误") {
    return false;
  } else if (!isError) {
    return true;
  }
}

export function parseWorksSortChild(dom: Document): CustType.IWorksSortChild[] {
  const nodeList = dom.getElementsByTagName("li");
  return Array.from(nodeList).map(ele => ({
    id: ele.getAttribute("data-category-id"),
    text: ele.getElementsByClassName("tree-categories-item-title-right")[0].innerText
  }));
}

export function parseAlbumn(dom: Document) {
  const data: CustType.AlbumnItem[] = [];
  const eles = dom.getElementsByClassName("divPhoto");

  for (let i = 0; i < eles.length; i++) {
    data.push({
      id: eles[i]
        .getElementsByTagName("a")[0]
        .getAttribute("href")
        .match(/\/gallery\/image\/\d+/g)[0]
        .split("/")[3],
      src: eles[i].getElementsByTagName("img")[0].getAttribute("src")
    });
  }

  return {
    title: dom.getElementsByClassName("thumbTitle")[0].innerText,
    desc: dom.getElementsByClassName("thumbDescription")[0].innerText,
    data
  };
}

export function parseAlbumnItem(dom: Document) {
  return dom.getElementById("ViewPicture1_GalleryImage").getAttribute("src");
}

export function parseCalendar(dom: Document): string[] {
  const dates: string[] = [];
  dom.querySelectorAll("a[href^='https']").forEach(ele => {
    const date = ele.getAttribute("href").match(/\d+\/\d+\/\d+/g)[0];
    dates.push(date);
  });
  return dates;
}
