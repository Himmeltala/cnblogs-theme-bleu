/**
 * 操作文本
 *
 * @author Himmeltala
 * @date 2023 年 1 月 15 日
 */

/**
 * 多次替换得到最终的字符。
 *
 * 如输入 置顶abc你好edf，regexs 为 ['置顶', '你好']，replacement 不输入就是替换空。
 *
 * 最终结果是：abcedf
 */
export function replace(str: string, regexs: RegExp[], replacement?: string[]) {
  let substitute = "";
  for (let i = 0; i < regexs.length; i++) {
    if (!replacement) substitute = "";
    else {
      if (!replacement[i]) substitute = "";
      else substitute = replacement[i];
    }
    str = str.replace(regexs[i], substitute);
  }
  return str;
}

/**
 * 多次切割得到最终的字符。
 *
 * 如输入 http://localhost:5173/Himmeltala/p/17926340.html/#/，regex 为 /\/p\/\d+.html/g，得到的结果是 ['', 'p', '17926340.html']。
 *
 * 首先第一次获取数组中 17926340.html，再对其进行切割得到 17926340。那么，indexs 和 splits 应该传递的参数如下：
 * [2, 0], ["/", "."]
 *
 * 最终结果是：17926340
 */
export function split(str: string, regex: RegExp, indexs: number[], splits: string[]) {
  let matched;
  if (indexs.length !== splits.length) return "";
  const mtcd = str.match(regex);
  if (mtcd) {
    matched = mtcd[0];
    for (let i = 0; i < indexs.length; i++) {
      matched = matched.split(splits[i])[indexs[i]];
    }
  }
  return matched;
}

/**
 * 统计汉字字数
 *
 * @param str 字符串
 */
export function calcChineseWords(str: string) {
  let total = 0;
  for (let i = 0; i < str.length; i++) {
    let c = str.charAt(i);
    //基本汉字
    if (c.match(/[\u4e00-\u9fa5]/)) {
      total++;
    }
    //基本汉字补充
    else if (c.match(/[\u9FA6-\u9fcb]/)) {
      total++;
    }
  }
  return total;
}
