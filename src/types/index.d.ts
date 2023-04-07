/**
 * 博客园类型
 */
declare namespace BlogType {
  type VoteType = "Bury" | "Digg";

  /**
   * 博客园评论和随笔的基础字段，一般是调用接口之后返回过来的字段
   */
  interface IBlog {
    // 随笔 ID
    postId?: string;
    // 投票类型，反对或赞成
    voteType?: VoteType;
    isAbandoned?: boolean;
  }

  /**
   * 博客园评论实体，区别于上面定义的评论实体，这个实体是根据博客园的数据库字段而来
   */
  interface IComment extends IBlog {
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
  interface IEssay extends IBlog {}

  /**
   * 随笔投票，博客园接口需要的正确字段
   */
  interface IEssayViewPoint {
    // 反对数量
    buryCount: number;
    // 点赞数量
    diggCount: number;
    feedbackCount: number;
    // 随笔 ID
    postId: string;
    // 阅读数量
    viewCount: number;
  }

  /**
   * 有些接口返回的数据类型是博客园的字段，需要该类型进行约束
   */
  interface AjaxType {
    id?: number;
    isSuccess?: boolean;
    message?: string;
    data?: any;
  }
}

/**
 * Ecy 类型
 */
declare namespace CustType {
  /**
   * 随笔/文章
   */
  interface IWriting {
    // 随笔 ID
    id?: string;
    // 随笔标题
    text?: string;
    // 随笔内容
    content?: string;
    // 随笔摘要
    desc?: string;
    // 随笔发表日期
    date?: string;
    // 随笔阅读数量
    view?: string;
    // 随笔评论数量
    comm?: string;
    // 随笔点赞数量
    digg?: string;
    // 随笔封面
    surface?: string;
    // 文章是否被密码锁定
    isLocked?: boolean;
    // 是否仅限于自己可见
    isOnlyMe?: boolean;
    // 是否置顶
    isTop?: boolean;
  }

  /**
   * 评论
   */
  interface IComment {
    // 是否正在编辑
    isEditing?: boolean;
    // 是否正在回复
    isAnsling?: boolean;
    // 评论 ID
    commentId?: string;
    // 个人主页地址
    space?: string;
    // 楼层
    layer?: string;
    // 发表日期
    date?: string;
    // 发表人
    author?: string;
    // 点赞数量
    digg?: string;
    // 反对数量
    bury?: string;
    // 头像地址
    avatar?: string;
    // 随笔 ID
    postId?: string;
    // 评论内容
    content?: string;
    // 回复评论 ID
    parentCommentId?: number;
    // 当前评论所在评论列表的页数
    pageIndex?: number;
  }

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
  interface IWritingList {
    // 页数
    page?: number;
    // 提示
    hint?: string;
    // 数据
    data?: IWriting[];
  }

  /**
   * 随笔列表，用于分类或标签区分的随笔列表
   */
  interface IWritingList2 extends IWritingList {
    // 分类描述
    desc?: string;
    // 子分类描述
    desc2?: string;
  }

  /**
   * 随笔的分类和标签数组
   */
  interface IWritingProps {
    tags: { text: string }[];
    sorts: { href: string; text: string }[];
  }

  /**
   * 分类子分类
   */
  interface IWritingSortChild {
    id: string;
    text: string;
  }

  /**
   * 侧边栏标签和分类数组
   */
  interface ICabinetColumn {
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
  interface ICabinetItemData {
    // id
    id?: string;
    // 文本描述
    text?: string;
    // 数量
    digg?: string;
    // 链接
    href?: string;
  }

  /**
   * 侧边栏阅读排行榜
   */
  interface ICabinetTopList {
    topView: ICabinetItemData[];
    topComments: ICabinetItemData[];
    topDigg: ICabinetItemData[];
  }

  /**
   * 上一篇或下一篇随笔
   */
  interface IPrevNext {
    prev: ICabinetItemData;
    next: ICabinetItemData;
  }

