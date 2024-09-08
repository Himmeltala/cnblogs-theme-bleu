/**
 * 监听鼠标滚动，上或下
 *
 * @param fncs
 * @param options
 */
export function useWheelRollsUpAndDown(
  fncs: {
    onDown?: Function;
    onUp?: Function;
    on?: Function;
  },
  options?: {
    throttle?: number;
  }
) {
  const { throttle = 200 } = options || {};
  let lastScrollY = window.scrollY;
  window.addEventListener(
    "scroll",
    useThrottleFn(e => {
      const isMovedDown = lastScrollY < window.scrollY;
      if (isMovedDown) {
        fncs.onDown && fncs.onDown(e);
      } else {
        fncs.onUp && fncs.onUp(e);
      }

      fncs.on && fncs.on(e);
      lastScrollY = window.scrollY;
    }, throttle)
  );
}

/**
 * 从评论切割一条线，判断是否超过线条在其上方；是否低于线条在其下方。
 *
 * @param onTop
 * @param onBottom
 * @param options
 */
export function useLineBetweenHighAndLow(
  onTop: Function,
  onBottom?: Function,
  options?: {
    bottomEdge?: number;
    throttle?: number;
  }
) {
  const { bottomEdge = 0.5, throttle = 200 } = options || {};
  window.addEventListener(
    "scroll",
    useThrottleFn(() => {
      const leanTowardsBottom = window.scrollY / Number(document.body.clientHeight);
      if (leanTowardsBottom <= bottomEdge) {
        onBottom && onBottom();
      } else if (leanTowardsBottom > bottomEdge && leanTowardsBottom <= 1) {
        onTop();
      }
    }, throttle)
  );
}
