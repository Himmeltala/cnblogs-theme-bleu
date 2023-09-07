export function deepMerge(target: any, source: any) {
  for (let p in source) {
    try {
      if (source[p].constructor == Object) {
        target[p] = deepMerge(target[p], source[p]);
      } else {
        target[p] = source[p];
      }
    } catch (e) {
      target[p] = source[p];
    }
  }
}
