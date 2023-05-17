/**
 * 随笔/文章
 */
type BleuArbeiten = Partial<{
  id: string;
  // 随笔标题
  text: string;
  content: string;
  desc: string;
  date: string;
  view: string;
  comm: string;
  digg: string;
  surface: string;
  // 文章是否被密码锁定
  isLocked: boolean;
  // 是否仅限于自己可见
  isOnlyMe: boolean;
  // 是否置顶
  isTop: boolean;
}>;

/**
 * 评论
 */
type BleuComment = Partial<{
  // 是否正在编辑
  isEditing: boolean;
  // 是否正在回复
  isAnsling: boolean;
  // 评论 ID
  commentId: string;
  // 个人主页地址
  space: string;
  // 楼层
  layer: string;
  date: string;
  author: string;
  digg: string;
  bury: string;
  avatar: string;
  postId: string;
  content: string;
  // 回复评论 ID
  parentCommentId: number;
  // 当前评论所在评论列表的页数
  pageIndex: number;
}>;

/**
 * 标签
 */
interface BleuMark {
  count: number;
  href: string;
  text: string;
}

/**
 * 随笔列表
 */
type BleuArbeitenList = Partial<{
  page: number;
  hint: string;
  data: BleuArbeiten[];
}>;

/**
 * 随笔列表，用于分类或标签区分的随笔列表
 */
interface BleuArbeitenList2 extends BleuArbeitenList {
  desc?: string;
  // 子分类描述
  desc2?: string;
  isArticle?: boolean;
}

/**
 * 随笔的分类和标签数组
 */
interface BleuArbeitenProps {
  tags: { text: string }[];
  sorts: { href: string; text: string }[];
}

/**
 * 二级分类
 */
interface BleuArbeitenL2 {
  id: string;
  text: string;
}

/**
 * 侧边栏标签和分类数组
 */
interface BleuMenuColumn {
  essaySort: { id: string; text: string; count: string }[];
  essayArchive: { id: string; text: string; count: string }[];
  articleSort: { id: string; text: string }[];
  articleArchive: { id: string; text: string }[];
  latestEssayList: { id: string; text: string }[];
  latestComments: { id: string; title: string; content: string; author: string }[];
  rankings: { text: string }[];
  tagList: { id: string; text: string }[];
  albumn: { id: string; text: string }[];
}

/**
 * 第一种：
 * 随笔数量、文章数量、评论数量、阅读数量
 *
 * 第二种：
 * 粉丝、昵称、关注、园龄
 *
 * 第三种：
 * 随笔上一篇或下一篇随笔数据类型
 */
type BleuMenuItemData = Partial<{
  id: string;
  // 文本描述
  text: string;
  digg: string;
  href: string;
}>;

/**
 * 侧边栏阅读排行榜
 */
interface BleuTopList {
  topView: BleuMenuItemData[];
  topComments: BleuMenuItemData[];
  topDigg: BleuMenuItemData[];
}

/**
 * 上一篇或下一篇随笔
 */
interface BleuArbeitenPrevNext {
  prev: IMenuItemData;
  next: IMenuItemData;
}

interface BleuAlbumnItem {
  id: string;
  src: string;
}

/**
 * 博客配置项
 */
type BleuConfig = Partial<{
  icon: string;
  avatar: string;
  signature: string;
  images: {
    bg: {
      src: string;
      opacity: number;
    };
    arbeiten?: string[];
    home: {
      opacity: number;
      interval: number;
      carousel: string[];
      divider: string;
    };
  };
  chart: any;
  font: {
    main: string;
    code: string;
  };
}>;

/**
 * Bleu 本地设置
 */
type BleuLocalSetting = Partial<{
  theme: { mode: "dark" | "light" };
  toolkits: { pin: boolean };
}>;

/**
 * Bleu 配置选项
 */
declare namespace BleuVars {
  let config: BleuConfig;

  function getBlogApp(): string;
  function getBlogId(): number;
  function getBaseURL(): string;
  function isPcDevice(): boolean;

  function getUserGuid(): string;
  /**
   * 是否已经订阅
   */
  function isFollow(): boolean;
}

/**
 * 是否已登录
 */
declare const isLogined: boolean;

/**
 * 是否为博主
 */
declare const isBlogOwner: boolean;

/**
 * 博客 ID
 */
declare const currentBlogId: number;

/**
 * 博客域名
 */
declare const currentBlogApp: string;

declare namespace Broswer {
  function setTitle(title?: string): void;
  function scrollIntoView(selector: string): void;
  function endLoading(): void;
  function startLoading(): void;
}

declare namespace Formatter {
  function unit(num: string): string;
}

declare namespace Native {
  function openImageUploadWindow(el: string, onUploaded: (img: string) => void): void;
}

declare namespace Navigation {
  function go(params: { path: string; router?: Router }): void;
}

declare namespace PrettifyLog {
  function primary(title: string, msg: string): void;
  function warning(title: string, msg: string): void;
}

declare namespace LocalStorage {
  function getSetting(): RemovableRef<BleuLocalSetting>;
  function getSettingTemp(): BleuLocalSetting;
  function reloadObjProps(source: any, template: any): any;
}

declare namespace Random {
  function get(src: string[], max: number): number[];
}

declare namespace Textual {
  function split(str: string, regex: RegExp, keys: number[], values: string[]): string;
  function replace(source: string, regExps: RegExp[], replacement?: string[]): string;
}
