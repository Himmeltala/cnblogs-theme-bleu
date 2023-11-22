/**
 * 操作浏览器本地存储
 *
 * @author Himmeltala
 * @date 2023 年 1 月 15 日
 */

/**
 * 获取本地存储中的设置
 */
export function getOptions() {
  return useStorage<LocalOptionModel>(Consts.OPSTIONS_KEY, {});
}

/**
 * 获取本地存储中的模板
 */
export function getOptionsTemplate(): LocalOptionModel {
  return {
    theme: { mode: "dark" }
  };
}

/**
 * @param source 要被裁剪或添加字段的对象
 * @param template 一个对象，根据该模板（对象）对 source 进行裁剪或添加字段
 */
export function optionsRefactor(source: any, template: any) {
  if (!source) source = template;
  const sourceKeys = Object.keys(source);
  const templateKeys = Object.keys(template);

  if (sourceKeys.length !== templateKeys.length) {
    if (sourceKeys.length > templateKeys.length) {
      sourceKeys.forEach(sourceKey => {
        const nonentity = templateKeys.find(templateKey => templateKey === sourceKey);
        if (!nonentity) Reflect.deleteProperty(source, sourceKey);
      });
    } else if (sourceKeys.length < templateKeys.length) {
      templateKeys.forEach(templateKey => {
        const nonentity = sourceKeys.find(sourceKey => templateKey === sourceKey);
        if (!nonentity) source[templateKey] = template[templateKey];
        else {
          if (typeof template[templateKey] === "object") {
            optionsRefactor(source[templateKey], template[templateKey]);
          }
        }
      });
    }
  } else {
    templateKeys.forEach(templateKey => {
      if (typeof template[templateKey] === "object") {
        if (typeof source[templateKey] !== "object" || !source[templateKey]) {
          source[templateKey] = template[templateKey];
        }
        optionsRefactor(source[templateKey], template[templateKey]);
      } else if (typeof template[templateKey] !== "object") {
        if (typeof source[templateKey] === "object") source[templateKey] = template[templateKey];
      }
    });
  }
  return source;
}
