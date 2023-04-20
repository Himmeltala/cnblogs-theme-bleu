/**
 * 博客园类型
 */
declare namespace BlogType {
  type VoteType = "Bury" | "Digg";

  /**
   * 博客园评论和随笔的基础字段，一般是调用接口之后返回过来的字段
   */
  interface IBasic {
    postId?: string;
    voteType?: VoteType;
    isAbandoned?: boolean;
  }

  /**
   * 博客园评论实体，区别于上面定义的评论实体，这个实体是根据博客园的数据库字段而来
   */
  interface IComment extends IBasic {
    // 评论 ID
    commentId?: string;
    // 评论内容
    body?: string;
    // 回复的评论 ID
    parentId?: string;
    // 当前页面的 index
    pageIndex?: string;
    // 回复评论的 ID
    parentCommentId?: string;
  }

  /**
   * 获取随笔，返回的博客园接口的字段
   */
  interface IWorks extends IBasic {}

  /**
   * 随笔投票，博客园接口需要的正确字段
   */
  interface IWorksViewPoint {
    buryCount: number;
    diggCount: number;
    feedbackCount: number;
    postId: string;
    viewCount: number;
  }

  /**
   * 有些接口返回的数据类型是博客园的字段，需要该类型进行约束
   */
  type AjaxType = Partial<{
    id: number;
    isSuccess: boolean;
    message: string;
    data: any;
  }>;
}

/**
 * Ecy 类型
 */
declare namespace CustType {
  /**
   * 随笔/文章
   */
  type IWorks = Partial<{
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
  type IComment = Partial<{
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
  interface IMark {
    count: number;
    href: string;
    text: string;
  }

  /**
   * 随笔列表
   */
  type IWorksList = Partial<{
    page: number;
    hint: string;
    data: IWorks[];
  }>;

  /**
   * 随笔列表，用于分类或标签区分的随笔列表
   */
  interface IWorksList2 extends IWorksList {
    desc?: string;
    // 子分类描述
    desc2?: string;
  }

  /**
   * 随笔的分类和标签数组
   */
  interface IWorksProps {
    tags: { text: string }[];
    sorts: { href: string; text: string }[];
  }

  /**
   * 分类子分类
   */
  interface IWorksSortChild {
    id: string;
    text: string;
  }

  /**
   * 侧边栏标签和分类数组
   */
  interface IMenuColumn {
    essaySort: { id: string; text: string }[];
    essayArchive: { id: string; text: string }[];
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
  type IMenuItemData = Partial<{
    id: string;
    // 文本描述
    text: string;
    digg: string;
    href: string;
  }>;

  /**
   * 侧边栏阅读排行榜
   */
  interface ITopList {
    topView: IMenuItemData[];
    topComments: IMenuItemData[];
    topDigg: IMenuItemData[];
  }

  /**
   * 上一篇或下一篇随笔
   */
  interface IPrevNext {
    prev: IMenuItemData;
    next: IMenuItemData;
  }

  interface AlbumnItem {
    id: string;
    src: string;
  }

  /**
   * 博客配置项
   */
  type IEcy = Partial<{
    icon: string;
    avatar: string;
    cabinet: Partial<{
      links: { href: string; text: string }[];
      books: { href?: string; text: string; img: string; author: string; rate: number }[];
    }>;
    nameplate: {
      signature: string;
      tags: string[];
      connection: { name: string; text: string; svg?: string; img?: string }[];
      warehouse: { url: string; text: string }[];
      experience: { text: string; date: string }[];
      intro: string;
      gossip: string;
      photo: { disabled: boolean; src?: string[] };
    };
    covers: {
      matte: { index: number; works: number };
      filter: { index: string; works: string };
      index: string[];
      works: string[];
    };
    graph: {
      alpha: number;
      sides: number;
      layer: number;
      lineWidth: number;
      textSize: number;
      data: { title: string; star: number }[];
    };
    font: {
      family: string;
    };
  }>;

  /**
   * Ecy 主题设置数据类型
   */
  type ILocalSetting = Partial<{
    theme: { mode: "dark" | "light" };
    toolkits: { pin: boolean };
    cabinet: {
      toggles: Record<string, { open: boolean; show: boolean }>;
    };
  }>;
}

/**
 * Ecy 工具
 */
declare namespace EcyUtils {
  function getLocalSetting(): RemovableRef<CustType.ILocalSetting>;
  function getLocalSettingTemp(): CustType.ILocalSetting;
  function endLoading(): void;
  function startLoading(): void;
  function openImageUploadWindow(el: string, onUploaded: (img: string) => void): void;
  function reloadObjProps(source: CustType.ILocalSetting, template: CustType.ILocalSetting): CustType.ILocalSetting;
  function setTitle(title?: string);

  namespace Random {
    function get(src: string[], max?: number): number[];
  }

  namespace Log {
    function primary(title: string, msg: string): void;
    function warning(title: string, msg: string): void;
  }

  namespace Parser {
    function unit(num: string): string;
  }

  namespace Text {
    function replace(source: string, regExps: RegExp[], replacement?: string[]): string;
  }

  namespace Router {
    function go(params: { path: string; router?: Router }): void;
  }
}

/**
 * Ecy 配置
 */
declare namespace EcyConfig {
  /**
   * 博客配置项
   */
  let __ECY_CONFIG__: CustType.IEcy;
  let blogId: number;
  /**
   * axios API URL 前缀
   */
  let baseAPI: string;
  /**
   * 博客域名
   */
  let blogApp: string;
  let isLogin: boolean;
  let isOwner: boolean;
  let userGuid: string;
  let isFollow: boolean;
  let pcDevice: boolean;

  function useLite(dev: Function, pro: Function);
}

declare const isLogined: boolean;
declare const isBlogOwner: boolean;
declare const currentBlogId: number;
declare const currentBlogApp: string;
