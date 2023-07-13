import { Fancybox } from "@fancyapps/ui";

export function useFancybox(options?: any) {
  if (!options) {
    options = {
      Toolbar: {
        display: {
          left: ["infobar"],
          middle: BleuVars.isPcDevice()
            ? ["zoomIn", "zoomOut", "toggle1to1", "rotateCCW", "rotateCW", "flipX", "flipY"]
            : [],
          right: ["slideshow", "thumbs", "close"]
        }
      },
      Hash: false
    };
  }

  if (BleuVars.config?.fancybox) {
    const merged = Object.assign({}, options, BleuVars.config.fancybox);
    Fancybox.bind("[data-fancybox]", merged);
  } else {
    Fancybox.bind("[data-fancybox]", options);
  }
}
