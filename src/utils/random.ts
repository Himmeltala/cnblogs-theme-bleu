/**
 * 操作随机数
 *
 * @author Himmeltala
 * @date 2023 年 1 月 15 日
 */

function select(min: number, max: number) {
  let sum = max - min + 1;
  return Math.floor(Math.random() * sum + min);
}

/**
 * 获取不重复的数组的索引数组
 *
 * @param src 源数组
 * @param max 最大数值
 * @returns 一个不重复的 src 的索引
 */
export function get(src: string[], max: number) {
  let a = [];

  if (src.length < max) {
    for (let i = 0; i < max; i++) {
      let d = Math.floor(Math.random() * src.length);
      a[i] = d;
    }
  } else if (src.length >= max) {
    for (let i = 0; i < src.length; i++) {
      a[i] = select(0, src.length - 1);
      for (let z = 0; z < i; z++) {
        if (a[i] == a[z]) {
          i--;
          break;
        }
      }
    }
  }

  return a;
}
