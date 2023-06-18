/**
 * 操作文本
 *
 * @author Himmelbleu
 * @date 2023 年 1 月 15 日
 */
export namespace Textual {
  /**
   * 匹配一串字符，得到其匹配的结果，再进行字符串切割
   *
   * @param str 源字符串
   * @param regex 从字符串中匹配想要的再进行切割
   * @param keys 对每一次 match 得到的子串进行索引，即取值
   * @param values 每一次 match 得到的子串
   * @returns 从 str 经过多次 split 得到的子串
   */
  export function regexReplace(str: string, regexs: RegExp[], replacement?: string[]) {
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
   * 替换字符串，默认替换 ""。传递 regExps，一个正则表达式数组。
   *
   * @param str 被修剪的字符串
   * @param regexs 正则表达式，找到匹配的字符串，然后替换掉
   * @param replacement 不传递，默认被替换的字符串是 ""。传递的数组等于 regExps 的长度，就一一对应进行替换。如果传递的
   * 数组小于 regExps，就与前几个进行对应替换，其余的用默认 "" 替换。
   */
  export function regexSplit(str: string, regex: RegExp, keys: number[], values: string[]) {
    let matched;
    if (keys.length !== values.length) return "";
    const mtcd = str.match(regex);
    if (mtcd) {
      matched = mtcd[0];
      for (let i = 0; i < keys.length; i++) {
        matched = matched.split(values[i])[keys[i]];
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
}
