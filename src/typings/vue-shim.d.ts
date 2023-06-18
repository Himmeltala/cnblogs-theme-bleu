export {};

declare module "vue" {
  interface ComponentCustomProperties {
    /**
     * 是否登录，来自于博客园 script 全局变量
     */
    isLogined: boolean;
    /**
     * 是否是博主，来自于博客园 script 全局变量
     */
    isBlogOwner: boolean;
  }
}
