/**
 * HTML 解析器
 *
 * @author Himmeltala
 * @date 2023 年 1 月 15 日
 */

function parseColHTML(
  dom: Document,
  selector: string,
  success: (e: Element, matched?: any) => void,
  regexp?: RegExp
) {
  dom.querySelectorAll(selector).forEach(ele => {
    if (regexp) {
      const matched = ele.getAttribute("href")?.match(regexp);
      if (matched) success(ele, matched);
    } else success(ele);
  });
}

/**
 * 解析侧边栏
 */
export function toColumnData(dom: Document): ColumnDataModel {
  const data: ColumnDataModel = {
    essaySort: [],
    essayArchive: [],
    articleArchive: [],
    articleSort: [],
    latestEssayList: [],
    latestComments: [],
    rankings: [],
    markList: [],
    albumn: []
  };

  parseColHTML(
    dom,
    "#sidebar_recentposts ul li > a",
    (element, matched) => {
      data.latestEssayList.push({
        id: matched[0],
        text: element.innerText
      });
    },
    /[0-9]+/g
  );

  parseColHTML(
    dom,
    "#sidebar_toptags ul li > a",
    (element, matched) => {
      data.markList.push({
        id: matched[1],
        text: element.innerText
      });
    },
    /tag\/(.[^\/]+)/
  );

  parseColHTML(dom, "#sidebar_scorerank ul li", e => {
    data.rankings.push({
      text: e.innerText
    });
  });

  parseColHTML(
    dom,
    "#sidebar_postcategory ul li > a",
    (element, matched) => {
      const innerText = element.innerText;

      data.essaySort.push({
        id: matched[0],
        text: innerText.split("(")[0],
        count: innerText.match(/[0-9]+/g)[0]
      });
    },
    /[0-9]+/g
  );

  parseColHTML(
    dom,
    "#sidebar_postarchive ul li > a",
    (element, matched) => {
      const innerText = element.innerText;
      const date = matched[1].split("/");

      data.essayArchive.push({
        id: `${date[0]}-${date[1]}`,
        text: innerText.split("(")[0],
        count: innerText.match(/\([0-9]+\)/g)[0].match(/[0-9]/g)[0]
      });
    },
    /archive\/([0-9]+\/[0-9]+)/
  );

  parseColHTML(
    dom,
    "#sidebar_imagecategory ul li > a",
    (element, matched) => {
      data.albumn.push({
        id: matched[1],
        text: element.innerText
      });
    },
    /gallery\/([0-9]+)/
  );

  parseColHTML(
    dom,
    "#sidebar_articlecategory ul li > a",
    (element, matched) => {
      const innerText = element.innerText;

      data.articleSort.push({
        id: matched[0],
        text: innerText.split("(")[0],
        count: innerText.match(/[0-9]+/g)[0]
      });
    },
    /[0-9]+/g
  );

  parseColHTML(
    dom,
    "#sidebar_articlearchive ul li > a",
    (element, matched) => {
      const date = matched[1].split("/");

      data.articleArchive.push({
        id: `${date[0]}-${date[1]}`,
        text: element.innerText
      });
    },
    /archive\/([0-9]+\/[0-9]+)/
  );

  const elesLi = dom.querySelectorAll("#sidebar_recentcomments ul li");

  for (let i = 0; i < elesLi.length; i += 3) {
    const comment = { id: "", title: "", content: "", author: "" };
    const titleEle = elesLi[i].querySelector(".recent_comment_title a");
    const bodyEle = elesLi[i + 1];
    const authorEle = elesLi[i + 2];

    if (titleEle) {
      comment.title = titleEle.innerText;
      comment.id = titleEle.getAttribute("href").match(/[0-9]+/g)[0];
    }

    if (bodyEle) {
      comment.content = bodyEle.innerText;
    }

    if (authorEle) {
      comment.author = Utils.Textual.replace(authorEle.innerText, [/--/g]);
    }

    data.latestComments.push(comment);
  }

  return data;
}

/**
 * 解析昵称、粉丝数、园龄
 */
export function toAuthorData(dom: Document): StatisticsModel[] {
  const nodeList = dom.querySelectorAll("#profile_block > a");
  return Array.from(nodeList).map(ele => ({
    text: ele.innerText.trim(),
    href: ele.getAttribute("href")
  }));
}

/**
 * 解析随笔、文章、评论、阅读
 */
export function toStatistics(dom: Document): StatisticsModel[] {
  const data: StatisticsModel[] = [];
  const eles = dom.getElementsByTagName("span");

  for (let index = 0; index < eles.length; index++) {
    if (eles[index].getAttribute("id")) {
      const t = eles[index].innerText;
      const text = t.match(/^[\u4e00-\u9fa5]*/g)[0];
      let digg = t.match(/\d+/g)[0];
      if (index === 3) digg = Utils.Formatter.unit(digg);
      data.push({ text, digg });
    }
  }

  return data;
}

/**
 * 解析博客阅读排行榜
 */
export function toTopList(dom: Document): TopListModel {
  const data: TopListModel = {
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

export function toMarkList(dom: Document): LabelModel[] {
  const data: LabelModel[] = [];
  const eles = dom.getElementById("MyTag1_dtTagList").getElementsByTagName("td");

  for (let i = 0; i < eles.length; i++) {
    const eleA = eles[i].getElementsByTagName("a")[0];
    data.push({
      count: parseInt(eles[i].getAttribute("data-use-count")),
      href: eleA.getAttribute("href"),
      text: eleA.innerText
    });
  }

  return data;
}

export function toPhotoDetail(dom: Document) {
  return dom.getElementById("ViewPicture1_GalleryImage").getAttribute("src");
}

export function toPhotos(dom: Document): PhotosModel {
  const data: PhotoDetailModel[] = [];
  const eles = dom.getElementsByClassName("divPhoto");

  for (let i = 0; i < eles.length; i++) {
    data.push({
      id: eles[i]
        .getElementsByTagName("a")[0]
        .getAttribute("href")
        .match(/\/gallery\/image\/\d+/g)[0]
        .split("/")[3],
      href: eles[i].getElementsByTagName("img")[0].getAttribute("src")
    });
  }

  return {
    title: dom.getElementsByClassName("thumbTitle")[0].innerText,
    desc: dom.getElementsByClassName("thumbDescription")[0].innerText,
    data
  };
}

export function toCalendar(dom: Document): string[] {
  const dates: string[] = [];
  dom.querySelectorAll("a[href^='https']").forEach(ele => {
    const date = ele.getAttribute("href").match(/\d+\/\d+\/\d+/g)[0];
    dates.push(date);
  });
  return dates;
}
