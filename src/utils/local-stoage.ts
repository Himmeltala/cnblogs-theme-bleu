export namespace LocalStorage {
  /**
   * 获取本地存储中的设置
   */
  export function getSetting(): RemovableRef<BleuLocalSetting> {
    return useStorage(`l-${BleuVars.getBlogApp()}-setting`, getSettingTemp());
  }

  /**
   * 获取本地存储中的模板
   */
  export function getSettingTemp(): BleuLocalSetting {
    return {
      theme: { mode: "dark" },
      toolkits: { pin: true }
    };
  }

  /**
   * 对一个对象的字段进行裁剪或添加
   *
   * @param source 要被裁剪或添加字段的对象
   * @param template 一个对象，根据该模板（对象）对 source 进行裁剪或添加字段
   */
  export function reloadObjProps(source: any, template: any) {
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
              reloadObjProps(source[templateKey], template[templateKey]);
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
          reloadObjProps(source[templateKey], template[templateKey]);
        } else if (typeof template[templateKey] !== "object") {
          if (typeof source[templateKey] === "object") source[templateKey] = template[templateKey];
        }
      });
    }
    return source;
  }
}
