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
  wordCount: number;
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
  articleSort: { id: string; text: string; count: string }[];
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
interface BleuConfig {
  icon?: string;
  avatar?: string;
  signature: string;
  images: {
    /**
     * 背景的相关配置
     */
    background: {
      src: string;
      size: string;
      repeat: string;
      opacity: number;
      position: string;
    };
    /**
     * 随笔、文章的相关配置
     */
    arbeiten: string[];
    /**
     * 首页的相关配置
     */
    home: {
      /**
       * 轮播图透明度
       */
      opacity: number;
      /**
       * 轮播图播放间隔
       */
      interval: number;
      carousel: string[];
      disabled: boolean;
    };
  };
  /**
   * markdown 样式配置
   */
  markdown?: {
    arbeiten: any;
    comment: any;
  };
  /**
   * 放大器配置
   */
  amplifier?: {
    arbeiten: any;
    comment: any;
  };
  /**
   * 图表
   */
  chart: {
    /**
     * 技能表
     */
    tech: any;
    /**
     * 我的标签
     */
    mark?: {
      count?: number;
    };
    category?: {
      count?: number;
    };
  };
  /**
   * 字体
   */
  font?: {
    main?: { name?: string };
    code?: { name?: string; size?: string };
    art?: { name?: string; size?: string };
  };
}

/**
 * Bleu 本地设置
 */
interface BleuOptions {
  theme: { mode: "dark" | "light" };
  toolkits: { pin: boolean };
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

/**
 * blogUserGuid
 */
declare const visitorUserId: string;
