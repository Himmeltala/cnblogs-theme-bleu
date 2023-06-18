/**
 * 导航
 *
 * @author Himmelbleu
 * @date 2023 年 1 月 15 日
 */
export namespace Navigation {
  /**
   * @param path 外部网址
   */
  export function go(path: string) {
    window.open(path);
  }
}
