export namespace Textual {
  /**
   * 替换字符串，默认替换 ""。传递 regExps，一个正则表达式数组。
   *
   * @param source 被修剪的字符串
   * @param regExps 正则表达式，找到匹配的字符串，然后替换掉
   * @param replacement 不传递，默认被替换的字符串是 ""。传递的数组等于 regExps 的长度，就一一对应进行替换。如果传递的
   * 数组小于 regExps，就与前几个进行对应替换，其余的用默认 "" 替换。
   */
  export function replace(source: string, regExps: RegExp[], replacement?: string[]) {
    let substitute = "";
    for (let i = 0; i < regExps.length; i++) {
      if (!replacement) substitute = "";
      else {
        if (!replacement[i]) substitute = "";
        else substitute = replacement[i];
      }
      source = source.replace(regExps[i], substitute);
    }
    return source;
  }

  /**
   * 循环分割字符串，得到最后结果
   *
   * @param str 源字符串
   * @param regex 从字符串中匹配想要的再进行切割
   * @param keys 对每一次 match 得到的子串进行索引，即取值
   * @param values 每一次 match 得到的子串
   * @returns 从 str 经过多次 split 得到的子串
   */
  export function split(str: string, regex: RegExp, keys: number[], values: string[]) {
    let matched;
    if (keys.length !== values.length) return "";
    if (str.match(regex)) {
      matched = str.match(regex)[0];
      for (let i = 0; i < keys.length; i++) {
        matched = matched.split(values[i])[keys[i]];
      }
    }
    return matched;
  }
}
