import { Fancybox } from "@fancyapps/ui";

export function use() {
  const options = Object.assign(
    {
      Toolbar: {
        display: {
          left: ["infobar"],
          middle: Consts.isPC()
            ? ["zoomIn", "zoomOut", "toggle1to1", "rotateCCW", "rotateCW", "flipX", "flipY"]
            : [],
          right: ["slideshow", "thumbs", "close"]
        }
      },
      Hash: false
    },
    Consts.config.fancybox
  );

  Fancybox.bind("[data-fancybox]", options);
}
