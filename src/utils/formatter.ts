/**
 * 格式化
 *
 * @author Himmeltala
 * @date 2023 年 1 月 15 日
 */

function fixed(trimed: string, suffix?: string, uint?: number, fix?: number) {
  const num = Number(trimed);
  if (num >= 10000) {
    const res = (num / (uint || 10000)).toFixed(fix || 2);
    return `${res}${suffix || ""}`;
  } else {
    return num.toString();
  }
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
