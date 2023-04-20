import $ from "jquery";
import hljs from "highlight.js";
import { useCatalogStore } from "@/store";

function createCodeModal(ele: JQuery<HTMLElement>) {
  const height = ele.height();

  if (height >= 380) {
    ele.height(380);
    const $click = $(`<div class="l-size-2 l-color-3 hover">展开</div>`);
    const $modal = $(`<div class="modal f-c-c rd-2"></div>`);
    $modal.prepend($click);

    $click.on("click", () => {
      ele.height(height);
      ele.removeClass("modal");
      $modal.css({ display: "none" });
    });

    ele.parent().prepend($modal);
  }
}

function createCodeTools(ele: JQuery<HTMLElement>) {
  const lang = ele
    .attr("class")
    ?.match(/(language-\w*){0,1}/g)[0]
    .split(",")[0]
    .split("-")[1]
    .toUpperCase();

  const tools = $(`
    <div class="code-tools f-c-e l-size-1 l-color-3 w-100%">
      <div class="clipboard hover mr-2">复制</div>
      <div>${lang}</div>
    </div>
  `);

  tools.find(".clipboard").on("click", () => {
    navigator.clipboard.writeText(ele.text()).then(
      () => {
        ElMessage({ message: "复制成功！", type: "success", grouping: true });
      },
      () => {
        ElMessage({ message: "没有权限！", type: "error", grouping: true });
      }
    );
  });

  ele.parent().prepend(tools);
}

/**
 * 构造代码高亮
 */
function useVHljs(el: any) {
  $(el)
    .find("pre code")
    .each((index, ele) => {
      const $ele = $(ele);

      hljs.highlightElement(ele);

      createCodeTools($ele);
      createCodeModal($ele);
    });
}

/**
 * 构造数学公式
 */
function useVMathjax() {
  // @ts-ignore
  const MathJax = window.MathJax;
  const nodes = document.querySelectorAll(".math");

  if (MathJax && nodes.length > 0) {
    MathJax.startup.promise = MathJax.startup.promise.then(() => MathJax.typesetPromise(nodes)).catch((err: any) => console.error(err));
  }
}

/**
 * 构造目录
 */
function useVCatalog(el: any, binding: any) {
  const catalog: any[] = [];
  let step = 0;

  $(el)
    .children("h1, h2, h3")
    .each((i, item) => {
      const id = $(item).attr("id");
      const type = $(item)[0].localName;
      let content = ``;

      if (type === "h1") {
        content = `<div id="catalog-${id}" class="hover" data-step="${step}">${$(item).text()}</div>`;
      } else if (type === "h2") {
        content = `<div id="catalog-${id}" class="hover" data-step="${step}" style="margin-left: 10px">${$(item).text()}</div>`;
      } else if (type === "h3") {
        content = `<div id="catalog-${id}" class="hover" data-step="${step}" style="margin-left: 20px">${$(item).text()}</div>`;
      }

      catalog.push({ id, content, item });
      step += 2.5;
    });

  useCatalogStore().setCatalog(catalog);
}

/**
 * 构造目录点击事件
 */
function useCatalogEvents(binding: any) {
  $(`#catalog-${binding.value.id}`).on("click", () => {
    document.querySelector(`#${binding.value.id}`).scrollIntoView();
  });
}

function createHighslide(ele: JQuery<HTMLElement>) {
  const image = $(".l-highslide .l-highslide__img");

  ele.on("click", () => {
    $(".l-highslide").removeClass("noactive").addClass("active");
    $("body").css({ overflow: "hidden" });
    image.attr("src", ele.attr("src"));
    image.css({ width: ele.width(), height: ele.height() });
  });

  const text = ele.parent("p");
  text.addClass("f-c-c flex-col");
  text.append(`<div class="l-color-2 l-size-2 mt-2">${ele.attr("alt")}</div>`);
}

/**
 * 构造图片放大器
 */
function useVHighslide(el: any) {
  $(el)
    .find("img")
    .each((index, ele) => {
      createHighslide($(ele));
    });
}

export function useDirective(Vue: any) {
  /**
   * 对 pre code 代码进行格式化
   */
  Vue.directive("hljs", {
    mounted(el: any) {
      useVHljs(el);
    },
    updated(el: any, binding: any) {
      if (binding.value != binding.oldValue) {
        useVHljs(el);
      }
    }
  });

  /**
   * 对指定元素下的标签进行数学公式格式化
   */
  Vue.directive("mathjax", {
    mounted() {
      useVMathjax();
    },
    updated(el: any, binding: any) {
      if (binding.value != binding.oldValue) {
        useVMathjax();
      }
    }
  });

  /**
   * 制作图片放大器
   */
  Vue.directive("highslide", {
    mounted(el: any) {
      useVHighslide(el);
    },
    updated(el: any, binding: any) {
      if (binding.value != binding.oldValue) {
        useVHighslide(el);
      }
    }
  });

  /**
   * 制作目录锚点
   */
  Vue.directive("catalog", {
    mounted(el: any, binding: any) {
      useVCatalog(el, binding);
    },
    updated(el: any, binding: any) {
      useVCatalog(el, binding);
    }
  });

  /**
   * 制作目录锚点的点击事件
   */
  Vue.directive("catalog-event", {
    mounted(el: any, binding: any) {
      useCatalogEvents(binding);
    },
    updated(el: any, binding: any) {
      useCatalogEvents(binding);
    }
  });
}
