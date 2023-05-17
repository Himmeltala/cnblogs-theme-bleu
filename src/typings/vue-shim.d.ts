export {};

declare module "vue" {
  interface ComponentCustomProperties {
    isLogined: boolean;
    isBlogOwner: boolean;
  }
}
