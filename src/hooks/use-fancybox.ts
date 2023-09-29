import { Fancybox } from "@fancyapps/ui";

export function useFancybox() {
  const options = Object.assign(
    {
      Toolbar: {
        display: {
          left: ["infobar"],
          middle: BleuVars.isPC()
            ? ["zoomIn", "zoomOut", "toggle1to1", "rotateCCW", "rotateCW", "flipX", "flipY"]
            : [],
          right: ["slideshow", "thumbs", "close"]
        }
      },
      Hash: false
    },
    BleuVars.config.fancybox
  );

  Fancybox.bind("[data-fancybox]", options);
}
