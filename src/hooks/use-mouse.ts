export function useWheelRollsUpAndDown(
  onDown: Function,
  onUp?: Function,
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
        onDown();
      } else {
        onUp && onUp();
      }
      lastScrollY = window.scrollY;
    }, throttle)
  );
}

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
