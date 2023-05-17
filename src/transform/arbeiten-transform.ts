export namespace ArbeitenTransform {
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
   * 获取首页随笔列表：日期下的随笔和文章。列表项包含描述、评论、点赞的随笔列表。
   */
  export function toWorksList(dom: Document): BleuArbeitenList {
    const id = dom.getElementsByClassName("postTitle2");
    const head = dom.getElementsByClassName("postTitle");
    const desc = dom.getElementsByClassName("c_b_p_desc");
    const notes = dom.getElementsByClassName("postDesc");
    const hint = dom.getElementsByClassName("dayTitle");
    const data: BleuArbeiten[] = [];

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
        text: Textual.replace(head[index].innerText.trim(), [/\[置顶\]/g]),
        desc: Textual.replace(desc[index].innerText, [/阅读全文/g]),
        date: notes[index].innerText.match(
          /[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d/g
        )[0],
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
  export function toWorks(id: string, dom: Document): BleuArbeiten {
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
   * 解析随笔详细页面中的属性：标签、分类
   */
  export function toWorksProps(dom: Document): BleuArbeitenProps {
    const data = <BleuArbeitenProps>{ tags: [], sorts: [] };

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
  export function toWorksPrevNext(dom: Document): BleuArbeitenPrevNext {
    const data: BleuArbeitenPrevNext = { prev: {}, next: {} };
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
   * 获取随笔档案、文章档案、随笔分类、档案分类四种列表。列表项包含描述、评论、点赞的随笔列表。
   */
  export function toWorksFull(dom: Document): BleuArbeitenList2 {
    const data: BleuArbeiten[] = [];

    const dateReg =
      /[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d/g;
    const viewReg = /阅读\([0-9]+\)/g;
    const commReg = /评论\([0-9]+\)/g;
    const diggReg = /推荐\([0-9]+\)/g;

    const eleList = dom.getElementsByClassName("entrylistItem");
    const eleListTitle = dom.getElementsByClassName("entrylistTitle")[0];
    const isArticle = !/随笔分类/g.test(eleListTitle.innerText);

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
      data,
      isArticle
    };
  }

  /**
   * 获取随笔和文章列表，列表通过标签查询。
   */
  export function toWorksSlice(dom: Document): BleuArbeitenList2 {
    const head = dom.querySelectorAll(".PostList > .postTitl2 > a");
    const desc = dom.querySelectorAll(".PostList > .postDesc2");
    const hint = dom.getElementsByClassName("PostListTitle")[0].innerText.trim();
    const data: BleuArbeiten[] = [];

    head.forEach((ele, index) => {
      data.push({
        id: ele.getAttribute("href").match(/[0-9]+/g)[0],
        text: ele.innerText.trim(),
        date: desc[index].innerText.match(
          /[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d/g
        )[0],
        view: desc[index].getElementsByClassName("post-view-count")[0].innerText.split(":")[1],
        comm: desc[index].getElementsByClassName("post-comment-count")[0].innerText.split(":")[1],
        digg: desc[index].getElementsByClassName("post-digg-count")[0].innerText.split(":")[1]
      });
    });

    return { data, hint, page: getPage(dom.getElementsByClassName("Pager")[0]) };
  }

  /**
   * 解析输入密码之后返回的 DOM，查找是否有错误密码提示
   *
   * @returns 输入密码正确返回 true
   */
  export function toIsUnLock(dom: Document): boolean {
    const isError = dom.getElementsByClassName("field-validation-error")[0]?.innerText;
    if (isError && isError === "密码错误") {
      return false;
    } else if (!isError) {
      return true;
    }
  }

  export function toWorksByL2(dom: Document): BleuArbeitenL2[] {
    const nodeList = dom.getElementsByTagName("li");
    return Array.from(nodeList).map(ele => ({
      id: ele.getAttribute("data-category-id"),
      text: ele.getElementsByClassName("tree-categories-item-title-right")[0].innerText
    }));
  }
}
