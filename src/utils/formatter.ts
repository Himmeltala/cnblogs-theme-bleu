/**
 * 格式化
 *
 * @author Himmelbleu
 * @date 2023 年 1 月 15 日
 */
export namespace Formatter {
  function fixed(trimed: string, suffix?: string, uint?: number, fix?: number) {
    const result = (Number(trimed) / uint || 1000).toFixed(fix || 2);
    return `${result}${suffix || ""}`;
  }

  /**
   * 把一串数字转换为“xx万”的形式
   *
   * @param num 被格式化的数字
   */
  export function unit(num: string): string {
    const trimed = num.trim();
    if (trimed.length < 5) {
      return fixed(trimed);
    } else if (trimed.length >= 5 && trimed.length <= 7) {
      return fixed(trimed, "万", 10000);
    }
  }
}
