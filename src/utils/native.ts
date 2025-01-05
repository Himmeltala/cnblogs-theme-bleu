/**
 * 博客园接口
 *
 * @author Himmeltala
 * @date 2023 年 1 月 15 日
 */

function openWindow(w: string, t: number, i: number, r: number) {
  const left = (screen.width - t) / 2 - r;
  const top = (screen.height - i) / 2 - r;
  const hatch = window.open(
    w,
    "_blank",
    `width=${t},height=${i},toolbars=0,resizable=1,left=${left},top=${top}`
  );
  hatch.focus();
}

/**
 * 打开博客园上传图片的 API，上传完成之后，图片路径要回显到 textarea 上。
 *
 * @param el 图片上传成功之后返回的链接赋值给 textarea 元素。
 * @param onUploaded 选择符合规则的本地图片之后，小窗关闭返回一个图片连接到 el textarea 元素中，获取 focus 得到图片链接该回调函数可向上传递该链接。
 */
export function openImageUploadWindow(el: string, onUploaded: (img: string) => void) {
  try {
    // @ts-ignore
    const elem = $(`#${el}`);

    elem.focus(() => {
      const imgUrl = elem.val() + "";
      onUploaded ? onUploaded(imgUrl.replace("[img]", "![](").replace("[/img]", ")")) : "";
      elem.val("");
    });

    const w = `${location.protocol}//upload.cnblogs${location.hostname.substring(
      location.hostname.lastIndexOf(".")
    )}/imageuploader/upload?host=www.cnblogs.com&editor=0#${el}`;

    document.domain = `cnblogs.${location.hostname.substring(
      location.hostname.lastIndexOf(".") + 1,
      location.hostname.length
    )}`;

    openWindow(w, 450, 120, 200);
  } catch (e) {
    console.error(e);
  }
}

/**
 * 收藏作品
 *
 * @param id 作品 ID
 */
export function savePost(id: string) {
  // @ts-ignore
  window.AddToWz(id);
}

/**
 * 分享到新浪
 */
export function shareToTsina() {
  // @ts-ignore
  window.ShareToTsina();
}

/**
 * 搜索作品
 *
 * @param keyword 关键字
 */
export function search(keyword: string) {
  Utils.Navigation.go("https://zzk.cnblogs.com/s?w=blog:" + Consts.getBlogApp() + "%" + keyword);
}
