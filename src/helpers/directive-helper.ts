import hljs from "highlight.js";
import { useCatalogStore } from "@/store";

hljs.configure({
  ignoreUnescapedHTML: true
});

function createCodeModal(ele: HTMLElement) {
  const height = Number(ele.offsetHeight);

  if (height >= 380) {
    const eleModal = document.createElement("div");
    eleModal.setAttribute("class", "modal f-c-c rd-2");

    const eleClick = document.createElement("div");
    eleClick.setAttribute("class", "l-size-2 l-color-2 hover");
    eleClick.innerText = "展开";
    ele.style.height = "380px";

    eleClick.addEventListener("click", () => {
      ele.style.height = `${height}px`;
      ele.classList.remove("modal");
      eleModal.style.display = "none";
    });

    eleModal.append(eleClick);
    ele.insertAdjacentElement("beforebegin", eleModal);
  }
}

function createCodeTools(ele: HTMLElement) {
  const lang = (
    ele
      .getAttribute("class")
      ?.match(/(language-\w*){0,1}/g)?.[0]
      ?.split("-")[1] || ""
  ).toUpperCase();

  const eleClipboard = document.createElement("div");
  eleClipboard.setAttribute("class", "clipboard hover mr-2");
  eleClipboard.innerText = "复制";

  const eleLang = document.createElement("div");
  eleLang.setAttribute("class", "code-language");
  eleLang.innerText = lang;

  const eleTools = document.createElement("div");
  eleTools.setAttribute("class", "code-tools f-c-e l-size-1 l-color-2 w-100%");
  eleTools.append(eleClipboard, eleLang);

  eleClipboard.addEventListener("click", () => {
    navigator.clipboard.writeText(ele.innerText).then(
      () => ElMessage({ message: "复制成功！", type: "success", grouping: true }),
      () => ElMessage({ message: "没有权限！", type: "error", grouping: true })
    );
  });

  ele.insertAdjacentElement("afterend", eleTools);
}

/**
 * 构造代码高亮
 */
function useVHljs(el: HTMLElement) {
  const eleCodes = el.querySelectorAll<HTMLElement>("pre code");
  eleCodes.forEach(eleCode => {
    hljs.highlightElement(eleCode);
    createCodeTools(eleCode);
    createCodeModal(eleCode);
  });
}

/**
 * 构造数学公式
 */
function useVMathjax(el: HTMLElement) {
  // @ts-ignore
  const MathJax = window.MathJax;
  const nodes = el.getElementsByClassName("math");

  if (MathJax && nodes.length > 0) {
    MathJax.startup.promise = MathJax.startup.promise
      .then(() => {
        MathJax.typesetPromise(nodes);
      })
      .catch(console.error);
  }
}

/**
 * 构造目录
 */
function useVCatalog(el: HTMLElement) {
  const catalog: any[] = [];
  let step = 0;

  Array.from(el.querySelectorAll("h1, h2, h3")).forEach((item: any) => {
    const id = item.getAttribute("id");
    const type = item.localName;
    let marginLeft = "";

    if (type === "h2") {
      marginLeft = "10px";
    } else if (type === "h3") {
      marginLeft = "20px";
    }

    const content = `
      <div id="catalog-${id}" class="hover" data-step="${step}" style="margin-left: ${marginLeft}">
        ${item.textContent}
      </div>
    `;

    catalog.push({ id, content, item });
    step += 2.5;
  });

  useCatalogStore().setCatalog(catalog);
}

/**
 * 构造目录点击事件
 */
function useCatalogEvents(binding: any) {
  document.getElementById(`catalog-${binding.value.id}`).addEventListener("click", () => {
    EcyUtils.scrollIntoView(`#${binding.value.id}`);
  });
}

/**
 * 构造图片放大器
 */
function useVHighslide(el: HTMLElement) {
  function onClickImage(eleImage: HTMLImageElement, eleHighslide: Element, eleHighslideImage: HTMLImageElement) {
    eleHighslide.classList.toggle("noactive");
    eleHighslide.classList.toggle("active");
    eleHighslideImage.src = eleImage.getAttribute("src");
    eleHighslideImage.style.width = `${eleImage.width}px`;
    eleHighslideImage.style.height = `${eleImage.height}px`;
    document.documentElement.style.overflow = "hidden";
  }

  const images = el.querySelectorAll<HTMLImageElement>("img");

  for (let i = 0; i < images.length; i++) {
    const eleTip = document.createElement("div");
    eleTip.setAttribute("class", "l-color-2 l-size-2 mt-2");
    eleTip.innerText = images[i].alt;

    if (images[i].parentElement.tagName === "P") {
      images[i].parentElement.setAttribute("class", "f-c-c flex-col");
      images[i].parentElement.insertAdjacentElement("beforeend", eleTip);
    }

    const eleHighslide = document.getElementsByClassName("l-highslide")[0];
    const eleHighslideImage = eleHighslide.querySelector<HTMLImageElement>(".l-highslide__img");
    images[i].addEventListener("click", () => onClickImage(images[i], eleHighslide, eleHighslideImage));
  }
}

export function useDirective(Vue: any) {
  /**
   * 对 pre code 代码进行格式化
   */
  Vue.directive("hljs", {
    mounted(el: HTMLElement) {
      useVHljs(el);
    },
    updated(el: HTMLElement, binding: any) {
      if (binding.value != binding.oldValue) {
        useVHljs(el);
      }
    }
  });

  /**
   * 对指定元素下的标签进行数学公式格式化
   */
  Vue.directive("mathjax", {
    mounted(el: HTMLElement) {
      useVMathjax(el);
    },
    updated(el: HTMLElement, binding: any) {
      if (binding.value != binding.oldValue) {
        useVMathjax(el);
      }
    }
  });

  /**
   * 制作图片放大器
   */
  Vue.directive("highslide", {
    mounted(el: HTMLElement) {
      useVHighslide(el);
    },
    updated(el: HTMLElement, binding: any) {
      if (binding.value != binding.oldValue) {
        useVHighslide(el);
      }
    }
  });

  /**
   * 制作目录锚点
   */
  Vue.directive("catalog", {
    mounted(el: HTMLElement) {
      useVCatalog(el);
    },
    updated(el: HTMLElement) {
      useVCatalog(el);
    }
  });

  /**
   * 制作目录锚点的点击事件
   */
  Vue.directive("catalog-event", {
    mounted(el: HTMLElement, binding: any) {
      useCatalogEvents(binding);
    },
    updated(el: HTMLElement, binding: any) {
      useCatalogEvents(binding);
    }
  });
}
