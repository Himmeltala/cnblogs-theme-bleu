/**
 * 随笔/文章
 */
type PostModel = Partial<{
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
type CommentModel = Partial<{
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
  digg: number;
  bury: number;
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
interface LabelModel {
  count: number;
  href: string;
  text: string;
}

/**
 * 随笔列表
 */
type PostsModel = Partial<{
  page: number;
  hint: string;
  data: PostModel[];
}>;

/**
 * 随笔档案、文章档案、随笔分类、档案分类四种列表，扩展 PostsModel 接口，
 * 比 PostsModel 多了三个属性值。
 */
interface Posts2Model extends PostsModel {
  /**
   * 父分类描述
   */
  desc?: string;
  /**
   * 子分类描述
   */
  desc2?: string;
  isArticle?: boolean;
}

/**
 * 随笔详细页的分类和标签
 */
interface PostPropsModel {
  tags: { text: string }[];
  sorts: { id: string; text: string }[];
}

/**
 * 二级分类
 */
interface SubPostModel {
  id: string;
  text: string;
}

/**
 * 侧边栏数据。包括：随笔分类、随笔档案、文章分类、文章档案、最新评论。
 */
declare type ColumnDataModel = Partial<{
  essaySort: { id: string; text: string; count: string }[];
  essayArchive: { id: string; text: string; count: string }[];
  articleSort: { id: string; text: string; count: string }[];
  articleArchive: { id: string; text: string }[];
  latestEssayList: { id: string; text: string }[];
  latestComments: { id: string; title: string; content: string; author: string }[];
  rankings: { text: string }[];
  markList: { id: string; text: string }[];
  albumn: { id: string; text: string }[];
}>;

/**
 * 随笔、文章、评论、阅读数据、粉丝、昵称、关注、园龄。
 * 或随笔上一篇或下一篇随笔数据类型。
 */
declare type StatisticsModel = Partial<{
  id: string;
  text: string;
  digg: string;
  href: string;
}>;

/**
 * 阅读排行榜
 */
interface TopListModel {
  topView: StatisticsModel[];
  topComments: StatisticsModel[];
  topDigg: StatisticsModel[];
}

/**
 * 上一篇或下一篇随笔
 */
interface PostPrevNextModel {
  prev: { href: string; text: string };
  next: { href: string; text: string };
}

interface PhotoDetailModel {
  id: string;
  href: string;
}

interface PhotosModel {
  title: string;
  desc: string;
  data: StatisticsModel[];
}

/**
 * 作品状态，是否关注过博主，是否点过赞
 */
interface PostInfoModel {
  props: PostPropsModel;
  prevNext: PostPrevNextModel;
  headlines: string;
  aggTopPosts: string;
  historyToday: string;
  postStats: {
    buryCount: number;
    diggCount: number;
    feedbackCount: number;
    viewCount: number;
    isFollowed: boolean;
    isDigg: boolean;
  };
}

/**
 * 博客配置项
 */
interface ConfigModel {
  icon: string;
  avatar: string;
  signature: string;
  status: string;
  images: {
    background: {
      src: string;
      size: string;
      repeat: string;
      opacity: number;
      position: string;
    };
    home: {
      opacity: number;
      interval: number;
      carousel: string[];
      disabled: boolean;
    };
    stochastic: string[];
  };
  header: {
    paths: { name?: string; value: string; icon?: string; src?: string }[];
  };
  welcome: any;
  fancybox: any;
  diagram: {
    technics: any;
  };
  theme?: {
    codeFamily: string;
    mainFamily: string;
    codeLineHeight: number;
    mainLineHeight: number;
  };
}

/**
 * 本地设置
 */
declare type LocalOptionModel = Partial<{
  theme: { mode: "dark" | "light" };
}>;

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

/**
 * 目录
 */
declare interface TopicType {
  id?: string;
  title: string;
  class?: string;
  content?: string;
  children?: TopicType[];
}