  interface AlbumnItem {
    id: string;
    src: string;
  }

  /**
   * 博客配置项
   */
  interface IEcy {
    // github
    github?: string;
    // 网站 icon
    icon?: string;
    // 侧边栏配置项
    cabinet?: { avatar?: string; signature?: string };
    // 目录配置项
    catalog?: { level?: boolean };
    // 铭牌
    nameplate?: {
      tags?: string[];
      connection?: { name: string; text: string; svg?: string; img?: string }[];
      warehouse?: { url: string; text: string }[];
      experience?: { text: string; date: string }[];
      intro?: string;
      gossip?: string;
      photo?: { disabled: boolean; src?: string[] };
    };
    // 技能栈配置项
    graph?: {
      strokeColor?: string;
      alpha?: number;
      sides?: number;
      layer?: number;
      lineWidth?: number;
      textSize?: number;
      lineColor?: string;
      textColor?: string;
      data?: { title: string; star: number }[];
    };
    // 我的链接配置项
    links?: { href: string; text: string }[];
    // 推荐书籍配置项
    books?: { href?: string; text: string; img: string; author: string; rate: number }[];
  }

  type ToggleType = Record<string, { open: boolean; show: boolean }>;
  interface IBox {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  }

  /**
   * Ecy 主题设置数据类型
   */
  interface ISetting {
    // 主题
    theme?: { color?: string; mode?: string };
    // 字体
    font?: {
      size?: { level1?: number; level2?: number; level3?: number; level4?: number; level5?: number; level6?: number };
      dark?: { color?: { level1?: string; level2?: string; level3?: string } };
      light?: { color?: { level1?: string; level2?: string; level3?: string } };
    };
    // 卡片
    card?: { padding?: IBox; margin?: IBox; radius?: number; color?: string; open?: boolean };
    // 背景
    background?: { src?: string; open?: boolean; filter?: number };
    // pages
    pages?: {
      home?: { padding?: IBox; margin?: IBox };
      writing?: { padding?: IBox; margin?: IBox; code?: { light?: { color?: string }; dark?: { color?: string } } };
      gallery?: { padding?: IBox; margin?: IBox };
      sort?: { padding?: IBox; margin?: IBox };
      markList?: { padding?: IBox; margin?: IBox };
      markSort?: { padding?: IBox; margin?: IBox };
    };
    listing?: { padding?: IBox; margin?: IBox };
    article?: { padding?: IBox; margin?: IBox };
    // 工具箱
    toolkits?: { pin?: boolean };
    openPager?: boolean;
    githubPostion?: "left" | "right";
    // 中间内容
    content?: { width?: number; padding?: IBox; margin?: IBox };
    // 陈列柜
    cabinet?: {
      position?: { left?: number; right?: number; break?: boolean };
      left?: { pin?: boolean; padding?: IBox; margin?: IBox };
      right?: { pin?: boolean; padding?: IBox; margin?: IBox };
      toggles?: ToggleType;
      width?: number;
      break?: boolean;
    };
    other?: {
      github?: {
        position?: "left" | "right";
      };
      pagation: {
        pin?: boolean;
      };
    };
  }
}

/**
 * Ecy 工具
 */
declare namespace EcyUtils {
  function getSetting(): RemovableRef<CustType.ISetting>;
  function endLoading(): void;
  function startLoading(): void;
  function openImageUploadWindow(el: string, onUploaded: (img: string) => void): void;
  function getSettingTemp(): CustType.ISetting;
  function reloadObjProps(source: CustType.ISetting, template: CustType.ISetting): CustType.ISetting;

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

  /**
   * 定义 Ecy
   *
   * @param dev 开发模式
   * @param pro 生产模式
   */
  function useLite(dev: Function, pro: Function);
}

declare const isLogined: boolean;
declare const isBlogOwner: boolean;
declare const currentBlogId: number;
/**
 * 博客域名
 */
declare const currentBlogApp: string;
